import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";

import Header from "../components/dashboard/header";
import { protectedPage } from "../server/common/protected-page";

const Dashboard: NextPage = () => {
  return (
    <>
      <Header />
      <main className="flex flex-col flex-nowrap p-6">
        <h1 className="text-3xl font-bold">My work</h1>
        <div className="bg-gray-100 h-48">
          <h1>My boards</h1>
          <div>
            <Link href="/boards/id"> Board 1</Link>
          </div>
        </div>
        <div>
          <h1 className="border-solid border-b-2 border-gray-100">Assigned tasks</h1>
        </div>
      </main>
    </>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (context) =>
  protectedPage(context);
