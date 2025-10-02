function toggleForms() {
  document.getElementById("loginForm").classList.toggle("hidden");
  document.getElementById("signupForm").classList.toggle("hidden");
  document.getElementById("error").textContent = "";
  document.getElementById("signupError").textContent = "";
}

// LOGIN
async function login(event) {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const errorElement = document.getElementById("error");
  errorElement.textContent = "";

  try {
    const userCredential = await window._signIn(window._auth, email, password);
    alert(`✅ Logged in as ${userCredential.user.email}`);
  } catch (error) {
    errorElement.textContent = error.message;
  }
}

// SIGNUP
async function signup(event) {
  event.preventDefault();
  const email = document.getElementById("newEmail").value.trim();
  const password = document.getElementById("newPassword").value;
  const errorElement = document.getElementById("signupError");
  errorElement.textContent = "";

  // 🔒 Password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    errorElement.textContent =
      "Password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one number.";
    return;
  }

  try {
    const userCredential = await window._signUp(window._auth, email, password);
    alert(`🎉 Account created for ${userCredential.user.email}`);
    // After signup, switch back to login form
    toggleForms();
  } catch (error) {
    errorElement.textContent = error.message;
  }
}