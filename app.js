// Login
async function login(event) {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const errorElement = document.getElementById("error");
  errorElement.textContent = ""; 

  try {
    const userCredential = await window._signIn(window._auth, email, password);
    alert(`✅ Logged in as ${userCredential.user.email}`);
    window.location.href = "profile.html"; 
  } catch (error) {
    errorElement.textContent = error.message;
  }
}

// Sign-up
async function signup(event) {
  event.preventDefault();
  const email = document.getElementById("newEmail").value.trim();
  const password = document.getElementById("newPassword").value;
  const errorElement = document.getElementById("signupError");
  errorElement.textContent = ""; 

  // kolla lösenordets styrka
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    errorElement.textContent =
      "Password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one number.";
    return;
  }

  try {
    const userCredential = await window._signUp(window._auth, email, password);
    alert(`🎉 Account created for ${userCredential.user.email}`);
    window.location.href = "profile.html"; 
  } catch (error) {
    errorElement.textContent = error.message; 
  }
}

function toggleForms() {
  document.getElementById("loginForm").classList.toggle("hidden");
  document.getElementById("signupForm").classList.toggle("hidden");
  document.getElementById("error").textContent = "";
  document.getElementById("signupError").textContent = "";
}

document.getElementById("forgotPassword").onclick = async function(event) {
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

async function completeLevel(category, levelIndex) {
  const user = window._auth.currentUser;
  if (!user) {
    alert("You must be logged in!");
    return;
  }
  const uid = user.uid;
  const userDocRef = window._doc(window._db, "users", uid);

  let userDoc = await window._getDoc(userDocRef);
  let progress = userDoc.exists() ? userDoc.data().progress : {};

  if (!progress[category]) {
    progress[category] = [false, false, false, false, false];
  }
  progress[category][levelIndex] = true;

  await window._setDoc(userDocRef, { progress }, { merge: true });
  alert(`Level ${levelIndex + 1} in ${category} marked as completed!`);
}

async function hasCompletedLevel(category, levelIndex) {
  const user = window._auth.currentUser;
  if (!user) return false;
  const uid = user.uid;
  const userDocRef = window._doc(window._db, "users", uid);
  let userDoc = await window._getDoc(userDocRef);
  if (!userDoc.exists()) return false;
  const progress = userDoc.data().progress || {};
  return progress[category] && progress[category][levelIndex] === true;
}