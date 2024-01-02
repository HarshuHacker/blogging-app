// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArGLt3MMMAnFYwtNT66VBd2X48m_cf8G0",
  authDomain: "blogging-app-9672e.firebaseapp.com",
  projectId: "blogging-app-9672e",
  storageBucket: "blogging-app-9672e.appspot.com",
  messagingSenderId: "508379875524",
  appId: "1:508379875524:web:539fe3a7841c7584b1e191"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)