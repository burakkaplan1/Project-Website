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
import { PhotographIcon } from "@heroicons/react/outline";
import { useRecoilState } from "recoil";
import { storyUploadState } from "../../atoms/states";

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [users, setUsers] = useState([]);
  const [storyOpen, setStoryOpen] = useRecoilState(storyUploadState);

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
      {nonDuplicateStories.length > 0 ? (
        nonDuplicateStories.map((story) => (
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
        ))
      ) : (
        <div className="flex items-center space-x-3">
          <div className="h-20 w-20 rounded-full bg-red-200 flex items-center justify-center">
            <PhotographIcon className="w-16 h-16 text-red-600" />
          </div>
          <div className="flex flex-col space-y-2">
            <h1 className="text-lg">There is no available story right now</h1>
            <h2>
              <strong
                className="cursor-pointer"
                onClick={() => setStoryOpen(true)}
              >
                Click here
              </strong>{" "}
              to share a story
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stories;
