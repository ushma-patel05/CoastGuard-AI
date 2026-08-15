// ============================================================
// CoastGuard AI — emergency.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  setActiveNavLink();
  initChecklist();
  initEvacPlanner();
  initVessels();
  initResources();
  initDamageAssessment();
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

/* ── Checklist ───────────────────────────────────────────── */
function initChecklist() {
  document.querySelectorAll('.checklist-item').forEach(item => {
    item.addEventListener('click', () => {
      const cb = item.querySelector('.checklist-cb');
      cb.classList.toggle('checked');
      item.classList.toggle('done');
    });
  });
}

/* ── Evacuation Planner ──────────────────────────────────── */
function initEvacPlanner() {
  const btn = document.getElementById('calcEvacBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const districtSel = document.getElementById('evacDistrict');
    const popInput    = document.getElementById('evacPopulation');
    const riskSel     = document.getElementById('evacRisk');

    const district  = districtSel?.value || 'Kutch';
    const pop       = parseInt(popInput?.value) || 50000;
    const riskLevel = riskSel?.value || 'HIGH';

    // Find nearest shelter for district
    const shelter = window.MOCK_DATA.shelters.find(s => s.district === district)
                 || window.MOCK_DATA.shelters[0];

    // Simulate calculation
    btn.disabled = true;
    btn.textContent = 'Calculating…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = '▶ Calculate Evacuation Plan';
      showEvacResult(district, pop, riskLevel, shelter);
    }, 1500);
  });
}

function showEvacResult(district, pop, risk, shelter) {
  const result = document.getElementById('evacResult');
  if (!result) return;

  const waves    = risk === 'CRITICAL' ? 1 : risk === 'HIGH' ? 2 : 3;
  const priority = risk === 'CRITICAL' ? 'IMMEDIATE' : risk === 'HIGH' ? 'HIGH' : 'MEDIUM';
  const busCount = Math.ceil(pop / 45);
  const timeMin  = Math.max(9, Math.round((shelter.distance / 40) * 60));

  result.classList.add('show');
  result.innerHTML = `
    <div style="border:1px solid rgba(6,182,212,0.2);border-radius:10px;overflow:hidden;margin-top:1rem">
      <div style="background:rgba(6,182,212,0.1);padding:0.75rem 1rem;display:flex;align-items:center;justify-content:space-between">
        <span style="font-size:0.82rem;font-weight:700;color:var(--cyan);text-transform:uppercase;letter-spacing:0.06em">Evacuation Plan — ${district}</span>
        <span class="badge badge-${risk.toLowerCase()}">${risk}</span>
      </div>
      <div style="padding:1rem">
        ${[
          ['Recommended Shelter',  shelter.name],
          ['Distance',             shelter.distance + ' km'],
          ['Travel Time',          timeMin + ' minutes'],
          ['Shelter Capacity',     shelter.capacity.toLocaleString()],
          ['Route Status',         shelter.route],
          ['Evacuation Priority',  priority],
          ['Estimated Buses',      busCount + ' buses'],
          ['Evacuation Waves',     waves + (waves===1?' (immediate)':' phases')],
        ].map(([k,v]) => `
          <div class="evac-row">
            <span class="evac-key">${k}</span>
            <span class="evac-val">${v}</span>
          </div>`).join('')}
        <div style="margin-top:0.75rem;font-size:0.72rem;color:var(--muted);text-align:center">⚠ SIMULATED PLAN — NOT REAL EMERGENCY GUIDANCE</div>
      </div>
    </div>`;
}

/* ── Vessels ─────────────────────────────────────────────── */
function initVessels() {
  renderVessels();
  document.addEventListener('click', e => {
    const card = e.target.closest('[data-vessel-id]');
    if (card) showVesselDetail(card.dataset.vesselId);
    if (e.target.matches('.modal-close') || e.target.matches('.modal-overlay')) {
      document.querySelectorAll('.modal-overlay').forEach(o => o.classList.remove('show'));
      document.body.style.overflow = '';
    }
  });
}

