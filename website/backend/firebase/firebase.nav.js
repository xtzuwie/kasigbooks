// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, collection, query, where, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

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
const db = getFirestore(app);

// Select DOM Elements
const uidElement = document.querySelector('.user-uid');
const emailElement = document.querySelectorAll('.user-email, .user-email-header');
const memberSinceElement = document.querySelector('.member-since');
const logoutBtn = document.querySelector('.logout-btn');
const notificationsContainer = document.querySelector('.notifications-container');
const notificationCount = document.querySelector('.notification-count');

// Handle Authentication State
onAuthStateChanged(auth, (user) => {
    if (user) {
        uidElement.textContent = user.uid;
        emailElement.forEach(element => {
            element.textContent = user.email;
        });
        console.log("User email: ", user.email);
        const creationDate = new Date(user.metadata.creationTime);
        memberSinceElement.textContent = creationDate.getFullYear();

        // Fetch and display notifications for the user
        initializeNotificationsListener(user.uid);
    } else {
        // Redirect to login if not authenticated
        window.location.href = "../index.html";
    }
});

// Logout Functionality
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = "../index.html";
    } catch (error) {
        console.error("Error signing out:", error);
        alert("Error logging out. Please try again.");
    }
});

// Initialize Notifications Listener
function initializeNotificationsListener(userId) {
    const notificationsRef = collection(db, "notifications");
    const q = query(
        notificationsRef,
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );

    onSnapshot(q, (snapshot) => {
        const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        updateNotificationsUI(notifications);
    });
}

// Update Notifications UI
function updateNotificationsUI(notifications) {
    notificationsContainer.innerHTML = '';
    notifications.forEach(notification => {
        const notificationElement = document.createElement('div');
        notificationElement.classList.add('p-3', 'border-bottom');

        notificationElement.innerHTML = `
            <p class="mb-1"><strong>${notification.title}</strong></p>
            <p class="text-muted mb-0">${notification.message}</p>
        `;

        notificationsContainer.appendChild(notificationElement);
    });

    notificationCount.textContent = notifications.length || '0';
}

// Sidebar Toggle Logic
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const toggleButton = document.querySelector('.toggle-sidebar');

toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
if (window.innerWidth <= 768 && 
    !sidebar.contains(e.target) && 
    !toggleBtn.contains(e.target) && 
    sidebar.classList.contains('active')) {
    sidebar.classList.remove('active');
    document.body.classList.remove('sidebar-open');
}
});

// Handle window resize
window.addEventListener('resize', () => {
if (window.innerWidth > 768) {
    sidebar.classList.remove('active');
    document.body.classList.remove('sidebar-open');
}
});