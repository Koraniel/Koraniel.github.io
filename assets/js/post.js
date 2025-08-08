
(async function () {
  const params = new URLSearchParams(location.search);
  const slug = params.get("slug");
  const index = await fetch("assets/posts/index.json").then(r => r.json());
  const lang = document.documentElement.getAttribute("data-lang") || index.default_lang || "en";
  const item = index.items.find(p => p.slug === slug) || index.items[0];
  if (!item) return;

  if (item.og_image) { const ogImg = document.querySelector('meta[property="og:image"]'); if (ogImg) ogImg.setAttribute("content", item.og_image); }

  const title = lang === "ru" ? item.title_ru : item.title_en;
  document.getElementById("post-title").textContent = title;
  document.title = `${title} — Your Name`;
  document.getElementById("post-meta").textContent =
    new Date(item.date).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US") + " · " + (item.tags||[]).join(", ");

  const md = await fetch(`assets/posts/${item.slug}.md`).then(r => r.text());
  const html = mdToHtml(md);
  const content = document.getElementById("post-content");
  content.innerHTML = html;

  if (window.renderMathInElement) {
    window.renderMathInElement(content, {delimiters: [
      {left: "$$", right: "$$", display: true},
      {left: "$", right: "$", display: false}
    ]});
  }
})();
