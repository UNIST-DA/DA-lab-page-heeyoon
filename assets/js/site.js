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
  const closeList = () => { if(inList){ html += '</ul>'; inList=false; } };

  for (let raw of lines){
    const line = raw.trimEnd();

    // 빈 줄
    if(!line){
      closeList();
      html += '<p></p>';
      continue;
    }

    // 🔴 HTML 블록은 그대로 통과 (갤러리 <div>나 <img> 사용 가능)
    if (/^\s*<[^>]+>/.test(line)){
      closeList();
      html += line;           // escape 안 함
      continue;
    }

    // 헤딩/리스트/문단
    if(/^###\s+/.test(line)){ closeList(); html += '<h3>'+escapeHtml(line.replace(/^###\s+/,''))+'</h3>'; continue; }
    if(/^##\s+/.test(line)){  closeList(); html += '<h2>'+escapeHtml(line.replace(/^##\s+/,''))+'</h2>'; continue; }
    if(/^#\s+/.test(line)){   closeList(); html += '<h1>'+escapeHtml(line.replace(/^#\s+/,''))+'</h1>'; continue; }

    if(/^[-*]\s+/.test(line)){
      if(!inList){ html += '<ul>'; inList = true; }
      const item = line.replace(/^[-*]\s+/, '');
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
  // Images: ![alt](url)
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
  // Links: [text](url)
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  // **bold**
  s = s.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
  // *italic*
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
// NAV 그림자/블러: 스크롤 시 헤더에 클래스 토글
(function(){
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 10) header.classList.add('nav-scrolled');
    else header.classList.remove('nav-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});
})();

// 스크롤 등장 애니메이션: IntersectionObserver
(function(){
  // 페이지에 이미 있는 주요 블록들을 자동으로 대상 지정 (HTML 수정 불필요)
  const targets = document.querySelectorAll(
    '.hero .hero-inner, .section, .card, .qcard, .paper'
  );
  targets.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, {threshold: 0.12});
  targets.forEach(el => io.observe(el));
})();

// 히어로 패럴랙스(가벼운 느낌): 스크롤에 따라 배경 살짝 이동
(function(){
  const hero = document.querySelector('.hero');
  if(!hero) return;
  let ticking = false;
  const update = () => {
    const y = window.scrollY || window.pageYOffset;
    // 배경 위치를 아주 살짝 위/아래로 (0.25 비율) 움직임
    hero.style.backgroundPosition = `center calc(50% + ${y * 0.5}px)`;
    ticking = false;
  };
  window.addEventListener('scroll', ()=>{
    if(!ticking){ requestAnimationFrame(update); ticking = true; }
  }, {passive:true});
  update();
})();
