import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAe8aZ1KmgeWZ0SV5X_SBPnjU_2s6ia-rw",
    authDomain: "congelados-21989.firebaseapp.com",
    projectId: "congelados-21989",
    storageBucket: "congelados-21989.firebasestorage.app",
    messagingSenderId: "1027003013526",
    appId: "1:1027003013526:web:2243dabf0cf6827a07a5b7",
    measurementId: "G-EVWSP8LGVM"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };