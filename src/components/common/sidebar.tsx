import Link from "next/link";
import { trpc } from "../../utils/trpc";
import HomeIcon from "./svg/homeIcon";
import TasksIcon from "./svg/tasksIcon";
import NotificationIcon from "./svg/notificationIcon";

const Sidebar: React.FC = () => {
  const { data: userBoards } = trpc.board.listBoards.useQuery();

  return (
    <aside className="border-r-1 fixed top-0 h-screen w-72 border border-gray-200 bg-white">
      <div className="flex h-full flex-col gap-2 py-4 px-7">
        <h1 className="mt-5 text-xl font-bold text-indigo-500">Logo agylo</h1>
        <div className="mt-12 flex flex-col justify-center gap-6 text-lg font-semibold text-gray-800 ">
          <Link href="/dashboard">
            <div className="flex flex-row items-center gap-3">
              <HomeIcon />
              <h1>Home</h1>
            </div>
          </Link>
          <Link href="/my-tasks">
            <div className="flex flex-row items-center gap-3">
              <TasksIcon />
              <h1>My tasks</h1>
            </div>
          </Link>
          <h1>
            <div className="flex flex-row items-center gap-3">
              <NotificationIcon />
              <h1>Inbox</h1>
            </div>
          </h1>
        </div>
        <div className="mt-8">
          <h1 className="font-medium text-stone-500">Boards</h1>
          <div className="ml-1.5 mt-5 mb-4 flex h-76 flex-col gap-2.5 overflow-auto">
            {userBoards?.map((board) => (
              <Link
                className="font-semibold text-gray-800"
                href={`/board/${board.boardId}`}
                key={board.boardId}
              >
                <div>
                  <p>{board.board.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
