/**
 * TimeLex — MB Attorneys Assessment Presentation
 * Generated with PptxGenJS
 * Author: Kone Tshivhinda
 */

const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author  = "Kone Tshivhinda";
pres.title   = "TimeLex — Automated Legal Time Capture";

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  dark:      "0D0F14",   // near-black bg
  card:      "13161D",   // sidebar / card
  gold:      "C9A84C",   // primary accent
  goldLight: "E8C96A",   // lighter gold
  text:      "E8EAF0",   // body text
  muted:     "7A8299",   // muted text
  dim:       "4A5168",
  green:     "4CAF82",
  red:       "E05C5C",
  blue:      "5B8EF0",
  white:     "FFFFFF",
  border:    "222836",
};

const makeShadow = () => ({ type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.25 });

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function darkSlide(slide) {
  slide.background = { color: C.dark };
}
function lightSlide(slide) {
  slide.background = { color: "F4F6F9" };
}

/** Dark section divider bar at top */
function topBar(slide, color = C.gold) {
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.18, fill: { color }, line: { color, width: 0 } });
}

/** Slide title on dark bg */
function darkTitle(slide, title, sub = "") {
  slide.addText(title, { x: 0.55, y: 0.28, w: 8.9, h: 0.65, fontSize: 28, bold: true, color: C.gold, fontFace: "Georgia", margin: 0 });
  if (sub) {
    slide.addText(sub, { x: 0.55, y: 0.92, w: 8.9, h: 0.35, fontSize: 13, color: C.muted, fontFace: "Calibri", margin: 0 });
  }
}

/** Slide title on light bg */
function lightTitle(slide, title, sub = "") {
  slide.addText(title, { x: 0.5, y: 0.28, w: 9, h: 0.6, fontSize: 28, bold: true, color: "1E2335", fontFace: "Georgia", margin: 0 });
  if (sub) {
    slide.addText(sub, { x: 0.5, y: 0.88, w: 9, h: 0.32, fontSize: 13, color: "5A6480", fontFace: "Calibri", margin: 0 });
  }
}

/** Card on dark background */
function darkCard(slide, x, y, w, h, opts = {}) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: opts.fill || C.card },
    line: { color: opts.border || C.border, width: 1 },
    shadow: makeShadow(),
    ...opts.shape,
  });
}

/** Gold-left-bordered card */
function accentCard(slide, x, y, w, h, fill = C.card) {
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { color: C.border, width: 1 }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.055, h, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
}

/** Stat callout box */
function statBox(slide, x, y, w, h, value, label, color = C.gold) {
  darkCard(slide, x, y, w, h);
  slide.addText(value, { x: x + 0.15, y: y + 0.18, w: w - 0.3, h: 0.55, fontSize: 32, bold: true, color, fontFace: "Calibri", align: "center", margin: 0 });
  slide.addText(label, { x: x + 0.1, y: y + 0.72, w: w - 0.2, h: 0.3, fontSize: 10, color: C.muted, fontFace: "Calibri", align: "center", margin: 0 });
}

// ─── SLIDE 1: TITLE ───────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  darkSlide(s);

  // Full left panel
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 4.5, h: 5.625, fill: { color: C.card }, line: { color: C.border, width: 1 } });
  // Gold accent stripe
  s.addShape(pres.shapes.RECTANGLE, { x: 4.5, y: 0, w: 0.055, h: 5.625, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });

  // Logo / brand mark
  s.addText("⚖", { x: 0.6, y: 0.7, w: 1.2, h: 1.2, fontSize: 64, color: C.gold, align: "center" });
  s.addText("TimeLex", { x: 0.55, y: 1.75, w: 3.6, h: 0.75, fontSize: 36, bold: true, color: C.gold, fontFace: "Georgia", align: "center", margin: 0 });
  s.addText("AUTOMATED LEGAL TIME CAPTURE", {
    x: 0.3, y: 2.5, w: 3.9, h: 0.35,
    fontSize: 9, color: C.muted, fontFace: "Calibri",
    align: "center", charSpacing: 3, margin: 0,
  });

  // Divider
  s.addShape(pres.shapes.LINE, { x: 0.5, y: 3.05, w: 3.5, h: 0, line: { color: C.border, width: 1 } });

  s.addText("© 2026 Kone Tshivhinda", { x: 0.3, y: 3.25, w: 3.9, h: 0.3, fontSize: 10, color: C.dim, fontFace: "Calibri", align: "center", margin: 0 });
  s.addText("Assessment Prototype", { x: 0.3, y: 3.55, w: 3.9, h: 0.25, fontSize: 9, color: C.dim, fontFace: "Calibri", align: "center", italic: true, margin: 0 });

  // Right side content
  s.addText("MB Motsoeneng Bill Attorneys", {
    x: 5, y: 1.0, w: 4.6, h: 0.45,
    fontSize: 14, color: C.muted, fontFace: "Calibri", margin: 0,
  });
  s.addText("Software Engineer Assessment\n2026", {
    x: 5, y: 1.5, w: 4.6, h: 1.1,
    fontSize: 30, bold: true, color: C.text, fontFace: "Georgia", margin: 0,
  });
  s.addShape(pres.shapes.LINE, { x: 5, y: 2.75, w: 4.5, h: 0, line: { color: C.border, width: 1 } });

  const pills = [
    ["◈", "Auto-Capture"],
    ["◎", "Draft & Approve"],
    ["◫", "Invoice Generator"],
  ];
  pills.forEach(([ic, lbl], i) => {
    const py = 3.1 + i * 0.55;
    s.addText(`${ic}  ${lbl}`, { x: 5, y: py, w: 4.4, h: 0.42, fontSize: 13, color: C.text, fontFace: "Calibri", margin: 0 });
  });

  s.addText("Deadline: 7 May 2026", { x: 5, y: 5.05, w: 4.5, h: 0.3, fontSize: 10, color: C.dim, fontFace: "Calibri", italic: true, margin: 0 });
}

// ─── SLIDE 2: THE PROBLEM ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  darkSlide(s);
  topBar(s);
  darkTitle(s, "The Problem", "Why attorneys lose billable time every single day");

  // Left: problem description
  accentCard(s, 0.4, 1.38, 4.7, 3.8);
  s.addText("The Manual Time Capture Trap", { x: 0.6, y: 1.55, w: 4.3, h: 0.45, fontSize: 15, bold: true, color: C.gold, fontFace: "Georgia", margin: 0 });
  const problems = [
    "Attorneys reconstruct their day at end of day — or end of month",
    "Each email, call, meeting must be manually typed into Ghost Practice",
    "Time is lost, misallocated or simply forgotten",
    "Inaccurate billing damages client trust and firm revenue",
    "Ghost Practice costs R33 925/month — yet input is still manual",
    "Litigation attorneys handle thousands of emails per month alone",
  ];
  problems.forEach((p, i) => {
    s.addText([{ text: p, options: { bullet: { code: "25CF", color: C.gold }, breakLine: i < problems.length - 1 } }],
      { x: 0.65, y: 2.05 + i * 0.49, w: 4.25, h: 0.44, fontSize: 11.5, color: C.text, fontFace: "Calibri", margin: 0 });
  });

  // Right: impact stats
  statBox(s, 5.45, 1.38, 2.0, 1.1, "2-3", "Days lost per month\n(Anchané Botha)", C.red);
  statBox(s, 7.6, 1.38, 2.0, 1.1, "R33k", "Monthly cost of\nGhost Practice", C.gold);
  statBox(s, 5.45, 2.65, 2.0, 1.1, "1000+", "Emails/month in\nlitigation", C.blue);
  statBox(s, 7.6, 2.65, 2.0, 1.1, "~40%", "Billable time lost\nto reconstruction", C.red);

  // Quote
  darkCard(s, 5.45, 3.88, 4.15, 1.25, { fill: "181C25" });
  s.addText('"Billing emails is extremely tedious. I lose 2–3 days a month just catching up on fees."', {
    x: 5.65, y: 3.98, w: 3.75, h: 0.75,
    fontSize: 11, color: C.muted, fontFace: "Calibri", italic: true, margin: 0,
  });
  s.addText("— Anchané Botha, Survey Respondent", { x: 5.65, y: 4.72, w: 3.75, h: 0.28, fontSize: 10, color: C.gold, fontFace: "Calibri", margin: 0 });
}