function renderVessels() {
  const container = document.getElementById('vesselContainer');
  if (!container) return;

  container.innerHTML = window.MOCK_DATA.vessels.map(v => {
    const statusCls = v.status === 'SAFE'      ? 'vessel-safe'
                    : v.status === 'WARNING'   ? 'vessel-warning'
                    : 'vessel-highrisk';
    const badgeCls  = v.status === 'SAFE'      ? 'badge-safe'
                    : v.status === 'WARNING'   ? 'badge-warn'
                    : 'badge-high';
    return `
      <div class="card vessel-card" data-vessel-id="${v.id}" style="cursor:pointer">
        <div class="vessel-indicator ${statusCls}"></div>
        <div style="flex:1">
          <div class="vessel-name">${v.name}</div>
          <div class="vessel-sub">${v.district} · ${v.crew} crew · ${v.distance}nm offshore</div>
        </div>
        <div>
          <span class="badge ${badgeCls}">${v.status}</span>
          <div style="font-size:0.7rem;color:var(--muted);text-align:right;margin-top:2px">${v.lastContact}</div>
        </div>
      </div>`;
  }).join('');
}

function showVesselDetail(id) {
  const v = window.MOCK_DATA.vessels.find(x => x.id === id);
  if (!v) return;

  const overlay = document.getElementById('vesselModal');
  const body    = document.getElementById('vesselModalBody');
  if (!overlay || !body) return;

  const statusColor = v.status === 'SAFE' ? 'var(--safe)'
                    : v.status === 'WARNING' ? 'var(--warn)'
                    : 'var(--high)';

  const action = v.status === 'HIGH RISK'
    ? 'IMMEDIATE RECALL: Vessel ordered to return to nearest port. Coast Guard dispatch authorized.'
    : v.status === 'WARNING'
    ? 'ADVISORY: Return to safe harbour within 2 hours. Monitor weather channel 16.'
    : 'All clear. Continue monitoring. Return before advisory zone expands.';

  body.innerHTML = `
    <div style="text-align:center;margin-bottom:1.5rem">
      <div style="font-size:2rem;margin-bottom:0.5rem">🚢</div>
      <div style="font-size:1.2rem;font-weight:700">${v.name}</div>
      <div style="font-size:0.82rem;color:${statusColor};font-weight:700;margin-top:4px">${v.status}</div>
    </div>
    <div class="grid-2" style="gap:0.75rem;margin-bottom:1.25rem">
      ${[
        ['District',      v.district],
        ['Crew Members',  v.crew],
        ['Offshore Dist.',v.distance + ' nm'],
        ['Last Contact',  v.lastContact],
        ['Latitude',      v.lat + '° N'],
        ['Longitude',     v.lon + '° E'],
      ].map(([l,val]) => `
        <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:0.75rem">
          <div style="font-size:0.7rem;color:var(--muted);text-transform:uppercase;margin-bottom:2px">${l}</div>
          <div style="font-weight:700;font-size:0.9rem">${val}</div>
        </div>`).join('')}
    </div>
    <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:8px;padding:1rem;margin-bottom:1rem">
      <div style="font-size:0.72rem;color:var(--warn);margin-bottom:4px;text-transform:uppercase;letter-spacing:0.06em">Action Required</div>
      <div style="font-size:0.85rem;line-height:1.6">${action}</div>
    </div>
    <div style="font-size:0.72rem;color:var(--muted);text-align:center">⚠ FICTIONAL DEMO VESSEL DATA — NOT REAL</div>
  `;

  document.getElementById('vesselModalTitle').textContent = v.name + ' — Details';
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

/* ── Resources ───────────────────────────────────────────── */
function initResources() {
  renderResources();
  const btn = document.getElementById('optimizeBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Optimizing…';
    setTimeout(() => {
      optimizeResources();
      btn.disabled = false;
      btn.textContent = '✓ Optimization Complete';
      btn.style.background = 'linear-gradient(135deg, #15803d, #22c55e)';
      setTimeout(() => {
        btn.textContent = '▶ Optimize Resources';
        btn.style.background = '';
      }, 4000);
    }, 2000);
  });
}

function renderResources() {
  const el = document.getElementById('resourceDisplay');
  if (!el) return;
  el.innerHTML = window.MOCK_DATA.resources.map(r => {
    const pct = Math.round((r.available / r.required) * 100);
    const cls = r.status === 'READY' ? 'progress-safe' : 'progress-warn';
    const badgeCls = r.status === 'READY' ? 'badge-safe' : 'badge-warn';
    return `
      <div class="resource-item">
        <div class="resource-header">
          <span class="resource-name">${r.name}</span>
          <span class="badge ${badgeCls}">${r.status}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:5px">
          <span class="resource-nums">Available: ${r.available.toLocaleString()} ${r.unit}</span>
          <span class="resource-nums">Required: ${r.required.toLocaleString()} ${r.unit}</span>
        </div>
        <div class="progress-wrap">
          <div class="progress-bar ${cls}" id="resPbar_${r.id}" style="width:${Math.min(pct,100)}%"></div>
        </div>
      </div>`;
  }).join('');
}

