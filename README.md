# Personal Site (Warm Palette)

**Deploy to GitHub Pages**
1. Create repo named `your-username.github.io`.
2. Put files from this folder into the repo.
3. Commit & push to `main`. Pages will serve from root automatically.

**Customize**
- Replace text in `index.html` (name, bio, links, sections).
- Put your real photo into `assets/images/` and update the `<img>` `src`.
- Drop your CV as `assets/CV.pdf` or change the link.
- Extend sections or duplicate `card` blocks as needed.

**Theming**
- Warm palette is defined via CSS variables in `assets/css/styles.css`.
- Dark mode toggle persists via `localStorage`.

**i18n**
- RU/EN strings live in `assets/js/main.js` under `dict`.
- Add more keys as needed (match `data-i18n` attributes).

**Accessibility**
- Includes skip link, accessible burger, proper landmarks and headings.