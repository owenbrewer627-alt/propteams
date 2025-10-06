console.log("PropTeams app loaded");

document.addEventListener("DOMContentLoaded", () => {
  // Find out which page you're on (e.g. index.html, signup.html, etc.)
  const currentPage = location.pathname.split("/").pop() || "index.html";

  // Loop through each link in the navbar
  document.querySelectorAll("header nav a").forEach(link => {
    const linkTarget = link.getAttribute("href");

    // If the link's href matches the current page, mark it as active
    if (linkTarget === currentPage) {
      link.classList.add("active");
    }
  });
});
