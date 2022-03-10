import { getProviders, signIn } from "next-auth/react";
import Header from "../../components/header/Header";
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
            {/* {Object.values(providers).map((provider) => (
              <div key={provider.name}>
                <button
                  className="bg-blue-500 text-white w-full p-3 rounded-md py-2"
                  onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                >
                  Sign in with {provider.name}
                </button>
              </div>
            ))} */}
            <div>
              <button
                className="bg-blue-500 text-white w-full p-3 rounded-md py-2"
                onClick={() => signIn(providers[0].id, { callbackUrl: "/" })}
              >
                Sign in with Facebook
              </button>
            </div>
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
