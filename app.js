// Login
async function login(event) {
  event.preventDefault(); // stop form from reloading page
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const errorElement = document.getElementById("error");
  errorElement.textContent = ""; // clear old errors

  try {
    // try to sign in with Firebase
    const userCredential = await window._signIn(window._auth, email, password);
    alert(`✅ Logged in as ${userCredential.user.email}`);
    window.location.href = "profile.html"; // go to profile page
  } catch (error) {
    errorElement.textContent = error.message; // show error if login fails
  }
}

// Signup
async function signup(event) {
  event.preventDefault(); // stop form from reloading page
  const email = document.getElementById("newEmail").value.trim();
  const password = document.getElementById("newPassword").value;
  const errorElement = document.getElementById("signupError");
  errorElement.textContent = ""; // clear old errors

  // check password strength
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    errorElement.textContent =
      "Password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one number.";
    return;
  }

  try {
    // try to create user with Firebase
    const userCredential = await window._signUp(window._auth, email, password);
    alert(`🎉 Account created for ${userCredential.user.email}`);
    window.location.href = "profile.html"; // go to profile page
  } catch (error) {
    errorElement.textContent = error.message; // show error if signup fails
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