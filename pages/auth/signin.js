import { getProviders, signIn } from "next-auth/react";
import Header from "../../components/header/Header";
import { FaFacebookF, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
// Web page
function signin({ providers }) {
  console.log(providers);
  return (
    <>
      <Header />
      <div className="my-20 items-center flex flex-col ">
        <h1 className="text-6xl font-semibold text-transparent bg-clip-text bg-gradient-to-br dark:from-purple-500 dark:to-blue-500 from-purple-600 to-blue-600">
          Burak Kaplan
        </h1>
        <div className="mt-10 border flex flex-col items-center justify-between pt-4 px-3 rounded-tr-lg">
          <p> This is a personal projects site!</p>
          <div className="mt-20 flex flex-col space-y-2 mb-5">
            <button
              onClick={() =>
                signIn(providers.facebook.id, { callbackURL: "/" })
              }
              className="bg-blue-500 text-white p-3 rounded-md py-2 flex items-center space-x-3"
            >
              <FaFacebookF className="w-6 h-6 text-white" />{" "}
              <span>Sign in with Facebook </span>
            </button>
            <button
              onClick={() => signIn(providers.google.id, { callbackURL: "/" })}
              className="bg-white text-blue-500 p-3 rounded-md py-2 flex items-center space-x-3 border border-blue-200"
            >
              <FcGoogle className="w-6 h-6 " />{" "}
              <span>Sign in with Google </span>
            </button>
            <button
              onClick={() => signIn(providers.github.id, { callbackURL: "/" })}
              className="bg-black text-white p-3 rounded-md py-2 flex items-center space-x-3 "
            >
              <FaGithub className="w-6 h-6 " />{" "}
              <span>Sign in with GitHub </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// SERVER
export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}

export default signin;
