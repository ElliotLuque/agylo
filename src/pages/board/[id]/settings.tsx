import { type ReactElement, useState } from "react";
import { trpc } from "../../../utils/trpc";
import Image from "next/image";
import KanbanLayout from "../../../components/kanban/kanbanLayout";
import type { NextPageWithLayout } from "../../_app";
import { protectedRouterPage } from "../../../server/common/protected-router-page";
import {
  type InferGetServerSidePropsType,
  type GetServerSideProps,
} from "next";

import Head from "next/head";
import SettingsForm from "../../../components/kanban/settings/settingsForm";
import DeleteBoardDialog from "../../../components/kanban/settings/deleteBoardDialog";
import Toast from "../../../components/common/toast";

const SettingsPage: NextPageWithLayout = ({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: boardInfo } = trpc.board.getBoardInfo.useQuery({
    id: parseInt(id as string),
  });

  const [open, setOpen] = useState(false);
  
  const [toast, setToast] = useState(false);

  return (
    <>
      <Head>
        <title>{boardInfo?.name} - Settings - Agylo</title>
      </Head>
      <div className="absolute right-28 top-32">
      {toast && <Toast message="Board updated successfully!" />}
      </div>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center">
          <div className="mx-4 flex w-[32rem] flex-col gap-7 divide-y p-5">
            <div className="mt-5">
              <h1 className="text-2xl font-bold text-gray-800">Board</h1>
              <h2 className="text-sm  font-medium text-gray-500">
                Manage your board settings
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
                id={parseInt(id as string)}
                name={boardInfo?.name ?? ""}
                description={boardInfo?.description ?? ""}
                setToast={setToast}
              />
            </div>
            <div className="mb-5 pt-5">
              <h1 className="text-lg font-medium text-gray-800">Delete board</h1>
              <p className="mt-2 text-sm text-gray-500">
                If you delete this board, all tasks, team members and comments will
                be permanently deleted. Please be certain.
              </p>
              <DeleteBoardDialog
                open={open}
                setOpen={setOpen}
                boardId={parseInt(id as string)}
                boardName={boardInfo?.name ?? ""}
              />
              <button
                onClick={() => setOpen(true)}
                className="mt-5 w-full rounded-lg bg-red-500 px-8 py-2.5 text-center text-md font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 sm:w-auto"
              >
                Delete this board
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
  const boardInfo = trpc.board.getBoardInfo.useQuery({
    id: parseInt(page.props.id as string),
  });

  const { description, name } = boardInfo?.data ?? {};

  return (
    <KanbanLayout name={name ?? "Board"} description={description ?? ""}>
      {page}
    </KanbanLayout>
  );
};

export default SettingsPage;
