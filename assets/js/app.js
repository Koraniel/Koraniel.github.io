
(async function () {
  const cfg = await fetch("config.json").then(r => r.json());
  const doc = document.documentElement;
  const lang = (doc.getAttribute("data-lang") || cfg.site.default_lang || "en").toLowerCase();
  const i18n = await fetch(`assets/i18n/${lang}.json`).then(r => r.json());

  // Expose config & i18n globally (debugging)
  window.__CFG__ = cfg;
  window.__I18N__ = i18n;

  // Set brand name if you'd like to override
  const brandNameEl = document.getElementById("brand-name");
  if (brandNameEl) brandNameEl.textContent = (lang === "ru" ? cfg.site.title_ru : cfg.site.title_en).split("—")[0].trim();

  // Fill hero name (optional — change "Your Name" to your name)
  const yourName = document.getElementById("your-name");
  if (yourName) yourName.textContent = brandNameEl.textContent;

  // Language switcher
  document.querySelectorAll(".lang-switcher [data-lang]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-lang");
      // Redirect to static RU/EN page so OG tags work for shares
      if (target === "ru") window.location.href = "ru.html";
      if (target === "en") window.location.href = "index.html";
    });
  });

  // i18n text injection
  for (const el of document.querySelectorAll("[data-i18n]")) {
    const path = el.getAttribute("data-i18n").split(".");
    let val = i18n;
    for (const k of path) val = val?.[k];
    if (typeof val === "string") el.textContent = val;
  }
  for (const el of document.querySelectorAll("[data-i18n-html]")) {
    const path = el.getAttribute("data-i18n-html").split(".");
    let val = i18n;
    for (const k of path) val = val?.[k];
    if (typeof val === "string") el.innerHTML = val;
  }

  // Controls: theme toggle
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem("theme");
  if (cfg.features.enable_dark_mode) {
    const theme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(theme);
  }
  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) themeBtn.addEventListener("click", () => {
    const theme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(theme);
  });
  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  // Header: mobile nav toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.getElementById("nav-list");
  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const open = navList.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Smooth scroll & active section highlight
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
  const sections = [...document.querySelectorAll("main .section")];
  const navLinks = [...document.querySelectorAll(".nav-list a")];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => l.classList.toggle("active", l.getAttribute("href") === `#${id}`));
      }
    });
  }, { rootMargin: "-60% 0px -35% 0px", threshold: [0, 1] });
  sections.forEach(s => observer.observe(s));

  // Fill contact & social links
  const email = cfg.site.email;
  const tg = cfg.site.telegram;
  const li = cfg.site.linkedin;
  const gh = cfg.site.github;
  const scholar = cfg.site.scholar;

  setHref("email-link", `mailto:${email}`);
  setHref("tg-link", tg);
  setHref("li-link", li);
  setHref("gh-link", gh);
  setHref("scholar-link", scholar);
  setHref("contact-email", `mailto:${email}`, email);
  setHref("contact-tg", tg, tg);
  setHref("contact-li", li, li);
  setHref("contact-gh", gh, gh);
  setHref("contact-scholar", scholar, scholar);

  function setHref(id, href, text) {
    const el = document.getElementById(id);
    if (el) {
      el.href = href;
      if (text) el.textContent = text;
    }
  }

  // CV button resolves to correct language file
  const cvBtn = document.getElementById("cv-button");
  if (cvBtn) {
    cvBtn.href = lang === "ru" ? cfg.site.resume_ru_path : cfg.site.resume_en_path;
  }

  // Education
  const eduWrap = document.getElementById("education-items");
  i18n.education.items.forEach(item => {
    const e = document.createElement("div");
    e.className = "edu-item";
    e.innerHTML = `<div class="period">${item.period}</div>
      <div class="place">${item.place}</div>
      <div class="details">${item.details_html}</div>`;
    eduWrap.appendChild(e);
  });

  // Publications
  const pubWrap = document.getElementById("pub-items");
  if (cfg.features.enable_publications) {
    i18n.publications.items.forEach(p => {
      const card = document.createElement("article");
      card.className = "card";
      const badge = p.badge ? `<span class="badge">${p.badge}</span>` : "";
      card.innerHTML = `<h3>${p.title}</h3>
        <div class="muted small">${p.authors}</div>
        <div class="muted small">${p.venue}</div>
        <p><a href="${p.link}" target="_blank" rel="noopener">Link</a> ${badge}</p>`;
      pubWrap.appendChild(card);
    });
  }

  // Repositories via GitHub API
  const repoWrap = document.getElementById("repo-items");
  if (cfg.features.enable_github_section && cfg.github.username) {
    try {
      const url = `https://api.github.com/users/${cfg.github.username}/repos?per_page=100&sort=updated`;
      const repos = await fetch(url).then(r => r.json());
      const filtered = repos
        .filter(r => r && (!cfg.github.exclude_forks || !r.fork))
        .filter(r => (r.stargazers_count || 0) >= (cfg.github.min_stars || 0))
        .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
        .slice(0, cfg.github.repo_fetch_limit || 8);
      for (const r of filtered) {
        const el = document.createElement("article");
        el.className = "card repo";
        const langName = r.language ? `<span>${r.language}</span>` : "";
        const stars = `<span>★ ${r.stargazers_count}</span>`;
        const forks = `<span>⑂ ${r.forks_count}</span>`;
        el.innerHTML = `<h3><a href="${r.html_url}" target="_blank" rel="noopener">${r.name}</a></h3>
          <p>${r.description || ""}</p>
          <div class="meta">${langName}${stars}${forks}</div>`;
        repoWrap.appendChild(el);
      }
    } catch (e) {
      const warn = document.createElement("p");
      warn.className = "muted";
      warn.textContent = "Failed to load repositories (rate limit?).";
      repoWrap.appendChild(warn);
    }
  }

  // Timeline
  const tWrap = document.getElementById("timeline-items");
  if (cfg.features.enable_timeline) {
    const items = [...i18n.timeline.items]
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    for (const it of items) {
      const li = document.createElement("li");
      const date = new Date(it.date).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", { year: "numeric", month: "short", day: "2-digit" });
      li.innerHTML = `<div class="tiny muted">${date}</div>
        <div class="title"><strong>${it.title}</strong></div>
        <div class="desc">${it.description}</div>`;
      tWrap.appendChild(li);
    }
  }

  // Structured data (Person)
  if (cfg.features.enable_structured_data) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": brandNameEl?.textContent || "Your Name",
      "url": cfg.site.base_url,
      "email": `mailto:${cfg.site.email}`,
      "sameAs": [cfg.site.github, cfg.site.linkedin, cfg.site.telegram, cfg.site.scholar].filter(Boolean)
    };
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(schema);
    document.head.appendChild(s);
  }

  // Register service worker
  if (cfg.features.enable_pwa && "serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("sw.js");
    } catch (e) {
      console.warn("SW registration failed", e);
    }
  }
})();

// Simple static contact -> mailto
function submitContact(e) {
  const form = e.target;
  const name = encodeURIComponent(form.name.value);
  const email = encodeURIComponent(form.email.value);
  const message = encodeURIComponent(form.message.value);
  const subject = `Contact from ${name}`;
  const body = `Name: ${name}%0AEmail: ${email}%0A%0A${message}`;
  const mailto = `mailto:${window.__CFG__?.site?.email}?subject=${subject}&body=${body}`;
  window.location.href = mailto;
  e.preventDefault();
  return false;
}
