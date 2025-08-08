#!/usr/bin/env python3
import json, datetime, xml.sax.saxutils as sx, pathlib
root = pathlib.Path(__file__).resolve().parents[1]
posts_index = json.loads((root/"assets/posts/index.json").read_text(encoding="utf-8"))
cfg = json.loads((root/"config.json").read_text(encoding="utf-8"))
site_url = cfg["site"]["base_url"].rstrip("/")
feed_title_en = cfg["feeds"]["site_title_en"]
feed_title_ru = cfg["feeds"]["site_title_ru"]
updated = max(p["date"] for p in posts_index["items"])
def item_xml(p):
    title = p.get("title_en") or p.get("title_ru") or p["slug"]
    link = f"{site_url}/post.html?slug={p['slug']}"
    pub = p["date"] + "T00:00:00Z"
    return f"  <entry>\n    <title>{sx.escape(title)}</title>\n    <link href=\"{link}\"/>\n    <id>{link}</id>\n    <updated>{pub}</updated>\n    <summary>{sx.escape(p.get('summary_en') or p.get('summary_ru') or '')}</summary>\n  </entry>"
xml = f"<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<feed xmlns=\"http://www.w3.org/2005/Atom\">\n  <title>{sx.escape(feed_title_en)} / {sx.escape(feed_title_ru)}</title>\n  <link href=\"{site_url}/feed.xml\" rel=\"self\"/>\n  <link href=\"{site_url}/blog.html\"/>\n  <updated>{updated}T00:00:00Z</updated>\n  <id>{site_url}/</id>\n" + "\n".join(item_xml(p) for p in posts_index["items"]) + "\n</feed>\n"
(root/"feed.xml").write_text(xml, encoding="utf-8")
print("Wrote", root/"feed.xml")
