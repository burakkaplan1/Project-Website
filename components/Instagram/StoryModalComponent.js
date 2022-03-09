import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRecoilState } from "recoil";
import { StoryId, StoryModal } from "../../atoms/states";

import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../firebase";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/outline";
import Moment from "react-moment";

const StoryModalComponent = (props) => {
  const [storyOpen, setStoryOpen] = useRecoilState(StoryModal);
  const [StoryID, setStoryID] = useRecoilState(StoryId);
  const [stories, setStories] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState(0);

  useEffect(() => {
    onSnapshot(query(collection(db, "InstagramStories")), (snapshot) => {
      setStories(snapshot.docs);
    });
  }, [db]);
  useEffect(() => {
    onSnapshot(query(collection(db, "Users")), (snapshot) =>
      setUsers(snapshot.docs)
    );
  }, [db]);

  useEffect(() => {
    setCurrentPhoto(0);
  }, [storyOpen]);

  return (
    <Transition.Root show={storyOpen} as={Fragment}>
      <Dialog
        as="div"
        onClose={setStoryOpen}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-end justify-center min-h-[800px] sm:min-h-screen pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl relative">
              {stories.filter((story) => story.data().uid == StoryID).length >
                1 && (
                <div className="absolute left-1.5 top-1 mx-auto mt-2 w-[96%] flex items-center rounded-xl space-x-1 first:rounded-l-full last:rounded-r-full">
                  {stories
                    .filter((story) => story.data().uid == StoryID)
                    .map((story, index) => (
                      <button
                        type="button"
                        onClick={() => setCurrentPhoto(index)}
                        key={story.id}
                        disabled={index === currentPhoto}
                        className="disabled:bg-gray-400 first-of-type:rounded-l-full  last-of-type:rounded-r-full
                     w-full  bg-gray-200 h-[3px] "
                      ></button>
                    ))}
                </div>
              )}

              <img
                className="w-full h-full"
                src={
                  stories
                    .sort((a, b) => b.data().PostingDate - a.data().PostingDate)
                    .filter((story) => story.data().uid == StoryID)
                    [currentPhoto]?.data().ImageURL
                }
              />

              <div
                className={`absolute ${
                  stories.filter((story) => story.data().uid == StoryID)
                    .length > 1
                    ? "top-4 "
                    : "top-2 "
                }left-2 flex items-center space-x-2 bg-black/5 w-full text-white`}
              >
                <img
                  src={users
                    .filter((user) => user.id == StoryID)
                    .map((user) => user.data().image)}
                  alt=""
                  className="w-10 h-10 object-cover rounded-full"
                />
                <p className="font-semibold text-sm ">
                  {users
                    .filter((user) => user.id == StoryID)
                    .map((user) => user.data().Username)}
                </p>
                <Moment fromNow ago className=" text-sm">
                  {stories
                    .filter((story) => story.data().uid == StoryID)
                    [currentPhoto]?.data()
                    .PostingDate?.toDate()}
                </Moment>
              </div>

              <div className="absolute bottom-1 left-1 text-white flex items-center space-x-2 text-sm bg-black/25 ">
                <p className="">Story will be deleted in: </p>
                <span className="font-semibold">
                  {parseInt(
                    (stories
                      .filter((story) => story.data().uid == StoryID)
                      [currentPhoto]?.data().DeleteTime -
                      Date.now()) /
                      60000
                  ) <= 60
                    ? parseInt(
                        (stories
                          .filter((story) => story.data().uid == StoryID)
                          [currentPhoto]?.data().DeleteTime -
                          Date.now()) /
                          60000
                      ) + " minutes"
                    : parseInt(
                        (stories
                          .filter((story) => story.data().uid == StoryID)
                          [currentPhoto]?.data().DeleteTime -
                          Date.now()) /
                          (60000 * 60)
                      ) + " Hours"}
                </span>
              </div>

              {currentPhoto + 1 <
                stories.filter((story) => story.data().uid == StoryID)
                  .length && (
                <button
                  type="button"
                  onClick={() => setCurrentPhoto(currentPhoto + 1)}
                  className="absolute right-3 top-1/2 w-5 h-5 bg-slate-400 flex items-center justify-center rounded-full"
                >
                  <ArrowRightIcon className="text-white w-3 h-3 " />
                </button>
              )}
              {currentPhoto > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentPhoto(currentPhoto - 1)}
                  className="absolute left-3 top-1/2 w-5 h-5 bg-slate-400 flex items-center justify-center rounded-full"
                >
                  <ArrowLeftIcon className="text-white w-3 h-3 " />
                </button>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default StoryModalComponent;
