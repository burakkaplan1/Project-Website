import React, { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRecoilState } from "recoil";

import { CameraIcon } from "@heroicons/react/outline";
import { db, storage } from "../../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
  setDoc,
} from "@firebase/firestore";
import { useSession } from "next-auth/react";
import { ref, getDownloadURL, uploadString } from "@firebase/storage";
import { uploadModalState } from "../../atoms/states";

function UploadInstagram() {
  const { data: session } = useSession();
  const [open, setOpen] = useRecoilState(uploadModalState);
  const filePickerRef = useRef(null);
  const captionRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const uploadPost = async () => {
    if (loading) return;
    setLoading(true);
    // 1) create a post and add to firestore 'posts' collection
    // 2) get the post ID for the newly created post
    // 3) upload the image to firebase storage with the post ID
    // 4)get a download url from firebase storage and update the original post with the image
    const docRef = await addDoc(collection(db, "Instagram"), {
      Username: session.user.username,
      description: captionRef.current.value,
      ProfilePic: session.user.image,
      uid: session.user.uid,
      PostingDate: serverTimestamp(),
    });
    console.log("New doc added with ID", docRef.id);

    const imageRef = ref(storage, `Instagram/${docRef.id}/image`);

    await uploadString(imageRef, selectedFile, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "Instagram", docRef.id), {
          ImageURL: downloadURL,
        });
      }
    );

    setOpen(false);
    setLoading(false);
    setSelectedFile(null);
  };
  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      console.log(reader);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        onClose={setOpen}
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
              className="inline-block dark:bg-black w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
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
                      className="w-6 h-6 text-red-600 dark:text-white "
                      aria-hidden="true"
                    />
                  </div>
                )}

                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                    >
                      Upload a photo
                    </Dialog.Title>
                    <div className="">
                      <input
                        onChange={addImageToPost}
                        ref={filePickerRef}
                        type="file"
                        hidden
                      />
                    </div>
                    <div>
                      <input
                        ref={captionRef}
                        className="border-none focus:ring-0 w-full text-center dark:bg-transparent mt-8"
                        type="text"
                        placeholder="Enter a caption..."
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    onClick={uploadPost}
                    disabled={!selectedFile}
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
                  >
                    {loading ? "Uploading..." : "Upload the post"}
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default UploadInstagram;
