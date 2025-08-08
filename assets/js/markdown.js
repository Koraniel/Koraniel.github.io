
function mdToHtml(md) {
  md = md.replace(/^\uFEFF/, "");
  const fmMatch = md.match(/^---\n([\s\S]*?)\n---\n/); if (fmMatch) md = md.slice(fmMatch[0].length);
  md = md.replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${escapeHtml(code)}</code></pre>`);
  md = md.replace(/^###### (.*)$/gm, "<h6>$1</h6>").replace(/^##### (.*)$/gm, "<h5>$1</h5>").replace(/^#### (.*)$/gm, "<h4>$1</h4>").replace(/^### (.*)$/gm, "<h3>$1</h3>").replace(/^## (.*)$/gm, "<h2>$1</h2>").replace(/^# (.*)$/gm, "<h1>$1</h1>");
  md = md.replace(/^\s*-\s+(.*)$/gm, "<li>$1</li>").replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>");
  md = md.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
  md = md.replace(/`([^`]+)`/g, "<code>$1</code>");
  md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" target="_blank" rel="noopener">$1</a>`);
  md = md.split(/\n{2,}/).map(block => (/^<h\d|^<ul>|^<pre>|^<blockquote>/.test(block) ? block : `<p>${block.replace(/\n/g,"<br>")}</p>`)).join("\n");
  return md;
}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
