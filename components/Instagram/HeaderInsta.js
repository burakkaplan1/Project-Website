import Image from "next/image";
import {
  BellIcon,
  HomeIcon,
  MenuIcon,
  PaperAirplaneIcon,
  PhotographIcon,
  PlusCircleIcon,
  SearchIcon,
} from "@heroicons/react/outline";
import { BiLogOut } from "react-icons/bi";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import {
  instagramSidebarOpen,
  storyUploadState,
  uploadModalState,
} from "../../atoms/states";
import { Menu } from "@headlessui/react";
const HeaderInsta = () => {
  const { data: session, jwt } = useSession();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useRecoilState(uploadModalState);
  const [storyOpen, setStoryOpen] = useRecoilState(storyUploadState);
  const [sidebarOpen, setSidebarOpen] = useRecoilState(instagramSidebarOpen);
  const Router = useRouter();
  useEffect(() => {
    onSnapshot(query(collection(db, "Users")), (snapshot) =>
      setUsers(snapshot.docs)
    );
  }, [db]);

  useEffect(() => {
    console.log(session);
  }, [session]);
  return (
    <div className="relative dark:bg-gray-900 h-16 w-full flex items-center justify-between px-10 lg:px-[15%] shadow-lg dark:border-t dark:border-white ">
      <Image
        src={
          "https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
        }
        priority={true}
        alt="instagram"
        width={103}
        height={29}
        className="cursor-pointer dark:invert"
        onClick={() => Router.push({ pathname: "/" })}
      />
      <div className="hidden md:inline-flex max-w-xs  ">
        <form
          className="flex relative mt-1 p-3 rounded-md "
          onSubmit={() =>
            Router.push({
              pathname: `/instagram/profile/${search}`,
            })
          }
        >
          <div className="absolute inset-y-0 pl-3 flex items-center">
            <SearchIcon className=" w-5 text-gray-500 dark:text-white" />
          </div>

          <input
            className="bg-gray-50 pl-10 py-2 block w-40 sm:text-sm border-gray-300 rounded-md focus:ring-black focus:border-black focus:w-80 transition-all ease-in-out duration-300 pointer-event-none dark:bg-gray-700 dark:placeholder:text-gray-100"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            list="accounts"
          />
          <datalist id="accounts">
            {users.map((user) => (
              <span key={user.id}>
                <option
                  className="bg-blue-600"
                  value={user.data().Username}
                  onSelect={() => setSearch(user.data().uid)}
                />
              </span>
            ))}
          </datalist>
        </form>
      </div>
      <div className="flex items-center justify-end space-x-4">
        <HomeIcon onClick={() => Router.push("/")} className="navBtn" />
        {sidebarOpen == false && session && (
          <MenuIcon
            className="h-6 w-6 md:hidden cursor-pointer z-50"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
        )}
        {sidebarOpen && session && (
          <div className="w-80 h-[100vh] md:hidden bg-gray-700 text-white absolute top-0 right-0 transition ease-in-out duration-500 flex flex-col justify-between px-4">
            <div>
              <div className="mt-5">
                <MenuIcon
                  className="h-6 w-6  md:hidden cursor-pointer z-50 "
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                />
              </div>

              <div className="mt-10 flex flex-col space-y-4">
                <div
                  className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition duration-150 ease-in"
                  onClick={() => Router.push("/")}
                >
                  <HomeIcon className="w-6 h-6 " />
                  <span>Go to homepage</span>
                </div>
                <div
                  className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition duration-150 ease-in"
                  onClick={() => setOpen(true)}
                >
                  <PlusCircleIcon className="w-6 h-6 " />
                  <span>Share a photo</span>
                </div>
                <div
                  className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition duration-150 ease-in"
                  onClick={() => setOpen(true)}
                >
                  <PhotographIcon className="w-6 h-6 " />
                  <span>Share a story</span>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <div
                className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition duration-150 ease-in py-4 border-b border-b-gray-300"
                onClick={signOut}
              >
                <BiLogOut className="w-6 h-6 " />
                <span>Log out</span>
              </div>
              <div
                className="flex flex-row items-center space-x-3 mt-3 cursor-pointer"
                onClick={() =>
                  Router.push(`/instagram/profile/${session.user.uid}`)
                }
              >
                <img
                  src={session.user.image}
                  alt={session.user.username}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col ">
                  <h2 className="text-sm font-semibold">{session.user.name}</h2>
                  <h3 className="text-xs text-gray-300">
                    @{session.user.username}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        )}
        {sidebarOpen == false && session ? (
          <>
            <BellIcon className="navBtn" />
            <div className="navBtn relative">
              <PaperAirplaneIcon className="rotate-45" />
              <div className="absolute -right-1 -top-2 w-5 h-5 text-xs flex items-center justify-center animate-pulse bg-red-500 rounded-full text-white">
                3
              </div>
            </div>
            <PlusCircleIcon onClick={() => setOpen(true)} className="navBtn" />
            <PhotographIcon
              title="Story"
              className="navBtn"
              onClick={() => setStoryOpen(true)}
            />
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button>
                <img
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full cursor-pointer hover:scale-110 ease-out transition-all"
                  objectfit="contain"
                  layout="fill"
                  src={session.user.image}
                  alt="profile pic"
                />
              </Menu.Button>
              <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white dark:bg-gray-700 divide-y divide-gray-100 dark:divide-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      className={`${
                        active
                          ? "bg-violet-500 text-white dark:bg-gray-900 cursor-pointer"
                          : "text-gray-900 dark:text-white"
                      } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      onClick={() =>
                        Router.push({
                          pathname: `/instagram/profile/${session.user.uid}`,
                        })
                      }
                    >
                      Profile
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      className={`${
                        active
                          ? "bg-violet-500 text-white dark:bg-gray-900 cursor-pointer"
                          : "text-gray-900 dark:text-white"
                      } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                    >
                      Saved
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      className={`${
                        active
                          ? "bg-violet-500 text-white dark:bg-gray-900 cursor-pointer"
                          : "text-gray-900 dark:text-white"
                      } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      onClick={signOut}
                    >
                      Log out
                    </a>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </>
        ) : (
          <button onClick={signIn}>Sign in</button>
        )}
      </div>
    </div>
  );
};

export default HeaderInsta;
