#!/usr/bin/env python3
import json, pathlib, html
root = pathlib.Path(__file__).resolve().parents[1]
cfg = json.loads((root/"config.json").read_text(encoding="utf-8"))
site = cfg["site"]["base_url"].rstrip("/")
posts = json.loads((root/"assets/posts/index.json").read_text(encoding="utf-8"))["items"]
projects = json.loads((root/"assets/projects/projects.json").read_text(encoding="utf-8"))["items"]

def page(title, desc, image, url):
    return f"<!doctype html><html lang='en'><meta charset='utf-8'><title>{html.escape(title)}</title>\n<meta property='og:type' content='article'>\n<meta property='og:title' content='{html.escape(title)}'>\n<meta property='og:description' content='{html.escape(desc)}'>\n<meta property='og:image' content='{html.escape(image)}'>\n<meta property='og:url' content='{html.escape(url)}'>\n<meta name='twitter:card' content='summary_large_image'>\n<link rel='canonical' href='{html.escape(url)}'>\n<meta name='viewport' content='width=device-width,initial-scale=1'>\n<link rel='stylesheet' href='assets/css/style.css'>\n<body><main class='section'><div class='container'><h1>{html.escape(title)}</h1>\n<p>{html.escape(desc)}</p>\n<p><a href='{html.escape(url)}'>Open</a></p>\n</div></main></body></html>"

for p in posts:
    url = f"{site}/post.html?slug={p['slug']}"
    title = p.get("title_en") or p["slug"]
    desc = p.get("summary_en") or ""
    img = p.get("og_image") or "assets/img/og-image-en.png"
    (root/f"og-post-{p['slug']}.html").write_text(page(title, desc, img, url), encoding="utf-8")

for pr in projects:
    url = f"{site}/projects.html#{pr['slug']}"
    title = pr.get("title_en") or pr["slug"]
    desc = pr.get("summary_en") or ""
    img = pr.get("og_image") or "assets/img/og-image-en.png"
    (root/f"og-proj-{pr['slug']}.html").write_text(page(title, desc, img, url), encoding="utf-8")

print("OG pages generated.")
