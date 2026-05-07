/**
 * TimeLex — Automated Legal Time Capture
 * Copyright (c) 2026 Kone Tshivhinda
 * ASSESSMENT PROTOTYPE - NOT FOR PRODUCTION USE
 *
 * Survey insights addressed:
 * - Auto-capture (Stephanie Chetty, Emily Zawe, Anchané Botha)
 * - Draft & approve workflow (multiple respondents)
 * - Real-time target tracking (Lerato Motlhabi, Johan Biggs)
 * - Daily capture reminders (Nomonde Shelembe, Johan Biggs)  ← idle banner
 * - Invoice self-service (Anchané Botha)
 * - User-friendly UI (Tony Tshivahse)                       ← keyboard shortcuts
 * - Matter autocomplete (Dominique Varenzakis)
 */

import { ActivityType, CaptureStatus, CaptureEngine } from './capture-engine.js';
import { InvoiceGenerator }                           from './invoice-generator.js';
import { GhostPracticeIntegration }                   from './gp-integration.js';
import { showToast, initLegacyToast }                 from './utils/toast-notification.js';
import * as MatterLookup                              from './utils/matter-lookup.js';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const STORAGE_KEYS = { ENTRIES: 'timelexEntries', DRAFTS: 'timelexDrafts' };
const MONTH_TARGET = 150;   // hours
const MONTH_BASE   = 47.8;  // simulated prior hours
const DEFAULT_RATE = 3500;  // R/hour

const ACTIVITY_ICONS  = { [ActivityType.EMAIL]:'✉', [ActivityType.MEETING]:'📅', [ActivityType.DOCUMENT]:'📄', [ActivityType.CALL]:'📞', [ActivityType.RESEARCH]:'🔍' };
const ACTIVITY_LABELS = { [ActivityType.EMAIL]:'Email', [ActivityType.MEETING]:'Meeting', [ActivityType.DOCUMENT]:'Document', [ActivityType.CALL]:'Phone Call', [ActivityType.RESEARCH]:'Research' };

const CHART_COLORS = {
  email:    '#5B8EF0',
  meeting:  '#4CAF82',
  doc:      '#8B5CF6',
  call:     '#E08A3C',
  research: '#C9A84C',
  matters: ['#C9A84C','#5B8EF0','#4CAF82','#E05C5C','#8B5CF6'],
};

const MATTERS = {
  '2024/0512-LIT': { client: 'Nkosi v Absa Bank',            partner: 'Stephanie Chetty',     dept: 'Litigation'   },
  '2024/0888-LIT': { client: 'Dlamini Urgent Application',   partner: 'Stephanie Chetty',     dept: 'Litigation'   },
  '2025/0103-COM': { client: 'Motlhabi Holdings — SLA Review',partner: 'Aristidis Perivolaris',dept: 'Corporate'    },
  '2025/0217-LAB': { client: 'Perivolaris Labour Dispute',   partner: 'Johan Biggs',          dept: 'Labour'       },
  '2025/0391-CON': { client: 'Botha Property Transfer',      partner: 'Anchané Botha',        dept: 'Contractual'  },
};

// ─── STATE ────────────────────────────────────────────────────────────────────
const state = {
  capturing:      true,
  entries:        [],
  drafts:         [],
  feedItems:      [],
  feedFilter:     'all',
  entryCounter:   1,
  lastCaptureMs:  Date.now(),
  captureEngine:  null,
  gpIntegration:  null,
};

// ─── ASSESSMENT GUARD ─────────────────────────────────────────────────────────
// FIXED: was midnight UTC May 7 (= 2AM SAST) — now end-of-day May 8 SAST
function assessmentIsActive() {
  return new Date() < new Date('2026-05-08T23:59:59+02:00');
}

// ─── localStorage PERSISTENCE ─────────────────────────────────────────────────
function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(state.entries));
    localStorage.setItem(STORAGE_KEYS.DRAFTS,  JSON.stringify(state.drafts));
  } catch (_) { /* storage unavailable */ }
}

