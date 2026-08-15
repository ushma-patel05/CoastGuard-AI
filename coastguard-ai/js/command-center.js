// ============================================================
// CoastGuard AI — command-center.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  setActiveNavLink();
  renderAlerts();
  startLiveSimulation();
  initAlertGenerator();
  initCharts();
});

/* ── shared nav helpers ───────────────────────────────────── */
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

/* ── Render Alerts ───────────────────────────────────────── */
function renderAlerts() {
  const container = document.getElementById('alertContainer');
  if (!container) return;
  container.innerHTML = '';
  window.MOCK_DATA.alerts.forEach(a => {
    container.innerHTML += buildAlertCard(a);
  });
}

function buildAlertCard(a) {
  const cls = a.level === 'HIGH' ? 'alert-high'
            : a.level === 'WARNING' ? 'alert-warning'
            : a.level === 'WATCH'   ? 'alert-watch'
            : 'alert-info';
  return `
    <div class="alert-card ${cls}">
      <div class="alert-icon">${a.icon}</div>
      <div class="alert-body">
        <div class="alert-title">${a.title}</div>
        <div class="alert-msg">${a.msg}</div>
        <div class="alert-time">⏱ ${a.time} — SIMULATED DATA</div>
      </div>
    </div>`;
}

/* ── Live Simulation ─────────────────────────────────────── */
const liveValues = {
  windSpeed:      window.MOCK_DATA.commandCenter.windSpeed,
  riskScore:      window.MOCK_DATA.commandCenter.riskScore,
  fishermenAtRisk:window.MOCK_DATA.commandCenter.fishermenAtRisk,
  activeAlerts:   window.MOCK_DATA.commandCenter.activeAlerts,
};

function startLiveSimulation() {
  updateLiveDisplay();
  setInterval(() => {
    liveValues.windSpeed      = clamp(liveValues.windSpeed      + randInt(-4, 6),  95, 145);
    liveValues.riskScore      = clamp(liveValues.riskScore      + randInt(-2, 3),  70, 99);
    liveValues.fishermenAtRisk= clamp(liveValues.fishermenAtRisk+ randInt(-20, 15),1100,1500);
    liveValues.activeAlerts   = clamp(liveValues.activeAlerts   + randInt(-1, 1),  5, 12);
    updateLiveDisplay();
  }, 3000);

  // timestamp
  const tsEl = document.getElementById('liveTimestamp');
  if (tsEl) {
    setInterval(() => {
      tsEl.textContent = 'Last updated: ' + new Date().toLocaleTimeString() + ' (DEMO)';
    }, 1000);
  }
}

function updateLiveDisplay() {
  setEl('liveWindSpeed',    liveValues.windSpeed + ' km/h');
  setEl('liveRiskScore',    liveValues.riskScore + '%');
  setEl('liveFishermen',    liveValues.fishermenAtRisk.toLocaleString());
  setEl('liveAlerts',       liveValues.activeAlerts);
  updateWindBar(liveValues.windSpeed);
  updateRiskBar(liveValues.riskScore);
}

function updateWindBar(v) {
  const bar = document.getElementById('windBar');
  if (bar) bar.style.width = Math.min((v / 200) * 100, 100) + '%';
}
function updateRiskBar(v) {
  const bar = document.getElementById('riskBar');
  if (bar) bar.style.width = v + '%';
}

/* ── Alert Generator ─────────────────────────────────────── */
const generatedAlerts = [
  { level:'HIGH',    icon:'🔴', title:'NEW: Storm Surge Warning',          msg:'Storm surge of 2–3 m predicted for low-lying coastal areas. Immediate evacuation advised.',    time:now() },
  { level:'WARNING', icon:'🟠', title:'NEW: Fishing Vessel Recall',         msg:'All vessels within 60 nautical miles ordered back to nearest safe harbour.',                   time:now() },
  { level:'WATCH',   icon:'🟡', title:'NEW: Flash Flood Watch',             msg:'Rapid water level rise detected in coastal river deltas. Residents on alert.',                 time:now() },
  { level:'INFO',    icon:'🔵', title:'NEW: NDRF Reinforcements Arriving',  msg:'Additional 3 NDRF teams dispatched to Kutch staging area. ETA 4 hours.',                      time:now() },
  { level:'HIGH',    icon:'🔴', title:'NEW: Power Infrastructure Alert',    msg:'Critical power infrastructure in Kutch coastal zone at risk. Backup generators activated.',   time:now() },
];
let genIdx = 0;

function initAlertGenerator() {
  const btn = document.getElementById('generateAlertBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const a = generatedAlerts[genIdx % generatedAlerts.length];
    a.time = now();
    genIdx++;
    const container = document.getElementById('alertContainer');
    if (!container) return;
    container.insertAdjacentHTML('afterbegin', buildAlertCard(a));
    liveValues.activeAlerts = Math.min(liveValues.activeAlerts + 1, 20);
    setEl('liveAlerts', liveValues.activeAlerts);
  });
}

/* ── Simple SVG Charts ───────────────────────────────────── */
function initCharts() {
  renderRiskTrend();
  renderDistrictRisk();
  renderAlertActivity();
  renderResourceAlloc();
}

