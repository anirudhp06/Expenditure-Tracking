// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth,GoogleAuthProvider,signInWithPopup } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
console.log("Imported Auth");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLtbu7znzhba1IkzxfptkSbCIaQgUSDlE",
  authDomain: "fir-bcaf6.firebaseapp.com",
  databaseURL: "https://fir-bcaf6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fir-bcaf6",
  storageBucket: "fir-bcaf6.appspot.com",
  messagingSenderId: "214512315771",
  appId: "1:214512315771:web:bb12e5cc764754212161de"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
import{getDatabase, set,get,remove,update,ref,child} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js"

const db=getDatabase();
export const auth=getAuth(app);
console.log("Auth Initialized");
export const provider= new GoogleAuthProvider();
console.log("Provider Initialized");

var signUp=document.querySelector("#sign-up");
signUp.addEventListener("click",()=>{
    signInWithPopup(auth,provider)
    .then((result)=>{
        const credential=GoogleAuthProvider.credentialFromResult(result);
        console.log("credential:",credential);
        const token=credential.accessToken;
        console.log("token:",token);
        //Signed in USER info
        const user=result.user;
        console.log("User:",user);
    }).catch((error)=>{
        const errorCode=error.code;
        const errorMessage=error.message;
        //Email used
        const email=error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
    });
});