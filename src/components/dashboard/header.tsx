import { signOut } from "next-auth/react";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="flex flex-row flex-wrap items-center justify-between shadow-md py-2 px-2">
      <div className="flex flex-row items-center gap-4">
        <Link href="/dashboard" className="text-2xl font-bold">Logo header</Link>
        <h1 className="text-lg">Projects</h1>
        <h1 className="text-lg">My tasks</h1>
      </div>
      <div className="flex flex-row items-center gap-4">
        <h1 className="text-lg">Search</h1>
        <h1 className="text-lg">Notification</h1>
        <h1 className="text-lg">Configuration</h1>
        <button
          onClick={() => signOut()}
          className="rounded-md bg-red-500 py-2 px-4 text-xl font-bold text-white hover:bg-red-700"
        >
          User WIP - Sign out 
        </button>
      </div>
    </header>
  );
};

export default Header;
