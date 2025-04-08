// firebase import
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
    import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
    import { startSessionTimeout, setupAutoReset } from './sessionTimeout.js';

    // Firebase Configuration
    const firebaseConfig = {
      apiKey: "AIzaSyCos7bb35LNSUyB4fV9AfsPTS6KOucMg4g",
      authDomain: "kasiglahanlib.firebaseapp.com",
      projectId: "kasiglahanlib",
      storageBucket: "kasiglahanlib.appspot.com",
      messagingSenderId: "913280719189",
      appId: "1:913280719189:web:fa46146c493ef2bd53b7dc",
      measurementId: "G-64WBLLZ1F6"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    // Login User
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const errorMessage = document.getElementById('loginError');

      try {
        await signInWithEmailAndPassword(auth, email, password);
        
        startSessionTimeout(auth); // session timeout function
        setupAutoReset(auth);
        window.location.href = './dashboard/index.html';
      } catch (error) {
        console.log("Login error", error.message);
        errorMessage.textContent = error.message.replace('Firebase: ', '');
        errorMessage.classList.remove('hidden');
      }
    });

    // Register User
    document.getElementById('registerForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;
      const errorMessage = document.getElementById('registerError');

      try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Registration Successful!");
        document.getElementById('registerForm').reset();
        showForm('login'); // Switch to login form
      } catch (error) {
        errorMessage.textContent = error.message.replace('Firebase: ', '');
        errorMessage.classList.remove('hidden');
      }
    });

    // Forgot Password
    document.getElementById('forgotPasswordForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const email = document.getElementById('resetEmail').value;
      const successMessage = document.getElementById('resetSuccess');
      const errorMessage = document.getElementById('resetError');

      try {
        await sendPasswordResetEmail(auth, email);
        successMessage.textContent = "Password reset link sent to your email!";
        successMessage.classList.remove('hidden');
        errorMessage.classList.add('hidden');
      } catch (error) {
        errorMessage.textContent = error.message.replace('Firebase: ', '');
        errorMessage.classList.remove('hidden');
        successMessage.classList.add('hidden');
      }
    });

    // Show Login/Register/Forgot Password Form
    window.showForm = (form) => {
      document.getElementById("loginForm").classList.toggle("hidden", form !== "login");
      document.getElementById("registerForm").classList.toggle("hidden", form !== "register");
      document.getElementById("forgotPasswordForm").classList.toggle("hidden", form !== "forgot");
    };