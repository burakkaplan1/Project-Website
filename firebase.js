// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrlH5liX7nfOjb-PEyXWSEk5PHjy_eVQk",
  authDomain: "portfolio-burak-kaplan.firebaseapp.com",
  projectId: "portfolio-burak-kaplan",
  storageBucket: "portfolio-burak-kaplan.appspot.com",
  messagingSenderId: "814062594905",
  appId: "1:814062594905:web:68e259fe55f7a61dc4ba48",
  measurementId: "G-PD48YLTZBL",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();
// const firestore = (
//   !getApps().length ?? initializeApp(firebaseConfig)
// ).getFirestore();
export { app, db, storage };
