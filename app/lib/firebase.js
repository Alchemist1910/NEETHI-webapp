import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB2IfrW2U1ChA-iwYKnFV3fpKUsVP5zlPg",
    authDomain: "neethi-3ec7b.firebaseapp.com",
    projectId: "neethi-3ec7b",
    storageBucket: "neethi-3ec7b.appspot.com",
    messagingSenderId: "267787400720",
    appId: "1:267787400720:web:7ec2d5886162bb0d793c95"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);