function renderRiskTrend() {
  const el = document.getElementById('riskTrendChart');
  if (!el) return;
  const days = ['Day -6','Day -5','Day -4','Day -3','Day -2','Day -1','Today'];
  const vals = [22, 35, 48, 61, 75, 81, 87];
  const W = 500, H = 150, pad = 40;
  const maxV = 100;
  const pts = vals.map((v, i) => {
    const x = pad + (i / (vals.length - 1)) * (W - pad * 2);
    const y = H - pad - (v / maxV) * (H - pad * 2);
    return `${x},${y}`;
  });

  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="line-chart-svg">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ef4444" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#ef4444" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <polyline fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
        points="${pts.join(' ')}"/>
      <polygon fill="url(#lineGrad)"
        points="${pts.join(' ')},${W - pad},${H - pad},${pad},${H - pad}"/>
      ${vals.map((v, i) => {
        const x = pad + (i / (vals.length - 1)) * (W - pad * 2);
        const y = H - pad - (v / maxV) * (H - pad * 2);
        return `
          <circle cx="${x}" cy="${y}" r="4" fill="#ef4444" stroke="#fff" stroke-width="1.5"/>
          <text x="${x}" y="${y - 10}" text-anchor="middle" class="chart-value">${v}</text>
          <text x="${x}" y="${H - 6}" text-anchor="middle" class="chart-label">${days[i]}</text>`;
      }).join('')}
      <!-- Y labels -->
      ${[0,25,50,75,100].map(v => {
        const y = H - pad - (v / maxV) * (H - pad * 2);
        return `<text x="${pad - 6}" y="${y + 4}" text-anchor="end" class="chart-label">${v}</text>
                <line x1="${pad}" y1="${y}" x2="${W - pad}" y2="${y}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>`;
      }).join('')}
    </svg>`;
}

function renderDistrictRisk() {
  const el = document.getElementById('districtRiskChart');
  if (!el) return;
  const districts = ['Kutch','Dwarka','Jamnagar','Porbandar','Junagadh','Gir S.','Amreli','Bhavnagar'];
  const vals      = [87, 74, 68, 82, 65, 61, 45, 38];
  const colors    = ['#ef4444','#f87171','#fb923c','#ef4444','#f59e0b','#f59e0b','#facc15','#22c55e'];
  const W = 500, H = 170, pad = 44, barW = 40, gap = 18;
  const maxV = 100;

  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="bar-chart-svg">
      ${districts.map((d, i) => {
        const x = pad + i * (barW + gap);
        const barH = ((vals[i] / maxV) * (H - pad * 2));
        const y = H - pad - barH;
        return `
          <rect class="bar" x="${x}" y="${y}" width="${barW}" height="${barH}" rx="4" fill="${colors[i]}" fill-opacity="0.7"/>
          <text x="${x + barW/2}" y="${y - 5}" text-anchor="middle" class="chart-value">${vals[i]}</text>
          <text x="${x + barW/2}" y="${H - 6}" text-anchor="middle" class="chart-label" transform="rotate(-20 ${x + barW/2} ${H - 6})">${d}</text>`;
      }).join('')}
      ${[0,25,50,75,100].map(v => {
        const y = H - pad - (v / maxV) * (H - pad * 2);
        return `<text x="${pad - 6}" y="${y + 4}" text-anchor="end" class="chart-label">${v}</text>
                <line x1="${pad}" y1="${y}" x2="${W-10}" y2="${y}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>`;
      }).join('')}
    </svg>`;
}

function renderAlertActivity() {
  const el = document.getElementById('alertActivityChart');
  if (!el) return;
  const hours  = ['06:00','08:00','10:00','12:00','14:00','16:00','18:00'];
  const counts = [1, 2, 3, 4, 7, 6, 5];
  const W = 500, H = 150, pad = 40;
  const maxV = Math.max(...counts) + 1;
  const pts = counts.map((v, i) => {
    const x = pad + (i / (counts.length - 1)) * (W - pad * 2);
    const y = H - pad - (v / maxV) * (H - pad * 2);
    return `${x},${y}`;
  });

  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="line-chart-svg">
      <defs>
        <linearGradient id="alertGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <polygon fill="url(#alertGrad)"
        points="${pts.join(' ')},${W - pad},${H - pad},${pad},${H - pad}"/>
      <polyline fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
        points="${pts.join(' ')}"/>
      ${counts.map((v, i) => {
        const x = pad + (i / (counts.length - 1)) * (W - pad * 2);
        const y = H - pad - (v / maxV) * (H - pad * 2);
        return `<circle cx="${x}" cy="${y}" r="4" fill="#f59e0b"/>
                <text x="${x}" y="${H - 6}" text-anchor="middle" class="chart-label">${hours[i]}</text>`;
      }).join('')}
    </svg>`;
}

function renderResourceAlloc() {
  const el = document.getElementById('resourceAllocChart');
  if (!el) return;
  const resources = window.MOCK_DATA.resources;
  el.innerHTML = resources.map(r => {
    const pct = Math.round((r.available / r.required) * 100);
    const cls = r.status === 'READY' ? 'progress-safe' : 'progress-warn';
    return `
      <div style="margin-bottom:1rem">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <span style="font-size:0.82rem;font-weight:600">${r.name}</span>
          <span style="font-size:0.78rem;color:var(--muted)">${r.available.toLocaleString()} / ${r.required.toLocaleString()}</span>
        </div>
        <div class="progress-wrap">
          <div class="progress-bar ${cls}" style="width:${Math.min(pct,100)}%"></div>
        </div>
      </div>`;
  }).join('');
}

/* ── Helpers ─────────────────────────────────────────────── */
function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function randInt(min, max)  { return Math.floor(Math.random() * (max - min + 1)) + min; }
function now() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
}
