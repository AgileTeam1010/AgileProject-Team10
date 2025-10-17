export {} // module scope

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBHVFExyz8RcEy_hWTSvtQYPx7rbZbzUjI",
  authDomain: "agileproject-team10.firebaseapp.com",
  projectId: "agileproject-team10",
  storageBucket: "agileproject-team10.firebasestorage.app",
  messagingSenderId: "949551209474",
  appId: "1:949551209474:web:aa44cf129ea8675e841b1b",
  measurementId: "G-MQQDX82E7M"
};

// init safely (avoid duplicate init)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// expose for other scripts
window._auth = auth;
window._db = db;

window._saveProgress = async function(operatorKey, progressMap) {
  const user = auth.currentUser;
  if (!user) return;
  const ref = doc(db, 'progress', user.uid);
  const payload = { progress: { [operatorKey]: progressMap } };
  try {
    await setDoc(ref, payload, { merge: true });
  } catch (err) {
    console.error('Save progress failed', err);
  }
};

window._loadProgress = async function() {
  const user = auth.currentUser;
  if (!user) return null;
  const ref = doc(db, 'progress', user.uid);
  try {
    const snap = await getDoc(ref);
    return (snap.exists() && snap.data().progress) ? snap.data().progress : {};
  } catch (err) {
    console.error('Load progress failed', err);
    return {};
  }
};

function updateAuthLinks(user) {
  if (typeof document === 'undefined') return;
  const els = document.querySelectorAll('.signinbtn, .authButton, [data-auth-link], #authButton');
  els.forEach((el) => {
    const isLink = el.tagName && el.tagName.toLowerCase() === 'a';
    const loggedText = el.dataset.loggedText || 'Profile';
    const profileHref = el.dataset.profileHref || 'profile.html';
    const loggedOutText = el.dataset.loggedOutText || 'Sign In / Register';
    const loginHref = el.dataset.loginHref || 'indexlogin.html';

    if (user) {
      if (isLink) { el.textContent = loggedText; el.href = profileHref; }
      else { el.textContent = loggedText; el.onclick = () => { location.href = profileHref; }; }
    } else {
      if (isLink) { el.textContent = loggedOutText; el.href = loginHref; }
      else { el.textContent = loggedOutText; el.onclick = () => { location.href = loginHref; }; }
    }
  });
}

onAuthStateChanged(auth, (user) => updateAuthLinks(user));

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => updateAuthLinks(auth.currentUser));
}