// ─── SLIDE 3: SURVEY INSIGHTS ─────────────────────────────────────────────────
{
  const s = pres.addSlide();
  darkSlide(s);
  topBar(s);
  darkTitle(s, "Survey Insights", "What MB attorneys told us — directly informing TimeLex");

  const insights = [
    { name: "Stephanie Chetty",       role: "Associate Partner",    pain: "Email billing is tedious — thousands of emails per month",       solution: "Auto-detect emails, draft entry per email", icon: "✉", col: C.blue },
    { name: "Anchané Botha",          role: "Attorney",             pain: "Lose 2-3 days/month to fee capture. Can't generate own invoices", solution: "Continuous capture + self-service invoice view", icon: "◫", col: C.gold },
    { name: "Lerato Motlhabi",        role: "Paralegal",            pain: "Want real-time tracking of hours against daily/monthly targets",  solution: "Live dashboard with billing target progress", icon: "◈", col: C.green },
    { name: "Johan Biggs",            role: "Director",             pain: "System should remind attorneys to post fees daily",               solution: "In-app daily capture prompts + real-time stats", icon: "⏰", col: C.gold },
    { name: "Noluthando Matshata",    role: "Attorney",             pain: "Duplicate effort — capture once in system, again for billing",    solution: "One approval click instead of full re-entry", icon: "◎", col: C.blue },
    { name: "Tony Tshivahse",         role: "Director",             pain: "Ghost Practice is not user friendly",                            solution: "Clean, minimal UI — review not retype", icon: "★", col: C.green },
  ];

  insights.forEach((ins, i) => {
    const col = i < 3 ? 0 : 1;
    const row = i % 3;
    const x = 0.35 + col * 4.85;
    const y = 1.35 + row * 1.38;
    darkCard(s, x, y, 4.65, 1.28);
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.055, h: 1.28, fill: { color: ins.col }, line: { color: ins.col, width: 0 } });
    s.addText(ins.icon, { x: x + 0.15, y: y + 0.08, w: 0.45, h: 0.45, fontSize: 18, color: ins.col, align: "center", margin: 0 });
    s.addText(ins.name, { x: x + 0.62, y: y + 0.08, w: 3.8, h: 0.28, fontSize: 11, bold: true, color: C.text, fontFace: "Calibri", margin: 0 });
    s.addText(ins.role, { x: x + 0.62, y: y + 0.34, w: 3.8, h: 0.22, fontSize: 9, color: C.muted, fontFace: "Calibri", italic: true, margin: 0 });
    s.addShape(pres.shapes.LINE, { x: x + 0.62, y: y + 0.58, w: 3.8, h: 0, line: { color: C.border, width: 0.5 } });
    s.addText(`Pain: ${ins.pain}`, { x: x + 0.62, y: y + 0.62, w: 3.8, h: 0.28, fontSize: 9, color: C.muted, fontFace: "Calibri", margin: 0 });
    s.addText(`→ ${ins.solution}`, { x: x + 0.62, y: y + 0.9, w: 3.8, h: 0.28, fontSize: 9, color: ins.col, fontFace: "Calibri", bold: true, margin: 0 });
  });
}

// ─── SLIDE 4: EXISTING TOOLS RESEARCH ────────────────────────────────────────
{
  const s = pres.addSlide();
  lightSlide(s);
  topBar(s);
  lightTitle(s, "Part 1 — Existing Tools Research", "Market evaluation: strengths, weaknesses & applicability to MB");

  const tools = [
    { name: "Toggl Track",    str: "Simple, intuitive UI",              weak: "No legal integrations, no matter system",  fit: "Low",  col: C.red },
    { name: "Clio Manage",    str: "Full legal PMS, time + billing",     weak: "Expensive, not GP-integrated, overseas",   fit: "Med",  col: "E08A3C" },
    { name: "TimeSolv",       str: "Legal-specific time tracking",       weak: "US-focused, no SA GP integration",         fit: "Med",  col: "E08A3C" },
    { name: "Harvest",        str: "Clean UX, Outlook add-in",           weak: "Generic, no matter classification",        fit: "Low",  col: C.red },
    { name: "Ghost Practice", str: "Deep MB integration, already in use",weak: "Purely manual — no auto-capture at all",   fit: "Base", col: C.blue },
    { name: "TimeLex (ours)", str: "Auto-capture + GP integration",      weak: "Prototype — needs production build",       fit: "High", col: C.green },
  ];

  const headers = ["Tool", "Strength", "Weakness", "Fit"];
  const colWidths = [1.6, 2.8, 2.8, 0.9];
  const colX = [0.35, 1.95, 4.75, 7.55];

  // Header row
  headers.forEach((h, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x: colX[i], y: 1.32, w: colWidths[i], h: 0.38, fill: { color: "1E2335" }, line: { color: "1E2335", width: 0 } });
    s.addText(h, { x: colX[i] + 0.08, y: 1.32, w: colWidths[i] - 0.1, h: 0.38, fontSize: 11, bold: true, color: C.white, fontFace: "Calibri", valign: "middle", margin: 0 });
  });

  tools.forEach((t, i) => {
    const y = 1.7 + i * 0.6;
    const rowFill = t.name === "TimeLex (ours)" ? "EAF7F1" : (i % 2 === 0 ? C.white : "F4F6F9");
    colX.forEach((x, ci) => {
      s.addShape(pres.shapes.RECTANGLE, { x, y, w: colWidths[ci], h: 0.55, fill: { color: rowFill }, line: { color: "D8DCE8", width: 0.5 } });
    });
    s.addText(t.name, { x: colX[0] + 0.08, y, w: colWidths[0] - 0.1, h: 0.55, fontSize: 11, bold: t.name === "TimeLex (ours)", color: "1E2335", fontFace: "Calibri", valign: "middle", margin: 0 });
    s.addText(t.str,  { x: colX[1] + 0.08, y, w: colWidths[1] - 0.1, h: 0.55, fontSize: 10, color: "3A4260", fontFace: "Calibri", valign: "middle", margin: 0 });
    s.addText(t.weak, { x: colX[2] + 0.08, y, w: colWidths[2] - 0.1, h: 0.55, fontSize: 10, color: "3A4260", fontFace: "Calibri", valign: "middle", margin: 0 });
    s.addShape(pres.shapes.RECTANGLE, { x: colX[3] + 0.12, y: y + 0.1, w: 0.65, h: 0.35, fill: { color: t.col }, line: { color: t.col, width: 0 }, rectRadius: 0.05 });
    s.addText(t.fit, { x: colX[3] + 0.12, y: y + 0.1, w: 0.65, h: 0.35, fontSize: 10, bold: true, color: C.white, fontFace: "Calibri", align: "center", valign: "middle", margin: 0 });
  });

  s.addText("Conclusion: No existing tool auto-captures activity AND integrates natively with Ghost Practice — that gap is exactly what TimeLex fills.", {
    x: 0.35, y: 5.2, w: 9.3, h: 0.28, fontSize: 10.5, color: "3A4260", fontFace: "Calibri", italic: true, margin: 0,
  });
}

