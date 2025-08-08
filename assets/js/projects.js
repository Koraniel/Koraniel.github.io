
(async function () {
  const data = await fetch("assets/projects/projects.json").then(r => r.json());
  const lang = document.documentElement.getAttribute("data-lang") || "en";
  const list = document.getElementById("projects-list");
  const q = document.getElementById("proj-search");
  const yearSel = document.getElementById("proj-year");

  const items = data.items.sort((a,b) => b.year - a.year);
  const years = [...new Set(items.map(i => i.year))].sort((a,b)=>b-a);
  yearSel.innerHTML = `<option value="">All</option>` + years.map(y=>`<option>${y}</option>`).join("");

  function render() {
    list.innerHTML = "";
    const query = (q.value || "").toLowerCase();
    const year = yearSel.value;
    const filtered = items.filter(p => {
      const title = (lang === "ru" ? p.title_ru : p.title_en);
      const text = `${title} ${(lang==='ru'?p.summary_ru:p.summary_en)}`.toLowerCase();
      const yearOk = !year || String(p.year) === year;
      const qOk = !query || text.includes(query) || (p.tags||[]).join(" ").toLowerCase().includes(query);
      return yearOk && qOk;
    });
    for (const p of filtered) {
      const title = (lang === "ru" ? p.title_ru : p.title_en);
      const summary = (lang === "ru" ? p.summary_ru : p.summary_en);
      const card = document.createElement("article"); card.className = "card";
      const imgs = (p.images||[]).map(src => `<img src="${src}" alt="" class="proj-thumb" data-full="${src}">`).join(" ");
      card.innerHTML = `<h3><a href="${p.link}" target="_blank" rel="noopener">${title}</a></h3>
        <div class="tiny muted">${p.year} · ${(p.tags||[]).map(t=>`#${t}`).join(" ")}</div>
        <p>${summary}</p>
        <div class="proj-thumbs">${imgs}</div>`;
      list.appendChild(card);
    }
    setupLightbox();
  }

  function setupLightbox() {
    const lb = document.getElementById("lightbox");
    const img = document.getElementById("lightbox-img");
    const close = document.getElementById("lightbox-close");
    document.querySelectorAll(".proj-thumb").forEach(th => {
      th.addEventListener("click", () => { img.src = th.getAttribute("data-full"); lb.hidden = false; });
    });
    close.addEventListener("click", () => lb.hidden = true);
    lb.addEventListener("click", (e) => { if (e.target === lb) lb.hidden = true; });
  }

  q?.addEventListener("input", render);
  yearSel?.addEventListener("change", render);
  render();
})();
