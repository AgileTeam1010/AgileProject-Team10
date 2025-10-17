// Centralized Firebase auth state helper
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBHVFExyz8RcEy_hWTSvtQYPx7rbZbzUjI",
  authDomain: "agileproject-team10.firebaseapp.com",
  projectId: "agileproject-team10",
  storageBucket: "agileproject-team10.firebasestorage.app",
  messagingSenderId: "949551209474",
  appId: "1:949551209474:web:aa44cf129ea8675e841b1b",
  measurementId: "G-MQQDX82E7M"
};

// Initialize app if not already initialized (browsers will ignore repeated inits)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Expose auth for other scripts
window._auth = auth;

// Try to set local persistence (survive restarts)
setPersistence(auth, browserLocalPersistence).catch((e) => {
  console.warn('Could not set auth persistence:', e && e.message ? e.message : e);
});

function updateSigninBtn(user) {
  // Update all elements with the signinbtn class so pages with relative paths work
  const btns = document.querySelectorAll('.signinbtn');
  btns.forEach(btn => {
    if (user) {
      btn.textContent = 'Profile';
      // choose profile link relative to current location
      // Use root-relative path so clicking works from any subfolder
      btn.href = '/profile.html';
    } else {
      btn.textContent = 'Sign In / Register';
      // link to login page relative to current location
      // many pages use ../indexlogin.html, but a root-level indexlogin.html exists, so use absolute-ish path
      // If current page is nested (path contains '/'), use '../indexlogin.html' to be safe in subfolders
      // Use root-relative so it works from any page when served from a webserver
      btn.href = '/indexlogin.html';
    }
  });
}

onAuthStateChanged(auth, (user) => {
  updateSigninBtn(user);
});

export { auth, updateSigninBtn };