// ─── SLIDE 5: PROPOSED SOLUTION OVERVIEW ─────────────────────────────────────
{
  const s = pres.addSlide();
  darkSlide(s);
  topBar(s);
  darkTitle(s, "Part 2 — Proposed Solution: TimeLex", "Automatic capture → attorney review → Ghost Practice sync → invoice");

  // Central flow diagram
  const steps = [
    { label: "Outlook\nCalendar\nWord / Teams", icon: "◉", y: 1.45, col: C.blue,  title: "Activity Detection" },
    { label: "AI classifies\nactivity type &\nmatter", icon: "◎", y: 1.45, col: C.gold,  title: "Smart Classification" },
    { label: "Draft entry\ncreated for\nattorney review", icon: "◈", y: 1.45, col: "E08A3C", title: "Draft Generation" },
    { label: "One-click\napprove or\nadjust matter", icon: "✓", y: 1.45, col: C.green, title: "Attorney Approval" },
    { label: "Sync to GP\nGenerate\ninvoice", icon: "◫", y: 1.45, col: C.gold,  title: "Billing Output" },
  ];

  const boxW = 1.6;
  const startX = 0.35;
  const spacing = 1.72;

  steps.forEach((step, i) => {
    const x = startX + i * spacing;
    // Box
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.35, w: boxW, h: 2.5, fill: { color: C.card }, line: { color: step.col, width: 1.5 }, shadow: makeShadow() });
    // Top accent
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.35, w: boxW, h: 0.12, fill: { color: step.col }, line: { color: step.col, width: 0 } });
    // Number
    s.addText(String(i + 1), { x, y: 1.47, w: boxW, h: 0.35, fontSize: 11, color: step.col, fontFace: "Calibri", bold: true, align: "center", margin: 0 });
    // Icon
    s.addText(step.icon, { x, y: 1.82, w: boxW, h: 0.55, fontSize: 28, color: step.col, align: "center", margin: 0 });
    // Title
    s.addText(step.title, { x: x + 0.05, y: 2.38, w: boxW - 0.1, h: 0.35, fontSize: 10.5, bold: true, color: C.text, fontFace: "Calibri", align: "center", margin: 0 });
    // Body
    s.addText(step.label, { x: x + 0.08, y: 2.73, w: boxW - 0.16, h: 0.9, fontSize: 9.5, color: C.muted, fontFace: "Calibri", align: "center", margin: 0 });
    // Arrow
    if (i < steps.length - 1) {
      s.addShape(pres.shapes.LINE, { x: x + boxW, y: 2.6, w: spacing - boxW, h: 0, line: { color: C.gold, width: 1.5 } });
      s.addText("›", { x: x + boxW + (spacing - boxW) / 2 - 0.1, y: 2.48, w: 0.2, h: 0.2, fontSize: 12, color: C.gold, align: "center", margin: 0 });
    }
  });

  // Key benefits row
  const benefits = [
    ["Zero re-typing", "Attorney approves, never re-enters"],
    ["6-min unit accuracy", "Standard legal billing precision"],
    ["GP-ready output", "Structured for Ghost Practice API"],
    ["Self-service invoices", "No secretary required"],
  ];

  benefits.forEach(([title, body], i) => {
    const x = 0.35 + i * 2.38;
    darkCard(s, x, 4.05, 2.25, 1.3);
    s.addText(title, { x: x + 0.15, y: 4.15, w: 1.95, h: 0.32, fontSize: 11, bold: true, color: C.gold, fontFace: "Calibri", margin: 0 });
    s.addText(body,  { x: x + 0.15, y: 4.48, w: 1.95, h: 0.72, fontSize: 10, color: C.muted, fontFace: "Calibri", margin: 0 });
  });
}

// ─── SLIDE 6: AUTO-CAPTURE ENGINE ────────────────────────────────────────────
{
  const s = pres.addSlide();
  darkSlide(s);
  topBar(s);
  darkTitle(s, "Feature 1 — Auto-Capture Engine", "capture-engine.js  ·  Simulates real-time activity detection");

  // Integration chips
  const chips = [
    { label: "✉  Outlook",        connected: true  },
    { label: "📅  Google Calendar", connected: true  },
    { label: "📄  Word / Docs",    connected: true  },
    { label: "📞  Teams / Calls",  connected: false },
    { label: "🔗  Ghost Practice", connected: true  },
  ];
  chips.forEach((c, i) => {
    const x = 0.4 + i * 1.87;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.32, w: 1.72, h: 0.4,
      fill: { color: c.connected ? "0D2E1F" : C.card },
      line: { color: c.connected ? C.green : C.border, width: 1 },
    });
    s.addText(c.label, { x: x + 0.06, y: 1.32, w: 1.6, h: 0.4, fontSize: 10.5, color: c.connected ? C.green : C.muted, fontFace: "Calibri", valign: "middle", margin: 0 });
  });

  // Activity types column
  const activities = [
    { type: "Email",    icon: "✉", col: C.blue,  units: "1–2 units",  detail: "Subject, sender, thread detected" },
    { type: "Meeting",  icon: "📅", col: C.green, units: "5–10 units", detail: "Duration from calendar event" },
    { type: "Document", icon: "📄", col: C.blue,  units: "3–8 units",  detail: "File open/edit time tracked" },
    { type: "Call",     icon: "📞", col: "E08A3C", units: "1–3 units", detail: "Call duration from Teams/Zoom" },
    { type: "Research", icon: "🔍", col: C.gold,  units: "3–6 units",  detail: "Browser tab activity monitored" },
  ];

  activities.forEach((a, i) => {
    const y = 1.92 + i * 0.68;
    accentCard(s, 0.4, y, 4.5, 0.62, C.card);
    s.addShape(pres.shapes.RECTANGLE, { x: 0.55, y: y + 0.1, w: 0.4, h: 0.4, fill: { color: a.col + "22" }, line: { color: a.col, width: 1 } });
    s.addText(a.icon, { x: 0.55, y: y + 0.1, w: 0.4, h: 0.4, fontSize: 14, color: a.col, align: "center", margin: 0 });
    s.addText(a.type, { x: 1.05, y: y + 0.08, w: 1.4, h: 0.25, fontSize: 12, bold: true, color: C.text, fontFace: "Calibri", margin: 0 });
    s.addText(a.detail, { x: 1.05, y: y + 0.34, w: 2.5, h: 0.22, fontSize: 9.5, color: C.muted, fontFace: "Calibri", margin: 0 });
    s.addShape(pres.shapes.RECTANGLE, { x: 3.6, y: y + 0.1, w: 1.1, h: 0.38, fill: { color: a.col + "22" }, line: { color: a.col, width: 0.5 } });
    s.addText(a.units, { x: 3.6, y: y + 0.1, w: 1.1, h: 0.38, fontSize: 9, color: a.col, fontFace: "Calibri", align: "center", valign: "middle", bold: true, margin: 0 });
  });

  // Right: how it works
  darkCard(s, 5.15, 1.35, 4.5, 3.9);
  s.addText("How the Engine Works", { x: 5.35, y: 1.48, w: 4.1, h: 0.38, fontSize: 14, bold: true, color: C.gold, fontFace: "Georgia", margin: 0 });
  const steps2 = [
    ["1. Poll integrations", "Each source (Outlook, Calendar, Word…) is polled on a randomised interval (8–15 sec in prototype; real-time via webhooks in production)"],
    ["2. Classify activity", "Activity type determined by source + content. Matter matched via keyword rules & title pattern extraction"],
    ["3. Calculate units", "Duration converted to 6-minute billing increments, rounded up per legal industry standard"],
    ["4. Generate narration", "Auto-written from activity metadata — attorney corrects if needed, not re-types from scratch"],
  ];
  steps2.forEach(([title, body], i) => {
    const y = 2.0 + i * 0.82;
    s.addText(title, { x: 5.35, y, w: 4.05, h: 0.28, fontSize: 11, bold: true, color: C.text, fontFace: "Calibri", margin: 0 });
    s.addText(body,  { x: 5.35, y: y + 0.28, w: 4.05, h: 0.48, fontSize: 9.5, color: C.muted, fontFace: "Calibri", margin: 0 });
  });
}

