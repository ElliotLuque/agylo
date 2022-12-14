import { motion } from "framer-motion";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { ReactElement, useState } from "react";
import BoardCreateDialog from "../components/dashboard/createDialog";

import Header from "../components/dashboard/header";
import LoadingSpinner from "../components/misc/loadingSpinner";
import { protectedPage } from "../server/common/protected-page";
import { trpc } from "../utils/trpc";
import type { NextPageWithLayout } from "./_app";

const BoardItem: React.FC<{
  id: number;
  name: string;
  description: string | null;
}> = ({ id, name, description }) => {
  return (
    <Link
      href={`/board/${id}`}
      className="flex h-48 w-80 flex-col flex-nowrap gap-1 rounded-xl bg-white p-4 drop-shadow-lg"
    >
      <h1 className="text-xl font-bold">{name}</h1>
      <p className="text-sm">{description}</p>
    </Link>
  );
};

const Dashboard: NextPageWithLayout = () => {
  const { data: boards, isLoading } = trpc.board.listBoards.useQuery();

  const [open, setOpen] = useState(false);

  return (
    <>
      <main className="mx-12 flex flex-col flex-nowrap p-6">
        <div className="flex flex-row flex-wrap justify-between">
          <h1 className="pb-1 text-3xl font-bold">My work</h1>
        </div>
        <BoardCreateDialog open={open} setOpen={setOpen} />
        <div className="flex flex-row items-center gap-7 py-6">
          {isLoading ? (
            <LoadingSpinner height={48} width={16} />
          ) : (
            boards?.map((board) => (
              <motion.div
                key={board.boardId}
                initial={{ x: 5, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <BoardItem
                  id={board.boardId}
                  name={board.board.name}
                  description={board.board.description}
                />
              </motion.div>
            ))
          )}
          <button
            className="inline-flex w-auto justify-center rounded-lg bg-indigo-500 px-6 py-4 text-white hover:bg-indigo-800"
            onClick={() => (open ? setOpen(false) : setOpen(true))}
          >
            Add new board
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
    <>
      <Header />
      {page}
    </>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (context) =>
  protectedPage(context);
