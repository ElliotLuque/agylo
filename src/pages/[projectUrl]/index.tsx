import { type ReactElement } from "react";
import { trpc } from "../../utils/trpc";
import type { NextPageWithLayout } from "../_app";
import {
  type InferGetServerSidePropsType,
  type GetServerSideProps,
} from "next";
import { protectedRouterPage } from "../../server/common/protected-router-page";
import LoadingSpinner from "../../components/misc/loadingSpinner";

import Head from "next/head";
import Header from "../../components/common/header";
import Layout from "../../components/common/layout";
import type { Column} from "../../types/kanban";
import KanbanBoard from "../../components/project/views/kanban/kanbanBoard";

const KanbanPage: NextPageWithLayout = ({
  url,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const trpcUtils = trpc.useContext();

  const {
    data: projectData,
    isLoading,
    error,
  } = trpc.project.getKanbanData.useQuery(
    { url },
    {
      onSuccess: () => {
        // setColumns([]);
        // projectData?.columns?.forEach((column) => {
        //   setColumns((prev) => [...prev, column]);
        // });
      },
      retry: false,
    }
  );

  const { mutateAsync: createColumn } = trpc.column.createColumn.useMutation({
    onSuccess: () => {
      trpcUtils.project.invalidate();
      trpcUtils.column.invalidate();
    },
  });

  const handleCreateColumn = async () => {
    await createColumn({
      projectId: projectData?.id as number,
      name: "New column",
      index: projectData?.columns.length as number,
    });
  };

  if (error?.data?.httpStatus === 403) {
    return (
      <>
        <Head>
          <title> Not authorized - Agylo</title>
        </Head>
        <div className="grid w-full place-items-center">
          <h1 className="text-2xl">
            You don&apos;t have access to this project
          </h1>
        </div>
      </>
    );
  }

  if (error?.data?.httpStatus === 404) {
    return (
      <>
        <Head>
          <title> Not found - Agylo</title>
        </Head>
        <div className="grid w-full place-items-center">
          <h1 className="text-2xl">Project not found</h1>
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Agylo</title>
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
        <title>{projectData?.name} - Agylo</title>
      </Head>
      <div className="flex w-full flex-col px-7 py-3">
        <Header
          name={projectData?.name ?? "Project"}
          description={projectData?.description ?? ""}
          url={projectData?.url as string}
        />
        <button onClick={handleCreateColumn}>Create column</button>
        <div className="w-full flex gap-4 p-7">
          <KanbanBoard columns={projectData?.columns as Column[]}/>
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