// ─── SLIDE 7: DRAFT & APPROVE WORKFLOW ───────────────────────────────────────
{
  const s = pres.addSlide();
  darkSlide(s);
  topBar(s);
  darkTitle(s, "Feature 2 — Draft & Approve Workflow", "The core UX principle: attorney reviews, never re-types");

  // Before column
  darkCard(s, 0.35, 1.35, 4.35, 3.9);
  s.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 1.35, w: 4.35, h: 0.38, fill: { color: C.red + "33" }, line: { color: C.red, width: 1 } });
  s.addText("❌  BEFORE  (Ghost Practice Today)", { x: 0.5, y: 1.35, w: 4.05, h: 0.38, fontSize: 11, bold: true, color: C.red, fontFace: "Calibri", valign: "middle", margin: 0 });

  const before = [
    "Attorney finishes a full day of work",
    'Opens Ghost Practice → clicks "New Time Entry"',
    "Tries to remember: what did I do? For which client?",
    "Types narration from memory",
    "Looks up matter number manually",
    "Calculates time in 6-min units manually",
    "Repeats for EVERY email, call, meeting",
    "Takes 1-3 hours — at end of an already long day",
  ];
  before.forEach((b, i) => {
    s.addText([{ text: b, options: { bullet: { code: "25CF", color: C.red }, breakLine: i < before.length - 1 } }],
      { x: 0.55, y: 1.85 + i * 0.4, w: 3.95, h: 0.38, fontSize: 10.5, color: C.text, fontFace: "Calibri", margin: 0 });
  });

  // After column
  darkCard(s, 5.0, 1.35, 4.65, 3.9);
  s.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 1.35, w: 4.65, h: 0.38, fill: { color: C.green + "33" }, line: { color: C.green, width: 1 } });
  s.addText("✓  AFTER  (TimeLex)", { x: 5.15, y: 1.35, w: 4.3, h: 0.38, fontSize: 11, bold: true, color: C.green, fontFace: "Calibri", valign: "middle", margin: 0 });

  const after = [
    "TimeLex detects every email, meeting, call automatically",
    "Draft entry created instantly with narration + units",
    "Attorney sees inbox of pending drafts",
    "Assigns matter number (autocomplete list)",
    "Clicks ✓ Approve — done in 1 click",
    "Or adjusts narration if needed",
    '"Approve All" for a full day in one click',
    "Entire process: 5 minutes maximum",
  ];
  after.forEach((a, i) => {
    s.addText([{ text: a, options: { bullet: { code: "25CF", color: C.green }, breakLine: i < after.length - 1 } }],
      { x: 5.18, y: 1.85 + i * 0.4, w: 4.2, h: 0.38, fontSize: 10.5, color: C.text, fontFace: "Calibri", margin: 0 });
  });

  // Arrow between
  s.addText("→", { x: 4.6, y: 3.1, w: 0.5, h: 0.4, fontSize: 24, color: C.gold, align: "center", margin: 0 });
}

