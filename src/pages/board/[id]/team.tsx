import { type ReactElement } from "react";
import type { NextPageWithLayout } from "../../_app";
import { trpc } from "../../../utils/trpc";
import KanbanLayout from "../../../components/kanban/kanbanLayout";
import { type GetServerSideProps } from "next";
import { protectedRouterPage } from "../../../server/common/protected-router-page";

const TeamPage: NextPageWithLayout = () => {
  return <div className="w-full">Team</div>;
};

TeamPage.getLayout = function getLayout(page: ReactElement) {
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

export const getServerSideProps: GetServerSideProps = async (context) =>
  protectedRouterPage(context);

export default TeamPage;
