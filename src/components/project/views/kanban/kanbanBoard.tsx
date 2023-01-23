import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  DragOverlay,
  TouchSensor,
  type DragOverEvent,
  type CollisionDetection,
  closestCenter,
  getFirstCollision,
  pointerWithin,
  rectIntersection,
  defaultDropAnimationSideEffects,
  type DropAnimation,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Assignee, Column, Label } from '../../../../types/kanban'
import ColumnSortable from './column/columnSortable'
import TaskSortable from './task/taskSortable'
import { createPortal } from 'react-dom'
import AddColumn from './column/addColumn'
import AddTask from './task/addTask'
import { arraysEqual } from '../../../../utils/arraysEqual'
import { trpc } from '../../../../utils/trpc'
import Head from 'next/head'
import LoadingSpinner from '../../../misc/loadingSpinner'
import { SelectColumn } from '../../../../types/kanban-delete'
import TaskDetailsDialog from './taskDetails/taskDetailsDialog'

const KanbanBoard: React.FC<{ projectUrl: string, dialogTaskKey: string }> = ({ projectUrl, dialogTaskKey }) => {
  const trpcUtils = trpc.useContext()
  const {
    data: projectData,
    isLoading,
    error,
  } = trpc.project.getKanbanData.useQuery(
    { url: projectUrl },
    {
      onSuccess: (data) => {
        setColumns(data?.columns as Column[])
      },
      retry: false,
    },
  )

  const { mutateAsync: orderColumn } = trpc.column.reorderColumn.useMutation()
  const { mutateAsync: orderTaskInColumn } = trpc.task.orderUpTask.useMutation()
  const { mutateAsync: moveTaskToColumn } =
    trpc.task.moveTaskToColumn.useMutation()

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

  const lastActiveIndex = useRef<number | null>(null)
  const lastOriginalIndex = useRef<number | null>(null)

  const lastContainerId = useRef<UniqueIdentifier | null>(null)
  const lastOverId = useRef<UniqueIdentifier | null>(null)

  const recentlyMovedToNewContainer = useRef(false)

  const [columns, setColumns] = useState<Column[]>([])
  const [clonedColumns, setClonedColumns] = useState<Column[]>([])
  const [selectedTaskKey, setSelectedTaskKey] = useState<string | null>(null)

  const columnsIds = useMemo(
    () => columns.map((column) => column.id),
    [columns],
  )
  const taskIds = (column: Column) => {
    return column.tasks.map((task) => task.taskKey)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 1 } }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  }

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      // If its a column, only allow column drops
      if (activeId && columns.find((column) => column.id === activeId)) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter((container) => {
            return columnsIds.includes(container.id as number)
          }),
        })
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args)

      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
            pointerIntersections
          : rectIntersection(args)
      let overId = getFirstCollision(intersections, 'id')
      //console.log("intersections", intersections)

      if (overId != null) {
        const columnContainer = columns.find(
          (column) => column.id === (overId as number),
        )

        // If a container is matched and it contains items (columns 'A', 'B', 'C')
        if (columnContainer && columnContainer.tasks?.length > 0) {
          //Return the closest droppable within that container
          overId =
            closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) => {
                  return taskIds(columnContainer).includes(
                    container.id as string,
                  )
                },
              ),
            })[0]?.id ?? overId
        }

        lastOverId.current = overId

        return [{ id: overId }]
      }

      // // When a draggable item moves to a new container, the layout may shift
      // // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // // to the id of the draggable item that was moved to the new container, otherwise
      // // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId
      }

      // // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeId, columns, columnsIds],
  )

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false
    })
  }, [columns])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event

    setActiveId(active.id as number)

    // Find the task in columns array which has the same id as active.id
    const task = columns
      .map((column) => column.tasks)
      .flat()
      .find((task) => task.taskKey === active.id)

    setClonedColumns(columns)

    // Set the active original index and container id
    lastOriginalIndex.current = task?.index as number
    lastContainerId.current = findContainer(active.id)?.id as UniqueIdentifier
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event

    const activeId = active?.id
    const overId = over?.id as UniqueIdentifier

    const activeContainer = findContainer(activeId)
    const overContainer = findContainer(overId)

    const lastContainer = findContainer(lastContainerId.current as number)

    if (
      overContainer !== undefined &&
      overContainer !== lastContainer &&
      overContainer.tasks.length > 0
    ) {
      // Get index of over id
      const overIndex = overContainer.tasks.findIndex(
        (task) => task.taskKey === overId,
      )

      lastActiveIndex.current = overIndex
    }

    if (
      isColumnId(activeId) ||
      activeContainer === undefined ||
      overContainer === undefined ||
      activeContainer === overContainer
    )
      return

    // Task has moved to a new container
    if (activeContainer !== overContainer) {
      if (!activeContainer) return

      recentlyMovedToNewContainer.current = true

      setColumns((prev) => {
        // Source
        const newActiveContainer = {
          ...activeContainer,
          tasks: activeContainer.tasks.filter(
            (task) => task.taskKey !== activeId,
          ),
        }
        const orderedNewActiveContainer = {
          ...newActiveContainer,
          tasks: newActiveContainer.tasks.map((task, index) => {
            return {
              ...task,
              index,
            }
          }),
        }

        // Destination
        const newOverContainer = {
          ...overContainer,
          tasks: [
            ...overContainer.tasks,
            activeContainer.tasks.find((task) => task.taskKey === activeId),
          ],
        }

        const orderedNewOverContainer = {
          ...newOverContainer,
          tasks: newOverContainer.tasks.map((task, index) => {
            return {
              ...task,
              index,
            }
          }),
        }

        const newColumns = prev.map((col) => {
          if (col.id === orderedNewActiveContainer.id) {
            return orderedNewActiveContainer
          }
          if (col.id === orderedNewOverContainer.id) {
            return orderedNewOverContainer
          }
          return col
        })

        return newColumns as Column[]
      })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    const activeId = active?.id
    const overId = over?.id as UniqueIdentifier

    // Task moving in column
    if (
      findContainer(activeId) === findContainer(overId) &&
      !isColumnId(overId) &&
      !isColumnId(activeId)
    ) {
      setColumns((prev) => {
        const activeContainer = findContainer(activeId)
        const activeContainerId = activeContainer?.id as UniqueIdentifier

        const activeItemIndex = activeContainer?.tasks.findIndex((item) => {
          return item.taskKey === active.id
        })
        const activeItemId = activeContainer?.tasks[activeItemIndex as number]
          ?.id as number

        const overItemIndex = activeContainer?.tasks.findIndex((item) => {
          return item.taskKey === over?.id
        })
        const overItemId = activeContainer?.tasks[overItemIndex as number]
          ?.id as number

        if (
          activeItemIndex === undefined ||
          overItemIndex === undefined ||
          activeContainer === undefined
        )
          return prev

        const newTasks = arrayMove(
          activeContainer.tasks,
          activeItemIndex,
          overItemIndex,
        )
        const orderedTasks = newTasks.map((task, index) => {
          return {
            ...task,
            index: index,
          }
        })

        const updatedColumn = {
          ...activeContainer,
          tasks: orderedTasks,
        }

        const newColumns = prev.map((col) => {
          return col.id === activeContainer.id ? updatedColumn : col
        })

        // Tasks sorted
        if (
          !arraysEqual(activeContainer.tasks, newTasks) &&
          activeContainerId === lastContainerId.current
        ) {
          const handleOrderTaskInColumn = async () => {
            try {
              await orderTaskInColumn({
                columnId: activeContainerId as number,
                sourceTaskId: activeItemId,
                sourceTaskIndex: activeItemIndex,
                destinationTaskIndex: overItemIndex,
              })
              trpcUtils.project.invalidate()
            } catch (error) {
              console.log(error)
            }
          }

          handleOrderTaskInColumn()
        }

        // Tasks moved
        if (
          !arraysEqual(prev, newColumns) &&
          activeContainerId !== lastContainerId.current
        ) {
          const handleMoveTaskToColumn = async () => {
            try {
              await moveTaskToColumn({
                newTaskIndex: lastActiveIndex.current as number,
                oldTaskIndex: lastOriginalIndex.current as number,
                taskId: activeItemId,
                newColumnId: activeContainerId as number,
                oldColumnId: lastContainerId.current as number,
              })
              trpcUtils.project.invalidate()
            } catch (error) {
              console.log(error)
            }
          }

          handleMoveTaskToColumn()
        }

        return newColumns
      })
    }

    // Columns sorting
    if (isColumnId(activeId)) {
      setColumns((prev) => {
        const activeContainer = findContainer(activeId)
        const overContainer = findContainer(overId)

        if (activeContainer === undefined || overContainer === undefined)
          return prev

        const activeContainerIndex = getColumnIndex(activeContainer.id)
        const overContainerIndex = getColumnIndex(overContainer.id)

        const updatedColumns = arrayMove(
          prev,
          activeContainerIndex,
          overContainerIndex,
        )
        const orderedColumns = updatedColumns.map((column, index) => {
          return {
            ...column,
            index: index,
          }
        })

        if (!arraysEqual(prev, orderedColumns as Column[])) {
          const handleOrderColumn = async () => {
            try {
              await orderColumn({
                sourceColumnId: activeContainer.id as number,
                sourceIndex: activeContainerIndex,
                destinationColumnId: overContainer.id as number,
                destinationIndex: overContainerIndex,
              })
              trpcUtils.project.invalidate()
            } catch (error) {
              console.log(error)
            }
          }

          handleOrderColumn()
        }

        return orderedColumns
      })
    }

    setActiveId(null)
  }

  const handleDragCancel = () => {
    if (clonedColumns) {
      setColumns(clonedColumns)
      setClonedColumns([])
    }

    setActiveId(null)
  }

  const findContainer = (id: UniqueIdentifier) => {
    const preResult = columns.find((col) => {
      return col.tasks.find((task) => {
        return task.taskKey === id
      })
    })

    if (preResult) {
      return preResult
    } else {
      return columns.find((col) => {
        return col.id === id
      })
    }
  }

  const isColumnId = (id: UniqueIdentifier) => {
    const result = columns.find((col) => {
      return col.id === id
    })
    return result ? true : false
  }

  const getColumnIndex = (id: UniqueIdentifier) => {
    const column = findContainer(id) as Column
    return columns.indexOf(column)
  }

  const renderColumnDragOverlay = (id: UniqueIdentifier) => {
    const column = columns[getColumnIndex(id)]
    return (
      <ColumnSortable
        key={column?.id}
        id={column?.id as number}
        name={column?.name as string}
        index={column?.index as number}
        availableColumns={columns
          .map(convertToSelectOption)
          .filter((col) => col.id !== column?.id)}
        tasksCount={column?.tasks.length as number}
      >
        {column?.tasks.map((task) => (
          <TaskSortable
            onClick={() => {
              return
            }}
            cursor={'cursor-pointer'}
            key={task.id}
            id={task.id}
            taskKey={task.taskKey}
            title={task.title}
            index={task.index}
            assignee={task.assignee}
            priorityId={task.priorityId}
            labels={task.labels}
            commentCount={task.commentCount}
            attachmentCount={task.attachmentCount}
          />
        ))}
        <AddTask
          projectId={projectData?.id as number}
          columnId={column?.id as number}
          columnLength={column?.tasks.length as number}
        />
      </ColumnSortable>
    )
  }

  const renderTaskDragOverlay = (id: UniqueIdentifier) => {
    const columnParent = columns.find((col) => {
      return col.tasks.find((task) => {
        return task.taskKey === id
      })
    })
    const taskIndex = columnParent?.tasks.findIndex((task) => {
      return task.taskKey === id
    })
    const task = columnParent?.tasks[taskIndex as number]

    return (
      <TaskSortable
        onClick={() => {
          return
        }}
        cursor={'cursor-grabbing'}
        key={task?.taskKey as string}
        id={task?.id as number}
        taskKey={task?.taskKey as string}
        title={task?.title as string}
        index={task?.index as number}
        assignee={task?.assignee as Assignee}
        priorityId={task?.priorityId as number}
        labels={task?.labels as Label[]}
        commentCount={task?.commentCount as number}
        attachmentCount={task?.attachmentCount as number}
      />
    )
  }

  if (error?.data?.httpStatus === 403) {
    return (
      <>
        <Head>
          <title> Not authorized - Agylo</title>
        </Head>
        <div className='grid w-full place-items-center'>
          <h1 className='text-2xl'>
            You don&apos;t have access to this project
          </h1>
        </div>
      </>
    )
  }

  if (error?.data?.httpStatus === 404) {
    return (
      <>
        <Head>
          <title> Not found - Agylo</title>
        </Head>
        <div className='grid w-full place-items-center'>
          <h1 className='text-2xl'>Project not found</h1>
        </div>
      </>
    )
  }

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Agylo</title>
        </Head>
        <div className='grid w-full place-items-center'>
          <LoadingSpinner classNames='p-12 h-48 w-48 animate-spin fill-indigo-500 text-gray-200 dark:text-gray-600' />
        </div>
      </>
    )
  }

  const convertToSelectOption = (column: Column): SelectColumn => {
    return {
      id: column.id,
      name: column.name,
      tasksCount: column.tasks.length,
    } as SelectColumn
  }

  return (
    <>
      {dialogTaskKey !== '' && (
        <TaskDetailsDialog
          taskKey={dialogTaskKey}
          projectName={projectData?.name as string}
          projectId={projectData?.id as number}
        />
      )}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        collisionDetection={collisionDetectionStrategy}
      >
        <SortableContext
          items={columnsIds}
          strategy={horizontalListSortingStrategy}
        >
          {columns.map((column) => {
            return (
              <ColumnSortable
                availableColumns={columns
                  .map(convertToSelectOption)
                  .filter((col) => col.id !== column.id)}
                key={column.id}
                id={column.id}
                index={column.index}
                name={column.name}
                tasksCount={column.tasks.length}
              >
                <SortableContext
                  items={taskIds(column)}
                  strategy={verticalListSortingStrategy}
                >
                  {column.tasks.map((task) => {
                    return (
                      <TaskSortable
                        onClick={() => {
                          setSelectedTaskKey(task.taskKey)
                        }}
                        cursor={'cursor-pointer'}
                        key={task.taskKey}
                        id={task.id}
                        taskKey={task.taskKey}
                        title={task.title}
                        index={task.index}
                        assignee={task.assignee}
                        priorityId={task.priorityId}
                        labels={task.labels}
                        commentCount={task.commentCount}
                        attachmentCount={task.attachmentCount}
                      />
                    )
                  })}
                  <AddTask
                    projectId={projectData?.id as number}
                    columnId={column?.id as number}
                    columnLength={column?.tasks.length as number}
                  />
                </SortableContext>
              </ColumnSortable>
            )
          })}
          <AddColumn
            columnsLength={columns.length}
            projectId={projectData?.id as number}
          />
        </SortableContext>
        {createPortal(
          <DragOverlay dropAnimation={dropAnimation}>
            {activeId
              ? columns.map((col) => col.id).includes(activeId as number)
                ? renderColumnDragOverlay(activeId)
                : renderTaskDragOverlay(activeId)
              : null}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </>
  )
}

export default KanbanBoard
