// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAwsZRgD75z7nRjYO18aqUW4HrJ9YEjuY0",
    authDomain: "attendance-system-68d22.firebaseapp.com",
    projectId: "attendance-system-68d22",
    storageBucket: "attendance-system-68d22.firebasestorage.app",
    messagingSenderId: "114857059463",
    appId: "1:114857059463:web:cde4ea9b4e53a553ddc422"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };