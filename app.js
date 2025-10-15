// Import Firestore and (optional) User class
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// Access Firebase from the global window (initialized in HTML)
const db = window._db;

// ---------------------------
// LOGIN
// ---------------------------
async function login(event) {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const errorElement = document.getElementById("error");
  errorElement.textContent = "";

  try {
    const userCredential = await window._signIn(window._auth, email, password);
    alert(`✅ Logged in as ${userCredential.user.email}`);
    window.location.href = "index.html"; // Go to main page
  } catch (error) {
    errorElement.textContent = error.message;
  }
}

// ---------------------------
// SIGNUP
// ---------------------------
async function signup(event) {
  event.preventDefault();
  const email = document.getElementById("newEmail").value.trim();
  const password = document.getElementById("newPassword").value;
  const errorElement = document.getElementById("signupError");
  errorElement.textContent = "";

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    errorElement.textContent =
      "Password must be at least 8 characters, include one uppercase, one lowercase, and one number.";
    return;
  }

  try {
    const userCredential = await window._signUp(window._auth, email, password);
    const user = userCredential.user;

    // Create Firestore document for new user
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      email: user.email,
      progress: {
        addition: {},
        subtraction: {},
        multiplication: {},
        division: {},
        mixed: {}
      }
    });

    alert(`🎉 Account created for ${user.email}`);
    window.location.href = "index.html"; // Go to main page
  } catch (error) {
    errorElement.textContent = error.message;
  }
}

// ---------------------------
// TOGGLE FORMS
// ---------------------------
function toggleForms() {
  document.getElementById("loginForm").classList.toggle("hidden");
  document.getElementById("signupForm").classList.toggle("hidden");
  document.getElementById("error").textContent = "";
  document.getElementById("signupError").textContent = "";
}

// ---------------------------
// FORGOT PASSWORD
// ---------------------------
document.getElementById("forgotPassword").onclick = async function (event) {
  event.preventDefault();
  const email = prompt("Enter your email to reset your password:");
  if (!email) return;

  try {
    await window._sendPasswordResetEmail(window._auth, email);
    alert("Password reset email sent! Check your inbox.");
  } catch (error) {
    alert("Error: " + error.message);
  }
};

// ---------------------------
// MAKE FUNCTIONS GLOBAL
// ---------------------------
window.login = login;
window.signup = signup;
window.toggleForms = toggleForms;
