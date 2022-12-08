import type { GetServerSideProps, NextPage } from "next";
import { signIn } from "next-auth/react";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import Link from "next/link";

const LandingPage: NextPage = () => {
  return (
    <div>
      <header>
        <nav className="flex flex-wrap items-center justify-between bg-gradient-to-b from-[#15162c] to-[#2e026d] p-6">
          <Link
            className="mr-6 flex flex-shrink-0 flex-row items-center text-white"
            href="/"
          >
            Logo
          </Link>
          <div>
            <ul>
              <li className="mr-4 inline-block">
                <Link
                  className="mt-4 mr-4 block text-white hover:text-white lg:mt-0 lg:inline-block"
                  href="/"
                >
                  Item 1
                </Link>
              </li>
              <li className="mr-4 inline-block">
                <Link
                  className="mt-4 mr-4 block text-white hover:text-white lg:mt-0 lg:inline-block"
                  href="/"
                >
                  Item 2
                </Link>
              </li>
              <li className="mr-4 inline-block">
                <Link
                  className="mt-4 mr-4 block text-white hover:text-white lg:mt-0 lg:inline-block"
                  href="/"
                >
                  Item 3
                </Link>
              </li>
            </ul>
          </div>
          <button
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={() => signIn()}
          >
            Sign in
          </button>
        </nav>
      </header>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-5xl font-bold text-white">Landing Page TO-DO</h1>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const session = await getServerAuthSession({ req, res });

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
