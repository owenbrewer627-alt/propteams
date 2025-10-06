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
// -------------------- Create Team logic --------------------
document.addEventListener("DOMContentLoaded", () => {
  // Only run on create-team.html
  if (!location.pathname.endsWith("create-team.html")) return;

  const form = document.getElementById("teamForm");
  const teamNameEl = document.getElementById("teamName");
  const teamNameError = document.getElementById("teamNameError");

  const m1 = document.getElementById("m1");
  const m2 = document.getElementById("m2");
  const m3 = document.getElementById("m3");
  const m4 = document.getElementById("m4");
  const summary = document.getElementById("teamSummary");

  const STORAGE_KEY = "propteams_team";

  // Helper: render the saved team as a card
  function renderTeamCard(team) {
    if (!team) {
      summary.innerHTML = "";
      return;
    }
    const membersList = team.members.length
      ? `<ul class="list">${team.members
          .map((n) => `<li>${n}</li>`)
          .join("")}</ul>`
      : `<p class="note">No members added yet.</p>`;

    summary.innerHTML = `
      <div class="card">
        <h3>Team: ${team.name}</h3>
        <p class="note">Members</p>
        ${membersList}
        <div class="actions">
          <button id="editTeam" class="btn secondary" type="button">Edit</button>
          <button id="clearTeam" class="btn secondary" type="button">Clear</button>
        </div>
      </div>
    `;

    // Wire up buttons
    document.getElementById("editTeam").onclick = () => {
      // Put values back in the form
      teamNameEl.value = team.name;
      [m1, m2, m3, m4].forEach(
        (input, i) => (input.value = team.members[i] || "")
      );
      // Scroll to form
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    document.getElementById("clearTeam").onclick = () => {
      localStorage.removeItem(STORAGE_KEY);
      renderTeamCard(null);
    };
  }

  // On page load, prefill from storage if present
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && saved.name) {
      renderTeamCard(saved);
      // Optionally, also prefill the form:
      teamNameEl.value = saved.name;
      [m1, m2, m3, m4].forEach(
        (input, i) => (input.value = saved.members[i] || "")
      );
    }
  } catch {}

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    teamNameError.textContent = "";

    const name = teamNameEl.value.trim();
    if (!name) {
      teamNameError.textContent = "Please enter a team name.";
      return;
    }

    // Collect non-empty member names (max 4)
    const members = [m1.value, m2.value, m3.value, m4.value]
      .map((v) => v.trim())
      .filter(Boolean)
      .slice(0, 4);

    const team = { name, members, updatedAt: new Date().toISOString() };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(team));
    } catch {}

    // Show success card
    renderTeamCard(team);

    // Simple success message
    form.insertAdjacentHTML(
      "beforebegin",
      `<p class="note" id="teamSavedNote">Team saved ✅</p>`
    );
    setTimeout(() => document.getElementById("teamSavedNote")?.remove(), 1500);
  });
});
// -------------------- Tournaments logic --------------------
// -------------------- Tournaments logic --------------------
document.addEventListener("DOMContentLoaded", () => {
  const listEl = document.getElementById("tournamentList");
  const entryEl = document.getElementById("entryStatus");
  if (!listEl || !entryEl) return; // not on tournaments page

  // Demo tournament data (normally this would come from an API)
  const TOURNAMENTS_KEY = "propteams_tournaments";
  const ENTRIES_KEY = "propteams_entries";
  const TEAM_KEY = "propteams_team";

  // Seed demo tournament if none exists
  function seedTournaments() {
    const existing = JSON.parse(localStorage.getItem(TOURNAMENTS_KEY) || "[]");
    if (existing.length) return existing;

    const start = new Date();
    const end = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week later

    const demo = [
      {
        id: "wk-" + start.toISOString().slice(0, 10),
        name: "Weekly Props Cup",
        prizePool: 500, // demo amount
        maxTeams: 500, // demo cap
        entered: 0, // will update when you enter
        startsAt: start.toISOString(),
        endsAt: end.toISOString(),
        status: "open",
      },
    ];

    localStorage.setItem(TOURNAMENTS_KEY, JSON.stringify(demo));
    return demo;
  }

  function fmt(dateIso) {
    const d = new Date(dateIso);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function load() {
    return JSON.parse(localStorage.getItem(TOURNAMENTS_KEY) || "[]");
  }
  function save(list) {
    localStorage.setItem(TOURNAMENTS_KEY, JSON.stringify(list));
  }
  function loadEntries() {
    return JSON.parse(localStorage.getItem(ENTRIES_KEY) || "[]");
  }
  function saveEntries(entries) {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  }

  // Render tournament cards
  function render() {
    const ts = load();
    if (!ts.length) {
      listEl.innerHTML = `<p class="note">No tournaments yet.</p>`;
      return;
    }

    listEl.innerHTML = `
      <div class="stack">
        ${ts
          .map(
            (t) => `
          <div class="card">
            <div class="row">
              <h3>${t.name}</h3>
              <span class="badge">${t.status.toUpperCase()}</span>
            </div>
            <p class="meta">
              Prize pool: $${t.prizePool} • Entries: ${t.entered}/${t.maxTeams}
            </p>
            <p class="small">
              Starts: ${fmt(t.startsAt)} • Ends: ${fmt(t.endsAt)}
            </p>
            <div class="actions">
              <button class="btn inline" data-enter="${t.id}" ${
              t.status !== "open" ? "disabled" : ""
            }>
                Enter as my team →
              </button>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    // Hook up Enter buttons
    listEl.querySelectorAll("[data-enter]").forEach((btn) => {
      btn.addEventListener("click", () =>
        enter(btn.getAttribute("data-enter"))
      );
    });
  }

  // Handle entering a tournament
  function enter(tournamentId) {
    const team = JSON.parse(localStorage.getItem(TEAM_KEY) || "null");
    if (!team || !team.name) {
      entryEl.innerHTML = `
        <p class="error" style="margin-top:8px;">No team found. Create your team first.</p>
        <div class="actions" style="margin-top:8px;">
          <a class="btn inline" href="create-team.html">Create Team</a>
        </div>
      `;
      return;
    }

    // Check if already entered
    const entries = loadEntries();
    const already = entries.find((e) => e.tournamentId === tournamentId);
    if (already) {
      entryEl.innerHTML = `
        <p class="note">You already entered <strong>${team.name}</strong> in this tournament.</p>
        <div class="actions" style="margin-top:8px;">
          <a class="btn inline" href="create-team.html">View/Edit Team</a>
        </div>
      `;
      return;
    }

    // Save entry
    entries.push({
      tournamentId,
      teamName: team.name,
      members: team.members || [],
      enteredAt: new Date().toISOString(),
    });
    saveEntries(entries);

    // Increment tournament entered count
    const ts = load();
    const t = ts.find((x) => x.id === tournamentId);
    if (t) {
      t.entered = (t.entered || 0) + 1;
      save(ts);
    }

    entryEl.innerHTML = `
      <p class="note">Entered as <strong>${team.name}</strong> ✅</p>
    `;
    render();
  }

  // Boot
  seedTournaments();
  render();
});