function loadFromStorage() {
  try {
    const e = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    const d = localStorage.getItem(STORAGE_KEYS.DRAFTS);
    if (e) state.entries = JSON.parse(e);
    if (d) state.drafts  = JSON.parse(d);
  } catch (_) { /* corrupt data — fall through to seed */ }
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function nowTime() {
  return new Date().toLocaleTimeString('en-ZA', { hour:'2-digit', minute:'2-digit' });
}

function todayHours() {
  return state.entries
    .filter(e => e.billable && e.status === 'approved')
    .reduce((s, e) => s + e.units * 0.1, 0);
}

function safeSet(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function escHtml(s = '') {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── STATS ────────────────────────────────────────────────────────────────────
function updateStats() {
  const today  = todayHours();
  const total  = MONTH_BASE + today;
  const pct    = Math.min((total / MONTH_TARGET) * 100, 100);
  const remain = Math.max(MONTH_TARGET - total, 0);

  const activeMatterSet = new Set(state.entries.filter(e => e.billable && e.status === 'approved').map(e => e.matter));

  safeSet('stat-today',       today.toFixed(1) + ' h');
  safeSet('stat-today-units', Math.round(today * 10) + ' units');
  safeSet('stat-month',       total.toFixed(1) + ' h');
  safeSet('stat-pending',     String(state.drafts.length));
  safeSet('stat-matters',     String(activeMatterSet.size));
  safeSet('target-pct',       pct.toFixed(1) + '%');
  safeSet('target-billed',    total.toFixed(1) + ' h billed');
  safeSet('target-remaining', remain.toFixed(1) + ' h remaining');

  const fill = document.getElementById('progress-fill');
  if (fill) fill.style.width = pct.toFixed(1) + '%';
}

// ─── FEED RENDERING ───────────────────────────────────────────────────────────
function feedItemHTML(item) {
  const hidden = state.feedFilter !== 'all' && item.type !== state.feedFilter ? ' style="display:none"' : '';
  return `<div class="feed-item"${hidden}>
    <div class="feed-icon ${item.type}">${item.icon}</div>
    <div class="feed-body">
      <div class="feed-title">${escHtml(item.title)}</div>
      <div class="feed-meta">${item.label} · ${item.units} unit${item.units !== 1 ? 's' : ''} · <span class="matter-tag">${item.matter}</span></div>
    </div>
    <div class="feed-time">${item.time}</div>
  </div>`;
}

function renderFeed() {
  const el = document.getElementById('feed-list');
  if (!el) return;
  el.innerHTML = state.feedItems.length === 0
    ? '<div class="feed-empty">Monitoring your Outlook, calendar and documents…</div>'
    : state.feedItems.slice(0, 15).map(feedItemHTML).join('');
}

function renderCaptureFeed() {
  const el = document.getElementById('capture-feed');
  if (!el) return;
  el.innerHTML = state.feedItems.length === 0
    ? '<div class="feed-empty">Awaiting activity detection…</div>'
    : state.feedItems.map(feedItemHTML).join('');
}

// ─── FEED FILTER ──────────────────────────────────────────────────────────────
function initFeedFilter() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.feedFilter = btn.dataset.filter;
      renderFeed();
    });
  });
}

// ─── DRAFTS ───────────────────────────────────────────────────────────────────
function addFeedItem(activityOrEngine, title, units, matter) {
  let icon, label, narration;

  if (activityOrEngine.narration) {
    icon      = ACTIVITY_ICONS[activityOrEngine.type]  || '•';
    label     = ACTIVITY_LABELS[activityOrEngine.type] || 'Activity';
    narration = activityOrEngine.narration;
    title     = activityOrEngine.title;
    units     = activityOrEngine.units;
    matter    = activityOrEngine.matter;
  } else {
    icon      = activityOrEngine.icon;
    label     = activityOrEngine.label;
    narration = typeof activityOrEngine.narrationFn === 'function'
      ? activityOrEngine.narrationFn(title) : title;
  }

  state.feedItems.unshift({
    icon, label, type: activityOrEngine.type || 'email',
    title, units, matter, time: nowTime(), id: Date.now(),
  });
  renderFeed();
  renderCaptureFeed();

  state.drafts.unshift({
    id: 'D' + (state.entryCounter++),
    type: label, icon, title, narration, units, matter,
    billable: true, time: nowTime(),
  });
  renderDrafts();
  updateStats();
}

function renderDrafts() {
  const el = document.getElementById('draft-list');
  if (!el) return;
  if (state.drafts.length === 0) {
    el.innerHTML = '<div class="feed-empty">No pending entries</div>';
    return;
  }
  el.innerHTML = state.drafts.map(d => `
    <div class="draft-item" id="draft-${d.id}">
      <div class="draft-header">
        <span class="draft-type">${d.icon} ${d.type}</span>
        <span class="draft-units">${d.units} unit${d.units !== 1 ? 's' : ''} · ${d.time}</span>
      </div>
      <div class="draft-narration">${escHtml(d.narration)}</div>
      <div class="draft-matter-row">
        <input class="draft-matter-input" list="matters-list"
          value="${escHtml(d.matter)}" id="dm-${d.id}" placeholder="Matter #" />
        <button class="btn-approve" onclick="App.approveDraft('${d.id}')">✓ Approve</button>
        <button class="btn-discard" onclick="App.discardDraft('${d.id}')">✕</button>
      </div>
    </div>`).join('');
}

