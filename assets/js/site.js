/* Minimal site runtime for JSON-driven content */
(function(){
  const rootAttr = document.currentScript?.getAttribute('data-root') || './';

  // Elements
  const workBtn = document.getElementById('workMenuBtn');
  const workMenu = document.getElementById('workMenu');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const openSearchBtn = document.getElementById('openSearchBtn');
  const cmdOverlay = document.getElementById('cmd');
  const cmdInput = document.getElementById('cmdInput');
  const cmdResults = document.getElementById('cmdResults');
  const cmdCloseBtn = document.getElementById('cmdClose');
  const typingEl = document.getElementById('typingText');
  const modal = document.getElementById('quickModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');

  // State
  let pages = [
    { id: 'home', title: 'Home', description: 'Main portfolio page with recent projects and experience', type: 'page', href: rootAttr + 'index.html' },
    { id: 'projects', title: 'Projects', description: 'All projects across categories', type: 'page', href: rootAttr + 'pages/projects.html' },
    { id: 'graphic-design', title: 'Graphic Design', description: 'Visual storytelling through creative design', type: 'page', href: rootAttr + 'pages/graphic-design.html' },
    { id: 'web-design', title: 'Web Design', description: 'Creating beautiful and functional web experiences', type: 'page', href: rootAttr + 'pages/web-design.html' },
    { id: 'ux-ui-design', title: 'UX/UI Design', description: 'Designing intuitive user experiences', type: 'page', href: rootAttr + 'pages/ux-ui-design.html' },
    { id: 'game-design', title: 'Game Design', description: 'Creating immersive gaming experiences', type: 'page', href: rootAttr + 'pages/game-design.html' }
  ];

  // Utilities
  const qs = (sel, ctx=document) => ctx.querySelector(sel);
  const qsa = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  const fetchJson = (path) => fetch(path).then(r => {
    if (!r.ok) throw new Error('Failed to load ' + path);
    return r.json();
  });

  function toggleMenu(){
    if (!workBtn || !workMenu) return;
    const open = workMenu.classList.toggle('show');
    workBtn.setAttribute('aria-expanded', String(open));
  }
  function closeMenu(){
    if (!workBtn || !workMenu) return;
    workMenu.classList.remove('show');
    workBtn.setAttribute('aria-expanded', 'false');
  }

  if (workBtn && workMenu){
    workBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
    document.addEventListener('click', (e) => { if (!workMenu.contains(e.target)) closeMenu(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  }

  // Mobile menu
  function toggleMobile(){
    if (!mobileMenuBtn || !mobileMenu) return;
    const hidden = mobileMenu.hasAttribute('hidden');
    if (hidden){ mobileMenu.removeAttribute('hidden'); mobileMenu.classList.add('show'); document.documentElement.classList.add('no-scroll'); document.body.classList.add('no-scroll'); }
    else { mobileMenu.setAttribute('hidden', ''); mobileMenu.classList.remove('show'); document.documentElement.classList.remove('no-scroll'); document.body.classList.remove('no-scroll'); }
    mobileMenuBtn.setAttribute('aria-expanded', String(hidden));
  }
  if (mobileMenuBtn && mobileMenu){
    mobileMenuBtn.addEventListener('click', toggleMobile);
    document.addEventListener('click', (e)=>{
      if ((mobileMenuBtn && mobileMenuBtn.contains(e.target)) || (mobileMenu && mobileMenu.contains(e.target))) return;
      if (!mobileMenu.hasAttribute('hidden')) toggleMobile();
    });
    if (mobileClose) mobileClose.addEventListener('click', toggleMobile);
    const mobileSearch = document.getElementById('mobileSearch');
    if (mobileSearch) mobileSearch.addEventListener('click', ()=>{ toggleMobile(); openCmd(); });
    mobileMenu.addEventListener('click', (e)=>{
      if (e.target === mobileMenu) toggleMobile();
    });
    document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape' && !mobileMenu.hasAttribute('hidden')) toggleMobile(); });
  }

  // Modal
  function openModal(title, html){
    if (!modal) return;
    modalTitle.textContent = title || '';
    modalBody.innerHTML = html || '';
    modal.hidden = false;
  }
  function closeModal(){ if (modal) modal.hidden = true; }
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  // Project cards
  function projectCard(p){
    const card = document.createElement('div');
    card.className = 'project-card';
    const hasImage = Boolean(p.image);
    const thumbInner = hasImage ? `<img src="${p.image}" alt="${p.title} preview">` : `${p.category || ''} • preview`;
    card.innerHTML = `
      <div class="project-thumb" aria-label="${p.title} preview" role="img">${thumbInner}</div>
      <div class="project-meta">
        <div class="project-kicker">${p.category || ''}</div>
        <div class="project-row">
          <div class="project-title">${p.title}</div>
          <div class="project-arrow">→</div>
        </div>
        <div class="experience-description">${p.description || ''}</div>
      </div>
    `;

    card.addEventListener('click', () => {
      if (p.detail && typeof p.detail === 'string') {
        openModal(p.title, p.detail);
      } else if (p.url && p.url !== '#') {
        window.location.href = p.url;
      }
    });
    return card;
  }

  // Render list with pagination
  function pagerRenderer(containerEl, items, chunkSize){
    let shown = 0;
    function renderMore(){
      const slice = items.slice(shown, shown + chunkSize);
      slice.forEach(p => containerEl.appendChild(projectCard(p)));
      shown += slice.length;
      return shown >= items.length;
    }
    return { renderMore };
  }

  // Command palette
  function openCmd(){ if (cmdOverlay){ cmdOverlay.hidden = false; cmdInput.value=''; renderSearch(''); setTimeout(()=>cmdInput.focus(),10); } }
  function closeCmd(){ if (cmdOverlay) cmdOverlay.hidden = true; }
  if (openSearchBtn) openSearchBtn.addEventListener('click', openCmd);
  if (cmdOverlay) cmdOverlay.addEventListener('click', (e)=>{ if (e.target===cmdOverlay) closeCmd(); });
  if (cmdCloseBtn){ cmdCloseBtn.setAttribute('role','button'); cmdCloseBtn.setAttribute('tabindex','0'); cmdCloseBtn.addEventListener('click', closeCmd); cmdCloseBtn.addEventListener('keydown', (e)=>{ if (e.key==='Enter' || e.key===' ') { e.preventDefault(); closeCmd(); } }); }
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !e.metaKey && !e.ctrlKey && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') { e.preventDefault(); openCmd(); }
    if ((e.key.toLowerCase() === 'k') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); openCmd(); }
    if (e.key === 'Escape' && cmdOverlay && !cmdOverlay.hidden) closeCmd();
  });

  function renderSearch(q){
    if (!cmdResults) return;
    const query = (q||'').trim().toLowerCase();
    const items = window.__siteProjects ? [
      ...pages,
      ...window.__siteProjects.map(p => ({ id: p.url || '#', title: p.title, description: p.description || p.category, type: 'project' }))
    ] : pages;

    const results = !query ? items.slice(0, 8) : items.filter(it =>
      it.title.toLowerCase().includes(query) || (it.description && it.description.toLowerCase().includes(query))
    ).slice(0, 20);

    cmdResults.innerHTML = '';
    results.forEach(r => {
      const div = document.createElement('div');
      div.className = 'cmd-item';
      div.setAttribute('role', 'option');
      div.tabIndex = 0;
      div.innerHTML = `<div class="cmd-title">${r.title}</div><div class="cmd-desc">${r.type === 'page' ? 'Page' : 'Project'} — ${r.description || ''}</div>`;
      div.addEventListener('click', () => {
        if (r.type === 'page') { window.location.href = r.href; }
        else { if (r.id && r.id !== '#') window.location.href = r.id; }
        closeCmd();
      });
      div.addEventListener('keydown', (e) => { if (e.key === 'Enter') div.click(); });
      cmdResults.appendChild(div);
    });
  }
  if (cmdInput) cmdInput.addEventListener('input', (e) => renderSearch(e.target.value));

  // Typing loop
  const phrases = [
    "Farhan Sadeque Kamal",
    "A Game Developer",
    "A UX/UI Designer",
    "A Web Designer",
    "An Aspring Entrepreneur",
    "A Tech Enthusiast",
    "A Leaner"
  ];
  let pi = 0, ci = 0, deleting = false;
  function tickType(){
    if (!typingEl) return;
    const full = phrases[pi];
    if (!deleting) {
      ci++; typingEl.textContent = full.slice(0, ci);
      if (ci === full.length) { deleting = true; setTimeout(tickType, 1200); return; }
    } else {
      ci--; typingEl.textContent = full.slice(0, ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    const delay = deleting ? 40 : 70; setTimeout(tickType, delay);
  }

  // Page boot
  document.addEventListener('DOMContentLoaded', async () => {
    tickType();

    // Load projects for home
    if (window.HOME_PAGE){
      const grid = document.getElementById('projectsGrid');
      const viewMoreBtn = document.getElementById('viewMoreBtn');
      try{
        const all = await fetchJson(rootAttr + 'data/recent-projects.json');
        window.__siteProjects = all;
        const pager = pagerRenderer(grid, all, 4);
        const updateBtn = () => {
          const done = pager.renderMore();
          if (done) {
            viewMoreBtn.disabled = false;
            viewMoreBtn.textContent = 'See all projects ↗';
            viewMoreBtn.onclick = () => { window.location.href = rootAttr + 'pages/projects.html'; };
          } else {
            viewMoreBtn.disabled = false;
            viewMoreBtn.textContent = 'View More ↗';
            viewMoreBtn.onclick = updateBtn;
          }
        };
        updateBtn();
        viewMoreBtn.onclick = updateBtn;
      }catch(err){
        grid.innerHTML = '<div style="color:var(--muted)">Failed to load projects.</div>';
        console.error(err);
      }
    }
  });
})();


