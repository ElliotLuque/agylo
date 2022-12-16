import { useState, type ReactElement } from "react";
import Header from "../../../components/dashboard/header";
import { trpc } from "../../../utils/trpc";
import type { NextPageWithLayout } from "../../_app";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import {
  type InferGetServerSidePropsType,
  type GetServerSideProps,
} from "next";
import { protectedRouterPage } from "../../../server/common/protected-router-page";
import LoadingSpinner from "../../../components/misc/loadingSpinner";

const KanbanLayout: NextPageWithLayout = ({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const trpcUtils = trpc.useContext();

  const { data: boardData, isLoading } = trpc.board.getBoard.useQuery({
    id: parseInt(id as string),
  });

  const { mutateAsync: createColumn } = trpc.column.createColumn.useMutation({
    onSuccess: () => {
      trpcUtils.board.invalidate();
    },
  });

  const { mutateAsync: reorderColumn } = trpc.column.reorderColumn.useMutation({
    onSuccess: () => {
      trpcUtils.board.invalidate();
    },
  });

  const [columns, setColumns] = useState<number[]>([]);

  const reorder = (
    list: Array<number>,
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);

    result.splice(endIndex, 0, removed as number);

    return result;
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    console.log({ result });

    setColumns(reorder(columns, source.index, destination.index));

    reorderColumn({
      sourceColumnId: parseInt(result.draggableId as string),
      boardId: parseInt(id as string),
      sourceIndex: source.index,
      destinationIndex: destination.index,
    });
  };

  const handleCreateColumn = async () => {
    await createColumn({
      boardId: parseInt(id as string),
      name: "New Column",
      index: 0,
    });
  };

  if (isLoading) {
    return <LoadingSpinner height={48} width={48} />;
  }

  return (
    <div>
      <h1 onClick={handleCreateColumn}>Board {boardData?.name}</h1>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="column" direction="horizontal">
          {(provided) => (
            <div
              className="flex flex-row gap-3 bg-slate-200 p-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {boardData?.columns.map((column) => (
                <Draggable
                  key={column.id}
                  draggableId={column.id.toString()}
                  index={column.index}
                >
                  {(provided) => (
                    <div
                      className="h-72 w-44 rounded-md bg-gray-100 px-7 py-4"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {column.name}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) =>
  protectedRouterPage(context);

KanbanLayout.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Header />
      {page}
    </>
  );
};

export default KanbanLayout;
