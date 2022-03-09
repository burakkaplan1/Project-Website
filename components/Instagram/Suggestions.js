import { collection, onSnapshot, query } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import SuggestionProfile from "./Profile/SuggestionProfile";

const Suggestions = () => {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    onSnapshot(query(collection(db, "Users")), (snapshot) => {
      setUsers(snapshot.docs);
    });
  }, [db]);

  return (
    <div className="">
      <h3 className="text-lg text-blue-800 dark:text-blue-500 font-semibold">
        Suggestions
      </h3>
      <div className="border flex flex-col space-y-3 border-gray-200 rounded-md px-3 py-2 dark:bg-gray-800">
        {users.slice(0, 4).map((user) => (
          <SuggestionProfile
            id={user.id}
            key={user.id}
            Name={user.data().name}
            Username={user.data().Username}
            profilePicture={user.data().image}
            Follow
          />
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
