import {initializeApp} from "firebase/app";
import {getAuth, setPersistence, browserSessionPersistence} from "firebase/auth";
import {initializeAppCheck, ReCaptchaV3Provider} from "firebase/app-check";
import {getFirestore} from "firebase/firestore";
import {getFunctions} from "firebase/functions";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

if (import.meta.env.VITE_RECAPTCHA_SITE_KEY) {
    initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
        isTokenAutoRefreshEnabled: true
    });
}

const auth = getAuth(app);
const db = getFirestore(app);
setPersistence(auth, browserSessionPersistence)
    .catch((error) => {
        console.error("Error al establecer la persistencia de la autenticación:", error);
    });
const functions = getFunctions(app, "us-central1");
export {auth, db, functions};

// Deploy