// ─── SLIDE 8: DASHBOARD + TARGET TRACKING ────────────────────────────────────
{
  const s = pres.addSlide();
  darkSlide(s);
  topBar(s);
  darkTitle(s, "Feature 3 — Live Dashboard & Target Tracking", "Requested by Lerato Motlhabi, Johan Biggs & Anchané Botha");

  // Stat cards
  const stats = [
    { val: "2.8 h", lbl: "Today's Billable Hours", sub: "28 units", col: C.gold },
    { val: "50.6 h", lbl: "Month to Date", sub: "of 150 h target", col: C.green },
    { val: "3", lbl: "Pending Review", sub: "draft entries", col: C.gold },
    { val: "8", lbl: "Matters Active", sub: "today", col: C.blue },
  ];
  stats.forEach((st, i) => {
    const x = 0.35 + i * 2.38;
    darkCard(s, x, 1.35, 2.25, 1.2);
    s.addText(st.lbl, { x: x + 0.12, y: 1.45, w: 2.0, h: 0.25, fontSize: 9, color: C.muted, fontFace: "Calibri", bold: true, charSpacing: 1, margin: 0 });
    s.addText(st.val, { x: x + 0.12, y: 1.68, w: 2.0, h: 0.52, fontSize: 28, bold: true, color: st.col, fontFace: "Calibri", margin: 0 });
    s.addText(st.sub, { x: x + 0.12, y: 2.18, w: 2.0, h: 0.22, fontSize: 9, color: C.dim, fontFace: "Calibri", margin: 0 });
  });

  // Progress bar (native chart as stacked bar)
  darkCard(s, 0.35, 2.75, 9.3, 0.95);
  s.addText("Monthly Billing Target", { x: 0.55, y: 2.82, w: 3, h: 0.28, fontSize: 11, bold: true, color: C.muted, fontFace: "Calibri", charSpacing: 1, margin: 0 });
  s.addText("33.7%", { x: 8.9, y: 2.82, w: 0.55, h: 0.28, fontSize: 14, bold: true, color: C.gold, fontFace: "Calibri", align: "right", margin: 0 });
  // Progress track
  s.addShape(pres.shapes.RECTANGLE, { x: 0.55, y: 3.2, w: 8.85, h: 0.24, fill: { color: C.border }, line: { color: C.border, width: 0 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.55, y: 3.2, w: 8.85 * 0.337, h: 0.24, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
  s.addText("50.6 h billed", { x: 0.55, y: 3.48, w: 3, h: 0.2, fontSize: 9.5, color: C.muted, fontFace: "Calibri", margin: 0 });
  s.addText("150 h target  ·  99.4 h remaining", { x: 6.0, y: 3.48, w: 3.5, h: 0.2, fontSize: 9.5, color: C.muted, fontFace: "Calibri", align: "right", margin: 0 });

  // Two columns: feed + drafts
  darkCard(s, 0.35, 3.9, 4.6, 1.5);
  s.addText("Live Activity Feed", { x: 0.55, y: 3.97, w: 3, h: 0.28, fontSize: 10, bold: true, color: C.muted, fontFace: "Calibri", charSpacing: 1, margin: 0 });
  const feedItems = [
    { icon: "✉", t: "Re: Discovery — Nkosi v Absa", m: "Email · 1 unit", time: "14:32" },
    { icon: "📄", t: "Drafting founding affidavit", m: "Document · 5 units", time: "13:15" },
  ];
  feedItems.forEach((fi, i) => {
    const y = 4.32 + i * 0.52;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.45, y, w: 4.38, h: 0.46, fill: { color: "181C25" }, line: { color: C.border, width: 0.5 } });
    s.addText(fi.icon, { x: 0.58, y: y + 0.06, w: 0.32, h: 0.32, fontSize: 14, color: C.blue, align: "center", margin: 0 });
    s.addText(fi.t, { x: 0.98, y: y + 0.05, w: 2.9, h: 0.2, fontSize: 10, bold: true, color: C.text, fontFace: "Calibri", margin: 0 });
    s.addText(fi.m, { x: 0.98, y: y + 0.24, w: 2.9, h: 0.18, fontSize: 9, color: C.muted, fontFace: "Calibri", margin: 0 });
    s.addText(fi.time, { x: 4.05, y: y + 0.12, w: 0.65, h: 0.2, fontSize: 9, color: C.dim, fontFace: "Calibri", align: "right", margin: 0 });
  });

  darkCard(s, 5.1, 3.9, 4.55, 1.5);
  s.addText("Draft Entries  (pending review)", { x: 5.3, y: 3.97, w: 3.4, h: 0.28, fontSize: 10, bold: true, color: C.muted, fontFace: "Calibri", charSpacing: 1, margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 4.32, w: 4.28, h: 0.9, fill: { color: "181C25" }, line: { color: C.gold + "66", width: 1 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 4.32, w: 0.055, h: 0.9, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
  s.addText("✉ EMAIL", { x: 5.35, y: 4.38, w: 1.2, h: 0.22, fontSize: 9, bold: true, color: C.gold, fontFace: "Calibri", margin: 0 });
  s.addText("1 unit · 14:32", { x: 7.65, y: 4.38, w: 1.5, h: 0.22, fontSize: 9, color: C.muted, fontFace: "Calibri", align: "right", margin: 0 });
  s.addText("Attending to email: Re: Discovery Documents — Nkosi v Absa", { x: 5.35, y: 4.62, w: 3.95, h: 0.22, fontSize: 9, color: C.muted, fontFace: "Calibri", margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 7.3, y: 4.9, w: 0.9, h: 0.25, fill: { color: C.green + "22" }, line: { color: C.green, width: 0.5 } });
  s.addText("✓ Approve", { x: 7.3, y: 4.9, w: 0.9, h: 0.25, fontSize: 9, bold: true, color: C.green, fontFace: "Calibri", align: "center", valign: "middle", margin: 0 });
}

// ─── SLIDE 9: INVOICE GENERATOR ──────────────────────────────────────────────
{
  const s = pres.addSlide();
  darkSlide(s);
  topBar(s);
  darkTitle(s, "Feature 4 — Invoice Generator", "Requested by Anchané Botha: generate pro-formas without the secretary");

  // Settings panel (left)
  darkCard(s, 0.35, 1.35, 3.6, 3.95);
  s.addText("Invoice Settings", { x: 0.55, y: 1.48, w: 3.2, h: 0.3, fontSize: 12, bold: true, color: C.muted, fontFace: "Calibri", charSpacing: 1, margin: 0 });
  const settings = [
    ["Matter", "2024/0512-LIT — Nkosi v Absa Bank"],
    ["Invoice Type", "Pro-Forma"],
    ["Hourly Rate", "R 3 500"],
    ["VAT Rate", "15%"],
  ];
  settings.forEach(([lbl, val], i) => {
    const y = 1.92 + i * 0.72;
    s.addText(lbl.toUpperCase(), { x: 0.55, y, w: 3.2, h: 0.22, fontSize: 9, color: C.dim, fontFace: "Calibri", bold: true, charSpacing: 1, margin: 0 });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.55, y: y + 0.24, w: 3.2, h: 0.35, fill: { color: "181C25" }, line: { color: C.border, width: 1 } });
    s.addText(val, { x: 0.68, y: y + 0.24, w: 3.0, h: 0.35, fontSize: 11, color: C.text, fontFace: "Calibri", valign: "middle", margin: 0 });
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.55, y: 4.82, w: 3.2, h: 0.38, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
  s.addText("Generate Preview", { x: 0.55, y: 4.82, w: 3.2, h: 0.38, fontSize: 12, bold: true, color: C.dark, fontFace: "Calibri", align: "center", valign: "middle", margin: 0 });

  // Invoice preview (right, white card)
  s.addShape(pres.shapes.RECTANGLE, { x: 4.15, y: 1.35, w: 5.5, h: 3.95, fill: { color: C.white }, line: { color: "D0D5E8", width: 1 }, shadow: makeShadow() });
  s.addText("MOTSOENENG BILL ATTORNEYS", { x: 4.3, y: 1.48, w: 3.5, h: 0.3, fontSize: 11, bold: true, color: "0D0F14", fontFace: "Georgia", margin: 0 });
  s.addText("Houghton Estate, Johannesburg  ·  +27 11 463 9401", { x: 4.3, y: 1.78, w: 3.5, h: 0.2, fontSize: 8, color: "666666", fontFace: "Calibri", margin: 0 });
  s.addText("PRO-FORMA INVOICE", { x: 7.5, y: 1.48, w: 2.0, h: 0.2, fontSize: 8, bold: true, color: "B8860B", fontFace: "Calibri", align: "right", charSpacing: 1, margin: 0 });
  s.addText("#PF-2026-0422", { x: 7.5, y: 1.68, w: 2.0, h: 0.25, fontSize: 13, bold: true, color: "0D0F14", fontFace: "Calibri", align: "right", margin: 0 });
  s.addShape(pres.shapes.LINE, { x: 4.25, y: 2.05, w: 5.25, h: 0, line: { color: "0D0F14", width: 1.5 } });
  s.addText("BILL TO", { x: 4.3, y: 2.12, w: 2, h: 0.2, fontSize: 8, color: "888888", fontFace: "Calibri", charSpacing: 1, margin: 0 });
  s.addText("Nkosi v Absa Bank", { x: 4.3, y: 2.32, w: 3, h: 0.25, fontSize: 11, bold: true, color: "0D0F14", fontFace: "Calibri", margin: 0 });
  s.addText("Matter: 2024/0512-LIT", { x: 4.3, y: 2.56, w: 3, h: 0.2, fontSize: 9, color: "555555", fontFace: "Calibri", margin: 0 });

  // Table header
  s.addShape(pres.shapes.RECTANGLE, { x: 4.25, y: 2.85, w: 5.25, h: 0.28, fill: { color: "0D0F14" }, line: { color: "0D0F14", width: 0 } });
  ["Description", "Units", "Hrs", "Amount (R)"].forEach((h, i) => {
    const hx = [4.3, 7.1, 7.55, 8.15];
    const hw = [2.7, 0.4, 0.55, 1.2];
    s.addText(h, { x: hx[i], y: 2.85, w: hw[i], h: 0.28, fontSize: 8, bold: true, color: C.gold, fontFace: "Calibri", valign: "middle", margin: 0 });
  });

  const lineItems = [
    ["Attending to email: RE: Settlement — Nkosi v Absa", "1", "0.1", "350.00"],
    ["Drafting founding affidavit", "6", "0.6", "2 100.00"],
    ["Call with opposing counsel re: postponement", "2", "0.2", "700.00"],
  ];
  lineItems.forEach(([desc, u, h, amt], i) => {
    const y = 3.17 + i * 0.28;
    const bg = i % 2 === 0 ? C.white : "F4F6F9";
    s.addShape(pres.shapes.RECTANGLE, { x: 4.25, y, w: 5.25, h: 0.28, fill: { color: bg }, line: { color: "EEEEEE", width: 0.5 } });
    s.addText(desc, { x: 4.3, y, w: 2.7, h: 0.28, fontSize: 8.5, color: "1A1A2E", fontFace: "Calibri", valign: "middle", margin: 0 });
    [u, h, amt].forEach((v, vi) => {
      const vx = [7.1, 7.55, 8.15];
      s.addText(v, { x: vx[vi], y, w: 0.55, h: 0.28, fontSize: 8.5, color: "1A1A2E", fontFace: "Calibri", valign: "middle", margin: 0 });
    });
  });
  s.addShape(pres.shapes.LINE, { x: 4.25, y: 4.0, w: 5.25, h: 0, line: { color: "DDDDDD", width: 0.5 } });

  const totals = [["Subtotal", "R 3 150.00"], ["VAT (15%)", "R 472.50"], ["TOTAL DUE", "R 3 622.50"]];
  totals.forEach(([lbl, val], i) => {
    const y = 4.05 + i * 0.28;
    s.addText(lbl, { x: 7.4, y, w: 1.2, h: 0.26, fontSize: i === 2 ? 10 : 9, bold: i === 2, color: i === 2 ? "0D0F14" : "555555", fontFace: "Calibri", margin: 0 });
    s.addText(val, { x: 8.3, y, w: 1.35, h: 0.26, fontSize: i === 2 ? 10 : 9, bold: i === 2, color: i === 2 ? "0D0F14" : "555555", fontFace: "Calibri", align: "right", margin: 0 });
  });

  s.addText("Generated by TimeLex  ·  Entries verified and approved by fee earner", {
    x: 4.25, y: 5.12, w: 5.25, h: 0.2, fontSize: 7.5, color: "AAAAAA", fontFace: "Calibri", align: "center", margin: 0,
  });
}

// ─── SLIDE 10: TECHNICAL ARCHITECTURE ────────────────────────────────────────
{
  const s = pres.addSlide();
  darkSlide(s);
  topBar(s);
  darkTitle(s, "Part 3 — Technical Architecture", "Modular ES6+ frontend · Ghost Practice API integration · POPIA-compliant");

  // Architecture layers
  const layers = [
    { label: "ATTORNEY'S TOOLS", items: ["Outlook", "Google Calendar", "Word / Docs", "Teams / Zoom", "Browser"], col: C.blue,  y: 1.35 },
    { label: "TIMELEX CAPTURE ENGINE", items: ["Activity classifier", "Matter matcher (regex + AI)", "Unit calculator (÷6 min)", "Narration generator", "Draft creator"], col: C.gold,  y: 2.4  },
    { label: "TIMELEX DASHBOARD (UI)", items: ["Dashboard", "Live Capture", "Time Entries", "Invoice Generator"], col: "E08A3C", y: 3.45 },
    { label: "OUTPUT / INTEGRATION",   items: ["Ghost Practice API", "CSV export (fallback)", "Pro-forma / Tax invoices"], col: C.green, y: 4.5  },
  ];

  layers.forEach(layer => {
    // Layer box
    s.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: layer.y, w: 6.8, h: 0.9, fill: { color: C.card }, line: { color: layer.col, width: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: layer.y, w: 0.055, h: 0.9, fill: { color: layer.col }, line: { color: layer.col, width: 0 } });
    s.addText(layer.label, { x: 0.55, y: layer.y + 0.06, w: 2.4, h: 0.25, fontSize: 9, bold: true, color: layer.col, fontFace: "Calibri", charSpacing: 1, margin: 0 });
    layer.items.forEach((item, i) => {
      const x = 0.6 + i * 1.28;
      s.addShape(pres.shapes.RECTANGLE, { x, y: layer.y + 0.35, w: 1.18, h: 0.42, fill: { color: layer.col + "22" }, line: { color: layer.col + "66", width: 0.5 } });
      s.addText(item, { x, y: layer.y + 0.35, w: 1.18, h: 0.42, fontSize: 8.5, color: C.text, fontFace: "Calibri", align: "center", valign: "middle", margin: 0 });
    });
    // Arrow down
    if (layer.y < 4.5) {
      s.addShape(pres.shapes.LINE, { x: 3.75, y: layer.y + 0.9, w: 0, h: 0.17, line: { color: layer.col, width: 1.5 } });
    }
  });

  // Right: tech stack
  darkCard(s, 7.38, 1.35, 2.27, 4.05);
  s.addText("Tech Stack", { x: 7.55, y: 1.48, w: 1.9, h: 0.28, fontSize: 12, bold: true, color: C.gold, fontFace: "Georgia", margin: 0 });
  const stack = [
    ["Frontend",   "HTML · CSS · ES6+"],
    ["Modules",    "ES Modules (import)"],
    ["Styling",    "CSS variables, 5-file"],
    ["GP API",     "REST / OAuth2"],
    ["MS Graph",   "Outlook webhooks"],
    ["Prod ready", "React + Node.js"],
  ];
  stack.forEach(([lbl, val], i) => {
    const y = 1.88 + i * 0.55;
    s.addText(lbl, { x: 7.55, y, w: 1.0, h: 0.22, fontSize: 9, color: C.muted, fontFace: "Calibri", bold: true, margin: 0 });
    s.addText(val,  { x: 7.55, y: y + 0.22, w: 1.95, h: 0.26, fontSize: 9.5, color: C.text, fontFace: "Calibri", margin: 0 });
  });
}

// ─── SLIDE 11: CODE ARCHITECTURE ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  darkSlide(s);
  topBar(s);
  darkTitle(s, "Code Architecture", "Modular by design — each file has a single clear responsibility");

  const files = [
    { name: "app.js",               size: "~400 lines", role: "Global state, navigation, init, public API (window.App). All views wired here.", col: C.gold,  icon: "◈" },
    { name: "capture-engine.js",    size: "~500 lines", role: "CaptureEngine class + 7 integration sub-classes (Outlook, Calendar, Word, Docs, Teams, Zoom, Browser). ActivityType / CaptureStatus enums.", col: C.blue,  icon: "◎" },
    { name: "invoice-generator.js", size: "~300 lines", role: "InvoiceGenerator class. Generates preview, renders DOM invoice, pushes to Ghost Practice. InvoiceType enum.", col: "E08A3C", icon: "◫" },
    { name: "gp-integration.js",    size: "~280 lines", role: "GhostPracticeIntegration class. Simulates OAuth2 auth, pushTimeEntries(), syncMatters(), generateInvoice().", col: C.green, icon: "⊕" },
    { name: "utils/date-helpers.js",size: "~150 lines", role: "toBillingUnits(), formatDuration(), getBillingPeriodStart(), business day helpers.", col: C.muted, icon: "⌚" },
    { name: "utils/matter-lookup.js",size:"~200 lines", role: "isValidMatterNumber(), searchMatters(), getMatterSuggestions(), createMatter(), sortMattersByRecency().", col: C.muted, icon: "🔍" },
    { name: "utils/toast-notification.js", size:"~150 lines", role: "showToast(), showSuccess/Error/Warning/Info(). Full toast container system with animations.", col: C.muted, icon: "◉" },
    { name: "styles/ (5 CSS files)", size: "~600 lines", role: "main.css · dashboard.css · capture.css · entries.css · invoice.css. CSS custom property theming throughout.", col: C.dim,  icon: "◧" },
  ];

  files.forEach((f, i) => {
    const col2 = i < 4 ? 0 : 1;
    const row  = i % 4;
    const x = 0.35 + col2 * 4.88;
    const y = 1.35 + row * 1.04;
    darkCard(s, x, y, 4.65, 0.97);
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.055, h: 0.97, fill: { color: f.col }, line: { color: f.col, width: 0 } });
    s.addText(f.name, { x: x + 0.18, y: y + 0.08, w: 2.8, h: 0.25, fontSize: 11, bold: true, color: C.text, fontFace: "Calibri", margin: 0 });
    s.addShape(pres.shapes.RECTANGLE, { x: x + 3.45, y: y + 0.1, w: 1.0, h: 0.22, fill: { color: f.col + "33" }, line: { color: f.col + "66", width: 0.5 } });
    s.addText(f.size, { x: x + 3.45, y: y + 0.1, w: 1.0, h: 0.22, fontSize: 8.5, color: f.col, fontFace: "Calibri", align: "center", valign: "middle", margin: 0 });
    s.addText(f.role, { x: x + 0.18, y: y + 0.36, w: 4.25, h: 0.52, fontSize: 9.5, color: C.muted, fontFace: "Calibri", margin: 0 });
  });
}

