
# Portfolio Site (RU/EN, Warm Terracotta) — Extended

Includes: Blog (RU/EN titles), Projects with gallery, RSS feed, static OG pages generator, timeline import (JSON/CSV),
publications filters, pinned repos, KaTeX math (CDN), PWA, sitemap/robots/404, structured data, and contact form integrations.

## Quick Start
1. Edit `config.json` — set `site.base_url`, socials, `github.username`, `form` settings if needed.
2. Replace images and CVs in `assets/img/*` and `assets/cv/*`.
3. Push to GitHub and enable Pages (branch: main, folder: /).

## Blog
- Posts live in `assets/posts/*.md` (simple Markdown).
- Update `assets/posts/index.json` when adding posts.
- View: `/blog.html`; individual: `/post.html?slug=your-slug`.
- Math supported via KaTeX CDN (edit HTML to self-host if needed).

## RSS
- Run `python3 tools/build_feed.py` locally to regenerate `feed.xml` after changing posts.
- Readers subscribe to `<base_url>/feed.xml`.

## Projects
- Data in `assets/projects/projects.json` (see fields in sample).
- Page `/projects.html` supports search & year filter. Click thumbnails for lightbox.

## Timeline import
- If `assets/data/timeline.json` or `assets/data/timeline.csv` exists, it overrides timeline in i18n.

## Publications filters
- Year parsed from `venue` (e.g., "... 2024"); search box filters by author/title/tag.

## Pinned repos
- `config.json` → `github.pinned` as array of `"owner/name"` strings. Rendered above auto list.

## Contact
- Default `mailto`. For Formspree: `"form": {"service":"formspree","endpoint":"https://formspree.io/f/XXXX"}`
- For StaticForms: `"form":{"service":"staticforms","endpoint":"YOUR_ACCESS_KEY"}`

## Static OG pages
- Run: `python3 tools/generate_og_pages.py`. Commits `og-post-*.html` / `og-proj-*.html`.
- Share these URLs if a crawler ignores JS.

## PWA
- `site.webmanifest` + `sw.js` included. Registers automatically.

MIT License.
