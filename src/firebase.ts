// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBDPW4yNCx-_0Ihzp33oHXCY3H4z4MjjC0",
    authDomain: "menajeventas-19308.firebaseapp.com",
    projectId: "menajeventas-19308",
    storageBucket: "menajeventas-19308.firebasestorage.app",
    messagingSenderId: "761384511356",
    appId: "1:761384511356:web:10dc6df57a8c2915e5e6f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore
const db = getFirestore(app);
export { db };

// Exportar auth
export const auth = getAuth(app)