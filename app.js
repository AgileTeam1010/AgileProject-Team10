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

    // compute redirect target:
    const params = new URLSearchParams(window.location.search);
    const redirectParam = params.get('redirect'); // explicit ?redirect=/path
    let redirectTo = 'index.html';

    if (redirectParam) {
      // only allow same-origin relative or absolute paths to avoid open-redirects
      try {
        const candidate = new URL(redirectParam, location.href);
        if (candidate.origin === location.origin) redirectTo = candidate.pathname + candidate.search + candidate.hash;
      } catch (e) {
        // ignore invalid redirect param
      }
    } else if (document.referrer) {
      try {
        const refUrl = new URL(document.referrer);
        if (refUrl.origin === location.origin) redirectTo = refUrl.pathname + refUrl.search + refUrl.hash;
      } catch (e) {
        // fallback to index.html
      }
    }

    // short delay to allow Firebase to finish restoring session
    setTimeout(() => {
      window.location.href = redirectTo;
    }, 300);

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
    window.location.href = "index.html"; // go to profile page
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