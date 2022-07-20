// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// !todo: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// !Ethan: tried .env.local => got error  @firebase/firestore: Firestore (8.6.5): Could not reach Cloud Firestore backend. Connection failed 1 times.
// !todo: used proper env config supported by firebase
// https://stackoverflow.com/questions/37482366/is-it-safe-to-expose-firebase-apikey-to-the-public
const firebaseConfig = {
  apiKey: "AIzaSyDcbO4XxR7SLe7cKdTM0z4SFz1sdR3qBAk",
  authDomain: "main-startapp-6f975.firebaseapp.com",
  projectId: "main-startapp-6f975",
  storageBucket: "main-startapp-6f975.appspot.com",
  messagingSenderId: "373522521624",
  appId: "1:373522521624:web:737e58f1d13507bb6ded6d",
  measurementId: "G-LY2Q4JFE5H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore();
const auth = getAuth();
const provider = new GoogleAuthProvider();
export { db, auth, provider };
