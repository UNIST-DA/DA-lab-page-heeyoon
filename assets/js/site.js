// current year
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();
});

// Very small Markdown -> HTML converter (headings, lists, paragraphs, **bold**, *italic*)
function mdToHtml(md){
  const lines = md.split(/\r?\n/);
  let html = '';
  let inList = false;
  function closeList(){ if(inList){ html += '</ul>'; inList=false; } }
  for(let raw of lines){
    const line = raw.trimEnd();
    if(!line){
      closeList();
      html += '<p></p>';
      continue;
    }
    if(/^###\s+/.test(line)){ closeList(); html += '<h3>'+escapeHtml(line.replace(/^###\s+/,''))+'</h3>'; continue; }
    if(/^##\s+/.test(line)){ closeList(); html += '<h2>'+escapeHtml(line.replace(/^##\s+/,''))+'</h2>'; continue; }
    if(/^#\s+/.test(line)){ closeList(); html += '<h1>'+escapeHtml(line.replace(/^#\s+/,''))+'</h1>'; continue; }
    if(/^-\s+/.test(line) || /^\*\s+/.test(line)){
      if(!inList){ html += '<ul>'; inList = true; }
      const item = line.replace(/^[-*]\s+/,'');
      html += '<li>'+inlineFmt(escapeHtml(item))+'</li>';
      continue;
    }
    closeList();
    html += '<p>'+inlineFmt(escapeHtml(line))+'</p>';
  }
  closeList();
  return html;
}
function inlineFmt(s){
  s = s.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
  s = s.replace(/\*(.+?)\*/g,'<em>$1</em>');
  return s;
}
function escapeHtml(s){
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function loadMarkdown(selector, path){
  fetch(path, {cache:'no-cache'})
    .then(r => r.text())
    .then(t => { document.querySelector(selector).innerHTML = mdToHtml(t); })
    .catch(e => { document.querySelector(selector).innerHTML = '<p style="color:#b91c1c">Failed to load content.</p>'; });
}
