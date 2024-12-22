document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.querySelector("#theme-toggle");
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark" || (currentTheme === null && prefersDarkScheme.matches)) {
      document.body.classList.add("dark-theme");
    }
  
    themeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark-theme");
      const theme = document.body.classList.contains("dark-theme") ? "dark" : "light";
      localStorage.setItem("theme", theme);
    });
  });
  