// ─── SLIDE 12: GHOST PRACTICE INTEGRATION ────────────────────────────────────
{
  const s = pres.addSlide();
  darkSlide(s);
  topBar(s);
  darkTitle(s, "Ghost Practice Integration", "gp-integration.js  ·  Simulated OAuth2 + REST API flow");

  // Flow diagram
  const flowSteps = [
    { label: "Attorney\nApproves Draft", col: C.gold },
    { label: "createGPTimeEntry()\nformat conversion", col: "E08A3C" },
    { label: "GP Auth\nOAuth2 token", col: C.blue },
    { label: "pushTimeEntries()\nREST POST", col: C.green },
    { label: "Ghost Practice\nDatabase", col: C.green },
  ];
  flowSteps.forEach((step, i) => {
    const x = 0.4 + i * 1.88;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.35, w: 1.68, h: 1.1, fill: { color: C.card }, line: { color: step.col, width: 1.5 }, shadow: makeShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.35, w: 1.68, h: 0.12, fill: { color: step.col }, line: { color: step.col, width: 0 } });
    s.addText(step.label, { x: x + 0.08, y: 1.52, w: 1.52, h: 0.82, fontSize: 10.5, color: C.text, fontFace: "Calibri", align: "center", valign: "middle", margin: 0 });
    if (i < flowSteps.length - 1) {
      s.addShape(pres.shapes.LINE, { x: x + 1.68, y: 1.9, w: 0.2, h: 0, line: { color: C.gold, width: 1.5 } });
    }
  });

  // Key methods
  s.addText("Key Methods in GhostPracticeIntegration Class", { x: 0.4, y: 2.65, w: 9.2, h: 0.3, fontSize: 12, bold: true, color: C.muted, fontFace: "Calibri", charSpacing: 1, margin: 0 });

  const methods = [
    { name: "authenticate()",       desc: "Simulates OAuth2 flow. Stores access + refresh tokens. In production: real GP OAuth endpoint." },
    { name: "pushTimeEntry(entry)", desc: "Converts TimeLex entry to GP format. POSTs to /time-entries. Returns success/failure." },
    { name: "pushTimeEntries([])",  desc: "Batch push with rate-limit delays between entries. Shows success/fail summary toast." },
    { name: "syncMatters()",        desc: "Fetches all active matters from GP. Populates matter autocomplete dropdown." },
    { name: "generateInvoice()",    desc: "Generates pro-forma or final invoice in GP. Returns invoice number." },
    { name: "createGPTimeEntries()","desc": "Factory function — transforms TimeLex entry array to GP-ready format (YYYY-MM-DD, units, narration)." },
  ];
  methods.forEach((m, i) => {
    const col = i < 3 ? 0 : 1;
    const row = i % 3;
    const x = 0.4 + col * 4.88;
    const y = 3.05 + row * 0.84;
    darkCard(s, x, y, 4.65, 0.78);
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.12, y: y + 0.1, w: 2.5, h: 0.25, fill: { color: "181C25" }, line: { color: C.border, width: 0.5 } });
    s.addText(m.name, { x: x + 0.17, y: y + 0.1, w: 2.5, h: 0.25, fontSize: 10, color: C.gold, fontFace: "Calibri", bold: true, margin: 0 });
    s.addText(m.desc, { x: x + 0.17, y: y + 0.4, w: 4.2, h: 0.35, fontSize: 9.5, color: C.muted, fontFace: "Calibri", margin: 0 });
  });
}

