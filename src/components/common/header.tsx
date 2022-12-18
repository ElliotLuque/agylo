import Link from "next/link";
import UserAvatar from "./userAvatar";

const Header: React.FC = () => {
  return (
    <header className="z-10 flex flex-row flex-wrap items-center justify-between py-2 px-2 shadow-md">
      <div className="flex flex-row items-center gap-4">
        <Link href="/dashboard" className="text-2xl font-bold text-indigo-500">
          Logo
        </Link>
        <h1 className="text-lg">Boards</h1>
        <h1 className="text-lg">Tasks</h1>
      </div>
      <div className="flex flex-row items-center gap-4">
        <h1 className="text-lg">Search</h1>
        <h1 className="text-lg">Notification</h1>
        <h1 className="text-lg">Configuration</h1>
        <UserAvatar width={42} height={42} />
      </div>
    </header>
  );
};

export default Header;
