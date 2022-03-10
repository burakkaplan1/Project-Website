import ProfileHomepage from "../../../components/Instagram/Profile/ProfileHomepage";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
  deleteDoc,
  setDoc,
} from "@firebase/firestore";
import { db } from "../../../firebase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProfilePostCard from "../../../components/Instagram/Profile/ProfilePostCard";
import { useSession } from "next-auth/react";
import FollowersModal from "../../../components/Instagram/Profile/FollowersModal";
import FollowingModal from "../../../components/Instagram/Profile/FollowingModal";
import ProfileEditModal from "../../../components/Instagram/Profile/ProfileEditModal";
import { FaRegImage } from "react-icons/fa";

const Profile = ({ UserProps }) => {
  const User = JSON.parse(UserProps);
  const Router = useRouter();
  const { id } = Router.query;
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [hasFollowed, setHasFollowed] = useState(false);
  const [comments, setComments] = useState([]);

  const [likes, setLikes] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    onSnapshot(
      query(collection(db, "Instagram"), where("uid", "==", id)),
      (snapshot) => setPosts(snapshot.docs)
    );
  }, [db]);

  useEffect(() => {
    if (
      followers
        .map((follower) => follower.id == session?.user?.uid)
        .includes(true) === true
    ) {
      setHasFollowed(true);
    } else {
      setHasFollowed(false);
    }
    console.log(
      followers
        .map((follower) => follower.id == session?.user?.uid)
        .includes(true)
    );
    console.log(hasFollowed);
  }, [followers]);

  const handleFollow = async (e) => {
    e.preventDefault();
    if (hasFollowed) {
      await deleteDoc(
        doc(db, "Users", session.user.uid, "Following", User.uid)
      );
      await deleteDoc(
        doc(db, "Users", User.uid, "Followers", session.user.uid)
      );
    } else {
      await setDoc(doc(db, "Users", session.user.uid, "Following", User.uid), {
        Username: User.Username,
        ProfilePic: User.image,
        uid: User.uid,
        Name: User.name,
      });

      await setDoc(doc(db, "Users", User.uid, "Followers", session.user.uid), {
        Username: session.user.username,
        uid: session.user.uid,
        ProfilePic: session.user.image,
        Name: session.user.name,
      });
    }
  };
  useEffect(() => {
    onSnapshot(collection(db, "Users", User.uid, "Followers"), (snapshot) =>
      setFollowers(snapshot.docs)
    );
  }, [db, User.uid]);
  useEffect(() => {
    onSnapshot(collection(db, "Users", User.uid, "Following"), (snapshot) =>
      setFollowings(snapshot.docs)
    );
  }, [db, User.uid]);

  return (
    <div className="dark:bg-gray-900">
      <ProfileHomepage
        ProfileImage={User.image}
        Username={User.Username}
        PostNumber={posts.map((post) => post.data()).length}
        name={User.name}
        Bio={User?.Bio}
        disabled={id !== session?.user?.uid}
        signedIn={session !== undefined ? true : false}
        followButton={handleFollow}
        FollowerNumber={followers.length}
        FollowingNumber={followings.length}
        following={followers
          .map((follower) => follower.id == session?.user?.uid)
          .includes(true)}
      />
      <div className="grid gap-x-8 gap-y-8 justify-evenly md:grid-cols-2 lg:grid-cols-3 mx-[5%] lg:mx-[15%] mt-10">
        {posts.length > 0 ? (
          posts
            .sort((a, b) => b.data().PostingDate - a.data().PostingDate)
            .map((post) => (
              <ProfilePostCard
                key={post.id}
                id={post.id}
                image={post.data().ImageURL}
                description={post.data().description}
                comment={10}
                likes={4}
              />
            ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center">
            <div className="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center">
              <FaRegImage className="w-24 h-24 text-gray-600" />
            </div>
            <h2 className="text-3xl text-gray-700">No post yet</h2>
          </div>
        )}
      </div>

      <FollowersModal id={id} />
      <FollowingModal id={id} />
      <ProfileEditModal id={id} />
    </div>
  );
};

export default Profile;

export const getStaticPaths = async () => {
  const snapshot = await getDocs(collection(db, "Users"));
  const paths = snapshot.docs.map((doc) => {
    return { params: { id: doc.id.toString() } };
  });
  return { paths, fallback: false };
};

export const getStaticProps = async (context) => {
  const id = context.params.id;
  const docRef = doc(db, "Users", id);
  const docSnap = await getDoc(docRef);

  return { props: { UserProps: JSON.stringify(docSnap.data()) || null } };
};