function optimizeResources() {
  // Simulate optimization — slightly improve numbers
  window.MOCK_DATA.resources.forEach(r => {
    if (r.status === 'WARNING') {
      r.available = Math.min(r.available + Math.floor(r.required * 0.12), r.required + 100);
      r.status = r.available >= r.required ? 'READY' : 'WARNING';
    }
  });
  renderResources();

  const note = document.getElementById('optimizeNote');
  if (note) {
    note.textContent = 'Resource reallocation complete. Additional supplies dispatched from state reserves. (SIMULATED)';
    note.style.display = 'block';
  }
}

/* ── Damage Assessment ────────────────────────────────────── */
function initDamageAssessment() {
  const fileInput  = document.getElementById('damageImageInput');
  const dropZone   = document.getElementById('dropZone');
  const preview    = document.getElementById('imagePreview');
  const runBtn     = document.getElementById('runDamageBtn');
  const resultEl   = document.getElementById('damageResult');

  if (!fileInput) return;

  // Click to open file
  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) loadPreview(file);
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) loadPreview(file);
  });

  function loadPreview(file) {
    const reader = new FileReader();
    reader.onload = ev => {
      preview.innerHTML = `
        <div style="margin-top:1rem">
          <img src="${ev.target.result}" alt="Preview" style="max-width:100%;max-height:220px;border-radius:8px;border:1px solid var(--card-border)"/>
          <div style="font-size:0.78rem;color:var(--muted);margin-top:6px">${file.name} (${(file.size/1024).toFixed(1)} KB)</div>
        </div>`;
      runBtn.disabled = false;
      resultEl.innerHTML = '';
      resultEl.classList.remove('show');
    };
    reader.readAsDataURL(file);
  }

  runBtn.addEventListener('click', () => {
    runBtn.disabled = true;
    runBtn.innerHTML = '<span class="spinner"></span> Analyzing…';
    resultEl.classList.remove('show');
    resultEl.innerHTML = '';

    const steps = [
      'Uploading demo image…',
      'Preprocessing satellite imagery…',
      'Analyzing structural damage patterns…',
      'Classifying damage severity…',
      'Generating assessment report…',
    ];

    let idx = 0;
    let logHTML = '';
    function showStep() {
      if (idx >= steps.length) {
        setTimeout(() => showDamageResult(), 600);
        return;
      }
      logHTML += `<div style="color:#67e8f9;font-size:0.82rem;margin-bottom:4px;font-family:monospace">> ${steps[idx]}</div>`;
      resultEl.innerHTML = `<div class="terminal" style="margin-bottom:1rem">${logHTML}</div>`;
      resultEl.classList.add('show');
      idx++;
      setTimeout(showStep, 500);
    }
    setTimeout(showStep, 200);

    function showDamageResult() {
      const dmg = window.MOCK_DATA.damageResults;
      runBtn.disabled = false;
      runBtn.textContent = '▶ Run Demo Assessment';

      resultEl.innerHTML += `
        <div style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.2);border-radius:10px;overflow:hidden">
          <div style="background:rgba(239,68,68,0.1);padding:0.75rem 1rem;display:flex;align-items:center;gap:8px">
            <span style="color:#ef4444;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em">▶ Demo Assessment Complete</span>
            <span class="badge badge-high" style="margin-left:auto">HIGH SEVERITY</span>
          </div>
          <div style="padding:1rem">
            ${dmg.map(r => `
              <div style="display:flex;justify-content:space-between;padding:0.6rem 0;border-bottom:1px solid rgba(255,255,255,0.05)">
                <span style="font-size:0.88rem;color:var(--muted)">${r.label}</span>
                <span style="font-weight:700;color:${r.severity==='HIGH'?'var(--high)':r.severity==='MEDIUM'?'var(--warn)':'var(--safe)'}">${r.value}${r.unit}</span>
              </div>`).join('')}
            <div style="margin-top:0.75rem;font-size:0.72rem;color:var(--muted);text-align:center">⚠ SIMULATED RESULT — NO REAL AI MODEL USED</div>
          </div>
        </div>`;
    }
  });
}
