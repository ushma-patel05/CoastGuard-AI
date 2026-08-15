// ============================================================
// CoastGuard AI — risk-map.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  setActiveNavLink();
  renderMap();
  renderDistrictList();
  initFilters();
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

/* ── SVG Gujarat Coastline Map ───────────────────────────── */
function renderMap() {
  const svg = document.getElementById('gujaratMap');
  if (!svg) return;

  // Sea/water background
  svg.innerHTML = `
    <!-- Sea Background -->
    <rect x="0" y="0" width="380" height="300" fill="rgba(6,182,212,0.06)" rx="4"/>

    <!-- Coastline path (stylized) -->
    <path d="M 80 50 L 95 80 L 85 100 L 75 120 L 90 140 L 105 165 L 120 182 L 128 200 L 138 218
             L 152 228 L 168 235 L 188 235 L 205 228 L 222 218 L 240 208 L 258 208 L 272 218
             L 278 235 L 280 260"
      fill="none" stroke="rgba(6,182,212,0.25)" stroke-width="1.5" stroke-dasharray="4,3"/>

    <!-- Arabian Sea label -->
    <text x="35" y="200" font-family="system-ui" font-size="10" fill="rgba(6,182,212,0.4)" font-style="italic">Arabian</text>
    <text x="38" y="213" font-family="system-ui" font-size="10" fill="rgba(6,182,212,0.4)" font-style="italic">Sea</text>

    <!-- Gulf of Kutch label -->
    <text x="115" y="128" font-family="system-ui" font-size="8" fill="rgba(6,182,212,0.35)" font-style="italic">Gulf of</text>
    <text x="112" y="138" font-family="system-ui" font-size="8" fill="rgba(6,182,212,0.35)" font-style="italic">Kutch</text>

    <!-- Gulf of Khambhat label -->
    <text x="225" y="185" font-family="system-ui" font-size="8" fill="rgba(6,182,212,0.35)" font-style="italic" transform="rotate(-60,225,185)">Gulf of Khambhat</text>
  `;

  // Draw districts
  window.MOCK_DATA.districts.forEach(d => {
    const riskClass = `risk-${d.risk.toLowerCase()}`;
    const size = d.risk === 'CRITICAL' ? 22 : d.risk === 'HIGH' ? 20 : d.risk === 'MEDIUM' ? 18 : 16;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'district-region');
    g.setAttribute('data-id', d.id);
    g.setAttribute('tabindex', '0');
    g.setAttribute('aria-label', d.name);

    // Shape: hexagon-ish polygon
    const pts = hexPoints(d.x, d.y, size).join(' ');
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', pts);
    polygon.setAttribute('class', riskClass);

    // Label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', d.x);
    text.setAttribute('y', d.y + 28);
    text.setAttribute('class', 'district-label');
    text.setAttribute('text-anchor', 'middle');
    const shortName = d.name.length > 10 ? d.name.substring(0, 9) + '…' : d.name;
    text.textContent = shortName;

    // Risk dot
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', d.x);
    dot.setAttribute('cy', d.y);
    dot.setAttribute('r', '4');
    dot.setAttribute('fill', riskColor(d.risk));
    dot.setAttribute('opacity', '0.9');

    g.appendChild(polygon);
    g.appendChild(dot);
    g.appendChild(text);

    g.addEventListener('click', () => showDistrictDetail(d.id));
    g.addEventListener('keydown', e => { if (e.key === 'Enter') showDistrictDetail(d.id); });
    svg.appendChild(g);
  });

  // Cyclone marker
  const cycloneG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  cycloneG.innerHTML = `
    <circle cx="50" cy="60" r="18" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.6"/>
    <circle cx="50" cy="60" r="10" fill="rgba(239,68,68,0.15)" stroke="#ef4444" stroke-width="1"/>
    <text x="50" y="64" text-anchor="middle" font-family="system-ui" font-size="11" fill="#ef4444">🌀</text>
    <text x="50" y="90" text-anchor="middle" font-family="system-ui" font-size="8" fill="#fca5a5">VAYU-2</text>
  `;
  svg.appendChild(cycloneG);

  // Legend
  const legendG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  legendG.innerHTML = `
    <rect x="4" y="255" width="90" height="42" rx="4" fill="rgba(13,21,42,0.8)" stroke="rgba(6,182,212,0.2)" stroke-width="0.5"/>
    ${[['CRITICAL','#dc2626'],['HIGH','#ef4444'],['MEDIUM','#f59e0b'],['LOW','#22c55e']].map(([l,c],i) => `
      <circle cx="14" cy="${263 + i*9}" r="3" fill="${c}"/>
      <text x="20" y="${267 + i*9}" font-family="system-ui" font-size="7.5" fill="#94a3b8">${l}</text>`).join('')}
  `;
  svg.appendChild(legendG);
}

