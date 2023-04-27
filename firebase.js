// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {GoogleAuthProvider, getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjYxVJaBANZ6eZuYaEfDN_YQxu4wYcWhM",
  authDomain: "book-cab-ea3c0.firebaseapp.com",
  projectId: "book-cab-ea3c0",
  storageBucket: "book-cab-ea3c0.appspot.com",
  messagingSenderId: "218679245690",
  appId: "1:218679245690:web:0b20b3366693424618f4c3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider= new GoogleAuthProvider();
const auth=getAuth();
export {app, provider, auth}
export const database=getFirestore(app);