function approveDraft(id) {
  const idx = state.drafts.findIndex(d => d.id === id);
  if (idx === -1) return;
  const draft = { ...state.drafts[idx] };
  const inputEl = document.getElementById('dm-' + id);
  if (inputEl) draft.matter = inputEl.value.trim() || draft.matter;
  if (!draft.matter) { showToast('Please enter a matter number', 'error'); return; }

  state.entries.unshift({ ...draft, status: 'approved', source: 'auto' });
  state.drafts.splice(idx, 1);
  state.lastCaptureMs = Date.now();
  renderDrafts();
  renderEntries();
  updateStats();
  saveToStorage();
  showToast(`✓ Entry approved — ${draft.units} unit(s) captured`, 'success');
}

function approveAll() {
  if (state.drafts.length === 0) { showToast('No pending entries to approve'); return; }
  const count = state.drafts.length;
  state.drafts.forEach(d => state.entries.unshift({ ...d, status: 'approved', source: 'auto' }));
  state.drafts = [];
  state.lastCaptureMs = Date.now();
  renderDrafts();
  renderEntries();
  updateStats();
  saveToStorage();
  showToast(`✓ ${count} entr${count !== 1 ? 'ies' : 'y'} approved`, 'success');
}

function discardDraft(id) {
  state.drafts = state.drafts.filter(d => d.id !== id);
  renderDrafts();
  updateStats();
  saveToStorage();
}

// ─── ENTRIES TABLE ────────────────────────────────────────────────────────────
function renderEntries() {
  const filterMatter = document.getElementById('filter-matter')?.value || '';
  const tbody  = document.getElementById('entries-body');
  const footer = document.getElementById('entries-summary');
  if (!tbody) return;

  const filtered = filterMatter
    ? state.entries.filter(e => e.matter === filterMatter)
    : state.entries;

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="empty-row">No entries yet — approve some drafts</td></tr>';
    if (footer) footer.textContent = '';
    return;
  }

  const billableUnits = filtered.filter(e => e.billable).reduce((s, e) => s + e.units, 0);

  tbody.innerHTML = filtered.map(e => `
    <tr>
      <td class="mono muted sm">${e.time}</td>
      <td class="mono sm">${e.matter}</td>
      <td>${e.icon} ${e.type}</td>
      <td class="narration-cell"
          contenteditable="true"
          onblur="App.saveNarrationEdit('${e.id}', this.textContent)"
          title="Click to edit">${escHtml(e.narration)}</td>
      <td class="mono center">${e.units}</td>
      <td><span class="tag ${e.billable ? 'tag-billable' : 'tag-unbillable'}">${e.billable ? 'Billable' : 'Unbillable'}</span></td>
      <td>
        <span class="tag tag-${e.status}">${e.status}</span>
        <span class="tag tag-${e.source}" style="margin-left:4px">${e.source}</span>
      </td>
      <td><button class="btn-icon" onclick="App.deleteEntry('${e.id}')" title="Delete">✕</button></td>
    </tr>`).join('');

  if (footer) {
    footer.textContent = `${filtered.length} entries · ${billableUnits} billable units · ${(billableUnits * 0.1).toFixed(1)} hours`;
  }
}

// ─── INLINE NARRATION EDITING ─────────────────────────────────────────────────
function saveNarrationEdit(id, newText) {
  const entry = state.entries.find(e => e.id === id);
  if (!entry) return;
  const trimmed = newText.trim();
  if (trimmed && trimmed !== entry.narration) {
    entry.narration = trimmed;
    saveToStorage();
    showToast('Narration updated', 'success');
  }
}

function deleteEntry(id) {
  state.entries = state.entries.filter(e => e.id !== id);
  renderEntries();
  updateStats();
  saveToStorage();
}

// ─── MANUAL ENTRY ──────────────────────────────────────────────────────────────
function addManualEntry() {
  const type      = document.getElementById('manual-type').value;
  const matter    = document.getElementById('manual-matter').value.trim();
  const mins      = parseInt(document.getElementById('manual-duration').value) || 6;
  const narration = document.getElementById('manual-narration').value.trim();
  const billable  = document.getElementById('manual-billable').checked;

  if (!matter)    { showToast('Please enter a matter number', 'error'); return; }
  if (!narration) { showToast('Please add a narration', 'error');       return; }

  const units = Math.max(1, Math.ceil(mins / 6));
  const icons = { Email:'✉', Meeting:'📅', 'Phone Call':'📞', 'Document Drafting':'📄', Research:'🔍', 'Court Attendance':'⚖' };

  state.entries.unshift({
    id: 'M' + (state.entryCounter++),
    type, icon: icons[type] || '📌',
    narration, matter, billable, units,
    time: nowTime(), status: 'approved', source: 'manual',
  });
  state.lastCaptureMs = Date.now();
  renderEntries();
  updateStats();
  saveToStorage();
  showToast('Manual entry added', 'success');

  document.getElementById('manual-matter').value    = '';
  document.getElementById('manual-narration').value = '';
  document.getElementById('manual-duration').value  = 6;
}

