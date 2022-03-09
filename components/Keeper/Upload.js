import { async } from "@firebase/util";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useState, useEffect, useRef } from "react";
import { db } from "../../firebase";
const Upload = (props) => {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  useEffect(() => {
    editorRef.current = {
      // CKEditor: require('@ckeditor/ckeditor5-react'), // depricated in v3
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };
    setEditorLoaded(true);
  }, []);

  const handleTitle = (event) => {
    setTitle(event.target.value);
  };
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setText(data);
  };

  const handleSubmit = async (e) => {
    const docRef = await addDoc(collection(db, "Keeper"), {
      uid: session?.user?.uid,
      Title: title,
      Text: text,
      PostingDate: serverTimestamp(),
    });
    console.log("New doc added with ID", docRef.id);
  };

  return editorLoaded ? (
    <div className="App mx-auto w-1/2 ">
      <div className="relative mb-4">
        <label
          className="absolute -top-6 left-3 font-sans font-semibold dark:text-white text-yellow-700"
          htmlFor="title"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={handleTitle}
          placeholder="Title"
          className="w-full py-1.5 px-3 bg-yellow-100 dark:bg-slate-700 rounded-md border-2 border-yellow-400 dark:border-slate-500"
        />
      </div>
      <CKEditor
        editor={ClassicEditor}
        className="text-red-500"
        onChange={handleEditorChange}
        data="<p>Hello from Burak Kaplan</p>"
        onReady={(editor) => {
          // You can store the "editor" and use when it is needed.
          console.log("Editor is ready to use!", editor);
        }}
        onBlur={(event, editor) => {
          console.log("Blur.", editor);
        }}
        onFocus={(event, editor) => {
          console.log("Focus.", editor);
        }}
      />
      <div className="mt-4 ">
        <button
          type="submit"
          onClick={handleSubmit}
          className="h-12 px-4 bg-yellow-300 rounded-md shadow-xl dark:bg-gray-200 dark:text-gray-900"
        >
          Upload +
        </button>
      </div>
    </div>
  ) : (
    <div>Editor loading</div>
  );
};

export default Upload;