// ─── SLIDE 13: RISK & COMPLIANCE ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  darkSlide(s);
  topBar(s, C.red);
  darkTitle(s, "Part 5 — Risk & Compliance", "POPIA · Attorney-Client Privilege · Ethics · Adoption");

  const risks = [
    { risk: "Attorney-Client Privilege", impact: "High", detail: "Only activity metadata captured — no email content stored. Entries stored locally, never third-party cloud.", mitigation: "Zero content logging policy + on-premise deployment option", col: C.red },
    { risk: "POPIA Compliance",          impact: "High", detail: "All personal data (matters, clients, billing) stays within firm infrastructure. No third-party analytics.", mitigation: "Firm-hosted deployment + data residency in South Africa", col: C.red },
    { risk: "Overbilling Risk",          impact: "High", detail: "Auto-capture could log non-billable activities as billable if not reviewed.", mitigation: "Attorney approval required before any entry is billed — no blind auto-posting ever", col: "E08A3C" },
    { risk: "Ghost Practice API Availability", impact: "Med", detail: "GP API may be unavailable or restricted during outages.", mitigation: "CSV export fallback — entries always exportable regardless of GP connection", col: "E08A3C" },
    { risk: "Adoption Resistance",       impact: "Med", detail: "Attorneys may resist changing established (if inefficient) habits.", mitigation: "Minimal behaviour change — review instead of re-type. No new login or tool to learn", col: C.gold },
    { risk: "Inaccurate Matter Matching",impact: "Med", detail: "AI keyword matching may assign wrong matter to an activity.", mitigation: "Matter is always editable before approval. Attorney is final decision-maker", col: C.gold },
  ];

  risks.forEach((r, i) => {
    const col = i < 3 ? 0 : 1;
    const row = i % 3;
    const x = 0.35 + col * 4.88;
    const y = 1.35 + row * 1.35;
    darkCard(s, x, y, 4.65, 1.28);
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.055, h: 1.28, fill: { color: r.col }, line: { color: r.col, width: 0 } });
    // Impact badge
    s.addShape(pres.shapes.RECTANGLE, { x: x + 3.55, y: y + 0.1, w: 0.9, h: 0.25, fill: { color: r.col + "33" }, line: { color: r.col, width: 0.5 } });
    s.addText(r.impact, { x: x + 3.55, y: y + 0.1, w: 0.9, h: 0.25, fontSize: 9, bold: true, color: r.col, fontFace: "Calibri", align: "center", valign: "middle", margin: 0 });
    s.addText(r.risk, { x: x + 0.2, y: y + 0.08, w: 3.2, h: 0.28, fontSize: 11, bold: true, color: C.text, fontFace: "Calibri", margin: 0 });
    s.addText(r.detail, { x: x + 0.2, y: y + 0.38, w: 4.2, h: 0.38, fontSize: 9.5, color: C.muted, fontFace: "Calibri", margin: 0 });
    s.addText(`→ ${r.mitigation}`, { x: x + 0.2, y: y + 0.78, w: 4.2, h: 0.38, fontSize: 9.5, bold: true, color: r.col, fontFace: "Calibri", margin: 0 });
  });
}

// ─── SLIDE 14: ROI & BUSINESS CASE ───────────────────────────────────────────
{
  const s = pres.addSlide();
  lightSlide(s);
  topBar(s);
  lightTitle(s, "ROI & Business Case", "The numbers that justify building TimeLex");

  // Left stats
  const stats = [
    { val: "R406k",   lbl: "Annual Ghost Practice cost",   sub: "R33 925 × 12 months", col: C.red },
    { val: "2-3 days", lbl: "Lost per attorney per month", sub: "to manual fee capture", col: "E08A3C" },
    { val: "15 min",  lbl: "Daily time saved per attorney", sub: "vs hours of reconstruction", col: C.green },
    { val: "~20%",    lbl: "Estimated billing uplift",     sub: "from capturing missed time", col: C.green },
  ];
  stats.forEach((st, i) => {
    const x = 0.4 + i * 2.35;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.35, w: 2.2, h: 1.35, fill: { color: C.white }, line: { color: "D0D5E8", width: 1 }, shadow: makeShadow() });
    s.addText(st.val, { x: x + 0.1, y: 1.45, w: 2.0, h: 0.62, fontSize: 30, bold: true, color: st.col, fontFace: "Calibri", align: "center", margin: 0 });
    s.addText(st.lbl, { x: x + 0.1, y: 2.07, w: 2.0, h: 0.32, fontSize: 10, bold: true, color: "1E2335", fontFace: "Calibri", align: "center", margin: 0 });
    s.addText(st.sub, { x: x + 0.1, y: 2.38, w: 2.0, h: 0.22, fontSize: 8.5, color: "5A6480", fontFace: "Calibri", align: "center", italic: true, margin: 0 });
  });

  // Payoff argument
  s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 2.95, w: 5.2, h: 2.35, fill: { color: C.white }, line: { color: "D0D5E8", width: 1 }, shadow: makeShadow() });
  s.addText("Why TimeLex Pays For Itself", { x: 0.6, y: 3.08, w: 4.8, h: 0.35, fontSize: 14, bold: true, color: "1E2335", fontFace: "Georgia", margin: 0 });
  const points = [
    "Each attorney who misses 30 min/day = ~R8 750/month in unbilled work (at R350/hour)",
    "With 10+ attorneys, the firm loses R87 500+ monthly from reconstruction gaps",
    "TimeLex captures that time automatically — ROI is immediate",
    "No per-seat licensing — one web app serves the entire firm",
    "Ghost Practice remains — TimeLex is an enhancement layer, not a replacement",
  ];
  points.forEach((p, i) => {
    s.addText([{ text: p, options: { bullet: { code: "25CF", color: C.gold }, breakLine: i < points.length - 1 } }],
      { x: 0.65, y: 3.52 + i * 0.35, w: 4.7, h: 0.33, fontSize: 10.5, color: "3A4260", fontFace: "Calibri", margin: 0 });
  });

  // Bar chart — hours recovered
  s.addChart(pres.charts.BAR, [
    { name: "Hours Recovered/Month", labels: ["Email", "Calls", "Meetings", "Docs", "Research"], values: [8.5, 3.2, 5.1, 6.8, 2.4] }
  ], {
    x: 5.75, y: 2.95, w: 3.9, h: 2.35,
    barDir: "col",
    chartColors: [C.gold],
    chartArea: { fill: { color: C.white } },
    catAxisLabelColor: "64748B",
    valAxisLabelColor: "64748B",
    valGridLine: { color: "E2E8F0", size: 0.5 },
    catGridLine: { style: "none" },
    showValue: true,
    dataLabelColor: "1E293B",
    showLegend: false,
    showTitle: true,
    title: "Estimated Hours Recovered Per Month",
    titleFontSize: 10,
  });
}