// ─── CSV EXPORT ───────────────────────────────────────────────────────────────
function exportCSV() {
  if (state.entries.length === 0) { showToast('No entries to export', 'error'); return; }

  const headers = ['Time','Matter','Client','Activity','Narration','Units','Hours','Value (R)','Billable','Status','Source'];
  const rows = state.entries.map(e => {
    const client = MATTERS[e.matter]?.client || '—';
    const hrs    = (e.units * 0.1).toFixed(1);
    const value  = e.billable ? (e.units * 0.1 * DEFAULT_RATE).toFixed(2) : '0.00';
    return [
      e.time, e.matter,
      `"${client}"`,
      e.type,
      `"${e.narration.replace(/"/g, '""')}"`,
      e.units, hrs, value,
      e.billable ? 'Yes' : 'No',
      e.status, e.source,
    ];
  });

  const csv  = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `timelex-entries-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('CSV exported', 'success');
}

// ─── INVOICE ──────────────────────────────────────────────────────────────────
function updateInvoicePreview() {
  const view = document.getElementById('view-invoice');
  if (!view?.classList.contains('active')) return;

  const matterFilter = document.getElementById('inv-matter')?.value  || 'all';
  const rate         = parseFloat(document.getElementById('inv-rate')?.value)  || DEFAULT_RATE;
  const vatPct       = parseFloat(document.getElementById('inv-vat')?.value) / 100 || 0.15;
  const type         = document.getElementById('inv-type')?.value || 'Pro-Forma';

  const approved = state.entries.filter(e =>
    e.status === 'approved' && e.billable &&
    (matterFilter === 'all' || e.matter === matterFilter)
  );

  let clientName = 'Multiple Clients (Consolidated)', matterRef = 'All Active Matters';
  if (matterFilter !== 'all' && MATTERS[matterFilter]) {
    clientName = MATTERS[matterFilter].client;
    matterRef  = 'Matter: ' + matterFilter;
  }

  safeSet('inv-client-name', clientName);
  safeSet('inv-matter-ref',  matterRef);
  safeSet('inv-label',       type === 'Pro-Forma' ? 'PRO-FORMA INVOICE' : 'TAX INVOICE');
  safeSet('inv-number',      type === 'Pro-Forma' ? `#PF-${new Date().getFullYear()}-0422` : `#INV-${new Date().getFullYear()}-0422`);
  safeSet('inv-date',        'Date: ' + new Date().toLocaleDateString('en-ZA', { day:'numeric', month:'long', year:'numeric' }));
  safeSet('inv-vat-label',   `VAT (${Math.round(vatPct * 100)}%)`);

  const tbody = document.getElementById('inv-lines');
  if (!tbody) return;

  if (approved.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="color:#999;text-align:center;padding:16px">No approved billable entries for this selection</td></tr>';
    ['inv-subtotal','inv-vat-amount','inv-total'].forEach(id => safeSet(id, 'R 0.00'));
    document.getElementById('inv-summary-box').style.display = 'none';
    return;
  }

  let subtotal = 0;
  tbody.innerHTML = approved.map(e => {
    const hrs = e.units * 0.1;
    const amt = hrs * rate;
    subtotal += amt;
    return `<tr>
      <td>${e.time}</td>
      <td>${escHtml(e.narration)}</td>
      <td style="text-align:center">${e.units}</td>
      <td style="text-align:center">${hrs.toFixed(1)}</td>
      <td style="text-align:right">R ${amt.toFixed(2)}</td>
    </tr>`;
  }).join('');

  const vat = subtotal * vatPct, total = subtotal + vat;
  safeSet('inv-subtotal',   'R ' + subtotal.toFixed(2));
  safeSet('inv-vat-amount', 'R ' + vat.toFixed(2));
  safeSet('inv-total',      'R ' + total.toFixed(2));

  // Summary box in settings panel
  const box = document.getElementById('inv-summary-box');
  if (box) {
    box.style.display = 'block';
    safeSet('inv-entry-count',   String(approved.length));
    safeSet('inv-unit-count',    String(approved.reduce((s,e) => s + e.units, 0)));
    safeSet('inv-total-summary', 'R ' + total.toFixed(2));
  }
}

function printInvoice() { window.print(); }

