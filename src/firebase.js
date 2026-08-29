// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyAudPLQB4FouYT3iAH6kfP-dVt08jvlyvM",
  authDomain: "ozonz-b4c0e.firebaseapp.com",
  projectId: "ozonz-b4c0e",
  storageBucket: "ozonz-b4c0e.firebasestorage.app",
  messagingSenderId: "90642507957",
  appId: "1:90642507957:web:11d14c25380d151747f6fc",
  measurementId: "G-7J15ER5VBW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Analytics safely
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export default app;
