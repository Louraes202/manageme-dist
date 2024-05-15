import 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyA7TmscgZWuwOq8m-PDhsQ5o7EPYMb4Lj8",
  authDomain: "manage-me-9cd8c.firebaseapp.com",
  projectId: "manage-me-9cd8c",
  storageBucket: "manage-me-9cd8c.appspot.com",
  messagingSenderId: "965472377583",
  appId: "1:965472377583:web:eaf5a69d48be40c293d91a",
  measurementId: "G-7Q19CFSW6L"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

export { db };