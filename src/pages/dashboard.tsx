import type { GetServerSideProps, NextPage } from "next";
import { signOut } from "next-auth/react";
import { protectedPage } from "../server/common/protected-page";

const Dashboard: NextPage = () => {
  return (
    <div>
      Dashboard
      <button onClick={() => signOut()}>sign out</button>
    </div>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (context) => protectedPage(context)
