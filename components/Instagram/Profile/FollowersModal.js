import React, { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRecoilState } from "recoil";
import { followersModalState } from "../../../atoms/states";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../../firebase";
import { useRouter } from "next/router";
const FollowersModal = (props) => {
  const [open, setOpen] = useRecoilState(followersModalState);
  const [followers, setFollowers] = useState([]);
  const [updatedUsers, setUpdatedUsers] = useState([]);
  const Router = useRouter();

  useEffect(() => {
    onSnapshot(
      query(collection(db, "Users", `${props.id}`, "Followers")),
      (snapshot) => setFollowers(snapshot.docs)
    );
  }, [db, props.id]);

  useEffect(() => {
    onSnapshot(query(collection(db, "Users")), (snapshot) =>
      setUpdatedUsers(snapshot.docs)
    );
  }, [db]);
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
              {followers.map((follower) => (
                <div
                  onClick={() =>
                    Router.push(`/instagram/profile/${follower.data().uid}`)
                  }
                  className="flex items-center space-x-4 mb-3"
                  key={
                    updatedUsers
                      .map((user) => user.id)
                      .includes(follower.data().uid)
                      ? updatedUsers.filter(
                          (user) => user.data().uid == follower.data().uid
                        )
                      : follower.data().uid
                  }
                >
                  <img
                    className="rounded-full w-10 h-10"
                    src={
                      updatedUsers
                        .map((user) => user.id)
                        .includes(follower.data().uid)
                        ? updatedUsers
                            .filter(
                              (user) => user.data().uid == follower.data().uid
                            )
                            .map((user) => user.data().image)
                        : follower.data().ProfilePic
                    }
                    alt=" "
                  />
                  <div>
                    <p>
                      <strong>
                        {updatedUsers
                          .map((user) => user.id)
                          .includes(follower.data().uid)
                          ? updatedUsers
                              .filter(
                                (user) => user.data().uid == follower.data().uid
                              )
                              .map((user) => user.data().name)
                          : follower.data().Name}
                      </strong>
                    </p>
                    <p className="text-gray-600 text-sm">
                      @
                      {updatedUsers
                        .map((user) => user.id)
                        .includes(follower.data().uid)
                        ? updatedUsers
                            .filter(
                              (user) => user.data().uid == follower.data().uid
                            )
                            .map((user) => user.data().Username)
                        : follower.data().Username}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default FollowersModal;