function hexPoints(cx, cy, r) {
  return Array.from({length: 6}, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);
    return `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`;
  });
}

function riskColor(risk) {
  return risk === 'CRITICAL' ? '#dc2626'
       : risk === 'HIGH'     ? '#ef4444'
       : risk === 'MEDIUM'   ? '#f59e0b'
       : '#22c55e';
}

/* ── District Detail Panel ───────────────────────────────── */
function showDistrictDetail(id) {
  const d = window.MOCK_DATA.districts.find(x => x.id === id);
  if (!d) return;

  // Highlight on map
  document.querySelectorAll('.district-region').forEach(g => g.style.opacity = '0.45');
  const selected = document.querySelector(`[data-id="${id}"]`);
  if (selected) selected.style.opacity = '1';

  const panel = document.getElementById('districtDetail');
  if (!panel) return;

  const riskBadge = `<span class="badge badge-${d.risk.toLowerCase()}">${d.risk}</span>`;
  const evacuPct  = d.evacuation;
  const evacuCls  = evacuPct > 60 ? 'progress-safe' : evacuPct > 30 ? 'progress-warn' : 'progress-high';
  const action    = d.risk === 'CRITICAL' ? 'Immediate mandatory evacuation. All residents to proceed to designated shelters now.'
                  : d.risk === 'HIGH'     ? 'Begin evacuation preparation. Coastal zones to evacuate within 12 hours.'
                  : d.risk === 'MEDIUM'   ? 'Stay on alert. Prepare evacuation bags. Monitor official channels.'
                  : 'Monitor updates. No immediate evacuation required at this time.';

  panel.innerHTML = `
    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1.5rem;gap:1rem">
      <div>
        <div style="font-size:0.72rem;color:var(--cyan);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px">Selected District</div>
        <h3 style="margin:0;font-size:1.2rem">${d.name}</h3>
      </div>
      ${riskBadge}
    </div>

    <div class="grid-2" style="gap:0.75rem;margin-bottom:1.25rem">
      ${[
        ['Population', (d.population/1000000).toFixed(1)+'M', 'var(--white)'],
        ['Wind Speed', d.windSpeed+' km/h', 'var(--high)'],
        ['Fishermen', d.fishermen.toLocaleString(), 'var(--warn)'],
        ['Shelters', d.shelters, 'var(--safe)'],
      ].map(([l,v,c]) => `
        <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:0.75rem;text-align:center">
          <div style="font-size:1.2rem;font-weight:800;color:${c}">${v}</div>
          <div style="font-size:0.72rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.06em">${l}</div>
        </div>`).join('')}
    </div>

    <div style="margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;margin-bottom:5px">
        <span style="font-size:0.82rem;font-weight:600">Evacuation Progress</span>
        <span style="font-size:0.82rem;color:var(--muted)">${evacuPct}%</span>
      </div>
      <div class="progress-wrap">
        <div class="progress-bar ${evacuCls}" style="width:${evacuPct}%"></div>
      </div>
    </div>

    <div style="background:rgba(6,182,212,0.06);border:1px solid rgba(6,182,212,0.15);border-radius:8px;padding:1rem;margin-bottom:1rem">
      <div style="font-size:0.72rem;color:var(--cyan);margin-bottom:4px;text-transform:uppercase;letter-spacing:0.06em">Recommended Action</div>
      <div style="font-size:0.85rem;line-height:1.6">${action}</div>
    </div>

    <div style="font-size:0.72rem;color:var(--muted);text-align:center">⚠ ALL DATA IS SIMULATED — NOT REAL EMERGENCY INFORMATION</div>
  `;
}

/* ── District List ───────────────────────────────────────── */
let currentFilter = 'ALL';

function renderDistrictList(filter = 'ALL') {
  const container = document.getElementById('districtList');
  if (!container) return;
  const data = filter === 'ALL'
    ? window.MOCK_DATA.districts
    : window.MOCK_DATA.districts.filter(d => d.risk === filter);

  container.innerHTML = data.map(d => `
    <div class="card" style="padding:0.75rem 1rem;cursor:pointer;margin-bottom:0.5rem"
         onclick="showDistrictDetail('${d.id}')">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="font-weight:700;font-size:0.88rem">${d.name}</div>
          <div style="font-size:0.75rem;color:var(--muted)">${(d.population/1000000).toFixed(1)}M pop · ${d.fishermen.toLocaleString()} fishermen</div>
        </div>
        <span class="badge badge-${d.risk.toLowerCase()}">${d.risk}</span>
      </div>
    </div>`).join('');

  if (!data.length) {
    container.innerHTML = `<div style="text-align:center;color:var(--muted);padding:2rem;font-size:0.88rem">No districts match this filter.</div>`;
  }
}

function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      currentFilter = f;
      renderDistrictList(f);
      // Reset map opacity
      document.querySelectorAll('.district-region').forEach(g => g.style.opacity = '1');
    });
  });
}
