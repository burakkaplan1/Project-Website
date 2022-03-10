import {
  BookmarkIcon,
  ChatIcon,
  EmojiHappyIcon,
  HeartIcon,
  PaperAirplaneIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import Image from "next/image";
import Comments from "./Comments";
import Moment from "react-moment";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  serverTimestamp,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
const Post = (props) => {
  const { data: session } = useSession();
  const Router = useRouter();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [updatedUser, setUpdatedUser] = useState([]);
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [user, setUser] = useState([]);
  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "Instagram", `${props.id}`, "Comments"),
        orderBy("timestamp", "asc")
      ),
      (snapshot) => setComments(snapshot.docs)
    );
  }, [db, props.id]);

  useEffect(() => {
    onSnapshot(query(collection(db, "Users")), (snapshot) =>
      setUpdatedUser(snapshot.docs)
    );
  }, [db]);

  const submitComment = async (e) => {
    e.preventDefault();
    const commentToSend = comment;
    setComment("");

    await addDoc(collection(db, "Instagram", `${props.id}`, "Comments"), {
      uid: session.user.uid,
      comment: commentToSend,
      username: session.user.username,
      timestamp: serverTimestamp(),
      userImage: session.user.image,
    });
  };

  const handleComment = (event) => {
    setComment(event.target.value);
  };

  useEffect(() => {
    onSnapshot(
      query(collection(db, "Instagram", `${props.id}`, "Likes")),
      (snapshot) => setLikes(snapshot.docs)
    );
  }, [db, props.id]);

  useEffect(() => {
    if (
      likes.map((like) => like.id === session?.user?.uid).includes(true) == true
    ) {
      setHasLiked(true);
    } else {
      setHasLiked(false);
    }
  }, [likes]);

  const handleLike = async (e) => {
    e.preventDefault();
    if (session) {
      if (hasLiked) {
        await deleteDoc(
          doc(db, "Instagram", `${props.id}`, "Likes", session?.user?.uid)
        );
      } else {
        await setDoc(
          doc(db, "Instagram", `${props.id}`, "Likes", session.user.uid),
          {
            username: session.user.username,
            uid: session.user.uid,
            timestamp: serverTimestamp(),
            userImage: session.user.image,
            name: session.user.name,
            email: session.user.email,
          }
        );
      }
    } else {
      Router.push("/auth/signin");
    }
  };

  return (
    <div
      id={props.id}
      className="flex flex-col rounded-sm border border-gray-200 my-3 dark:bg-gray-800"
    >
      {/* Post header*/}
      <div className="flex justify-between items-center px-4 py-2">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() =>
            Router.push({
              pathname: `/instagram/profile/${props.uid}`,
            })
          }
        >
          <img
            className="rounded-full object-cover w-10 h-10"
            src={props.ProfilePic}
            alt={props.username}
          />
          <h3 className="font-semibold text-sm ">{props.username}</h3>
        </div>
        {session?.user?.uid == props.uid && (
          <button type="button" onClick={props.onDelete}>
            <TrashIcon className="w-5 h-5 cursor-pointer" />
          </button>
        )}
      </div>

      {/* Image*/}
      <div>
        <img
          src={props.Image}
          alt=""
          className="w-full max-h-[30rem] object-cover"
        />
      </div>
      {/* Comment  */}
      <div className="flex flex-col px-4 py-3 ">
        <div className="border-b border-gray-300 pb-2">
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <button onClick={handleLike}>
                <HeartIcon
                  className={`w-7 h-7 cursor-pointer  ${
                    hasLiked === true
                      ? "text-red-500 fill-red-500"
                      : "text-gray-700 dark:text-white "
                  }`}
                />
              </button>
              <ChatIcon className="text-gray-700 w-7 h-7 cursor-pointer dark:text-white" />
              <PaperAirplaneIcon className="text-gray-700 w-7 h-7 cursor-pointer dark:text-white" />
            </div>
            <BookmarkIcon className="text-gray-700 w-7 h-7 cursor-pointer dark:text-white" />
          </div>
          <div className="mt-3 relative">
            {likes.length >= 2 ? (
              <>
                <img
                  src={
                    updatedUser
                      .map((user) => user.id)
                      .includes(likes[0].data().uid)
                      ? updatedUser
                          .filter(
                            (user) => user.data().uid == likes[0].data().uid
                          )
                          .map((user) => user.data().image)
                      : likes[0].data().userImage
                  }
                  alt=""
                  className=" absolute left-0 w-6 h-6 border-2 border-white z-10 rounded-full "
                />
                <img
                  src={
                    updatedUser
                      .map((user) => user.id)
                      .includes(likes[1].data().uid)
                      ? updatedUser
                          .filter(
                            (user) => user.data().uid == likes[1].data().uid
                          )
                          .map((user) => user.data().image)
                      : likes[1].data().userImage
                  }
                  alt=""
                  className=" absolute left-4 w-6 h-6 rounded-full border-2 border-white "
                />
              </>
            ) : likes.length == 1 ? (
              <img
                src={
                  updatedUser
                    .map((user) => user.id)
                    .includes(likes[0].data().uid)
                    ? updatedUser
                        .filter(
                          (user) => user.data().uid == likes[0].data().uid
                        )
                        .map((user) => user.data().image)
                    : likes[0].data().userImage
                }
                alt=""
                className=" absolute left-0 w-6 h-6 rounded-full border-2 border-white "
              />
            ) : null}
            {likes.length >= 2 ? (
              <p className="ml-12 text-sm">
                {" "}
                Liked by{" "}
                <span className="font-semibold">
                  {updatedUser
                    .map((user) => user.id)
                    .includes(likes[0].data().uid)
                    ? updatedUser
                        .filter(
                          (user) => user.data().uid == likes[0].data().uid
                        )
                        .map((user) => user.data().Username)
                    : likes[0].data().username}
                </span>
                ,{" "}
                <span className="font-semibold">
                  {" "}
                  {updatedUser
                    .map((user) => user.id)
                    .includes(likes[1].data().uid)
                    ? updatedUser
                        .filter(
                          (user) => user.data().uid == likes[1].data().uid
                        )
                        .map((user) => user.data().Username)
                    : likes[1].data().username}{" "}
                </span>{" "}
                <span className="font-semibold">
                  {likes.length - 2 > 0 &&
                    " and " + (likes.length - 2) + " others"}
                </span>
              </p>
            ) : likes.length == 1 ? (
              <p className="ml-7 text-sm">
                this post is liked by{" "}
                <span className="font-semibold">
                  {updatedUser
                    .map((user) => user.id)
                    .includes(likes[0].data().uid)
                    ? updatedUser
                        .filter(
                          (user) => user.data().uid == likes[0].data().uid
                        )
                        .map((user) => user.data().Username)
                    : likes[0].data().username}
                </span>
              </p>
            ) : (
              <p className="font-semibold text-sm">This post has no likes!</p>
            )}
            <div className="mt-3">
              <div className="flex items-start">
                <p className="font-semibold text-sm mr-1">{props.username}: </p>
                <p className="text-sm line-clamp-2 hover:line-clamp-none">
                  {props.description}
                </p>
              </div>
              {comments.map((comment) => (
                <Comments
                  key={comment.id}
                  CommentUser={
                    updatedUser
                      .map((user) => user.id)
                      .includes(comment.data().uid)
                      ? updatedUser
                          .filter(
                            (user) => user.data().uid == comment.data().uid
                          )
                          .map((user) => user.data().Username)
                      : comment.data().username
                  }
                  userComment={comment.data().comment}
                />
              ))}

              <Moment fromNow className="text-xs text-slate-500 ">
                {props.PostingTime}
              </Moment>
            </div>
          </div>
        </div>
        <form
          className="mt-3 flex items-center space-x-3"
          onSubmit={submitComment}
        >
          {session ? (
            <>
              <EmojiHappyIcon className="w-6 h-6" />
              <input
                className="flex-1 text-sm focus:ring-0 focus:ring-offset-0 border-none dark:bg-transparent"
                type="text"
                value={comment}
                onChange={handleComment}
                placeholder="Write a comment..."
              />
              <button
                type="submit"
                disabled={comment !== "" ? false : true}
                className="disabled:text-blue-300 text-blue-600 font-semibold"
              >
                Post
              </button>
            </>
          ) : (
            <span className="justify-self-center text-red-400 font-semibold">
              Comment component will appear, if you log in
            </span>
          )}
        </form>
      </div>
    </div>
  );
};

export default Post;
