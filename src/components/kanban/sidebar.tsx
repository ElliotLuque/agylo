import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

const Sidebar: React.FC<{ name: string; description: string }> = ({
  name,
  description,
}) => {
  const { id } = useRouter().query;

  return (
    <aside className="border-r-1 h-full w-72 border border-gray-200 bg-gray-50">
      <div className="flex h-full flex-col justify-between gap-2 py-4 px-7">
        <div>
          <div className="mt-5 flex flex-row items-center gap-6">
            <Image
              width={45}
              height={45}
              src={
                "https://cdn-icons-png.flaticon.com/512/1195/1195191.png?w=1800&t=st=1671288239~exp=1671288839~hmac=eaf6e627a59608a80254c733b040b5d8ca2fb12d18c21a55264eb4f30633646d"
              }
              alt="default icon"
            />
            <div>
              <h1 className="text-lg font-medium text-gray-800">{name}</h1>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          <div className="mt-10 flex flex-col justify-center gap-4 text-xl font-bold">
            <Link href={{ pathname: "/board/[id]", query: { id } }}>Home</Link>
            <Link href={{ pathname: "/board/[id]/team", query: { id } }}>
              Team
            </Link>
          </div>
        </div>
        <div className="mb-4">
          <Link
            className="text-2xl font-bold"
            href={{ pathname: "/board/[id]/settings", query: { id } }}
          >
            Settings
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
