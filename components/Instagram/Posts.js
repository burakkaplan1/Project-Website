import Post from "./Post";
import {
  query,
  collection,
  onSnapshot,
  orderBy,
  deleteDoc,
  doc,
} from "@firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { db, storage } from "../../firebase";
import { useEffect, useState } from "react";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    onSnapshot(
      query(collection(db, "Instagram"), orderBy("PostingDate", "desc")),
      (snapshot) => setPosts(snapshot.docs)
    );
  }, [db]);

  useEffect(() => {
    onSnapshot(query(collection(db, "Users")), (snapshot) => {
      setUsers(snapshot.docs);
    });
  }, [db]);

  useEffect(() => {}, [db]);
  const handleDelete = async (id, event) => {
    event.stopPropagation();

    const docRef = doc(db, "Instagram", id);
    if (confirm(`Instagram post with id of ${id} will be deleted`) == true) {
      await deleteDoc(docRef);
      const imageRef = ref(storage, `Instagram/${docRef.id}/image`);
      deleteObject(imageRef)
        .then(() => {
          // File deleted successfully
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
        });
      alert(`Instagram post with id of ${id} is successfully deleted`);
    } else {
      alert("Post is not deleted");
    }
  };

  return (
    <div className="mt-10 ">
      {posts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          uid={post.data().uid}
          username={
            users.map((user) => user.id).includes(post.data().uid)
              ? users
                  .filter((user) => user.data().uid == post.data().uid)
                  .map((user) => user.data().Username)
              : post.data().Username
          }
          image={post.data().ImageURL}
          description={post.data().description}
          ProfilePic={
            users.map((user) => user.id).includes(post.data().uid)
              ? users
                  .filter((user) => user.data().uid == post.data().uid)
                  .map((user) => user.data().image)
              : post.data().ProfilePic
          }
          PostingTime={post.data().PostingDate?.toDate()}
          onDelete={(e) => handleDelete(post.id, e)}
        />
      ))}
    </div>
  );
};

export default Posts;
