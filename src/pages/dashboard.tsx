import { motion } from "framer-motion";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { type ReactElement, useState } from "react";
import CreateProjectDialog from "../components/alerts/createProjectDialog";

import LoadingSpinner from "../components/misc/loadingSpinner";
import { protectedPage } from "../server/common/protected-page";
import { trpc } from "../utils/trpc";
import type { NextPageWithLayout } from "./_app";
import Head from "next/head";
import Layout from "../layouts/layout";

const ProjectItem: React.FC<{
  url: string;
  name: string;
  description: string | null;
}> = ({ url, name, description }) => {
  return (
    <Link
      href={`/${url}`}
      className="flex h-48 w-80 flex-col flex-nowrap gap-1 rounded-xl bg-white p-4 drop-shadow-lg"
    >
      <h1 className="text-xl font-bold">{name}</h1>
      <p className="text-sm">{description}</p>
    </Link>
  );
};

const Dashboard: NextPageWithLayout = () => {
  const { data: projects, isLoading } = trpc.project.listUserProjects.useQuery();

  const [open, setOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Dashboard - Agylo</title>
      </Head>
      <main className="mx-12 flex flex-col flex-nowrap p-6">
        <div className="flex flex-row flex-wrap justify-between">
          <h1 className="pb-1 text-3xl font-bold">Dashboard</h1>
        </div>
        <CreateProjectDialog open={open} setOpen={setOpen} />
        <div className="flex flex-row flex-wrap items-center gap-7 py-6">
          {isLoading ? (
            <LoadingSpinner height={48} width={16} />
          ) : (
            projects?.map((project) => (
              <motion.div
                key={project.projectId}
                initial={{ x: 5, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectItem
                  url={project.project.url}
                  name={project.project.name}
                  description={project.project.description}
                />
              </motion.div>
            ))
          )}
          <button
            className="inline-flex w-auto justify-center rounded-lg bg-indigo-500 px-6 py-4 text-white hover:bg-indigo-800"
            onClick={() => (open ? setOpen(false) : setOpen(true))}
          >
            Add new project
          </button>
        </div>

        <div>
          <h1 className="border-b-2 border-solid border-gray-100">
            Assigned tasks
          </h1>
        </div>
      </main>
    </>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (context) =>
  protectedPage(context);