// ─── SLIDE 15: DEMO GUIDE ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  darkSlide(s);
  topBar(s, C.green);
  darkTitle(s, "Demo Walkthrough", "What to show — in sequence — for maximum impact");

  const steps3 = [
    { num: "01", title: "Open the app",         detail: "Open index.html via Live Server. Show dark dashboard with pre-seeded entries already populating the stats.", time: "30s" },
    { num: "02", title: "Live activity feed",   detail: "Point to the feed — new activity appears every ~10 seconds automatically. Show email detected → draft created in real time.", time: "60s" },
    { num: "03", title: "Approve a draft",      detail: "Show the Draft Entries panel. Type a matter number into the input (autocomplete fires). Click ✓ Approve. Stats update live.", time: "60s" },
    { num: "04", title: "Approve All",          detail: "Accumulate 3-4 drafts. Click Approve All. Show the entries table filling up instantly. This is the one-click vs hours point.", time: "30s" },
    { num: "05", title: "Time Entries view",    detail: "Click Time Entries nav. Show the table with auto/manual tags. Filter by matter number. Show summary line — units + hours.", time: "45s" },
    { num: "06", title: "Manual entry",         detail: "Go to Live Capture. Add a manual entry (Court Attendance). Show it appearing in entries table immediately.", time: "45s" },
    { num: "07", title: "Invoice Generator",    detail: "Click Invoice nav. Select a matter, set rate to R3 500, click Generate Preview. Show formatted invoice with VAT calculation.", time: "60s" },
    { num: "08", title: "Push to Ghost Practice","detail": "Click Push to Ghost Practice button. Show the success toast. Explain this is where the GP API call would go in production.", time: "30s" },
  ];

  steps3.forEach((step, i) => {
    const col = i < 4 ? 0 : 1;
    const row = i % 4;
    const x = 0.35 + col * 4.88;
    const y = 1.38 + row * 1.03;
    darkCard(s, x, y, 4.65, 0.96);
    // Number badge
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.12, y: y + 0.2, w: 0.5, h: 0.5, fill: { color: C.green + "22" }, line: { color: C.green, width: 1 } });
    s.addText(step.num, { x: x + 0.12, y: y + 0.2, w: 0.5, h: 0.5, fontSize: 12, bold: true, color: C.green, fontFace: "Calibri", align: "center", valign: "middle", margin: 0 });
    // Time badge
    s.addShape(pres.shapes.RECTANGLE, { x: x + 3.9, y: y + 0.1, w: 0.62, h: 0.25, fill: { color: C.dark }, line: { color: C.border, width: 0.5 } });
    s.addText(step.time, { x: x + 3.9, y: y + 0.1, w: 0.62, h: 0.25, fontSize: 9, color: C.gold, fontFace: "Calibri", align: "center", valign: "middle", margin: 0 });
    s.addText(step.title, { x: x + 0.75, y: y + 0.08, w: 3.5, h: 0.28, fontSize: 11, bold: true, color: C.text, fontFace: "Calibri", margin: 0 });
    s.addText(step.detail, { x: x + 0.75, y: y + 0.38, w: 3.65, h: 0.5, fontSize: 9.5, color: C.muted, fontFace: "Calibri", margin: 0 });
  });

  s.addText("Total demo time: ~7 minutes  ·  Emphasise: review not retype, auto-detect, GP-ready output", {
    x: 0.35, y: 5.42, w: 9.3, h: 0.2, fontSize: 10, color: C.dim, fontFace: "Calibri", italic: true, margin: 0,
  });
}

// ─── SLIDE 16: ROADMAP ────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  lightSlide(s);
  topBar(s);
  lightTitle(s, "Production Roadmap", "From prototype to production — what comes after assessment");

  const phases = [
    {
      phase: "Phase 1", label: "Foundation", time: "Month 1-2", col: C.blue,
      items: ["Real Microsoft Graph API (Outlook, Calendar, Teams)", "Ghost Practice REST API integration", "User authentication (per-attorney accounts)", "Matter sync from GP database"],
    },
    {
      phase: "Phase 2", label: "Intelligence", time: "Month 3-4", col: C.gold,
      items: ["AI narration generation (GPT/Claude API)", "Smart matter matching from email history", "Bulk approval queue", "Slack/Teams daily reminder notifications"],
    },
    {
      phase: "Phase 3", label: "Scale", time: "Month 5-6", col: C.green,
      items: ["Mobile app (React Native) for on-the-go capture", "Multi-user team billing dashboard", "Automated monthly report generation", "POPIA audit trail & data export"],
    },
  ];

  phases.forEach((ph, i) => {
    const x = 0.4 + i * 3.15;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.38, w: 3.0, h: 3.95, fill: { color: C.white }, line: { color: "D0D5E8", width: 1 }, shadow: makeShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.38, w: 3.0, h: 0.58, fill: { color: ph.col }, line: { color: ph.col, width: 0 } });
    s.addText(ph.phase, { x: x + 0.15, y: 1.4, w: 1.2, h: 0.28, fontSize: 11, bold: true, color: C.white, fontFace: "Calibri", margin: 0 });
    s.addText(ph.label, { x: x + 0.15, y: 1.66, w: 1.8, h: 0.24, fontSize: 10, color: C.white, fontFace: "Calibri", italic: true, margin: 0 });
    s.addText(ph.time,  { x: x + 1.65, y: 1.46, w: 1.2, h: 0.42, fontSize: 9.5, color: C.white + "CC", fontFace: "Calibri", align: "right", margin: 0 });
    ph.items.forEach((item, j) => {
      const y = 2.1 + j * 0.72;
      s.addShape(pres.shapes.RECTANGLE, { x: x + 0.15, y, w: 2.7, h: 0.6, fill: { color: "F4F6F9" }, line: { color: "D0D5E8", width: 0.5 } });
      s.addShape(pres.shapes.RECTANGLE, { x: x + 0.15, y, w: 0.04, h: 0.6, fill: { color: ph.col }, line: { color: ph.col, width: 0 } });
      s.addText(item, { x: x + 0.28, y, w: 2.5, h: 0.6, fontSize: 10, color: "3A4260", fontFace: "Calibri", valign: "middle", margin: 0 });
    });
  });

  s.addText("Current prototype is Phase 0 — all functionality demonstrated, production integration would follow these phases.", {
    x: 0.4, y: 5.45, w: 9.2, h: 0.22, fontSize: 10, color: "5A6480", fontFace: "Calibri", italic: true, margin: 0,
  });
}

// ─── SLIDE 17: CLOSING ────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  darkSlide(s);
  // Gold left panel
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 4.2, h: 5.625, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
  s.addText("⚖", { x: 0.5, y: 0.8, w: 3.2, h: 1.1, fontSize: 72, color: C.dark, align: "center" });
  s.addText("TimeLex", { x: 0.3, y: 1.85, w: 3.6, h: 0.65, fontSize: 34, bold: true, color: C.dark, fontFace: "Georgia", align: "center", margin: 0 });
  s.addText("Stop reconstructing.\nStart billing.", { x: 0.3, y: 2.55, w: 3.6, h: 0.85, fontSize: 16, color: C.dark, fontFace: "Georgia", align: "center", italic: true, margin: 0 });
  s.addShape(pres.shapes.LINE, { x: 0.5, y: 3.6, w: 3.2, h: 0, line: { color: C.dark + "66", width: 1 } });
  s.addText("© 2026 Kone Tshivhinda", { x: 0.3, y: 3.75, w: 3.6, h: 0.3, fontSize: 10, color: C.dark + "BB", fontFace: "Calibri", align: "center", margin: 0 });
  s.addText("ASSESSMENT PROTOTYPE", { x: 0.3, y: 4.05, w: 3.6, h: 0.25, fontSize: 8.5, color: C.dark + "99", fontFace: "Calibri", align: "center", charSpacing: 2, margin: 0 });
  s.addText("github.com/konethegreat/\ntimelex-automated-time-tracking", { x: 0.3, y: 4.45, w: 3.6, h: 0.5, fontSize: 9, color: C.dark + "BB", fontFace: "Calibri", align: "center", italic: true, margin: 0 });

  // Right
  s.addText("Thank you", { x: 4.5, y: 0.9, w: 5.2, h: 0.72, fontSize: 38, bold: false, color: C.text, fontFace: "Georgia", margin: 0 });
  s.addText("What we built", { x: 4.5, y: 1.85, w: 5.2, h: 0.35, fontSize: 13, bold: true, color: C.gold, fontFace: "Calibri", charSpacing: 1, margin: 0 });
  const summary = [
    "✉  Auto-capture engine — 5 activity types, 7 integration classes",
    "◈  Draft & approve workflow — 1 click instead of hours",
    "◫  Live dashboard with billing target tracking",
    "⚖  Self-service invoice generator with VAT",
    "🔗  Ghost Practice integration layer (simulated + API-ready)",
    "⚙  Modular architecture — 8 source files, 2 000+ lines",
  ];
  summary.forEach((item, i) => {
    s.addText(item, { x: 4.5, y: 2.28 + i * 0.42, w: 5.1, h: 0.38, fontSize: 12, color: C.text, fontFace: "Calibri", margin: 0 });
  });

  s.addText("Questions?", { x: 4.5, y: 4.85, w: 5.1, h: 0.4, fontSize: 18, bold: false, color: C.gold, fontFace: "Georgia", italic: true, margin: 0 });
}

// ─── WRITE FILE ───────────────────────────────────────────────────────────────
pres.writeFile({ fileName: "TimeLex_Assessment_Presentation.pptx" })
  .then(() => console.log("✅  Presentation written successfully"))
  .catch(e => console.error("❌  Error:", e));