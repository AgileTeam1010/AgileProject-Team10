import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged, 
  setPersistence, 
  browserLocalPersistence, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

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
const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence);

// ✅ Make available everywhere
window._auth = auth;
window._db = db;
window._doc = doc;
window._getDoc = getDoc;
window._setDoc = setDoc;
window._updateDoc = updateDoc;
window._signIn = signInWithEmailAndPassword;
window._signUp = createUserWithEmailAndPassword;
window._resetPass = sendPasswordResetEmail;
window._signOut = signOut;

// ✅ Update Sign-in buttons on every page
function updateSigninBtn(user) {
  const btns = document.querySelectorAll('.signinbtn');
  btns.forEach(btn => {
    if (user) {
      const depth = (window.location.pathname.match(/\//g) || []).length - 1;
      const prefix = depth > 0 ? '../'.repeat(depth) : '';
      btn.textContent = 'Profile';
      btn.href = `${prefix}profile.html`;
    } else {
      btn.textContent = 'Sign In / Register';
      btn.href = 'indexlogin.html';
    }
  });
}

onAuthStateChanged(auth, (user) => {
  updateSigninBtn(user);
});

export { auth, db };
