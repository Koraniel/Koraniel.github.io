
# Portfolio Site (RU/EN, Warm Terracotta)

A clean, customizable personal site for GitHub Pages with:
- RU/EN language support (static `index.html` for EN and `ru.html` for RU for correct OG sharing)
- Warm/terracotta palette, light/dark theme toggle
- Open Graph + Twitter card + favicons
- Timeline/achievements, education, publications, repositories (via GitHub API)
- PWA (manifest + service worker)
- Sitemap, robots, 404
- Structured data (schema.org/Person)
- Download CV button per language

## Quick Start

1. **Update URLs and data**
   - Edit `config.json`:
     - `site.base_url` → your GitHub Pages URL (no trailing slash)
     - Social links, email, etc.
     - `github.username` → your GitHub handle.
2. **Replace images and CV**
   - `assets/img/avatar.png` with your photo/logo.
   - `assets/img/og-image-*.png` for prettier shares (1200×630).
   - `assets/cv/cv_en.pdf`, `assets/cv/cv_ru.pdf` with your actual CVs.
3. **Publish to GitHub Pages**
   - Create a repo `<REPO>` on your GitHub account.
   - Push these files.
   - In repo settings → Pages, publish from the `main` branch root.
   - Your site becomes available at `https://<USERNAME>.github.io/<REPO>/`.

### Customize Sections

- Text lives in `assets/i18n/en.json` and `assets/i18n/ru.json`.
- Add items to `education.items`, `publications.items`, `timeline.items`, `goals.items`.
- Repositories auto-load from GitHub; tune filters in `config.json` (`min_stars`, `exclude_forks`, `repo_fetch_limit`).

### Notes

- OG tags are static in the HTML for each language page, so sharing `index.html` → EN card, `ru.html` → RU card.
- The contact form is static; it opens your email client with `mailto:`. Integrations like Formspree can be added if needed.
- If you use a custom domain, put the domain in a `CNAME` file at repo root.

MIT License.
