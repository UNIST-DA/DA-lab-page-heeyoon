// Smooth-scroll for in-page anchors & current year
(function(){
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const el = document.querySelector(id);
        if (el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth'}); }
      }
    });
  });
})();
