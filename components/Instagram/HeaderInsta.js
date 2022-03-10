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
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { storyUploadState, uploadModalState } from "../../atoms/states";
import { Menu } from "@headlessui/react";
const HeaderInsta = () => {
  const { data: session, jwt } = useSession();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useRecoilState(uploadModalState);
  const [storyOpen, setStoryOpen] = useRecoilState(storyUploadState);
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
    <div className="relative dark:bg-gray-900 h-16 w-full flex items-center justify-between px-10 lg:px-[15%] shadow-lg dark:border-t dark:border-white">
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
        <MenuIcon className="h-6 w-6 md:hidden cursor-pointer" />
        {session ? (
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
