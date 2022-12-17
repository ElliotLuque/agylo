import { useState, type ReactElement } from "react";
import { trpc } from "../../../utils/trpc";
import type { NextPageWithLayout } from "../../_app";
import {
  type InferGetServerSidePropsType,
  type GetServerSideProps,
} from "next";
import { protectedRouterPage } from "../../../server/common/protected-router-page";
import LoadingSpinner from "../../../components/misc/loadingSpinner";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import Head from "next/head";
import KanbanLayout from "../../../components/common/kanbanLayout";

type Column = {
  id: number;
  name: string;
  index: number;
};

const KanbanPage: NextPageWithLayout = ({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const trpcUtils = trpc.useContext();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [columns, setColumns] = useState<Column[]>([]);

  const { data: boardData, isLoading } = trpc.board.getBoard.useQuery(
    {
      id: parseInt(id as string),
    },
    {
      onSuccess: () => {
        setColumns(boardData?.columns || []);
      },
    }
  );

  const { mutateAsync: createColumn } = trpc.column.createColumn.useMutation({
    onSuccess: () => {
      trpcUtils.board.invalidate();
    },
  });

  const handleCreateColumn = async () => {
    await createColumn({
      boardId: parseInt(id as string),
      name: "New Column",
      index: 0,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setColumns((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Agylo board</title>
        </Head>
        <div className="grid w-full place-items-center">
          <LoadingSpinner height={48} width={48} />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Agylo board - {boardData?.name}</title>
      </Head>
      <div className="w-full">
        <h1 onClick={handleCreateColumn}>Board {boardData?.name}</h1>
        <DndContext
          collisionDetection={closestCenter}
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
          {/* <SortableContext
          items={columns}
          strategy={horizontalListSortingStrategy}
        >
          {columns.map((column) => (
            <ColumnDraggable
              key={column.id}
              id={column.id}
              name={column.name}
            />
          ))}
        </SortableContext> */}
        </DndContext>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) =>
  protectedRouterPage(context);

KanbanPage.getLayout = function getLayout(page: ReactElement) {
  const boardInfo = trpc.board.getBoardInfo.useQuery({
    id: parseInt(page.props.id as string),
  });

  const { description, name } = boardInfo?.data ?? {};

  return (
    <KanbanLayout
      name={name ?? "Board"}
      description={description ?? ""}
    >
      {page}
    </KanbanLayout>
  );
};

export default KanbanPage;
