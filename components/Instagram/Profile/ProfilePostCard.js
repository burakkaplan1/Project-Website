import { ChatAlt2Icon, HeartIcon } from "@heroicons/react/outline";
import { collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";

const ProfilePostCard = (props) => {
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    onSnapshot(
      query(collection(db, "Instagram", `${props.id}`, "Comments")),
      (snapshot) => setComments(snapshot.docs)
    );
  }, [db, props.id]);
  useEffect(() => {
    onSnapshot(
      query(collection(db, "Instagram", `${props.id}`, "Likes")),
      (snapshot) => setLikes(snapshot.docs)
    );
  }, [db, props.id]);
  return (
    <div className="relative group cursor-pointer" id={props.id}>
      <img
        src={props.image}
        alt={props.description}
        className="w-80 h-80 border object-contain border-gray-100 hover:brightness-[30%] transition-all duration-400 ease-linear "
      />
      <div className="hidden group-hover:inline-flex space-x-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
        <p className="flex items-center space-x-1">
          <ChatAlt2Icon className="w-6 h-6" /> <span>{comments?.length}</span>
        </p>{" "}
        <p className="flex items-center space-x-1">
          <HeartIcon className="w-6 h-6" /> <span>{likes.length}</span>
        </p>{" "}
      </div>
    </div>
  );
};

export default ProfilePostCard;
