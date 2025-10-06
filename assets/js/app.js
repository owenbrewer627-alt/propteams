console.log("PropTeams app loaded");

document.addEventListener("DOMContentLoaded", () => {
  // Find out which page you're on (e.g. index.html, signup.html, etc.)
  const currentPage = location.pathname.split("/").pop() || "index.html";

  // Loop through each link in the navbar
  document.querySelectorAll("header nav a").forEach((link) => {
    const linkTarget = link.getAttribute("href");

    // If the link's href matches the current page, mark it as active
    if (linkTarget === currentPage) {
      link.classList.add("active");
    }
  });
});

// -------------------- Sign Up form validation --------------------
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  if (!form) return; // we're not on signup.html

  const nameEl = document.getElementById("name");
  const emailEl = document.getElementById("email");
  const passEl = document.getElementById("password");
  const confirmEl = document.getElementById("confirm");
  const termsEl = document.getElementById("terms");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const confirmError = document.getElementById("confirmError");
  const termsError = document.getElementById("termsError");

  const emailOk = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase());

  const show = (el, msg) => (el.textContent = msg || "");
  const clearAll = () => {
    [nameError, emailError, passwordError, confirmError, termsError].forEach(
      (e) => show(e, "")
    );
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearAll();

    let valid = true;

    if (!nameEl.value.trim()) {
      show(nameError, "Please enter your full name.");
      valid = false;
    }

    if (!emailEl.value.trim()) {
      show(emailError, "Please enter your email.");
      valid = false;
    } else if (!emailOk(emailEl.value.trim())) {
      show(emailError, "Please enter a valid email (e.g., you@example.com).");
      valid = false;
    }

    if (!passEl.value) {
      show(passwordError, "Please enter a password.");
      valid = false;
    } else if (passEl.value.length < 8) {
      show(passwordError, "Password must be at least 8 characters.");
      valid = false;
    }

    if (!confirmEl.value) {
      show(confirmError, "Please confirm your password.");
      valid = false;
    } else if (confirmEl.value !== passEl.value) {
      show(confirmError, "Passwords do not match.");
      valid = false;
    }

    if (!termsEl.checked) {
      show(termsError, "Please agree to the Terms.");
      valid = false;
    }

    if (!valid) return;

    // Demo "success" state (no backend yet)
    // You can store locally just to simulate an account being made:
    const user = {
      name: nameEl.value.trim(),
      email: emailEl.value.trim(),
      createdAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem("propteams_user_demo", JSON.stringify(user));
    } catch {}

    // Simple success UI
    form.innerHTML = `
      <h2 style="color: var(--accent); text-align:center; margin-bottom:10px;">Account created 🎉</h2>
      <p class="note" style="text-align:center;">(Demo only — no real account yet.)</p>
      <div style="text-align:center; margin-top:16px;">
        <a href="create-team.html" class="btn" style="display:inline-block; width:auto;">Go to Create Team →</a>
      </div>
    `;
  });
});
