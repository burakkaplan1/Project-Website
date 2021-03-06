import HeaderInsta from "./HeaderInsta";
import Posts from "./Posts";
import Stories from "./Stories";
import StoryUpload from "./StoryUpload";
import UploadInstagram from "./UploadInstagram";
import StoryModalComponent from "./StoryModalComponent";
import Suggestions from "./Suggestions";
import { useRecoilState } from "recoil";
import { instagramSidebarOpen } from "../../atoms/states";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { collection, onSnapshot, query, setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
const Instagram = () => {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useRecoilState(instagramSidebarOpen);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    onSnapshot(query(collection(db, "Users")), (snapshot) =>
      setUsers(snapshot.docs)
    );
  }, [db]);

  useEffect(async () => {
    if (session) {
      if (users.filter((user) => user.id == session.user.uid).length == 0) {
        await setDoc(doc(db, "Users", session?.user.uid), {
          Username: session.user.name,
          uid: session.user.uid,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        });
      }
    }
  }, [users]);
  return (
    <div className="dark:bg-gray-900 ">
      <HeaderInsta />

      <div
        className={`grid lg:grid-cols-5 lg:space-x-5 justify-evenly pt-10 mx-auto lg:w-[70%] md:w-[60%] w-[95%] ${
          sidebarOpen &&
          "blur-sm md:blur-0  transition duration-150 ease-linear"
        }`}
      >
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
