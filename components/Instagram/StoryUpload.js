import React, { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRecoilState } from "recoil";
import { storyUploadState } from "../../atoms/states";
import { useSession } from "next-auth/react";
import { CameraIcon } from "@heroicons/react/outline";

import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

const StoryUpload = () => {
  const { data: session } = useSession();
  const [storyOpen, setStoryOpen] = useRecoilState(storyUploadState);
  const [selectedFile, setSelectedFile] = useState(null);
  const [duration, setDuration] = useState("15 Minute");
  const filePickerRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const uploadStory = async (e) => {
    if (loading) return;
    setLoading(true);

    const nowDate = Date.now();
    const FifteenMinute = nowDate + 900000;
    const anHour = nowDate + 3600000;
    const aDay = nowDate + 86400000;
    var vDeletingTime = FifteenMinute;

    if (duration == "15 Minute") {
      vDeletingTime = FifteenMinute;
    } else if (duration == "1 Hour") {
      vDeletingTime = anHour;
    } else if (duration == "24 Hours") {
      vDeletingTime = aDay;
    } else {
      vDeletingTime = FifteenMinute;
    }

    const docRef = await addDoc(collection(db, "InstagramStories"), {
      Username: session.user.username,
      duration: duration,
      ProfilePic: session.user.image,
      uid: session.user.uid,
      PostingDate: serverTimestamp(),
      DeleteTime: parseInt(vDeletingTime),
    });
    console.log("New doc added with ID", docRef.id);

    const imageRef = ref(storage, `InstagramStories/${docRef.id}/image`);

    await uploadString(imageRef, selectedFile, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "InstagramStories", docRef.id), {
          ImageURL: downloadURL,
        });
      }
    );

    setStoryOpen(false);
    setLoading(false);
    setSelectedFile(null);
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

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
          {/* This element is to trick the browser into centering the modal contents. */}
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
            <div
              onClick={() => filePickerRef.current.click()}
              className="inline-block dark:bg-gray-900 w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
            >
              <div>
                {selectedFile ? (
                  <img
                    src={selectedFile}
                    onClick={() => setSelectedFile(null)}
                    alt=""
                  />
                ) : (
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-gray-600 cursor-pointer">
                    <CameraIcon
                      className="w-6 h-6 text-red-600   dark:text-white"
                      aria-hidden="true"
                    />
                  </div>
                )}

                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900 dark:text-blue-300"
                    >
                      Upload a Story
                    </Dialog.Title>
                    <div className=" ">
                      <input
                        onChange={addImageToPost}
                        ref={filePickerRef}
                        type="file"
                        hidden
                      />
                    </div>

                    <div className="text-sm flex items-center justify-center z-10 mt-10">
                      <p className="font-semibold text-gray-800 dark:text-blue-200">
                        Select duration:{" "}
                      </p>
                      <div className="flex items-center ml-5 space-x-2 justify-evenly">
                        <label>
                          <input
                            type="radio"
                            name="duration"
                            value="15 Minute"
                            onChange={(e) => setDuration(e.target.value)}
                            className=" form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                          />
                          15 Min.
                        </label>

                        <label>
                          <input
                            type="radio"
                            value="1 Hour"
                            name="duration"
                            onChange={(e) => setDuration(e.target.value)}
                            className=" form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                          />
                          1 Hour
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="duration"
                            value="24 Hours"
                            onChange={(e) => setDuration(e.target.value)}
                            className=" form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                          />
                          24 Hours{" "}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    onClick={uploadStory}
                    disabled={!selectedFile}
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
                  >
                    {loading ? "Uploading..." : "Upload the Story"}
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default StoryUpload;
