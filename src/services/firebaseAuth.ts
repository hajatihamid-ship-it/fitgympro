import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBIxsc97PAqB-NAu2GFI9VepP2G_ZOOoqM",
    authDomain: "fitgympro-85c9a.firebaseapp.com",
    projectId: "fitgympro-85c9a",
    storageBucket: "fitgympro-85c9a.appspot.com",
    messagingSenderId: "901919943915",
    appId: "1:901919943915:web:f29f8f129e5efb8b9362ae",
    measurementId: "G-Q7YFMPH2RE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };