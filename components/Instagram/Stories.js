import {
  collection,
  onSnapshot,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, storage } from "../../firebase";
import { ref, deleteObject } from "firebase/storage";
import Story from "./Story";

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    onSnapshot(query(collection(db, "InstagramStories")), (snapshot) => {
      setStories(snapshot.docs);
    });
  }, [db]);
  useEffect(() => {
    onSnapshot(query(collection(db, "Users")), (snapshot) =>
      setUsers(snapshot.docs)
    );
  }, [db]);

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }
  const newStories = stories.map((story) => story.data());
  const nonDuplicateStories = getUniqueListBy(newStories, "uid");

  var storiesToDelete = stories
    .filter((story) => story.data().DeleteTime <= Date.now())
    .map((story) => story.id);

  useEffect(
    async (e) => {
      for (let i = 0; i < storiesToDelete.length; i++) {
        await deleteDoc(doc(db, "InstagramStories", storiesToDelete[i]));
        var imageToBeDeleted = ref(
          storage,
          `InstagramStories/${storiesToDelete[i]}`
        );
        await deleteObject(imageToBeDeleted)
          .then(() => {})
          .catch((error) => console.log(error));
      }
    },
    [stories]
  );

  return (
    <div className="flex space-x-1 p-6 bg-white  border-gray-200 border rounded-md overflow-x-scroll scrollbar-thin scrollbar-thumb-black w-full dark:bg-gray-800">
      {nonDuplicateStories.map((story) => (
        <Story
          id={users
            .filter((user) => user.data().uid == story.uid)
            .map((user) => user.data().uid)}
          key={story.id}
          image={
            users.map((user) => user.id).includes(story.uid)
              ? users
                  .filter((user) => user.data().uid == story.uid)
                  .map((user) => user.data().image)
              : story.ProfilePic
          }
          username={
            users.map((user) => user.id).includes(story.uid)
              ? users
                  .filter((user) => user.data().uid == story.uid)
                  .map((user) => user.data().Username)
              : story.Username
          }
        />
      ))}
    </div>
  );
};

export default Stories;
