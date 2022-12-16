import type { GetServerSideProps } from "next";
import { getServerAuthSession } from "./get-server-auth-session";

export const protectedRouterPage: GetServerSideProps = async (context) => {
    const { req, res } = context;
    const session = await getServerAuthSession({ req, res });

    const id = context.query?.id;
  
    if (!session) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  
    return {
      props: { session, id },
    };
  };