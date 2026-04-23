/**
 * TimeLex — Automated Legal Time Capture
 * Copyright (c) 2026 Kone Tshivhinda
 * 
 * ASSESSMENT PROTOTYPE - NOT FOR PRODUCTION USE
 * Developed exclusively for MB Motsoeneng Bill Attorneys Software Engineer Assessment 2026
 * 
 * ALL RIGHTS RESERVED
 * This work is protected by copyright law. Submission of this assessment does not constitute 
 * transfer of ownership. All intellectual property rights remain with the creator.
 * 
 * This code may not be used in production without express written permission.
 * For commercial licensing inquiries, contact: erictshivhinda@gmail.com
 * 
 * IMPORTANT: This assessment submission is provided under Assessment-Specific License terms
 * as documented in the complete project repository. Intentional limitations exist for 
 * assessment purposes only (not for production implementation).
 * 
 * ASSESSMENT WATERMARK: Visible in print and screenshots to prevent unauthorized production use
 * This watermark appears when printing or capturing screenshots of the application
 */

import { toBillingUnits, formatDuration, getCurrentTime } from './utils/date-helpers.js';
import { 
  showToast, 
  showSuccess, 
  showError, 
  showWarning, 
  showInfo,
  initLegacyToast
} from './utils/toast-notification.js';
import { CaptureEngine, createSimulatedActivity } from './capture-engine.js';
import { InvoiceGenerator, InvoiceType } from './invoice-generator.js';
import { GhostPracticeIntegration, createGPTimeEntries, initLegacyGPIntegration } from './gp-integration.js';
import * as MatterLookup from './utils/matter-lookup.js';

/**
 * TimeLex — Automated Legal Time Capture
 * Prototype for MB Motsoeneng Bill Attorneys
 * 
 * Survey insights addressed:
 * - Auto-capture emails, meetings, docs, calls (top request from multiple attorneys)
 * - Draft entries for review — attorney approves, not re-types
 * - Quick matter assignment via autocomplete
 * - Real-time target tracking (Lerato, Johan, Anchané requests)
 * - Daily capture reminders (Nomonde, Johan requests)
 * - Invoice generation without secretary (Anchané request)
 */

