import React, { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRecoilState } from "recoil";
import { profileEditModalState } from "../../../atoms/states";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadString } from "@firebase/storage";
import PhoneInput from "react-phone-number-input/input";
import "react-phone-number-input/style.css";
import { db, storage } from "../../../firebase";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
const ProfileEditModal = (props) => {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useRecoilState(profileEditModalState);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [profileDescription, setProfileDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const filePickerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const Router = useRouter();

  const fName = "";
  const fUsername = "";
  const fProfileDescription = "";
  const fPhoneNumber = "";

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "Users"),
        where("uid", "==", `${session?.user?.uid}`)
      ),
      (snaphot) => {
        setUsers(snaphot.docs);
      }
    );
  }, [db]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name === "" || name === undefined || name === null) {
      if (
        users.map(
          (user) =>
            user.data().name !== undefined ||
            user.data().name !== null ||
            user.data().name !== ""
        )
      ) {
        fName = users.map((user) => user.data().name);
      } else {
        fName = session.user.name;
      }
    } else {
      fName = name;
    }
    if (username === "" || username === undefined || username === null) {
      if (
        users.map(
          (user) =>
            user.data().Username !== undefined ||
            user.data().Username !== null ||
            user.data().Username !== ""
        )
      ) {
        fUsername = users.map((user) => user.data().Username);
      } else {
        fUsername = session.user.username;
      }
    } else {
      fUsername = username;
    }
    if (
      profileDescription === "" ||
      profileDescription === undefined ||
      profileDescription === null
    ) {
      if (
        users.map(
          (user) =>
            user.data().Bio !== undefined ||
            user.data().Bio !== null ||
            user.data().Bio !== ""
        )
      ) {
        fProfileDescription = users.map((user) => user.data().Bio);
      } else {
        fProfileDescription = "";
      }
    } else {
      fProfileDescription = profileDescription;
    }
    if (
      phoneNumber === "" ||
      phoneNumber === undefined ||
      phoneNumber === null
    ) {
      if (
        users.map(
          (user) =>
            user.data().phoneNumber !== undefined ||
            user.data().phoneNumber !== null ||
            user.data().phoneNumber !== ""
        )
      ) {
        fPhoneNumber = users.map((user) => user.data().phoneNumber);
      } else {
        fPhoneNumber = "";
      }
    } else {
      fPhoneNumber = phoneNumber;
    }
    if (confirm("You are accepting the updates ") === true) {
      await setDoc(doc(db, "Users", session.user.uid), {
        name: fName,
        Username: fUsername,
        Bio: fProfileDescription,
        phoneNumber: fPhoneNumber,
        uid: session.user.uid,
        image: session.user.image,
      });

      const imageRef = ref(storage, `Users/${session.user.uid}/image`);
      await uploadString(imageRef, selectedFile, "data_url").then(
        async (snapshot) => {
          const downloadURL = await getDownloadURL(imageRef);
          await updateDoc(doc(db, "Users", session.user.uid), {
            image: downloadURL,
          });
        }
      );

      alert("Your profile successfully updated");
    } else {
      ("Profile is not updated!");
    }
    setOpen(false);
    location.reload();
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
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <form className="flex flex-col space-y-3">
                <div
                  className="flex items-center justify-center"
                  onClick={() => filePickerRef.current.click()}
                >
                  <img
                    onClick={() => setSelectedFile(null)}
                    src={
                      selectedFile
                        ? selectedFile
                        : users
                            .filter((user) => user.id == session.user.uid)
                            .map((user) => user.data().image)
                    }
                    alt={users
                      .filter((user) => user.id == session.user.uid)
                      .map((user) => user.data().Username)}
                    className="rounded-full w-40 h-40"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
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
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold" htmlFor="name">
                    Your name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-lg text-gray-700 text-sm"
                    placeholder="Burak Kaplan"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold" htmlFor="username">
                    Username{" "}
                    <span className="font-normal">(max length: 30)</span>
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    minLength={3}
                    maxLength={30}
                    onChange={(e) => setUsername(e.target.value)}
                    className="rounded-lg text-gray-700 text-sm"
                    placeholder="Burakapln"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    className="text-sm font-semibold"
                    htmlFor="profileDescription"
                  >
                    Profile Description
                  </label>
                  <textarea
                    id="profileDescription"
                    type="text"
                    value={profileDescription}
                    onChange={(e) => setProfileDescription(e.target.value)}
                    className="rounded-lg text-gray-700 text-sm"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    className="text-sm font-semibold"
                    htmlFor="phoneNumber"
                  >
                    Phone Number
                  </label>
                  <PhoneInput
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    className="rounded-lg text-gray-700 text-sm"
                    placeholder="+31 0 999999"
                  />
                </div>
                <button type="submit" onClick={handleSubmit}>
                  Update
                </button>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ProfileEditModal;