function pushToGP() {
  const approved = state.entries.filter(e => e.status === 'approved' && e.billable);
  if (approved.length === 0) { showToast('No approved entries to push', 'error'); return; }
  showToast(`${approved.length} entries queued for Ghost Practice sync`, 'success');
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
function renderAnalytics() {
  const view = document.getElementById('view-analytics');
  if (!view?.classList.contains('active')) return;

  const approved = state.entries.filter(e => e.status === 'approved' && e.billable);
  const totalUnits = approved.reduce((s, e) => s + e.units, 0);
  const totalHrs   = totalUnits * 0.1;
  const totalValue = totalHrs * DEFAULT_RATE;
  const autoCount  = approved.filter(e => e.source === 'auto').length;

  // Matter hours map
  const matterMap = {};
  approved.forEach(e => {
    if (!matterMap[e.matter]) matterMap[e.matter] = 0;
    matterMap[e.matter] += e.units * 0.1;
  });
  const topMatter = Object.entries(matterMap).sort((a,b) => b[1]-a[1])[0];

  // Activity hours map
  const typeMap = {};
  approved.forEach(e => {
    const t = e.type || 'Other';
    if (!typeMap[t]) typeMap[t] = 0;
    typeMap[t] += e.units * 0.1;
  });

  safeSet('an-total-hours', totalHrs.toFixed(1) + ' h');
  safeSet('an-total-units', totalUnits + ' units');
  safeSet('an-total-value', 'R ' + totalValue.toLocaleString('en-ZA', { maximumFractionDigits: 0 }));
  safeSet('an-auto-pct',    approved.length ? Math.round((autoCount / approved.length) * 100) + '%' : '0%');
  safeSet('an-auto-count',  `${autoCount} of ${approved.length} entries`);
  safeSet('an-top-matter',  topMatter ? topMatter[0] : '—');
  safeSet('an-top-matter-hrs', topMatter ? topMatter[1].toFixed(1) + ' h' : '0 h');

  // Set period labels
  const period = new Date().toLocaleDateString('en-ZA', { month:'long', year:'numeric' });
  safeSet('analytics-period', period);

  // Matter breakdown table
  renderAnalyticsTable(matterMap, approved);

  // Charts (after paint)
  requestAnimationFrame(() => {
    drawDonutChart('chart-activity', 'legend-activity', typeMap);
    drawHorizontalBars('chart-matter', matterMap);
    drawWeekTimeline('chart-timeline', approved);
  });
}

function renderAnalyticsTable(matterMap, approved) {
  const tbody = document.getElementById('analytics-table');
  if (!tbody) return;
  if (Object.keys(matterMap).length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-row">Approve some entries to see analytics</td></tr>';
    return;
  }
  tbody.innerHTML = Object.entries(matterMap)
    .sort((a,b) => b[1]-a[1])
    .map(([matter, hrs]) => {
      const m = MATTERS[matter] || { client:'—' };
      const entries = approved.filter(e => e.matter === matter);
      const units = entries.reduce((s,e) => s + e.units, 0);
      const value = (hrs * DEFAULT_RATE).toFixed(2);
      return `<tr>
        <td class="mono sm">${matter}</td>
        <td>${escHtml(m.client)}</td>
        <td class="mono center">${entries.length}</td>
        <td class="mono center">${units}</td>
        <td class="mono center">${hrs.toFixed(1)}</td>
        <td class="mono" style="text-align:right">R ${parseFloat(value).toLocaleString('en-ZA', { minimumFractionDigits:2 })}</td>
      </tr>`;
    }).join('');
}

// ─── CANVAS CHARTS ────────────────────────────────────────────────────────────
const DARK = '#0d0f14', CARD = '#13161d', BORDER = '#222836', TEXT = '#e8eaf0', MUTED = '#7a8299';

function drawDonutChart(canvasId, legendId, dataMap) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const entries = Object.entries(dataMap);
  if (entries.length === 0) {
    ctx.fillStyle = MUTED; ctx.font = '13px DM Sans, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('No data yet', W / 2, H / 2); return;
  }

  const total = entries.reduce((s, [, v]) => s + v, 0);
  const typeColorMap = { Email: CHART_COLORS.email, Meeting: CHART_COLORS.meeting,
    Document: CHART_COLORS.doc, 'Phone Call': CHART_COLORS.call, Research: CHART_COLORS.research };
  const colors = entries.map(([k], i) => typeColorMap[k] || CHART_COLORS.matters[i % 5]);

  const cx = 120, cy = H / 2, r = 85, inner = 52;
  let startAngle = -Math.PI / 2;

  entries.forEach(([, val], i) => {
    const sweep = (val / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, startAngle + sweep);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();
    startAngle += sweep;
  });

  // Donut hole
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, 2 * Math.PI);
  ctx.fillStyle = CARD;
  ctx.fill();

  // Centre label
  ctx.fillStyle = TEXT; ctx.font = 'bold 18px DM Mono, monospace'; ctx.textAlign = 'center';
  ctx.fillText(total.toFixed(1), cx, cy + 3);
  ctx.fillStyle = MUTED; ctx.font = '11px DM Sans, sans-serif';
  ctx.fillText('hours', cx, cy + 18);

  // Legend
  const legend = document.getElementById(legendId);
  if (legend) {
    legend.innerHTML = entries.map(([label, val], i) => `
      <div class="legend-item">
        <span class="legend-dot" style="background:${colors[i]}"></span>
        <span class="legend-label">${label}</span>
        <span class="legend-val">${val.toFixed(1)}h</span>
      </div>`).join('');
  }
}

