import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

const UserAvatar: React.FC = () => {
  const { data: session } = useSession();

  return (
    <Image
      onClick={() => signOut()}
      className="p-1 cursor-pointer rounded-full"
      width={42}
      height={42}
      src={
        session?.user?.image ??
        "https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg"
      }
      alt="User image"
    />
  );
};

const Header: React.FC = () => {
  return (
    <header className="flex flex-row flex-wrap items-center justify-between py-2 px-2 shadow-md">
      <div className="flex flex-row items-center gap-4">
        <Link href="/dashboard" className="text-2xl font-bold text-indigo-500">
          Logo
        </Link>
        <h1 className="text-lg">Projects</h1>
        <h1 className="text-lg">My tasks</h1>
      </div>
      <div className="flex flex-row items-center gap-4">
        <h1 className="text-lg">Search</h1>
        <h1 className="text-lg">Notification</h1>
        <h1 className="text-lg">Configuration</h1>
        <UserAvatar />
      </div>
    </header>
  );
};

export default Header;
