// Import the functions you need from Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2oVByxHoWhm3Y5-keOtZXzLxm0V18xyc",
  authDomain: "rickysegura-dc454.firebaseapp.com",
  projectId: "rickysegura-dc454",
  storageBucket: "rickysegura-dc454.firebasestorage.app",
  messagingSenderId: "1026382777269",
  appId: "1:1026382777269:web:932bfcd5d75ca957f467fc",
  measurementId: "G-TB71DYFLC9"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Initialize Firebase services
const db = getFirestore(app);

// Export Firebase instances
export { app, db };