function drawHorizontalBars(canvasId, matterMap) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const entries = Object.entries(matterMap).sort((a,b) => b[1]-a[1]).slice(0, 5);
  if (entries.length === 0) {
    ctx.fillStyle = MUTED; ctx.font = '13px DM Sans, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('No data yet', W / 2, H / 2); return;
  }

  const maxVal  = Math.max(...entries.map(([,v]) => v));
  const padL    = 130, padR = 60, padT = 20, barH = 24, gap = 18;
  const availW  = W - padL - padR;

  entries.forEach(([matter, val], i) => {
    const y      = padT + i * (barH + gap);
    const barW   = (val / maxVal) * availW;
    const color  = CHART_COLORS.matters[i % 5];
    const mName  = matter.length > 16 ? matter.slice(0, 16) + '…' : matter;

    // Label
    ctx.fillStyle = MUTED; ctx.font = '11px DM Mono, monospace'; ctx.textAlign = 'right';
    ctx.fillText(mName, padL - 8, y + barH / 2 + 4);

    // Track
    ctx.fillStyle = BORDER;
    ctx.fillRect(padL, y, availW, barH);

    // Bar with rounded right
    ctx.fillStyle = color;
    ctx.fillRect(padL, y, Math.max(barW, 4), barH);

    // Value
    ctx.fillStyle = TEXT; ctx.font = 'bold 11px DM Mono, monospace'; ctx.textAlign = 'left';
    ctx.fillText(val.toFixed(1) + 'h', padL + barW + 6, y + barH / 2 + 4);
  });
}

function drawWeekTimeline(canvasId, entries) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  // Simulate a realistic week including today's real data
  const today = new Date().getDay(); // 0=Sun
  const dayIdxToday = today === 0 ? 6 : today - 1; // map to Mon=0

  // Simulated prior days + today's real hours
  const dayHours = [1.8, 3.2, 2.5, 4.1, 1.6, 0, 0];
  dayHours[dayIdxToday] = parseFloat(todayHours().toFixed(1)) || 0.2;

  const maxH   = Math.max(...dayHours, 1);
  const padL   = 36, padR = 24, padT = 16, padB = 32;
  const availW = W - padL - padR;
  const availH = H - padT - padB;
  const barW   = Math.floor(availW / 7) - 8;

  days.forEach((day, i) => {
    const x      = padL + i * (availW / 7) + (availW / 7 - barW) / 2;
    const barH   = (dayHours[i] / maxH) * availH;
    const y      = padT + availH - barH;
    const isToday = i === dayIdxToday;
    const color   = isToday ? '#C9A84C' : '#222836';
    const txtCol  = isToday ? '#C9A84C' : MUTED;

    // Bar
    ctx.fillStyle = color;
    ctx.fillRect(x, y, barW, barH);

    // Value above bar
    if (dayHours[i] > 0) {
      ctx.fillStyle = txtCol; ctx.font = 'bold 11px DM Mono, monospace'; ctx.textAlign = 'center';
      ctx.fillText(dayHours[i].toFixed(1), x + barW / 2, y - 4);
    }

    // Day label
    ctx.fillStyle = txtCol; ctx.font = isToday ? 'bold 11px DM Sans, sans-serif' : '11px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(day, x + barW / 2, H - 8);
  });

  // Baseline
  ctx.strokeStyle = BORDER; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(padL, padT + availH); ctx.lineTo(W - padR, padT + availH); ctx.stroke();
}

// ─── CAPTURE ENGINE ────────────────────────────────────────────────────────────
function toggleCapture() {
  state.capturing = !state.capturing;
  if (state.captureEngine) { state.capturing ? state.captureEngine.start() : state.captureEngine.stop(); }

  const btn    = document.getElementById('capture-toggle-text');
  const badge  = document.getElementById('feed-badge');
  const status = document.getElementById('capture-status-badge');

  if (state.capturing) {
    if (btn)   btn.textContent = 'Pause Capture';
    if (badge) { badge.textContent = 'Detecting…'; badge.className = 'badge pulse'; badge.removeAttribute('style'); }
    if (status) status.innerHTML = '<span class="live-dot"></span> Monitoring active';
    showToast('Auto-capture resumed');
  } else {
    if (btn)   btn.textContent = 'Resume Capture';
    if (badge) { badge.textContent = 'Paused'; badge.className = 'badge'; badge.style.cssText='background:var(--red-dim);color:var(--red)'; }
    if (status) status.innerHTML = '⏸ Capture paused';
    showToast('Auto-capture paused');
  }
}

