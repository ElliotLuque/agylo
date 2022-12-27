import { type ReactElement, useState } from "react";
import { trpc } from "../../utils/trpc";
import Image from "next/image";
import type { NextPageWithLayout } from "../_app";
import { protectedRouterPage } from "../../server/common/protected-router-page";
import {
  type InferGetServerSidePropsType,
  type GetServerSideProps,
} from "next";

import Head from "next/head";
import Toast from "../../components/common/toast";
import Layout from "../../components/common/layout";
import SettingsForm from "../../components/project/settings/settingsForm";
import DeleteProjectDialog from "../../components/project/settings/deleteProjectDialog";

const SettingsPage: NextPageWithLayout = ({
  url,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const { data: projectInfo } = trpc.project.getProjectBasicInfo.useQuery({
    url,
  });

  const [openDialog, setOpenDialog] = useState(false);

  const [toast, setToast] = useState(false);

  return (
    <>
      <Head>
        <title>{projectInfo?.name} - Settings - Agylo</title>
      </Head>
      <div className="absolute right-28 top-32">
        <Toast message="Project updated successfully!" isOpen={toast} />
      </div>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center">
          <div className="mx-4 flex w-[32rem] flex-col gap-7 divide-y p-5">
            <div className="mt-5">
              <h1 className="text-2xl font-bold text-gray-800">Project</h1>
              <h2 className="text-sm  font-medium text-gray-500">
                Manage your project settings
              </h2>
            </div>
            <div className="py-5">
              <Image
                width={95}
                height={95}
                src={
                  "https://cdn-icons-png.flaticon.com/512/1195/1195191.png?w=1800&t=st=1671288239~exp=1671288839~hmac=eaf6e627a59608a80254c733b040b5d8ca2fb12d18c21a55264eb4f30633646d"
                }
                alt="default icon"
              />
              <button className="mt-5 w-full rounded-lg bg-indigo-500 px-2.5 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto">
                Change icon
              </button>
            </div>
            <div className="mb-5 pt-5">
              <h1 className="text-lg font-medium text-gray-800">Details</h1>
              <SettingsForm
                id={projectInfo?.id as number}
                name={projectInfo?.name ?? ""}
                description={projectInfo?.description ?? ""}
                setToast={setToast}
              />
            </div>
            <div className="mb-5 pt-5">
              <h1 className="text-lg font-medium text-gray-800">
                Delete project
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                If you delete this project, all tasks, team members and comments
                will be permanently deleted. Please be certain.
              </p>
              <DeleteProjectDialog
                open={openDialog}
                setOpen={setOpenDialog}
                projectId={projectInfo?.id as number}
                projectName={projectInfo?.name as string}
              />
              <button
                onClick={() => setOpenDialog(true)}
                className="text-md mt-5 w-full rounded-lg bg-red-500 px-8 py-2.5 text-center font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 sm:w-auto"
              >
                Delete this project
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) =>
  protectedRouterPage(context);

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SettingsPage;
