import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";

const SuggestionProfile = (props) => {
  const { data: session } = useSession();
  const [hasFollowed, setHasFollowed] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const Router = useRouter();

  useEffect(() => {
    onSnapshot(query(collection(db, "Users", props.id, "Followers"))),
      (snapshot) => setFollowers(snapshot.docs);
  }, [db, props.id]);

  useEffect(() => {
    if (session) {
      onSnapshot(
        query(collection(db, "Users", session?.user?.uid, "Following")),
        (snapshot) => {
          setFollowings(snapshot.docs);
        }
      );
    }
  }, [db, session]);

  useEffect(() => {
    console.log(followings.map((following) => following.id));
  }, []);

  useEffect(() => {
    if (
      followings.map((following) => following.id == props.id).includes(true)
    ) {
      setHasFollowed(true);
    } else {
      setHasFollowed(false);
    }
  }, [followings]);
  const handleFollow = async (e) => {
    e.preventDefault();
    if (hasFollowed == true) {
      await deleteDoc(
        doc(db, "Users", session?.user?.uid, "Following", props.id)
      );
      await deleteDoc(
        doc(db, "Users", props.id, "Followers", session?.user?.uid)
      );
    }
    if (hasFollowed == false) {
      await setDoc(
        doc(db, "Users", session?.user?.uid, "Following", props.id),
        {
          Username: props.Username,
          uid: props.id,
          ProfilePic: props.profilePicture,
          Name: props.Name,
        }
      );
      await setDoc(
        doc(db, "Users", props.id, "Followers", session?.user?.uid),
        {
          Username: session?.user?.username,
          uid: session?.user?.uid,
          ProfilePic: session?.user?.image,
          Name: session?.user?.name,
        }
      );
    }
  };
  return (
    <div className="flex items-center justify-between" id={props.id}>
      {
        <div
          onClick={() =>
            Router.push({ pathname: `/instagram/profile/${props.id}` })
          }
          className="flex items-center space-x-2 cursor-pointer"
        >
          <img
            src={props.profilePicture}
            alt={props.Username}
            className="rounded-full w-10 h-10 object-cover"
          />
          <div className="text-sm flex flex-col">
            <span className="font-semibold">{props.Name}</span>
            <span className="text-gray-500">@{props.Username}</span>
          </div>
        </div>
      }
      <button
        type="button"
        className="align-self-end text-blue-300 hover:text-blue-700 font-semibold"
        onClick={handleFollow}
      >
        {hasFollowed == true ? "Following" : "+Follow"}
      </button>
    </div>
  );
};

export default SuggestionProfile;