// ─── IDLE REMINDER ─────────────────────────────────────────────────────────────
// Directly addresses Johan Biggs + Nomonde Shelembe survey requests for reminders
function initIdleReminder() {
  const IDLE_THRESHOLD_MS = 90 * 60 * 1000; // 90 minutes
  setInterval(() => {
    const banner   = document.getElementById('idle-banner');
    const idleText = document.getElementById('idle-text');
    if (!banner) return;
    const idle = Date.now() - state.lastCaptureMs;
    if (idle >= IDLE_THRESHOLD_MS) {
      const idleMin = Math.floor(idle / 60000);
      if (idleText) idleText.textContent =
        `⏰  You haven't captured any billable time in ${idleMin} minutes. Something probably happened — check your inbox, calendar or recent documents.`;
      banner.style.display = 'flex';
    } else {
      banner.style.display = 'none';
    }
  }, 60 * 1000); // check every minute
}

// ─── LIVE CLOCK ───────────────────────────────────────────────────────────────
function startLiveClock() {
  function tick() {
    const el = document.getElementById('live-clock');
    if (el) el.textContent = new Date().toLocaleTimeString('en-ZA', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
  }
  tick();
  setInterval(tick, 1000);
}

// ─── KEYBOARD SHORTCUTS ───────────────────────────────────────────────────────
function initKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    switch (e.key) {
      case 'a': case 'A': approveAll(); break;
      case '?': toggleShortcutsModal(); break;
      case 'Escape': closeShortcutsModal(); break;
      case '1': navigateTo('dashboard');  break;
      case '2': navigateTo('capture');    break;
      case '3': navigateTo('entries');    break;
      case '4': navigateTo('invoice');    break;
      case '5': navigateTo('analytics');  break;
    }
  });
}

function toggleShortcutsModal() {
  const overlay = document.getElementById('shortcuts-overlay');
  if (!overlay) return;
  overlay.classList.toggle('visible');
}
function closeShortcutsModal() {
  document.getElementById('shortcuts-overlay')?.classList.remove('visible');
}

// ─── NAVIGATION ───────────────────────────────────────────────────────────────
function navigateTo(view) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.view === view));
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + view));
  requestAnimationFrame(() => {
    if (view === 'entries')   renderEntries();
    if (view === 'invoice')   updateInvoicePreview();
    if (view === 'capture')   renderCaptureFeed();
    if (view === 'analytics') renderAnalytics();
  });
}

function initNav() {
  document.querySelector('.nav')?.addEventListener('click', e => {
    const item = e.target.closest('.nav-item');
    if (!item?.dataset?.view) return;
    e.preventDefault();
    navigateTo(item.dataset.view);
  });

  document.getElementById('filter-matter')?.addEventListener('change', renderEntries);

  const billableToggle = document.getElementById('manual-billable');
  if (billableToggle) {
    billableToggle.addEventListener('change', () => {
      safeSet('billable-label', billableToggle.checked ? 'Billable' : 'Unbillable');
    });
  }
}

// ─── DATE LABELS ──────────────────────────────────────────────────────────────
function setDateLabels() {
  const now    = new Date();
  const opts   = { weekday:'long', day:'numeric', month:'long', year:'numeric' };
  const period = now.toLocaleDateString('en-ZA', { month:'long', year:'numeric' });
  safeSet('dash-date',      now.toLocaleDateString('en-ZA', opts));
  safeSet('entries-period', period);
  safeSet('analytics-period', period);
}

// ─── MATTER AUTOCOMPLETE ──────────────────────────────────────────────────────
function initMatterAutocomplete() {
  const mattersArray = Object.entries(MATTERS).map(([num, m]) =>
    MatterLookup.createMatter(num, m.client, m.partner, { department: m.dept }));

  const input   = document.getElementById('manual-matter');
  const datalist = document.getElementById('matters-list');
  if (!input || !datalist) return;

  const refresh = (query) => {
    const suggestions = MatterLookup.getMatterSuggestions(mattersArray, query);
    datalist.innerHTML = suggestions.map(s => `<option value="${s.value}">${s.label}</option>`).join('');
  };
  refresh('');
  input.addEventListener('input', e => refresh(e.target.value));
}

