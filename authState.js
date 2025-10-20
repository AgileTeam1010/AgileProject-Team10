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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
window._auth = auth;

setPersistence(auth, browserLocalPersistence).catch((e) => {
  console.warn('Could not set auth persistence:', e && e.message ? e.message : e);
});

// Updaterar alla knappar med klassen 'signinbtn' baserat på inloggningsstatus
function updateSigninBtn(user) {
  const btns = document.querySelectorAll('.signinbtn');
  btns.forEach(btn => {
    if (user) {
      btn.textContent = 'Profile';
      btn.href = 'profile.html';
    } else {
      btn.textContent = 'Sign In / Register';
      btn.href = 'indexlogin.html';
    }
  });
}

onAuthStateChanged(auth, (user) => {
  updateSigninBtn(user);
});

export { auth, updateSigninBtn };
