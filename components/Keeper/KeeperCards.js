import {
  collection,
  onSnapshot,
  query,
  doc,
  deleteDoc,
  where,
} from "@firebase/firestore";
import { useSession } from "next-auth/react";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import KeeperCard from "./KeeperCard";
const KeeperCards = () => {
  const [notes, setNotes] = useState([]);
  const [showNumber, setShowNumber] = useState(3);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      onSnapshot(
        query(
          collection(db, "Keeper"),
          where("uid", "==", String(session?.user?.uid))
        ),
        (snapshot) => setNotes(snapshot.docs)
      );
    }
  }, [db, session]);

  const handleShowMore = () => {
    setShowNumber(showNumber + 3);
  };
  const handleShowLess = () => {
    setShowNumber(showNumber - 3);
  };

  const handleDelete = async (id, event) => {
    event.stopPropagation();

    const docRef = doc(db, "Keeper", id);
    await deleteDoc(docRef);
    alert(`Note with id of ${id} is successfully deleted`);
  };
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-3 justify-evenly flex-wrap">
        {notes.slice(0, showNumber).map((note) => (
          <KeeperCard
            key={note.id}
            id={note.id}
            title={note.data().Title}
            Text={note.data().Text}
            Time={note.data().PostingDate?.toDate()}
            onDelete={(e) => handleDelete(note.id, e)}
          />
        ))}
      </div>
      <div className="flex items-center justify-center space-x-4 mt-4">
        {showNumber > 3 && (
          <button
            type="button"
            className="p-2 dark:bg-slate-500 bg-yellow-700 text-white rounded-full shadow-xl hover:shadow-md"
            onClick={handleShowLess}
          >
            Show less
          </button>
        )}
        {notes.length > 3 ? (
          <button
            type="button"
            className="p-2 dark:bg-slate-500  bg-yellow-700 text-white rounded-full shadow-xl hover:shadow-md"
            onClick={handleShowMore}
          >
            Show more
          </button>
        ) : (
          <p className="text-yellow-700 mt-3">
            ** Button will appear when the number of notes exceeds 3 **
          </p>
        )}
      </div>
    </div>
  );
};

export default KeeperCards;
