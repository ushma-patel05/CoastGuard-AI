// ============================================================
// CoastGuard AI — agents.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  setActiveNavLink();
  initAgentButtons();
});

function initNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (!hamburger) return;
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('show');
  });
}
function setActiveNavLink() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
}

const AGENT_DEFS = [
  {
    key: 'cyclone',
    num: '01',
    name: 'Cyclone Intelligence Agent',
    icon: '🌀',
    desc: 'Monitors cyclone formation, trajectory prediction, intensity classification, and landfall probability for the Arabian Sea and Gujarat coastline.',
    metrics: ['Wind Speed','Pressure','Direction','Intensity','Landfall %'],
    capabilities: [
      'Real-time intensity tracking',
      'Trajectory prediction modeling',
      'Landfall probability estimation',
      'Category classification (1–5)',
      'Multi-district impact assessment',
    ]
  },
  {
    key: 'fishermen',
    num: '02',
    name: 'Fishermen Safety Agent',
    icon: '⚓',
    desc: 'Tracks fishing vessel positions, evaluates danger zones, and generates personalized safety alerts for vessels at sea during adverse weather.',
    metrics: ['Vessels Tracked','Danger Zone','At Risk','Recalled','Safe'],
    capabilities: [
      'Vessel proximity to cyclone tracking',
      'Automatic recall alert generation',
      'Coast Guard dispatch coordination',
      'Emergency beacon monitoring',
      'Route-to-safety optimization',
    ]
  },
  {
    key: 'evacuation',
    num: '03',
    name: 'Evacuation Planner Agent',
    icon: '🗺️',
    desc: 'Analyzes population distribution, shelter capacity, evacuation routes, and traffic to generate optimal phased evacuation plans.',
    metrics: ['Population','Shelters','Routes','Traffic','Priority'],
    capabilities: [
      'Zone-based evacuation priority',
      'Shelter capacity optimization',
      'Route traffic analysis',
      'Special needs population tracking',
      'Phased evacuation scheduling',
    ]
  },
  {
    key: 'relief',
    num: '04',
    name: 'Relief Coordinator Agent',
    icon: '🏥',
    desc: 'Optimizes distribution of food, medical supplies, rescue assets, and shelter resources across affected districts.',
    metrics: ['Food','Medical','Boats','Shelters','Water'],
    capabilities: [
      'Resource gap identification',
      'Optimal distribution routing',
      'Pre-positioning recommendations',
      'Demand forecasting by district',
      'Inter-agency coordination simulation',
    ]
  },
  {
    key: 'damage',
    num: '05',
    name: 'Damage Assessment Agent',
    icon: '📊',
    desc: 'Analyzes post-cyclone damage across buildings, roads, agriculture, and infrastructure to prioritize recovery operations.',
    metrics: ['Buildings','Roads','Agriculture','Infrastructure','Severity'],
    capabilities: [
      'Structure damage classification',
      'Road network disruption mapping',
      'Agricultural loss estimation',
      'Critical infrastructure assessment',
      'Recovery priority ranking',
    ]
  }
];

function initAgentButtons() {
  renderAgentCards();
  document.addEventListener('click', e => {
    if (e.target.closest('[data-agent-run]')) {
      const key = e.target.closest('[data-agent-run]').dataset.agentRun;
      runAgent(key);
    }
    if (e.target.matches('.modal-close') || e.target.matches('.modal-overlay')) {
      document.querySelectorAll('.modal-overlay').forEach(o => o.classList.remove('show'));
      document.body.style.overflow = '';
    }
  });
}

function renderAgentCards() {
  const container = document.getElementById('agentCardsContainer');
  if (!container) return;

  container.innerHTML = AGENT_DEFS.map(a => `
    <div class="card agent-card" id="agentCard_${a.key}">
      <div class="agent-number">${a.num}</div>
      <div style="font-size:2rem;margin-bottom:0.5rem">${a.icon}</div>
      <div class="agent-name">${a.name}</div>
      <div class="agent-desc">${a.desc}</div>
      <div class="agent-metrics">
        ${a.metrics.map(m => `<span class="agent-metric">${m}</span>`).join('')}
      </div>
      <div class="agent-status-bar">
        <div>
          <span class="agent-status-dot" id="dot_${a.key}"></span>
          <span id="statusLabel_${a.key}" style="font-size:0.8rem;font-weight:600;color:var(--safe)">READY</span>
        </div>
        <span style="font-size:0.75rem;color:var(--muted)">DEMO MODE</span>
      </div>
      <div class="sep" style="margin:0.75rem 0"></div>
      <div style="margin-bottom:1rem">
        <div style="font-size:0.75rem;color:var(--muted);margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.06em">Capabilities</div>
        ${a.capabilities.map(c => `
          <div style="display:flex;align-items:flex-start;gap:6px;margin-bottom:4px">
            <span style="color:var(--cyan);font-size:0.75rem;margin-top:2px">◈</span>
            <span style="font-size:0.82rem;color:var(--muted)">${c}</span>
          </div>`).join('')}
      </div>
      <button class="btn btn-primary btn-full" data-agent-run="${a.key}">
        ▶ Run Demo Analysis
      </button>
    </div>`).join('');
}

