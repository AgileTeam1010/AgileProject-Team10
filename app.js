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
    window.location.href = "profile.html"; // redirect här
  } catch (error) {
    errorElement.textContent = error.message;
  }
}

// Signup
async function signup(event) {
  event.preventDefault();
  const email = document.getElementById("newEmail").value.trim();
  const password = document.getElementById("newPassword").value;
  const errorElement = document.getElementById("signupError");
  errorElement.textContent = "";

  // Password check
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    errorElement.textContent =
      "Password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one number.";
    return;
  }

  try {
    const userCredential = await window._signUp(window._auth, email, password);
    alert(`🎉 Account created for ${userCredential.user.email}`);
    window.location.href = "profile.html"; // ny redirect
  } catch (error) {
    errorElement.textContent = error.message;
  }
}