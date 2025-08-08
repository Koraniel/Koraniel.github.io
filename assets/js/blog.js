
(async function () {
  const res = await fetch("assets/posts/index.json").then(r => r.json());
  const lang = document.documentElement.getAttribute("data-lang") || res.default_lang || "en";
  const list = document.getElementById("blog-list");
  const search = document.getElementById("blog-search");
  const tagsWrap = document.getElementById("blog-tags");

  const items = res.items.sort((a,b) => new Date(b.date) - new Date(a.date));
  const allTags = [...new Set(items.flatMap(p => (p.tags || [])))].sort();
  const active = new Set();

  function render() {
    const q = (search.value || "").toLowerCase();
    list.innerHTML = "";
    const filtered = items.filter(p => {
      const title = (lang === "ru" ? p.title_ru : p.title_en) || "";
      const matchQ = !q || title.toLowerCase().includes(q) || (p.tags||[]).join(" ").toLowerCase().includes(q);
      const matchT = active.size === 0 || (p.tags||[]).some(t => active.has(t));
      return matchQ && matchT;
    });
    for (const p of filtered) {
      const title = (lang === "ru" ? p.title_ru : p.title_en) || p.title_en;
      const summary = (lang === "ru" ? p.summary_ru : p.summary_en) || "";
      const a = document.createElement("article");
      a.className = "card";
      a.innerHTML = `<h3><a href="post.html?slug=${encodeURIComponent(p.slug)}">${title}</a></h3>
        <div class="tiny muted">${new Date(p.date).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US")}</div>
        <p>${summary}</p>
        <div class="tiny muted">${(p.tags||[]).map(t=>`#${t}`).join(" ")}</div>`;
      list.appendChild(a);
    }
  }

  function renderTags() {
    tagsWrap.innerHTML = allTags.map(t => `<button class="btn btn-ghost" data-tag="${t}">#${t}</button>`).join(" ");
    tagsWrap.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        const t = btn.getAttribute("data-tag");
        if (active.has(t)) active.delete(t); else active.add(t);
        btn.classList.toggle("btn-solid");
        render();
      });
    });
  }

  search?.addEventListener("input", render);
  renderTags(); render();
})();