const App = (() => {
  // ─── ASSESSMENT PROTECTION ─────────────────────────────────────────────────
  // Expiration check - blocks entire app if assessment period has passed
  const EXPIRATION_DATE = new Date('2026-05-07T23:59:59');
  
  function checkAssessmentStatus() {
    const now = new Date();
    if (now > EXPIRATION_DATE) {
      document.body.innerHTML = `
        <div style="display:flex; justify-content:center; align-items:center; height:100vh; background:#f8d7da; color:#721c24; text-align:center; font-family:sans-serif;">
          <div style="padding: 40px;">
            <h1 style="margin-bottom: 20px;">Assessment Period Expired</h1>
            <p style="margin: 10px 0; font-size: 16px;">This prototype was valid until May 7, 2026.</p>
            <p style="margin: 10px 0; font-size: 16px;">Please contact Kone Tshivhinda for production licensing.</p>
            <p style="margin-top: 30px; font-size: 12px; color: #999;"><small>Copyright (c) 2026</small></p>
          </div>
        </div>`;
      return false;
    }
    return true;
  }
  
  // Check assessment status immediately on load
  if (!checkAssessmentStatus()) {
    throw new Error('Assessment period has expired');
  }

  // ─── STATE ─────────────────────────────────────────────────────────────────
  const state = {
    capturing: true,
    entries: [],        // approved time entries
    drafts: [],         // pending review
    feedItems: [],      // activity feed
    monthBase: 47.8,    // hours already on books (simulated month-to-date)
    target: 150,        // monthly hour target
    captureInterval: null,
    captureEngine: null,
    gpIntegration: null,
    invoiceGenerator: null,
    currentInvoice: null,
    entryCounter: 1,
    rate: 3500,
    assessmentWatermark: true, // Critical protection - prevents production use
    matterSuggestions: []    // For autocomplete functionality
  };

  // ─── MATTER LOOKUP ─────────────────────────────────────────────────────────
  // Correct structure: object with matter numbers as keys
  const matters = {
    '2024/0512-LIT': MatterLookup.createMatter('2024/0512-LIT', 'Nkosi v Absa Bank', 'Stephanie Chetty', { department: 'Litigation' }),
    '2024/0888-LIT': MatterLookup.createMatter('2024/0888-LIT', 'Dlamini Urgent Application', 'Stephanie Chetty', { department: 'Litigation' }),
    '2025/0103-COM': MatterLookup.createMatter('2025/0103-COM', 'Motlhabi Holdings — SLA Review', 'Aristidis Perivolaris', { department: 'Corporate' }),
    '2025/0217-LAB': MatterLookup.createMatter('2025/0217-LAB', 'Perivolaris Labour Dispute', 'Johan Biggs', { department: 'Labour' }),
    '2025/0391-CON': MatterLookup.createMatter('2025/0391-CON', 'Botha Property Transfer', 'Anchané Botha', { department: 'Contractual' })
  };
  state.captureEngine = new CaptureEngine({
  matters,
  addActivity: (activity) => {
    addFeedItem(
      {
        type: activity.type,
        icon: getIconForActivityType(activity.type),
        label: getActivityLabel(activity.type)
      },
      activity.title,
      activity.units,
      activity.matter
    );
  }
}, {
  enabled: true,
  autoApprove: false
});



// Start the capture engine
state.captureEngine.start();

// Update your toggleCapture function to use the engine
function toggleCapture() {
  if (!state.assessmentWatermark) {
    toast('This is an assessment prototype only - contact Kone Tshivhinda for licensing', 'error');
    return;
  }
  
  state.captureEngine.toggle();
  
  const btn = document.getElementById('capture-toggle-text');
  const badge = document.getElementById('feed-badge');
  const statusBadge = document.getElementById('capture-status-badge');
  
  if (state.captureEngine.getStatus() === CaptureStatus.ACTIVE) {
    btn.textContent = 'Pause Capture';
    badge.textContent = 'Detecting…';
    badge.className = 'badge pulse';
    if (statusBadge) statusBadge.innerHTML = '<span class="live-dot"></span> Monitoring active';
    toast('Auto-capture resumed');
  } else {
    btn.textContent = 'Resume Capture';
    badge.textContent = 'Paused';
    badge.className = 'badge';
    badge.style.background = 'var(--red-dim)';
    badge.style.color = 'var(--red)';
    if (statusBadge) statusBadge.innerHTML = '⏸ Capture paused';
    toast('Auto-capture paused');
  }
}

// Helper functions for activity types
function getIconForActivityType(type) {
  const icons = {
    [ActivityType.EMAIL]: '✉',
    [ActivityType.MEETING]: '📅',
    [ActivityType.DOCUMENT]: '📄',
    [ActivityType.CALL]: '📞',
    [ActivityType.RESEARCH]: '🔍'
  };
  return icons[type] || '•';
}

function getActivityLabel(type) {
  const labels = {
    [ActivityType.EMAIL]: 'Email',
    [ActivityType.MEETING]: 'Meeting',
    [ActivityType.DOCUMENT]: 'Document',
    [ActivityType.CALL]: 'Phone Call',
    [ActivityType.RESEARCH]: 'Research'
  };
  return labels[type] || 'Activity';
}

  // Convert matters object to array for search functionality
  const mattersArray = Object.values(matters);

  // ─── SIMULATED ACTIVITY POOL ───────────────────────────────────────────────
  const activityPool = [
    {
      type: 'email', icon: '✉', label: 'Email',
      titles: [
        'Re: Discovery Documents — Nkosi v Absa',
        'FW: Settlement Proposal — Dlamini Matter',
        'RE: Heads of Argument — Perivolaris',
        'Client query: Trust account balance',
        'Opposing counsel: Postponement request',
        'RE: Botha transfer — FICA documents',
        'FW: Mediation date confirmation',
      ],
      defaultMatter: '2024/0512-LIT',
      unitRange: [1, 2],
      narrationFn: (title) => `Attending to email: ${title.substring(0, 60)}`,
    },
    {
      type: 'meeting', icon: '📅', label: 'Meeting',
      titles: [
        'Client consultation — Motlhabi Holdings',
        'Team debrief — Litigation matters',
        'Settlement conference — Dlamini',
        'Internal strategy session',
        'Call with counsel re: heads of argument',
      ],
      defaultMatter: '2025/0103-COM',
      unitRange: [5, 10],
      narrationFn: (title) => `Attending meeting: ${title}`,
    },
    {
      type: 'doc', icon: '📄', label: 'Document',
      titles: [
        'Drafting founding affidavit — Nkosi v Absa',
        'Reviewing settlement agreement — Dlamini',
        'Amending heads of argument — Labour matter',
        'Preparing court bundle — 2024/0512-LIT',
        'Drafting letter of demand — Botha transfer',
      ],
      defaultMatter: '2024/0512-LIT',
      unitRange: [3, 8],
      narrationFn: (title) => title,
    },
    {
      type: 'call', icon: '📞', label: 'Phone Call',
      titles: [
        'Call with client — progress update',
        'Call with sheriff — service of process',
        'Call with registrar — court date',
        'Call with opposing counsel',
        'Call with correspondent attorney',
      ],
      defaultMatter: '2024/0888-LIT',
      unitRange: [1, 3],
      narrationFn: (title) => title,
    },
    {
      type: 'research', icon: '🔍', label: 'Research',
      titles: [
        'Legal research — locus standi principles',
        'Reviewing case law: SCA judgments re: costs',
        'Research — section 65 proceedings',
        'Researching prescription Act applicability',
      ],
      defaultMatter: '2025/0217-LAB',
      unitRange: [3, 6],
      narrationFn: (title) => title,
    },
  ];

  // ─── PROTECTION MECHANISMS ─────────────────────────────────────────────────
  function addWatermark() {
    // Add watermark to prevent unauthorized production use
    const watermark = document.createElement('div');
    watermark.id = 'assessment-watermark';
    watermark.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0,0,0,0.05);
      color: #666;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 9999;
      pointer-events: none;
      font-family: var(--font-sans);
    `;
    watermark.textContent = "ASSESSMENT PROTOTYPE - NOT FOR PRODUCTION USE | © 2026 Kone Tshivhinda";
    document.body.appendChild(watermark);
    
    // Add watermark to print output
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        body::after {
          content: "ASSESSMENT PROTOTYPE - NOT FOR PRODUCTION USE | © 2026 Kone Tshivhinda";
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: rgba(0,0,0,0.05);
          color: #666;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
          z-index: 9999;
          pointer-events: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function checkAssessmentIntegrity() {
    // Intentional limitation for assessment purposes only
    const assessmentDate = new Date('2026-05-07');
    const today = new Date();
    
    if (today > assessmentDate) {
      state.capturing = false;
      document.getElementById('capture-toggle-text').textContent = 'Assessment Expired';
      document.getElementById('feed-badge').textContent = 'EXPIRED';
      document.getElementById('feed-badge').className = 'badge';
      document.getElementById('feed-badge').style.background = 'var(--red-dim)';
      document.getElementById('feed-badge').style.color = 'var(--red)';
      
      const feedList = document.getElementById('feed-list');
      if (feedList) {
        feedList.innerHTML = `
          <div class="feed-empty" style="color: var(--red); font-weight: 600;">
            ASSESSMENT EXPIRED - This is a prototype for assessment purposes only<br>
            Contact Kone Tshivhinda for licensing information
          </div>
        `;
      }
      
      toast('Assessment period has expired - This is a prototype for assessment purposes only', 'error');
    }
  }

  // ─── MATTER AUTOCOMPLETE FUNCTIONALITY ─────────────────────────────────────
  function initMatterAutocomplete() {
    const matterInput = document.getElementById('manual-matter');
    const datalist = document.getElementById('matters-list');
    
    if (!matterInput || !datalist) return;
    
    // Initialize with all matters
    updateMatterDatalist('');
    
    // Set up input event listener for autocomplete
    matterInput.addEventListener('input', (e) => {
      const query = e.target.value;
      updateMatterDatalist(query);
    });
    
    // For draft entries matter input
    document.addEventListener('input', (e) => {
      if (e.target && e.target.classList.contains('draft-matter-input')) {
        const query = e.target.value;
        const suggestions = MatterLookup.getMatterSuggestions(mattersArray, query);
        state.matterSuggestions = suggestions;
      }
    });
  }
  
  function updateMatterDatalist(query) {
    const datalist = document.getElementById('matters-list');
    if (!datalist) return;
    
    // Clear existing options
    datalist.innerHTML = '';
    
    // Get matching matters
    const suggestions = MatterLookup.getMatterSuggestions(mattersArray, query);
    
    // Add new options
    suggestions.forEach(suggestion => {
      const option = document.createElement('option');
      option.value = suggestion.value;
      option.textContent = suggestion.label;
      datalist.appendChild(option);
    });
  }

  // ─── HELPERS ───────────────────────────────────────────────────────────────
  function now() {
    return new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
  }

  function todayHours() {
    return state.entries
      .filter(e => e.billable && e.status === 'approved')
      .reduce((sum, e) => sum + e.units * 0.1, 0);
  }

  function totalHours() {
    return state.monthBase + todayHours();
  }

  function updateStats() {
    const today = todayHours();
    const total = totalHours();
    const todayUnits = Math.round(today * 10);
    const pct = Math.min((total / state.target) * 100, 100);
    const remaining = Math.max(state.target - total, 0);

    document.getElementById('stat-today').textContent = today.toFixed(1) + ' h';
    document.getElementById('stat-today-units').textContent = todayUnits + ' units';
    document.getElementById('stat-month').textContent = total.toFixed(1) + ' h';
    document.getElementById('stat-pending').textContent = state.drafts.length;
    document.getElementById('target-pct').textContent = pct.toFixed(1) + '%';
    document.getElementById('progress-fill').style.width = pct.toFixed(1) + '%';
    document.getElementById('target-billed').textContent = total.toFixed(1) + ' h billed';
    document.getElementById('target-remaining').textContent = remaining.toFixed(1) + ' h remaining';
  }

  function toast(msg, type = 'default') {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.className = `toast show ${type}`;
    setTimeout(() => { el.className = 'toast'; }, 3000);
  }

  // ─── FEED ──────────────────────────────────────────────────────────────────
  function addFeedItem(activity, title, units, matter) {
    const item = { activity, title, units, matter, time: now(), id: Date.now() };
    state.feedItems.unshift(item);
    renderFeed();
    renderCaptureFeed();

    // Auto-create a draft entry
    const draft = {
      id: 'D' + (state.entryCounter++),
      type: activity.label,
      icon: activity.icon,
      title,
      narration: activity.narrationFn(title),
      units,
      matter,
      billable: true,
      time: now(),
    };
    state.drafts.unshift(draft);
    renderDrafts();
    updateStats();
  }

  function renderFeed() {
    const el = document.getElementById('feed-list');
    if (state.feedItems.length === 0) {
      el.innerHTML = '<div class="feed-empty">Monitoring your Outlook, calendar and documents…</div>';
      return;
    }
    el.innerHTML = state.feedItems.slice(0, 10).map(item => `
      <div class="feed-item">
        <div class="feed-icon ${item.activity.type}">${item.activity.icon}</div>
        <div class="feed-body">
          <div class="feed-title">${item.title}</div>
          <div class="feed-meta">${item.activity.label} · ${item.units} unit${item.units > 1 ? 's' : ''} · ${item.matter}</div>
        </div>
        <div class="feed-time">${item.time}</div>
      </div>
    `).join('');
  }

  function renderCaptureFeed() {
    const el = document.getElementById('capture-feed');
    if (!el) return;
    if (state.feedItems.length === 0) {
      el.innerHTML = '<div class="feed-empty">Awaiting activity detection…</div>';
      return;
    }
    el.innerHTML = state.feedItems.map(item => `
      <div class="feed-item">
        <div class="feed-icon ${item.activity.type}">${item.activity.icon}</div>
        <div class="feed-body">
          <div class="feed-title">${item.title}</div>
          <div class="feed-meta">${item.activity.label} · ${item.units} unit${item.units > 1 ? 's' : ''} · ${item.matter}</div>
        </div>
        <div class="feed-time">${item.time}</div>
      </div>
    `).join('');
  }

  // ─── DRAFTS ────────────────────────────────────────────────────────────────
  function renderDrafts() {
    const el = document.getElementById('draft-list');
    if (state.drafts.length === 0) {
      el.innerHTML = '<div class="feed-empty">No pending entries</div>';
      return;
    }
    el.innerHTML = state.drafts.map(d => `
      <div class="draft-item" id="draft-${d.id}">
        <div class="draft-header">
          <span class="draft-type">${d.icon} ${d.type}</span>
          <span class="draft-units">${d.units} unit${d.units > 1 ? 's' : ''} · ${d.time}</span>
        </div>
        <div class="draft-narration">${d.narration}</div>
        <div class="draft-matter-row">
          <input class="draft-matter-input" list="matters-list" value="${d.matter}" id="dm-${d.id}" placeholder="Matter #" />
          <button class="btn-approve" onclick="App.approveDraft('${d.id}')">✓ Approve</button>
          <button class="btn-discard" onclick="App.discardDraft('${d.id}')">✕</button>
        </div>
      </div>
    `).join('');
  }

  function approveDraft(id) {
    if (!state.assessmentWatermark) {
      toast('This is an assessment prototype only - contact Kone Tshivhinda for licensing', 'error');
      return;
    }
    
    const idx = state.drafts.findIndex(d => d.id === id);
    if (idx === -1) return;
    const draft = state.drafts[idx];
    const matterInput = document.getElementById('dm-' + id);
    if (matterInput) draft.matter = matterInput.value.trim() || draft.matter;

    // Validate matter number
    if (!MatterLookup.isValidMatterNumber(draft.matter)) {
      toast('Please enter a valid matter number (e.g., 2024/0512-LIT)', 'error');
      return;
    }

    const entry = { ...draft, status: 'approved', source: 'auto' };
    state.entries.unshift(entry);
    state.drafts.splice(idx, 1);
    renderDrafts();
    renderEntries();
    updateStats();
    toast('Entry approved — ' + draft.units + ' unit(s) captured', 'success');
  }

  function approveAll() {
    if (!state.assessmentWatermark) {
      toast('This is an assessment prototype only - contact Kone Tshivhinda for licensing', 'error');
      return;
    }
    
    if (state.drafts.length === 0) { 
      toast('No pending entries to approve'); 
      return; 
    }
    
    const count = state.drafts.length;
    let validCount = 0;
    
    for (const draft of [...state.drafts]) {
      // Validate matter number
      if (!MatterLookup.isValidMatterNumber(draft.matter)) {
        continue; // Skip invalid matters
      }
      
      const entry = { ...draft, status: 'approved', source: 'auto' };
      state.entries.unshift(entry);
      validCount++;
    }
    
    state.drafts = [];
    renderDrafts();
    renderEntries();
    updateStats();
    
    if (validCount > 0) {
      toast(`${validCount} valid entries approved`, 'success');
    } else {
      toast('No valid entries to approve - please check matter numbers', 'error');
    }
  }

  function discardDraft(id) {
    if (!state.assessmentWatermark) {
      toast('This is an assessment prototype only - contact Kone Tshivhinda for licensing', 'error');
      return;
    }
    
    state.drafts = state.drafts.filter(d => d.id !== id);
    renderDrafts();
    updateStats();
  }

  // ─── ENTRIES TABLE ─────────────────────────────────────────────────────────
  function renderEntries() {
    const filterMatter = document.getElementById('filter-matter')?.value || '';
    const tbody = document.getElementById('entries-body');
    const footer = document.getElementById('entries-summary');
    if (!tbody) return;

    const filtered = filterMatter
      ? state.entries.filter(e => e.matter === filterMatter)
      : state.entries;

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text-dim);padding:24px">No entries yet — approve some drafts</td></tr>';
      footer.textContent = '';
      return;
    }

    const totalUnits = filtered.filter(e => e.billable).reduce((s, e) => s + e.units, 0);
    const totalHrs   = (totalUnits * 0.1).toFixed(1);

    tbody.innerHTML = filtered.map(e => `
      <tr>
        <td class="mono" style="color:var(--text-muted);font-size:11px">${e.time}</td>
        <td class="mono" style="font-size:11px">${e.matter}</td>
        <td>${e.icon} ${e.type}</td>
        <td style="color:var(--text-muted);font-size:11px;max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e.narration}</td>
        <td class="mono" style="text-align:center">${e.units}</td>
        <td><span class="tag ${e.billable ? 'tag-billable' : 'tag-unbillable'}">${e.billable ? 'Billable' : 'Unbillable'}</span></td>
        <td>
          <span class="tag tag-${e.status}">${e.status}</span>
          <span class="tag tag-${e.source}" style="margin-left:4px">${e.source}</span>
        </td>
        <td>
          <button class="btn-icon" onclick="App.deleteEntry('${e.id}')" title="Delete">✕</button>
        </td>
      </tr>
    `).join('');

    footer.textContent = `${filtered.length} entries · ${totalUnits} billable units · ${totalHrs} hours`;
  }

  function deleteEntry(id) {
    if (!state.assessmentWatermark) {
      toast('This is an assessment prototype only - contact Kone Tshivhinda for licensing', 'error');
      return;
    }
    
    state.entries = state.entries.filter(e => e.id !== id);
    renderEntries();
    updateStats();
  }

  // ─── MANUAL ENTRY ──────────────────────────────────────────────────────────
  function addManualEntry() {
    if (!state.assessmentWatermark) {
      toast('This is an assessment prototype only - contact Kone Tshivhinda for licensing', 'error');
      return;
    }
    
    const type     = document.getElementById('manual-type').value;
    const matter   = document.getElementById('manual-matter').value.trim();
    const mins     = parseInt(document.getElementById('manual-duration').value) || 6;
    const narration= document.getElementById('manual-narration').value.trim();
    const billable = document.getElementById('manual-billable').checked;

    // Validate matter number
    if (!matter) { 
      toast('Please enter a matter number', 'error'); 
      return; 
    }
    
    if (!MatterLookup.isValidMatterNumber(matter)) {
      toast('Please enter a valid matter number (e.g., 2024/0512-LIT)', 'error');
      return;
    }
    
    if (!narration) { 
      toast('Please add a narration', 'error'); 
      return; 
    }

    const units = Math.max(1, Math.ceil(mins / 6));
    const icons = { 
      Email:'✉', 
      Meeting:'📅', 
      'Phone Call':'📞', 
      'Document Drafting':'📄', 
      Research:'🔍', 
      'Court Attendance':'⚖' 
    };
    
    const entry = {
      id: 'M' + (state.entryCounter++),
      type, 
      icon: icons[type] || '📌',
      narration, 
      matter, 
      billable, 
      units,
      time: now(), 
      status: 'approved', 
      source: 'manual',
    };
    
    state.entries.unshift(entry);
    renderEntries();
    updateStats();

    // Clear form
    document.getElementById('manual-matter').value = '';
    document.getElementById('manual-narration').value = '';
    document.getElementById('manual-duration').value = 6;
    toast('Manual entry added', 'success');
  }

  // ─── INVOICE ───────────────────────────────────────────────────────────────
  function updateInvoicePreview() {
    const invoiceView = document.getElementById('view-invoice');
    if (!invoiceView || !invoiceView.classList.contains('active')) {
      return;
    }
    
    if (!state.assessmentWatermark) {
      toast('This is an assessment prototype only - contact Kone Tshivhinda for licensing', 'error');
      return;
    }
    
    const matterFilter = document.getElementById('inv-matter')?.value || '';
    const rate = parseFloat(document.getElementById('inv-rate')?.value) || 3500;
    const vatPct = parseFloat(document.getElementById('inv-vat')?.value) / 100 || 0.15;
    const type = document.getElementById('inv-type')?.value;

    state.rate = rate;

    const approved = state.entries.filter(e =>
      e.status === 'approved' && e.billable &&
      (matterFilter === 'all' || e.matter === matterFilter)
    );

    let clientName = 'Multiple Clients (Consolidated)';
    let matterRef = 'All Active Matters';
    if (matterFilter !== 'all' && matters[matterFilter]) {
      clientName = matters[matterFilter].client;
      matterRef = 'Matter: ' + matterFilter;
    }

    // SAFETY CHECKS FOR ALL ELEMENTS
    const clientNameEl = document.getElementById('inv-client-name');
    const matterRefEl = document.getElementById('inv-matter-ref');
    const labelEl = document.getElementById('inv-label');
    const numberEl = document.getElementById('inv-number');
    const tbody = document.getElementById('inv-lines');
    const subtotalEl = document.getElementById('inv-subtotal');
    const vatAmountEl = document.getElementById('inv-vat-amount');
    const totalEl = document.getElementById('inv-total');

    if (clientNameEl) clientNameEl.textContent = clientName;
    if (matterRefEl) matterRefEl.textContent = matterRef;
    if (labelEl) labelEl.textContent = type === 'Pro-Forma' ? 'PRO-FORMA INVOICE' : 'TAX INVOICE';
    if (numberEl) numberEl.textContent = type === 'Pro-Forma' ? '#PF-2026-0422' : '#INV-2026-0422';

    if (tbody) {
      if (approved.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="color:#999;text-align:center;padding:16px">No approved billable entries for this matter</td></tr>';
        if (subtotalEl) subtotalEl.textContent = 'R 0.00';
        if (vatAmountEl) vatAmountEl.textContent = 'R 0.00';
        if (totalEl) totalEl.textContent = 'R 0.00';
        return;
      }

      let subtotal = 0;
      tbody.innerHTML = approved.map(e => {
        const hrs = (e.units * 0.1);
        const amount = hrs * rate;
        subtotal += amount;
        return `
          <tr>
            <td>${e.time}</td>
            <td>${e.narration}</td>
            <td style="text-align:center">${e.units}</td>
            <td style="text-align:center">${hrs.toFixed(1)}</td>
            <td>R ${amount.toFixed(2)}</td>
          </tr>
        `;
      }).join('');

      const vat = subtotal * vatPct;
      const total = subtotal + vat;
      if (subtotalEl) subtotalEl.textContent = 'R ' + subtotal.toFixed(2);
      if (vatAmountEl) vatAmountEl.textContent = 'R ' + vat.toFixed(2);
      if (totalEl) totalEl.textContent = 'R ' + total.toFixed(2);
    }
  }

  // SAFE INVOICE UPDATE WITH RETRY LOGIC
  function safeUpdateInvoicePreview() {
    // Prevent execution if not on invoice view
    const invoiceView = document.getElementById('view-invoice');
    if (!invoiceView || !invoiceView.classList.contains('active')) {
      return;
    }

    const previewContainer = document.getElementById('invoice-preview-content');
    if (!previewContainer) {
      // Element not ready - retry after short delay
      setTimeout(safeUpdateInvoicePreview, 100);
      return;
    }

    try {
      updateInvoicePreview();
    } catch (error) {
      console.error('Failed to update invoice preview:', error);
      showError('Failed to generate invoice preview. Please try again.');
    }
  }

  function printInvoice() {
    if (!state.assessmentWatermark) {
      alert('This is an assessment prototype only - contact Kone Tshivhinda for licensing');
      return;
    }
    
    window.print();
  }

  function pushToGP() {
    if (!state.assessmentWatermark) {
      toast('This is an assessment prototype only - contact Kone Tshivhinda for licensing', 'error');
      return;
    }
    
    toast('Entries queued for Ghost Practice sync — would POST to GP API in production', 'success');
  }

  // ─── CAPTURE SIMULATION ────────────────────────────────────────────────────
  function pickRandom(arr) { 
    return arr[Math.floor(Math.random() * arr.length)]; 
  }
  
  function randomInt(min, max) { 
    return min + Math.floor(Math.random() * (max - min + 1)); 
  }

  function simulateActivity() {
    if (!state.capturing || !state.assessmentWatermark) return;
    
    const activity = pickRandom(activityPool);
    const title    = pickRandom(activity.titles);
    const units    = randomInt(...activity.unitRange);
    
    // Randomly assign to one of our matters
    const matterKeys = Object.keys(matters);
    const matter = pickRandom(matterKeys);
    
    addFeedItem(activity, title, units, matter);
  }

  function startCapture() {
    if (state.captureInterval) return;
    
    // First event after 2s, then every 8-15s to simulate real behaviour
    setTimeout(simulateActivity, 2000);
    
    state.captureInterval = setInterval(() => {
      simulateActivity();
    }, randomInt(8000, 15000));
  }

  function toggleCapture() {
    if (!state.assessmentWatermark) {
      toast('This is an assessment prototype only - contact Kone Tshivhinda for licensing', 'error');
      return;
    }
    
    state.capturing = !state.capturing;
    const btn = document.getElementById('capture-toggle-text');
    const badge = document.getElementById('feed-badge');
    const statusBadge = document.getElementById('capture-status-badge');

    if (state.capturing) {
      btn.textContent = 'Pause Capture';
      badge.textContent = 'Detecting…';
      badge.className = 'badge pulse';
      if (statusBadge) statusBadge.innerHTML = '<span class="live-dot"></span> Monitoring active';
      toast('Auto-capture resumed');
    } else {
      btn.textContent = 'Resume Capture';
      badge.textContent = 'Paused';
      badge.className = 'badge';
      badge.style.background = 'var(--red-dim)';
      badge.style.color = 'var(--red)';
      if (statusBadge) statusBadge.innerHTML = '⏸ Capture paused';
      toast('Auto-capture paused');
    }
  }

  // ─── NAVIGATION ────────────────────────────────────────────────────────────
  function initNav() {
    document.querySelector('.nav').addEventListener('click', function(e) {
      const target = e.target.closest('.nav-item');
      if (!target || !target.dataset.view) return;
      
      e.preventDefault();
      
      // Update active nav item
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      target.classList.add('active');
      
      // Show the correct view
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      const viewId = 'view-' + target.dataset.view;
      const viewElement = document.getElementById(viewId);
      
      if (viewElement) {
        viewElement.classList.add('active');
        
        // Special rendering for certain views
        if (target.dataset.view === 'entries') {
          setTimeout(renderEntries, 0);
        } else if (target.dataset.view === 'invoice') {
          // Add a small delay to ensure the view is fully rendered
          setTimeout(safeUpdateInvoicePreview, 50);
        } else if (target.dataset.view === 'capture') {
          setTimeout(renderCaptureFeed, 0);
        }
      }
    });

    // Filter change
    const filter = document.getElementById('filter-matter');
    if (filter) filter.addEventListener('change', renderEntries);

    // Billable toggle label
    const billable = document.getElementById('manual-billable');
    if (billable) {
      billable.addEventListener('change', () => {
        document.getElementById('billable-label').textContent = billable.checked ? 'Billable' : 'Unbillable';
      });
    }
  }

  // ─── SEED DATA ─────────────────────────────────────────────────────────────
  function seedEntries() {
    const seeds = [
      { id: 'S1', type: 'Email', icon: '✉', narration: 'Attending to email: RE: Settlement — Nkosi v Absa', matter: '2024/0512-LIT', units: 1, billable: true, time: '07:45', status: 'approved', source: 'auto' },
      { id: 'S2', type: 'Meeting', icon: '📅', narration: 'Client consultation — Motlhabi Holdings SLA', matter: '2025/0103-COM', units: 5, billable: true, time: '08:30', status: 'approved', source: 'auto' },
      { id: 'S3', type: 'Document', icon: '📄', narration: 'Drafting founding affidavit — Nkosi v Absa Bank', matter: '2024/0512-LIT', units: 6, billable: true, time: '09:15', status: 'approved', source: 'auto' },
      { id: 'S4', type: 'Phone Call', icon: '📞', narration: 'Call with opposing counsel re: postponement', matter: '2024/0888-LIT', units: 2, billable: true, time: '10:00', status: 'approved', source: 'auto' },
      { id: 'S5', type: 'Research', icon: '🔍', narration: 'Legal research — costs orders in urgent applications', matter: '2024/0888-LIT', units: 3, billable: true, time: '10:30', status: 'approved', source: 'auto' },
      { id: 'S6', type: 'Email', icon: '✉', narration: 'Attending to email: FW: FICA docs — Botha transfer', matter: '2025/0391-CON', units: 1, billable: true, time: '11:00', status: 'approved', source: 'auto' },
    ];
    state.entries = seeds;
  }

  // ─── INIT ──────────────────────────────────────────────────────────────────
  function init() {
    // Initialize legacy toast system for compatibility with inline event handlers
    initLegacyToast();
    // Add copyright protection
    addWatermark();
    checkAssessmentIntegrity();
    
    seedEntries();
    initNav();
    initMatterAutocomplete(); // Initialize matter autocomplete
    updateStats();
    startCapture();
    
    // Initialize GP integration
    state.gpIntegration = new GhostPracticeIntegration({
      toast: (msg, type) => showToast(msg, type)
    });
    
    // Initialize legacy pushToGP function for backward compatibility
    initLegacyGPIntegration({
      toast: (msg, type) => showToast(msg, type),
      pushTimeEntries: async (entries) => {
        if (!state.gpIntegration.isConnected()) {
          await state.gpIntegration.authenticate();
        }
        return state.gpIntegration.pushTimeEntries(entries);
      }
    });
    
    // Initialize invoice generator
    state.invoiceGenerator = new InvoiceGenerator({
      toast: (msg, type) => showToast(msg, type)
    }, {
      firmName: 'MOTSOENENG BILL ATTORNEYS',
      firmAddress: 'Houghton Estate, Johannesburg',
      firmContact: 'Tel: +27 11 463 9401 · www.mb.co.za',
      defaultRate: 3500,
      defaultVatRate: 15,
      currency: 'R'
    });
    
    // Initialize legacy invoice functions for backward compatibility
    state.invoiceGenerator.initLegacyFunctions({
      toast: (msg, type) => showToast(msg, type),
      gpIntegration: state.gpIntegration
    });

    // Initial render
    setTimeout(() => {
      renderFeed();
      renderDrafts();
    }, 100);
  }

  document.addEventListener('DOMContentLoaded', init);

  // Public API
  return {
    toggleCapture,
    approveAll,
    approveDraft,
    discardDraft,
    addManualEntry,
    deleteEntry,
    updateInvoicePreview,
    printInvoice,
    pushToGP,
    getApprovedBillableEntries() {
      return state.entries.filter(e => 
        e.status === 'approved' && e.billable
      );
    },
    clearApprovedEntries() {
      state.entries = state.entries.filter(e => 
        !(e.status === 'approved' && e.billable)
      );
      renderEntries();
      updateStats();
    }
  };
})();

// Make App available globally for inline event handlers
window.App = App;