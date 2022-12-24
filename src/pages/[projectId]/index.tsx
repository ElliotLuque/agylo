import { useState, type ReactElement } from "react";
import { trpc } from "../../utils/trpc";
import type { NextPageWithLayout } from "../_app";
import {
  type InferGetServerSidePropsType,
  type GetServerSideProps,
} from "next";
import { protectedRouterPage } from "../../server/common/protected-router-page";
import LoadingSpinner from "../../components/misc/loadingSpinner";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Head from "next/head";
import Header from "../../components/common/header";
import Layout from "../../components/common/layout";

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

  const { data: projectData, isLoading } = trpc.project.getProject.useQuery(
    {
      id: parseInt(id as string),
    },
    {
      onSuccess: () => {
        setColumns(projectData?.columns || []);
      },
    }
  );

  const { mutateAsync: createColumn } = trpc.column.createColumn.useMutation({
    onSuccess: () => {
      trpcUtils.project.invalidate();
    },
  });

  const handleCreateColumn = async () => {
    await createColumn({
      projectId: parseInt(id as string),
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
        <div className="grid w-full place-items-center">
          <LoadingSpinner height={48} width={48} />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{projectData?.name} - Agylo</title>
      </Head>
      <div className="flex w-full flex-col">
        <Header
          name={projectData?.name ?? "Project"}
          description={projectData?.description ?? ""}
          id={parseInt(id as string)}
        />
        <div>
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
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) =>
  protectedRouterPage(context);

KanbanPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default KanbanPage;
