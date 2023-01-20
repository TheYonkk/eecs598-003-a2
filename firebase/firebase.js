// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// hey, you! I know that these are some DB credentials and it's better to store them in environment variables.
// this DB is only temporary, so enjoy the useless keys! :)
const firebaseConfig = {
  apiKey: "AIzaSyDXt0lllQKCOJjXfun1aVVvFV-sM-nmyYQ",
  authDomain: "eecs598-003-yonkers-a2.firebaseapp.com",
  databaseURL: "https://eecs598-003-yonkers-a2-default-rtdb.firebaseio.com",
  projectId: "eecs598-003-yonkers-a2",
  storageBucket: "eecs598-003-yonkers-a2.appspot.com",
  messagingSenderId: "814627830804",
  appId: "1:814627830804:web:3691d8c58a8fc0c5c8bb01",
  measurementId: "G-BL89BHJ8HQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