function runAgent(key) {
  const data = window.MOCK_DATA?.agentResults?.[key];
  const def  = AGENT_DEFS.find(a => a.key === key);
  if (!data || !def) return;

  // Update card status
  const dot   = document.getElementById('dot_' + key);
  const label = document.getElementById('statusLabel_' + key);
  if (dot && label) {
    dot.classList.add('analyzing');
    label.textContent = 'ANALYZING';
    label.style.color = 'var(--cyan)';
  }

  openAnalysisModal(def, data, () => {
    if (dot && label) {
      dot.classList.remove('analyzing');
      label.textContent = 'COMPLETE';
      label.style.color = 'var(--safe)';
    }
  });
}

function openAnalysisModal(def, data, onComplete) {
  const overlay = document.getElementById('agentModal');
  const terminal = document.getElementById('terminalOutput');
  const resultBox = document.getElementById('terminalResult');
  const titleEl   = document.getElementById('modalTitle');

  if (!overlay) return;

  titleEl.textContent = def.name + ' — Analysis';
  terminal.innerHTML  = '';
  resultBox.classList.add('hidden');
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';

  const lines = [
    `> INITIALIZING ${def.name.toUpperCase()}...`,
    '> Loading coastal sensor data...',
    '> Importing historical patterns...',
    '> Running simulation model...',
    '> Evaluating risk parameters...',
    '> Cross-referencing district data...',
    '> Optimizing recommendations...',
    '> ANALYSIS COMPLETE ✓'
  ];

  let i = 0;
  function showLine() {
    if (i >= lines.length) {
      setTimeout(() => {
        resultBox.classList.remove('hidden');
        populateResult(resultBox, data);
        onComplete && onComplete();
      }, 400);
      return;
    }
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `<span class="terminal-prompt">${lines[i]}</span>`;
    terminal.appendChild(line);
    requestAnimationFrame(() => line.classList.add('show'));
    i++;
    setTimeout(showLine, 260);
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
    ['Recommended Action', data.action],
  ];
  if (data.windSpeed)           rows.splice(2,0,['Wind Speed',        data.windSpeed]);
  if (data.landfallProbability) rows.splice(3,0,['Landfall Prob.',     data.landfallProbability]);
  if (data.timeToLandfall)      rows.splice(4,0,['Time to Landfall',  data.timeToLandfall]);
  if (data.vesselsAtRisk)       rows.splice(2,0,['Vessels at Risk',   `${data.vesselsAtRisk} / ${data.totalVessels}`]);
  if (data.populationAtRisk)    rows.splice(2,0,['Population at Risk', data.populationAtRisk]);
  if (data.completionTime)      rows.splice(3,0,['Est. Completion',   data.completionTime]);
  if (data.gap)                 rows.splice(2,0,['Resource Gap',      data.gap]);
  if (data.buildingsDamaged)    rows.splice(2,0,['Buildings Damaged', data.buildingsDamaged]);

  box.innerHTML = `
    <div style="font-size:0.8rem;color:#4ade80;margin-bottom:0.75rem;font-weight:700">── ANALYSIS RESULTS ──</div>
    ${rows.map(([k,v]) => `
      <div class="terminal-result-row">
        <span class="terminal-result-label" style="max-width:40%">${k}</span>
        <span class="terminal-result-val" style="max-width:58%;text-align:right">${v}</span>
      </div>`).join('')}
    ${data.details ? `
      <div style="margin-top:0.75rem;padding-top:0.75rem;border-top:1px solid rgba(255,255,255,0.06)">
        <div style="font-size:0.75rem;color:#4ade80;margin-bottom:0.5rem">── KEY FINDINGS ──</div>
        ${data.details.map(d => `<div style="font-size:0.78rem;color:#94a3b8;margin-bottom:3px">• ${d}</div>`).join('')}
      </div>` : ''}
    <div style="margin-top:0.75rem;font-size:0.72rem;color:#64748b;text-align:center">⚠ SIMULATED RESULT — NOT REAL EMERGENCY DATA</div>
  `;
}
