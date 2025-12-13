"use client";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Use automatic initialization
// https://firebase.google.com/docs/app-hosting/firebase-sdks#initialize-with-no-arguments
const firebaseConfig = {
    apiKey: "AIzaSyArDWRDiHKa7B4QGVwm6wcVH6m7KIwd7AQ",
    authDomain: "caloriesnap-384d3.firebaseapp.com",
    projectId: "caloriesnap-384d3",
    storageBucket: "caloriesnap-384d3.firebasestorage.app",
    messagingSenderId: "62180670024",
    appId: "1:62180670024:web:77c3b11338c46234f6f67d",
    measurementId: "G-VS90VSVE84"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
//export const storage = getStorage(firebaseApp);