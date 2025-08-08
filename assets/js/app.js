
(async function () {
  const cfg = await fetch("config.json").then(r => r.json());
  const doc = document.documentElement;
  const lang = (doc.getAttribute("data-lang") || cfg.site.default_lang || "en").toLowerCase();
  const i18n = await fetch(`assets/i18n/${lang}.json`).then(r => r.json());

  window.__CFG__ = cfg; window.__I18N__ = i18n;

  const brandNameEl = document.getElementById("brand-name");
  if (brandNameEl) brandNameEl.textContent = (lang === "ru" ? cfg.site.title_ru : cfg.site.title_en).split("—")[0].trim();

  const yourName = document.getElementById("your-name");
  if (yourName) yourName.textContent = brandNameEl.textContent;

  document.querySelectorAll(".lang-switcher [data-lang]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-lang");
      if (target === "ru") window.location.href = "ru.html";
      if (target === "en") window.location.href = "index.html";
    });
  });

  for (const el of document.querySelectorAll("[data-i18n]")) {
    const path = el.getAttribute("data-i18n").split(".");
    let val = i18n; for (const k of path) val = val?.[k];
    if (typeof val === "string") el.textContent = val;
  }
  for (const el of document.querySelectorAll("[data-i18n-html]")) {
    const path = el.getAttribute("data-i18n-html").split(".");
    let val = i18n; for (const k of path) val = val?.[k];
    if (typeof val === "string") el.innerHTML = val;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem("theme");
  if (cfg.features.enable_dark_mode) {
    const theme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(theme);
  }
  document.getElementById("theme-toggle")?.addEventListener("click", () => {
    const theme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(theme);
  });
  function setTheme(theme) { document.documentElement.setAttribute("data-theme", theme); localStorage.setItem("theme", theme); }

  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.getElementById("nav-list");
  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const open = navList.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href").slice(1); const target = document.getElementById(id);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth", block: "start" }); }
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

  const email = cfg.site.email, tg=cfg.site.telegram, li=cfg.site.linkedin, gh=cfg.site.github, scholar=cfg.site.scholar;
  setHref("email-link", `mailto:${email}`); setHref("tg-link", tg); setHref("li-link", li);
  setHref("gh-link", gh); setHref("scholar-link", scholar);
  setHref("contact-email", `mailto:${email}`, email); setHref("contact-tg", tg, tg);
  setHref("contact-li", li, li); setHref("contact-gh", gh, gh); setHref("contact-scholar", scholar, scholar);
  function setHref(id, href, text){ const el=document.getElementById(id); if(el){ el.href=href; if(text) el.textContent=text; } }

  const cvBtn = document.getElementById("cv-button"); if (cvBtn) cvBtn.href = lang === "ru" ? cfg.site.resume_ru_path : cfg.site.resume_en_path;

  const eduWrap = document.getElementById("education-items");
  i18n.education.items.forEach(item => {
    const e = document.createElement("div"); e.className = "edu-item";
    e.innerHTML = `<div class="period">${item.period}</div><div class="place">${item.place}</div><div class="details">${item.details_html}</div>`; eduWrap.appendChild(e);
  });

  const pubWrap = document.getElementById("pub-items");
  if (cfg.features.enable_publications) {
    i18n.publications.items.forEach(p => {
      const card = document.createElement("article"); card.className = "card";
      const badge = p.badge ? `<span class="badge">${p.badge}</span>` : "";
      card.innerHTML = `<h3>${p.title}</h3><div class="muted small">${p.authors}</div><div class="muted small">${p.venue}</div><p><a href="${p.link}" target="_blank" rel="noopener">Link</a> ${badge}</p>`;
      pubWrap.appendChild(card);
    });
  }

  // Publications filters/search
  (function setupPubFilters(){
    if(!cfg.features.enable_pub_filters) return;
    const wrap = document.getElementById("publications").querySelector(".container");
    const controls = document.createElement("div");
    controls.className = "grid-2";
    controls.innerHTML = `<div><label>Search <input id="pub-search" placeholder="author/title/tag"></label></div><div style="text-align:right"><label>Year <select id="pub-year"></select></label></div>`;
    wrap.insertBefore(controls, wrap.children[1]);
    const yearSel = controls.querySelector("#pub-year");
    const search = controls.querySelector("#pub-search");
    const items = i18n.publications.items.map(p => ({...p, year: (p.venue.match(/(20\d{2})/)||[])[1]||""}));
    const years = [...new Set(items.map(p=>p.year).filter(Boolean))].sort((a,b)=>b-a);
    yearSel.innerHTML = `<option value="">All</option>` + years.map(y=>`<option>${y}</option>`).join("");
    function apply(){
      const q = (search.value||"").toLowerCase(); const year = yearSel.value;
      const cards = document.querySelectorAll("#publications #pub-items .card");
      cards.forEach((card, idx) => {
        const p = items[idx];
        const text = `${p.title} ${p.authors} ${p.venue} ${p.badge||""}`.toLowerCase();
        const ok = (!q || text.includes(q)) && (!year || p.year === year);
        card.style.display = ok ? "" : "none";
      });
    }
    search.addEventListener("input", apply); yearSel.addEventListener("change", apply); setTimeout(apply, 0);
  })();

  // Repositories: pinned first
  if (cfg.features.enable_github_section && cfg.github.pinned && Array.isArray(cfg.github.pinned) && cfg.github.pinned.length>0) {
    const pinnedWrap = document.createElement("div"); pinnedWrap.className = "cards";
    const repoSection = document.getElementById("repositories").querySelector(".container");
    const h = document.createElement("h3"); h.textContent = "Pinned";
    repoSection.insertBefore(h, repoSection.children[2]); repoSection.insertBefore(pinnedWrap, repoSection.children[3]);
    (async function(){
      for (const full of cfg.github.pinned) {
        try {
          const [owner, name] = full.split("/");
          const r = await fetch(`https://api.github.com/repos/${owner}/${name}`).then(x=>x.json());
          const el = document.createElement("article"); el.className = "card repo";
          el.innerHTML = `<h3><a href="${r.html_url}" target="_blank" rel="noopener">${r.name}</a></h3><p>${r.description||""}</p><div class="meta"><span>${r.language||""}</span><span>★ ${r.stargazers_count}</span><span>⑂ ${r.forks_count}</span></div>`;
          pinnedWrap.appendChild(el);
        } catch {}
      }
    })();
  }
  const repoWrap = document.getElementById("repo-items");
  if (cfg.features.enable_github_section && cfg.github.username) {
    try {
      const url = `https://api.github.com/users/${cfg.github.username}/repos?per_page=100&sort=updated`;
      const repos = await fetch(url).then(r => r.json());
      const filtered = repos.filter(r => r && (!cfg.github.exclude_forks || !r.fork)).filter(r => (r.stargazers_count||0) >= (cfg.github.min_stars||0)).sort((a,b) => (b.stargazers_count||0)-(a.stargazers_count||0)).slice(0, cfg.github.repo_fetch_limit||8);
      for (const r of filtered) {
        const el = document.createElement("article"); el.className = "card repo";
        const langName = r.language ? `<span>${r.language}</span>` : "";
        const stars = `<span>★ ${r.stargazers_count}</span>`; const forks = `<span>⑂ ${r.forks_count}</span>`;
        el.innerHTML = `<h3><a href="${r.html_url}" target="_blank" rel="noopener">${r.name}</a></h3><p>${r.description||""}</p><div class="meta">${langName}${stars}${forks}</div>`;
        repoWrap.appendChild(el);
      }
    } catch (e) {
      const warn = document.createElement("p"); warn.className = "muted"; warn.textContent = "Failed to load repositories (rate limit?)."; repoWrap.appendChild(warn);
    }
  }

  // Timeline import override
  async function loadTimelineFallback() {
    try { const resp = await fetch("assets/data/timeline.json"); if (resp.ok) return resp.json(); } catch {}
    try {
      const csv = await fetch("assets/data/timeline.csv").then(r=>r.text());
      const rows = csv.trim().split(/\r?\n/).slice(1).map(line=>line.split(";"));
      return rows.map(([date,title,description])=>({date,title,description}));
    } catch {}
    return null;
  }
  const tWrap = document.getElementById("timeline-items");
  if (cfg.features.enable_timeline) {
    let items = i18n.timeline.items;
    const imported = await loadTimelineFallback(); if (imported) items = imported;
    items = [...items].sort((a,b) => new Date(b.date) - new Date(a.date));
    for (const it of items) {
      const li = document.createElement("li");
      const date = new Date(it.date).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", { year: "numeric", month: "short", day: "2-digit" });
      li.innerHTML = `<div class="tiny muted">${date}</div><div class="title"><strong>${it.title}</strong></div><div class="desc">${it.description}</div>`;
      tWrap.appendChild(li);
    }
  }

  // Goals
  const goals = document.getElementById("goal-items");
  i18n.goals.items.forEach(g => { const li=document.createElement("li"); li.textContent=g; goals.appendChild(li); });

  // Structured data
  if (cfg.features.enable_structured_data) {
    const schema = {"@context":"https://schema.org","@type":"Person","name":brandNameEl?.textContent || "Your Name","url":cfg.site.base_url,"email":`mailto:${cfg.site.email}`,"sameAs":[cfg.site.github,cfg.site.linkedin,cfg.site.telegram,cfg.site.scholar].filter(Boolean)};
    const s = document.createElement("script"); s.type="application/ld+json"; s.textContent = JSON.stringify(schema); document.head.appendChild(s);
  }

  // PWA
  if (cfg.features.enable_pwa && "serviceWorker" in navigator) { try { await navigator.serviceWorker.register("sw.js"); } catch (e) { console.warn("SW registration failed", e); } }

  // Social embeds (Twitter/Telegram) optional
  (function socialEmbeds(){
    const cont = document.getElementById("contact"); if (!cont) return;
    const wrap = document.createElement("div"); wrap.className = "grid-2";
    wrap.innerHTML = `<div><h3>Twitter</h3><blockquote class="twitter-timeline" data-height="400">Tweets by ${cfg.embeds.twitter_username}</blockquote><script async src="https://platform.twitter.com/widgets.js"></script></div><div><h3>Telegram</h3><script async src="https://telegram.org/js/telegram-widget.js?22" data-telegram-post="${cfg.embeds.telegram_channel}/1" data-width="100%"></script></div>`;
    cont.querySelector(".container").appendChild(wrap);
  })();
})();

// Contact form support
async function submitContact(e) {
  const cfg = window.__CFG__;
  const form = e.target;
  const name = form.name.value, email = form.email.value, message = form.message.value;
  if (cfg.form.service === "formspree" && cfg.form.endpoint) {
    e.preventDefault();
    const resp = await fetch(cfg.form.endpoint, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ name, email, message }) });
    alert(resp.ok ? "Sent!" : "Failed to send"); return false;
  }
  if (cfg.form.service === "staticforms" && cfg.form.endpoint) {
    e.preventDefault();
    const data = new FormData();
    data.append("accessKey", cfg.form.endpoint); data.append("name", name); data.append("email", email); data.append("message", message);
    const resp = await fetch("https://api.staticforms.xyz/submit", { method:"POST", body:data });
    alert(resp.ok ? "Sent!" : "Failed to send"); return false;
  }
  const subject = `Contact from ${name}`; const body = `Name: ${name}%0AEmail: ${email}%0A%0A${encodeURIComponent(message)}`;
  const mailto = `mailto:${cfg.site.email}?subject=${encodeURIComponent(subject)}&body=${body}`; window.location.href = mailto; e.preventDefault(); return false;
}
