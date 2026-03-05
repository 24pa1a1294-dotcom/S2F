import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAzfodbPalwFuL2bLiCbRUQGC4rnb6DGDc",
    authDomain: "skill-to-force.firebaseapp.com",
    projectId: "skill-to-force",
    storageBucket: "skill-to-force.firebasestorage.app",
    messagingSenderId: "499077067376",
    appId: "1:499077067376:web:2d2f165245ff2987b23ab5",
    measurementId: "G-FZG6E1Z4B7"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
