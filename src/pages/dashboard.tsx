import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";

import Header from "../components/dashboard/header";
import { protectedPage } from "../server/common/protected-page";
import { trpc } from "../utils/trpc";

const Dashboard: NextPage = () => {
  const { mutateAsync } = trpc.board.createBoard.useMutation({});

  const handleCreateBoard = async () => {
    const board = await mutateAsync({
      name: "New board",
    });
  };

  return (
    <>
      <Header />
      <main className="flex flex-col flex-nowrap p-6">
        <h1 className="text-3xl font-bold">My work</h1>
        <div className="h-48 bg-gray-100">
          <h1>My boards</h1>
          <div>
            <Link href="/boards/id"> Board 1</Link>
          </div>
          <button onClick={handleCreateBoard}>Create test board</button>
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

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (context) =>
  protectedPage(context);
