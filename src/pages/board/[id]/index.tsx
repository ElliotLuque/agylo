import { useRouter } from "next/router";
import type { ReactElement } from "react";
import Header from "../../../components/dashboard/header";
import { trpc } from "../../../utils/trpc";
import  type { NextPageWithLayout } from "../../_app";

const KanbanLayout: NextPageWithLayout = () => {

  const router = useRouter()
  const { id } = router.query

  const { data: boardData } = trpc.board.getBoard.useQuery({
    id: Number(id),
  })
  return (  
    <div>
      <h1>Board {boardData?.name}</h1>
    </div>
  );
};

KanbanLayout.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Header />
      {page}
    </>
  );
};

export default KanbanLayout;
