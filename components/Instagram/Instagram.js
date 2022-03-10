import HeaderInsta from "./HeaderInsta";
import Posts from "./Posts";
import Stories from "./Stories";
import StoryUpload from "./StoryUpload";
import UploadInstagram from "./UploadInstagram";
import StoryModalComponent from "./StoryModalComponent";
import Suggestions from "./Suggestions";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { async } from "@firebase/util";

const Instagram = () => {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    onSnapshot(query(collection(db, "Users")), (snapshot) =>
      setUsers(snapshot.docs)
    );
  }, [db]);

  useEffect(async () => {
    if (users.map((user) => user.id == session?.user?.uid).includes(true)) {
      return console.log(users.map((user) => user.id));
    } else {
      await addDoc(doc(db, "Users", `${session.user.uid}`), {
        name: session.user.name,
        Username: session.user.username,
        image: session.user.image,
        uid: session.user.uid,
      });
    }
  }, [db, session]);

  return (
    <div className="dark:bg-gray-900">
      <HeaderInsta />

      <div className="grid lg:grid-cols-5 lg:space-x-5 justify-evenly pt-10 mx-auto w-[70%]">
        <div className="lg:col-span-3 h-[100vh] overflow-y-scroll">
          <Stories />
          <Posts />
          <UploadInstagram />
          <StoryUpload />
          <StoryModalComponent />
        </div>
        <div className="w-full h-screen hidden lg:inline-block lg:col-span-2">
          <Suggestions />
        </div>
      </div>
    </div>
  );
};

export default Instagram;
