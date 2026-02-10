// Small UI helpers: nav toggle + simple counter animation
document.addEventListener('DOMContentLoaded',function(){
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');
  navToggle && navToggle.addEventListener('click', ()=>{
    const shown = siteNav.style.display === 'block';
    siteNav.style.display = shown ? 'none' : 'block';
  });

  // Animate metrics: moved to a function and allow dynamic population
  function animateMetrics(){
    const counters = document.querySelectorAll('.metric-value');
    counters.forEach(el=>{
      const raw = el.dataset.target || el.textContent || '0';
      const target = parseFloat(raw) || 0;
      let current = 0;
      const decimals = (String(target).includes('.')) ? 2 : 0;
      const step = Math.max(target/60, 0.1);
      const formatter = (v)=> decimals? v.toFixed(decimals) : Math.round(v);
      const id = setInterval(()=>{
        current += step;
        if(current >= target){
          el.textContent = formatter(target);
          clearInterval(id);
        } else {
          el.textContent = formatter(current);
        }
      },20);
    });
  }

  // load projects from data/projects.json and render
  const projectsContainer = document.getElementById('projectsList');
  if(projectsContainer){
    // Helper: render dynamic project cards from JSON and attach role metadata
    fetch('data/projects.json').then(r=>r.json()).then(list=>{
      projectsContainer.innerHTML = '';
      // render selected project cards
      list.forEach(p=>{
        const card = document.createElement('article');
        card.className = 'project-card';
        card.dataset.role = p.role || 'web';
        const img = document.createElement('img');
        img.src = p.image || 'assets/images/avatar.jpg';
        img.alt = p.title;
        const h3 = document.createElement('h3');
        h3.textContent = p.title;
        const meta = document.createElement('div');
        meta.className = 'project-meta';
        meta.textContent = 'Role: ' + ((p.role||'').toUpperCase() || 'Web');
        const desc = document.createElement('p');
        desc.textContent = p.description;
        const a = document.createElement('a');
        a.className = 'project-link';
        a.href = p.link || '#';
        a.textContent = 'Repo / Demo';
        card.appendChild(img);
        card.appendChild(h3);
        card.appendChild(meta);
        card.appendChild(desc);
        card.appendChild(a);
        projectsContainer.appendChild(card);
      });

      // Render role sample lists (up to 3 each)
      const renderRoleSamples = (role, containerId)=>{
        const container = document.getElementById(containerId);
        if(!container) return;
        container.innerHTML = '';
        const filtered = list.filter(p=> (p.role||'').toLowerCase() === role).slice(0,3);
        filtered.forEach(p=>{
          const item = document.createElement('div');
          item.className = 'role-item';
          const title = document.createElement('div');
          title.className = 'role-item-title';
          title.textContent = p.title;
          const sd = document.createElement('div');
          sd.className = 'role-item-desc';
          sd.textContent = p.description;
          item.appendChild(title);
          item.appendChild(sd);
          item.addEventListener('click', ()=>{
            applyProjectFilters(role);
            document.getElementById('projects')?.scrollIntoView({behavior:'smooth'});
          });
          container.appendChild(item);
        });
        if(filtered.length === 0){
          container.innerHTML = '<p class="muted">No sample projects for this role yet.</p>';
        }
      };

      renderRoleSamples('sre','roles-sre');
      renderRoleSamples('web','roles-web');
      renderRoleSamples('qa','roles-qa');

      // After projects load, animate metrics and apply current filter
      animateMetrics();
      applyProjectFilters(currentFilter || 'all');
    }).catch(err=>{
      projectsContainer.innerHTML = '<p style="color:#9aa4b2">Could not load projects.</p>';
      console.error('load projects error',err);
    });
  }

  // Project filtering UI: show/hide project cards by data-role
  let currentFilter = 'all';
  function applyProjectFilters(role){
    const cards = document.querySelectorAll('#projectsList .project-card');
    cards.forEach(c=>{
      const r = c.dataset.role || c.querySelector('[data-role]')?.getAttribute('data-role') || '';
      if(role === 'all' || r === role){
        c.style.display = '';
      } else {
        c.style.display = 'none';
      }
    });
    // update active button state + aria
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(b=>{
      const active = b.dataset.filter === role;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    currentFilter = role;
  }

  // Wire buttons with accessibility helpers
  document.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.setAttribute('role','tab');
    // initialize aria-pressed attribute
    btn.setAttribute('aria-pressed', String(btn.classList.contains('active')));
    btn.addEventListener('click', ()=>{
      const role = btn.dataset.filter;
      applyProjectFilters(role);
      btn.focus();
    });
    btn.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        btn.click();
      }
    });
  });

  // Load metrics from JSON and populate metric elements, then animate
  fetch('data/metrics.json').then(r=>r.json()).then(metrics=>{
    const els = document.querySelectorAll('.metric-value[data-key]');
    els.forEach(el=>{
      const key = el.dataset.key;
      if(metrics.hasOwnProperty(key)){
        el.dataset.target = metrics[key];
      }
    });
    animateMetrics();
  }).catch(err=>{
    // fallback: just animate whatever is present
    animateMetrics();
  });

  // Theme toggle: persist preference in localStorage and support soothing theme
  const themeToggle = document.getElementById('themeToggle');
  const COLOR_KEY = 'site-colors';
  const THEME_KEY = 'site-theme';
  const setIcon = (theme) => {
    if(!themeToggle) return;
    const icons = { dark: '🌙', soothing: '✨', light: '☀️' };
    themeToggle.textContent = icons[theme] || '🌙';
  };
  const applyTheme = (theme) => {
    document.body.classList.toggle('light-theme', theme === 'light');
    document.body.classList.toggle('soothing-theme', theme === 'soothing');
    setIcon(theme);
  };
  const saved = localStorage.getItem(THEME_KEY);
  if(saved) applyTheme(saved);
  else {
    applyTheme('dark');
  }
  if(themeToggle){
    themeToggle.addEventListener('click', ()=>{
      const current = document.body.classList.contains('soothing-theme') ? 'soothing'
        : (document.body.classList.contains('light-theme') ? 'light' : 'dark');
      const next = current === 'dark' ? 'soothing' : (current === 'soothing' ? 'light' : 'dark');
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  // Dynamic color palettes: rotate accent colors and optional background gradients
  const colorToggle = document.getElementById('colorToggle');
  const palettes = [
    {accent:'#2dd4bf',accent2:'#7cdccf',bg:'linear-gradient(90deg,#071827 0%, #0b1220 100%)'},
    {accent:'#ff6b9f',accent2:'#ffd6e0',bg:'linear-gradient(90deg,#f6eefc 0%, #e8f9f6 100%)'},
    {accent:'#7c8bff',accent2:'#b9c7ff',bg:'linear-gradient(90deg,#0f1720 0%, #1b2b5a 100%)'},
    {accent:'#ffd166',accent2:'#ffe9a8',bg:'linear-gradient(90deg,#fef3d7 0%, #fff7e0 100%)'}
  ];
  let paletteIndex = 0;
  let paletteTimer = null;
  const applyPalette = (p)=>{
    document.documentElement.style.setProperty('--accent', p.accent);
    document.documentElement.style.setProperty('--accent-2', p.accent2 || p.accent);
    if(p.bg) document.documentElement.style.setProperty('--bg', p.bg);
  };
  const startPaletteRotation = ()=>{
    stopPaletteRotation();
    paletteTimer = setInterval(()=>{
      paletteIndex = (paletteIndex+1) % palettes.length;
      applyPalette(palettes[paletteIndex]);
    },4000);
  };
  const stopPaletteRotation = ()=>{ if(paletteTimer){ clearInterval(paletteTimer); paletteTimer=null; } };
  // load saved color mode
  const savedColor = localStorage.getItem(COLOR_KEY);
  if(savedColor === 'dynamic'){
    document.body.classList.add('dynamic-colors');
    applyPalette(palettes[paletteIndex]);
    startPaletteRotation();
    if(colorToggle) colorToggle.textContent = '🔁';
  } else {
    // ensure palette variables reflect current accent
    document.documentElement.style.setProperty('--accent', getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#2dd4bf');
    if(colorToggle) colorToggle.textContent = '🎨';
  }
  if(colorToggle){
    colorToggle.addEventListener('click', ()=>{
      const isDynamic = document.body.classList.toggle('dynamic-colors');
      if(isDynamic){
        localStorage.setItem(COLOR_KEY,'dynamic');
        applyPalette(palettes[paletteIndex]);
        startPaletteRotation();
        colorToggle.textContent = '🔁';
      } else {
        localStorage.removeItem(COLOR_KEY);
        stopPaletteRotation();
        // reset background and accent to defaults (respect theme)
        // remove any inline background override (revert to CSS variable from theme)
        document.documentElement.style.removeProperty('--bg');
        const themeAccent = getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#2dd4bf';
        document.documentElement.style.setProperty('--accent', themeAccent);
        colorToggle.textContent = '🎨';
      }
    });
  }

});