// ─── SEED DATA ────────────────────────────────────────────────────────────────
function seedEntries() {
  // Only seed if localStorage is empty
  if (state.entries.length > 0) return;
  state.entries = [
    { id:'S1', type:'Email',     icon:'✉',  narration:'Attending to email: RE: Settlement — Nkosi v Absa',           matter:'2024/0512-LIT', units:1, billable:true, time:'07:45', status:'approved', source:'auto' },
    { id:'S2', type:'Meeting',   icon:'📅', narration:'Client consultation — Motlhabi Holdings SLA',                 matter:'2025/0103-COM', units:5, billable:true, time:'08:30', status:'approved', source:'auto' },
    { id:'S3', type:'Document',  icon:'📄', narration:'Drafting founding affidavit — Nkosi v Absa Bank',             matter:'2024/0512-LIT', units:6, billable:true, time:'09:15', status:'approved', source:'auto' },
    { id:'S4', type:'Phone Call',icon:'📞', narration:'Call with opposing counsel re: postponement — Dlamini matter', matter:'2024/0888-LIT', units:2, billable:true, time:'10:00', status:'approved', source:'auto' },
    { id:'S5', type:'Research',  icon:'🔍', narration:'Legal research — costs orders in urgent applications',         matter:'2024/0888-LIT', units:3, billable:true, time:'10:30', status:'approved', source:'auto' },
    { id:'S6', type:'Email',     icon:'✉',  narration:'Attending to email: FW: FICA docs — Botha transfer',          matter:'2025/0391-CON', units:1, billable:true, time:'11:00', status:'approved', source:'auto' },
  ];
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
function init() {
  initLegacyToast();
  setDateLabels();
  loadFromStorage();
  seedEntries();
  initNav();
  initFeedFilter();
  initMatterAutocomplete();
  initKeyboardShortcuts();
  startLiveClock();
  updateStats();

  // Assessment guard
  if (!assessmentIsActive()) {
    showToast('Assessment period has ended', 'error');
    // Still allow viewing — don't disable, just notify
  }

  // Capture engine
  try {
    state.captureEngine = new CaptureEngine(
      { matters: Object.fromEntries(Object.entries(MATTERS).map(([k,v]) => [k, { ...v, matterNumber:k }])),
        addActivity: (a) => addFeedItem(a) },
      { enabled: true, autoApprove: false }
    );
    state.captureEngine.start();
  } catch (_) {
    // CaptureEngine unavailable — fall back to legacy simulation
    _legacySimulation();
  }

  initIdleReminder();
  state.gpIntegration = new GhostPracticeIntegration({ toast: showToast });

  requestAnimationFrame(() => { renderFeed(); renderDrafts(); renderEntries(); });
}

// ─── LEGACY SIMULATION FALLBACK ───────────────────────────────────────────────
const activityPool = [
  { type:'email',    icon:'✉',  label:'Email',     narrationFn: t => `Attending to email: ${t.slice(0,60)}`,
    titles:['Re: Discovery Documents — Nkosi v Absa','FW: Settlement Proposal — Dlamini','RE: Botha transfer — FICA documents','Client query: trust account','Opposing counsel: postponement request'],
    unitRange:[1,2], defaultMatter:'2024/0512-LIT' },
  { type:'meeting',  icon:'📅', label:'Meeting',   narrationFn: t => `Attending meeting: ${t}`,
    titles:['Client consultation — Motlhabi Holdings','Settlement conference — Dlamini','Team debrief — Litigation matters'],
    unitRange:[5,10], defaultMatter:'2025/0103-COM' },
  { type:'doc',      icon:'📄', label:'Document',  narrationFn: t => t,
    titles:['Drafting founding affidavit — Nkosi v Absa','Reviewing settlement agreement','Preparing court bundle'],
    unitRange:[3,8], defaultMatter:'2024/0512-LIT' },
  { type:'call',     icon:'📞', label:'Phone Call',narrationFn: t => t,
    titles:['Call with client — progress update','Call with sheriff — service of process','Call with opposing counsel'],
    unitRange:[1,3], defaultMatter:'2024/0888-LIT' },
  { type:'research', icon:'🔍', label:'Research',  narrationFn: t => t,
    titles:['Legal research — locus standi principles','Reviewing case law: SCA judgments re: costs'],
    unitRange:[3,6], defaultMatter:'2025/0217-LAB' },
];

function _legacySimulation() {
  const rand = (min,max) => min + Math.floor(Math.random() * (max-min+1));
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const matterKeys = Object.keys(MATTERS);
  const simulate = () => {
    if (!state.capturing) return;
    const a = pick(activityPool);
    addFeedItem(a, pick(a.titles), rand(...a.unitRange), pick(matterKeys));
  };
  setTimeout(simulate, 2000);
  setInterval(simulate, 8000 + Math.random() * 7000);
}

document.addEventListener('DOMContentLoaded', init);

// ─── PUBLIC API ───────────────────────────────────────────────────────────────
const App = {
  toggleCapture, approveAll, approveDraft, discardDraft,
  addManualEntry, deleteEntry, exportCSV,
  updateInvoicePreview, printInvoice, pushToGP,
  toggleShortcutsModal, closeShortcutsModal,
  saveNarrationEdit,
  getApprovedBillableEntries: () => state.entries.filter(e => e.status==='approved' && e.billable),
  clearApprovedEntries: () => { state.entries = state.entries.filter(e => !(e.status==='approved' && e.billable)); renderEntries(); updateStats(); saveToStorage(); },
};

window.App = App;
export default App;
