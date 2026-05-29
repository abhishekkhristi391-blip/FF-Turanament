import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// ==========================================
// FIREBASE CONFIGURATION
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyCJZ6PFiIFY8iUzEKx-cSQBVRUs8TQn8ho",
    authDomain: "af-titan-esports-adda-82bd6.firebaseapp.com",
    databaseURL: "https://af-titan-esports-adda-82bd6-default-rtdb.firebaseio.com",
    projectId: "af-titan-esports-adda-82bd6",
    storageBucket: "af-titan-esports-adda-82bd6.firebasestorage.app",
    messagingSenderId: "1053626721749",
    appId: "1:1053626721749:web:a00e73b4abaec9815e895c"
};

let app, db, auth;

try {
    // Prevent multiple initializations
    if (!window.myFbApp) { 
        window.myFbApp = initializeApp(firebaseConfig); 
    }
    app = window.myFbApp;
    db = getDatabase(app);
    auth = getAuth(app);
    console.log("Firebase Modular Config Initialized Successfully");
} catch (error) {
    console.error("Firebase initialization failed:", error);
    document.body.innerHTML = `<div class="alert alert-danger m-5 position-fixed top-0 start-0 end-0" style="z-index: 10000;">Critical Error: Could not connect to Firebase. Check config. Error: ${error.message}</div>`;
}

// Inhe export kar rahe hain taaki app.js mein use kar sakein
export { app, db, auth };
