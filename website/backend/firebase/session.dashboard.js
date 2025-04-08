// import firebase 

  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
  import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
  import { startSessionTimeout, setupAutoReset } from "../backend/sessionTimeout.js";

  const firebaseConfig = {
    apiKey: "AIzaSyCos7bb35LNSUyB4fV9AfsPTS6KOucMg4g",
    authDomain: "kasiglahanlib.firebaseapp.com",
    projectId: "kasiglahanlib",
    storageBucket: "kasiglahanlib.appspot.com",
    messagingSenderId: "913280719189",
    appId: "1:913280719189:web:fa46146c493ef2bd53b7dc",
    measurementId: "G-64WBLLZ1F6"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Display user info
      document.querySelector('.user-email-header').textContent = user.email;
      document.querySelector('.user-email').textContent = user.email;
      document.querySelector('.user-uid').textContent = user.uid;

      // Start session timeout logic
      startSessionTimeout(auth);
      setupAutoReset(auth);
    } else {
      // If no user is signed in, redirect to login
      window.location.href = "../login/index.html";
    }
  });

  // Logout handler
  document.querySelector(".logout-btn").addEventListener("click", (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
      window.location.href = "../login/index.html";
    });
  });