// ============================================================
// CoastGuard AI — main.js  (Home page)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHeroCounters();
  initAgentModals();
  setActiveNavLink();
});

/* ── Navigation ───────────────────────────────────────────── */
function initNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (!hamburger) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('show');
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('show');
    });
  });
}

function setActiveNavLink() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ── Counter Animation ────────────────────────────────────── */
function initHeroCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const isFloat = el.dataset.count.includes('.');
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  let step = 0;

  const interval = setInterval(() => {
    step++;
    current = Math.min(current + increment, target);
    el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;
    if (step >= steps) {
      el.textContent = prefix + (isFloat ? target.toFixed(1) : target.toLocaleString()) + suffix;
      clearInterval(interval);
    }
  }, duration / steps);
}

/* ── AI Agent Modals ──────────────────────────────────────── */
function initAgentModals() {
  document.querySelectorAll('[data-agent]').forEach(btn => {
    btn.addEventListener('click', () => {
      const agentKey = btn.dataset.agent;
      openAgentModal(agentKey);
    });
  });
}

function openAgentModal(agentKey) {
  const data = window.MOCK_DATA?.agentResults?.[agentKey];
  if (!data) return;

  const overlay = document.getElementById('agentModal');
  const terminal = document.getElementById('terminalOutput');
  const resultBox = document.getElementById('terminalResult');
  const titleEl  = document.getElementById('modalTitle');

  titleEl.textContent = data.title;
  terminal.innerHTML = '';
  resultBox.classList.add('hidden');
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';

  const lines = [
    '> INITIALIZING AI AGENT...',
    '> Loading coastal sensor data...',
    '> Analyzing demo dataset...',
    '> Evaluating risk parameters...',
    '> Cross-referencing historical patterns...',
    '> Generating recommendations...',
    '> ANALYSIS COMPLETE ✓'
  ];

  let i = 0;
  function showLine() {
    if (i >= lines.length) {
      setTimeout(() => {
        resultBox.classList.remove('hidden');
        populateResult(resultBox, data);
      }, 400);
      return;
    }
    const line = document.createElement('div');
    line.className = 'terminal-line';
    const isCmd = lines[i].startsWith('>');
    line.innerHTML = isCmd
      ? `<span class="terminal-prompt">${lines[i]}</span>`
      : `<span style="color:#94a3b8">${lines[i]}</span>`;
    terminal.appendChild(line);
    requestAnimationFrame(() => line.classList.add('show'));
    i++;
    setTimeout(showLine, i === lines.length ? 200 : 280);
  }
  setTimeout(showLine, 200);
}

function populateResult(box, data) {
  const riskColor = data.riskLevel === 'CRITICAL' ? '#fca5a5'
                  : data.riskLevel === 'HIGH'     ? '#f87171'
                  : data.riskLevel === 'MEDIUM'   ? '#fcd34d' : '#86efac';

  const rows = [
    ['Risk Level',   `<span style="color:${riskColor};font-weight:700">${data.riskLevel}</span>`],
    ['Confidence',   `${data.confidence}%`],
    ['Action',       data.action],
  ];

  if (data.windSpeed)           rows.splice(2, 0, ['Wind Speed',        data.windSpeed]);
  if (data.landfallProbability) rows.splice(3, 0, ['Landfall Prob.',     data.landfallProbability]);
  if (data.timeToLandfall)      rows.splice(4, 0, ['Time to Landfall',  data.timeToLandfall]);
  if (data.vesselsAtRisk)       rows.splice(2, 0, ['Vessels at Risk',   `${data.vesselsAtRisk} / ${data.totalVessels}`]);
  if (data.populationAtRisk)    rows.splice(2, 0, ['Population at Risk', data.populationAtRisk]);
  if (data.completionTime)      rows.splice(3, 0, ['Est. Completion',   data.completionTime]);
  if (data.gap)                 rows.splice(2, 0, ['Resource Gap',      data.gap]);
  if (data.buildingsDamaged)    rows.splice(2, 0, ['Buildings Damaged', data.buildingsDamaged]);

  box.innerHTML = `
    <div style="font-size:0.8rem;color:#4ade80;margin-bottom:0.75rem;font-weight:700">── ANALYSIS RESULTS ──</div>
    ${rows.map(([k,v]) => `
      <div class="terminal-result-row">
        <span class="terminal-result-label">${k}</span>
        <span class="terminal-result-val">${v}</span>
      </div>`).join('')}
    ${data.details ? `
      <div style="margin-top:0.75rem;padding-top:0.75rem;border-top:1px solid rgba(255,255,255,0.06)">
        <div style="font-size:0.75rem;color:#4ade80;margin-bottom:0.5rem">── KEY FINDINGS ──</div>
        ${data.details.map(d => `<div style="font-size:0.78rem;color:#94a3b8;margin-bottom:3px">• ${d}</div>`).join('')}
      </div>` : ''}
    <div style="margin-top:0.75rem;font-size:0.72rem;color:#64748b;text-align:center">⚠ SIMULATED RESULT — NOT REAL EMERGENCY DATA</div>
  `;
}

/* ── Modal Close ─────────────────────────────────────────── */
document.addEventListener('click', (e) => {
  if (e.target.matches('.modal-close') || e.target.matches('.modal-overlay')) {
    document.querySelectorAll('.modal-overlay').forEach(o => {
      o.classList.remove('show');
    });
    document.body.style.overflow = '';
  }
});
