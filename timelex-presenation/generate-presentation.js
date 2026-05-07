/**
 * TimeLex Presentation — UPDATED VERSION
 * Added: Analytics Feature slide, updated code architecture, updated demo
 * Same visual style: dark #0D0F14 + gold #C9A84C
 */
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout  = "LAYOUT_16x9";
pres.author  = "Kone Tshivhinda";
pres.title   = "TimeLex — Automated Legal Time Capture";

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  dark:"0D0F14", card:"13161D", card2:"181C25", border:"222836", border2:"2D3448",
  gold:"C9A84C", goldL:"E8C96A", text:"E8EAF0", muted:"7A8299", dim:"4A5168",
  green:"4CAF82", red:"E05C5C", blue:"5B8EF0", orange:"E08A3C", white:"FFFFFF",
};
const makeShadow = () => ({ type:"outer", blur:8, offset:3, angle:135, color:"000000", opacity:0.22 });

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const ds = s => { s.background = { color: C.dark }; };
const ls = s => { s.background = { color: "F4F6F9" }; };

function topBar(s, col = C.gold) {
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.16, fill:{color:col}, line:{color:col,width:0} });
}

function dTitle(s, t, sub = "") {
  s.addText(t, { x:0.55, y:0.28, w:8.9, h:0.62, fontSize:27, bold:true, color:C.gold, fontFace:"Georgia", margin:0 });
  if (sub) s.addText(sub, { x:0.55, y:0.9, w:8.9, h:0.32, fontSize:12, color:C.muted, fontFace:"Calibri", margin:0 });
}

function lTitle(s, t, sub = "") {
  s.addText(t, { x:0.5, y:0.28, w:9, h:0.58, fontSize:27, bold:true, color:"1E2335", fontFace:"Georgia", margin:0 });
  if (sub) s.addText(sub, { x:0.5, y:0.86, w:9, h:0.30, fontSize:12, color:"5A6480", fontFace:"Calibri", margin:0 });
}

function dCard(s, x, y, w, h, fill = C.card) {
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill:{color:fill}, line:{color:C.border,width:1}, shadow:makeShadow() });
}

function accentCard(s, x, y, w, h, col = C.gold, fill = C.card) {
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill:{color:fill}, line:{color:C.border,width:1}, shadow:makeShadow() });
  s.addShape(pres.shapes.RECTANGLE, { x, y, w:0.052, h, fill:{color:col}, line:{color:col,width:0} });
}

function statBox(s, x, y, w, h, val, lbl, col = C.gold) {
  dCard(s, x, y, w, h);
  s.addText(val, { x:x+0.12, y:y+0.16, w:w-0.24, h:0.52, fontSize:30, bold:true, color:col, fontFace:"Calibri", align:"center", margin:0 });
  s.addText(lbl, { x:x+0.08, y:y+0.68, w:w-0.16, h:0.28, fontSize:9.5, color:C.muted, fontFace:"Calibri", align:"center", margin:0 });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 1 — TITLE
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide(); ds(s);
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:4.4, h:5.625, fill:{color:C.card}, line:{color:C.border,width:1} });
  s.addShape(pres.shapes.RECTANGLE, { x:4.4, y:0, w:0.05, h:5.625, fill:{color:C.gold}, line:{color:C.gold,width:0} });
  s.addText("⚖", { x:0.5, y:0.65, w:3.4, h:1.1, fontSize:64, color:C.gold, align:"center" });
  s.addText("TimeLex", { x:0.3, y:1.72, w:3.8, h:0.72, fontSize:36, bold:true, color:C.gold, fontFace:"Georgia", align:"center", margin:0 });
  s.addText("AUTOMATED LEGAL TIME CAPTURE", { x:0.3, y:2.48, w:3.8, h:0.32, fontSize:9, color:C.muted, fontFace:"Calibri", align:"center", charSpacing:3, margin:0 });
  s.addShape(pres.shapes.LINE, { x:0.5, y:3.0, w:3.4, h:0, line:{color:C.border,width:1} });
  s.addText("© 2026 Kone Tshivhinda", { x:0.3, y:3.18, w:3.8, h:0.28, fontSize:10, color:C.dim, fontFace:"Calibri", align:"center", margin:0 });
  s.addText("Assessment Prototype", { x:0.3, y:3.46, w:3.8, h:0.24, fontSize:9, color:C.dim, fontFace:"Calibri", align:"center", italic:true, margin:0 });
  s.addText("MB Motsoeneng Bill Attorneys", { x:4.75, y:1.0, w:4.8, h:0.42, fontSize:14, color:C.muted, fontFace:"Calibri", margin:0 });
  s.addText("Software Engineer\nAssessment 2026", { x:4.75, y:1.5, w:4.8, h:1.1, fontSize:30, bold:true, color:C.text, fontFace:"Georgia", margin:0 });
  s.addShape(pres.shapes.LINE, { x:4.75, y:2.72, w:4.8, h:0, line:{color:C.border,width:1} });
  [["◈","Auto-Capture Engine"],["◎","Draft & Approve Workflow"],["◫","Invoice Generator"],["◉","Analytics Dashboard"]].forEach(([ic,lb],i)=>{
    s.addText(`${ic}  ${lb}`, { x:4.75, y:2.95+i*0.45, w:4.7, h:0.40, fontSize:12.5, color:C.text, fontFace:"Calibri", margin:0 });
  });
  s.addText("Deadline: 7 May 2026", { x:4.75, y:5.1, w:4.8, h:0.28, fontSize:10, color:C.dim, fontFace:"Calibri", italic:true, margin:0 });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — THE PROBLEM
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide(); ds(s); topBar(s);
  dTitle(s, "The Problem", "Why attorneys lose billable time every single day");
  accentCard(s, 0.4, 1.36, 4.72, 3.8);
  s.addText("The Manual Time Capture Trap", { x:0.62, y:1.54, w:4.3, h:0.42, fontSize:14, bold:true, color:C.gold, fontFace:"Georgia", margin:0 });
  const probs = ["Attorneys reconstruct their full day at end-of-day, or end-of-month","Every email, call and meeting must be manually typed into Ghost Practice","Time is lost, misallocated, or simply forgotten entirely","Inaccurate billing damages client trust and firm revenue","Ghost Practice costs R33 925/month — yet input is still 100% manual","Litigation attorneys handle thousands of emails per month alone"];
  probs.forEach((p,i)=>{
    s.addText([{text:p,options:{bullet:{code:"25CF",color:C.gold},breakLine:i<probs.length-1}}],
      {x:0.65,y:2.04+i*0.48,w:4.25,h:0.44,fontSize:11,color:C.text,fontFace:"Calibri",margin:0});
  });
  statBox(s,5.42,1.36,2.02,1.08,"2-3","Days lost/month\n(Anchané Botha)",C.red);
  statBox(s,7.6,1.36,2.02,1.08,"R33k","Monthly cost of\nGhost Practice",C.gold);
  statBox(s,5.42,2.6,2.02,1.08,"1000+","Emails/month in\nlitigation",C.blue);
  statBox(s,7.6,2.6,2.02,1.08,"~40%","Billable time lost\nto reconstruction",C.red);
  dCard(s,5.42,3.84,4.2,1.28,C.card2);
  s.addText('"Billing emails is extremely tedious. I lose 2–3 days a month just catching up on fees."', { x:5.62,y:3.96,w:3.8,h:0.72,fontSize:11,color:C.muted,fontFace:"Calibri",italic:true,margin:0 });
  s.addText("— Anchané Botha, Survey Respondent", { x:5.62,y:4.7,w:3.8,h:0.26,fontSize:10,color:C.gold,fontFace:"Calibri",margin:0 });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — SURVEY INSIGHTS
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide(); ds(s); topBar(s);
  dTitle(s, "Survey Insights", "Every feature maps directly to a named person's complaint");
  const ins = [
    {name:"Stephanie Chetty",role:"Associate Partner",pain:"Email billing tedious — thousands/month in litigation",sol:"Auto-detect emails, draft entry per email",icon:"✉",col:C.blue},
    {name:"Anchané Botha",role:"Attorney",pain:"Loses 2-3 days/month on fees, can't generate own invoices",sol:"Continuous capture + self-service invoice view",icon:"◫",col:C.gold},
    {name:"Lerato Motlhabi",role:"Paralegal",pain:"Wants real-time tracking of hours vs monthly targets",sol:"Live dashboard with billing target progress bar",icon:"◈",col:C.green},
    {name:"Johan Biggs",role:"Director",pain:"System should remind attorneys to post fees daily",sol:"In-app idle reminders + real-time stats panel",icon:"⏰",col:C.gold},
    {name:"Noluthando Matshata",role:"Attorney",pain:"Duplicate effort — captured once, then again for billing",sol:"One-click approval replaces full manual re-entry",icon:"◎",col:C.blue},
    {name:"Tony Tshivahse",role:"Director",pain:"Ghost Practice is not user friendly",sol:"Clean UI, keyboard shortcuts, review not retype",icon:"★",col:C.green},
  ];
  ins.forEach((p,i)=>{
    const col2 = i<3?0:1, row = i%3;
    const x=0.35+col2*4.88, y=1.35+row*1.37;
    dCard(s,x,y,4.65,1.27);
    s.addShape(pres.shapes.RECTANGLE,{x,y,w:0.052,h:1.27,fill:{color:p.col},line:{color:p.col,width:0}});
    s.addText(p.icon,{x:x+0.14,y:y+0.08,w:0.44,h:0.44,fontSize:18,color:p.col,align:"center",margin:0});
    s.addText(p.name,{x:x+0.62,y:y+0.08,w:3.8,h:0.26,fontSize:11,bold:true,color:C.text,fontFace:"Calibri",margin:0});
    s.addText(p.role,{x:x+0.62,y:y+0.34,w:3.8,h:0.2,fontSize:9,color:C.muted,fontFace:"Calibri",italic:true,margin:0});
    s.addShape(pres.shapes.LINE,{x:x+0.62,y:y+0.57,w:3.8,h:0,line:{color:C.border,width:0.5}});
    s.addText(`Pain: ${p.pain}`,{x:x+0.62,y:y+0.62,w:3.8,h:0.26,fontSize:9,color:C.muted,fontFace:"Calibri",margin:0});
    s.addText(`→ ${p.sol}`,{x:x+0.62,y:y+0.9,w:3.8,h:0.26,fontSize:9,bold:true,color:p.col,fontFace:"Calibri",margin:0});
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — EXISTING TOOLS RESEARCH
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide(); ls(s); topBar(s);
  lTitle(s, "Part 1 — Existing Tools Research", "Market evaluation: strengths, weaknesses & applicability to MB");
  const tools = [
    {name:"Toggl Track",str:"Simple intuitive UI",weak:"No legal integrations, no matter system",fit:"Low",col:C.red},
    {name:"Clio Manage",str:"Full legal PMS, time + billing",weak:"Expensive, not GP-integrated, overseas",fit:"Med",col:C.orange},
    {name:"TimeSolv",str:"Legal-specific time tracking",weak:"US-focused, no SA GP integration",fit:"Med",col:C.orange},
    {name:"Harvest",str:"Clean UX, Outlook add-in",weak:"Generic, no matter classification",fit:"Low",col:C.red},
    {name:"Ghost Practice",str:"Deep MB integration, in use",weak:"Purely manual — zero auto-capture",fit:"Base",col:C.blue},
    {name:"TimeLex (ours)",str:"Auto-capture + GP integration",weak:"Prototype — needs production build",fit:"High",col:C.green},
  ];
  const hdr = ["Tool","Strength","Weakness","Fit"], cw=[1.6,2.85,2.85,0.9], cx=[0.35,1.95,4.8,7.65];
  hdr.forEach((h,i)=>{
    s.addShape(pres.shapes.RECTANGLE,{x:cx[i],y:1.32,w:cw[i],h:0.36,fill:{color:"1E2335"},line:{color:"1E2335",width:0}});
    s.addText(h,{x:cx[i]+0.08,y:1.32,w:cw[i]-0.1,h:0.36,fontSize:11,bold:true,color:C.white,fontFace:"Calibri",valign:"middle",margin:0});
  });
  tools.forEach((t,i)=>{
    const y=1.68+i*0.58, rf=t.name==="TimeLex (ours)"?"EAF7F1":i%2===0?C.white:"F4F6F9";
    cx.forEach((x,ci)=>{s.addShape(pres.shapes.RECTANGLE,{x,y,w:cw[ci],h:0.54,fill:{color:rf},line:{color:"D8DCE8",width:0.5}});});
    s.addText(t.name,{x:cx[0]+0.08,y,w:cw[0]-0.1,h:0.54,fontSize:11,bold:t.name==="TimeLex (ours)",color:"1E2335",fontFace:"Calibri",valign:"middle",margin:0});
    s.addText(t.str, {x:cx[1]+0.08,y,w:cw[1]-0.1,h:0.54,fontSize:10,color:"3A4260",fontFace:"Calibri",valign:"middle",margin:0});
    s.addText(t.weak,{x:cx[2]+0.08,y,w:cw[2]-0.1,h:0.54,fontSize:10,color:"3A4260",fontFace:"Calibri",valign:"middle",margin:0});
    s.addShape(pres.shapes.RECTANGLE,{x:cx[3]+0.12,y:y+0.1,w:0.65,h:0.34,fill:{color:t.col},line:{color:t.col,width:0}});
    s.addText(t.fit,{x:cx[3]+0.12,y:y+0.1,w:0.65,h:0.34,fontSize:10,bold:true,color:C.white,fontFace:"Calibri",align:"center",valign:"middle",margin:0});
  });
  s.addText("Conclusion: No existing tool auto-captures activity AND integrates natively with Ghost Practice. That is exactly the gap TimeLex fills.", {x:0.35,y:5.2,w:9.3,h:0.26,fontSize:10.5,color:"3A4260",fontFace:"Calibri",italic:true,margin:0});
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 5 — PROPOSED SOLUTION
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide(); ds(s); topBar(s);
  dTitle(s, "Part 2 — Proposed Solution: TimeLex", "Detect → classify → draft → approve → bill. Zero re-typing.");
  const steps = [
    {label:"Outlook\nCalendar\nWord / Teams",icon:"◉",col:C.blue,title:"Activity Detection"},
    {label:"AI classifies type\n& predicts matter",icon:"◎",col:C.gold,title:"Smart Classification"},
    {label:"Draft entry created\nwith narration + units",icon:"◈",col:C.orange,title:"Draft Generation"},
    {label:"Attorney approves\nin one click",icon:"✓",col:C.green,title:"Approval"},
    {label:"GP sync +\ninvoice output",icon:"◫",col:C.gold,title:"Billing Output"},
  ];
  const bW=1.62, sX=0.35, sp=1.73;
  steps.forEach((st,i)=>{
    const x=sX+i*sp;
    s.addShape(pres.shapes.RECTANGLE,{x,y:1.35,w:bW,h:2.5,fill:{color:C.card},line:{color:st.col,width:1.5},shadow:makeShadow()});
    s.addShape(pres.shapes.RECTANGLE,{x,y:1.35,w:bW,h:0.11,fill:{color:st.col},line:{color:st.col,width:0}});
    s.addText(String(i+1),{x,y:1.46,w:bW,h:0.32,fontSize:11,color:st.col,fontFace:"Calibri",bold:true,align:"center",margin:0});
    s.addText(st.icon,{x,y:1.78,w:bW,h:0.54,fontSize:28,color:st.col,align:"center",margin:0});
    s.addText(st.title,{x:x+0.06,y:2.34,w:bW-0.12,h:0.32,fontSize:10.5,bold:true,color:C.text,fontFace:"Calibri",align:"center",margin:0});
    s.addText(st.label,{x:x+0.08,y:2.68,w:bW-0.16,h:0.88,fontSize:9.5,color:C.muted,fontFace:"Calibri",align:"center",margin:0});
    if(i<4){
      s.addShape(pres.shapes.LINE,{x:x+bW,y:2.6,w:sp-bW,h:0,line:{color:C.gold,width:1.5}});
      s.addText("›",{x:x+bW+(sp-bW)/2-0.1,y:2.48,w:0.2,h:0.2,fontSize:12,color:C.gold,align:"center",margin:0});
    }
  });
  const bens=[["Zero re-typing","Attorney approves, never re-enters"],["6-min accuracy","Standard legal billing precision"],["GP-ready output","Structured for Ghost Practice API"],["Self-service invoices","No secretary required"]];
  bens.forEach(([t,b],i)=>{
    const x=0.35+i*2.38;
    dCard(s,x,4.04,2.26,1.3);
    s.addText(t,{x:x+0.14,y:4.14,w:1.98,h:0.3,fontSize:11,bold:true,color:C.gold,fontFace:"Calibri",margin:0});
    s.addText(b,{x:x+0.14,y:4.46,w:1.98,h:0.72,fontSize:10,color:C.muted,fontFace:"Calibri",margin:0});
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 6 — AUTO-CAPTURE ENGINE
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide(); ds(s); topBar(s);
  dTitle(s, "Feature 1 — Auto-Capture Engine", "capture-engine.js · 7 integration classes · simulates real-time activity detection");
  const chips=[{l:"✉  Outlook",c:true},{l:"📅  Calendar",c:true},{l:"📄  Word / Docs",c:true},{l:"📞  Teams / Calls",c:false},{l:"🔗  Ghost Practice",c:true}];
  chips.forEach((ch,i)=>{
    const x=0.4+i*1.88;
    s.addShape(pres.shapes.RECTANGLE,{x,y:1.32,w:1.72,h:0.38,fill:{color:ch.c?"0D2E1F":C.card},line:{color:ch.c?C.green:C.border,width:1}});
    s.addText(ch.l,{x:x+0.06,y:1.32,w:1.6,h:0.38,fontSize:10.5,color:ch.c?C.green:C.muted,fontFace:"Calibri",valign:"middle",margin:0});
  });
  const acts=[{t:"Email",ic:"✉",col:C.blue,u:"1–2 units",d:"Subject, sender, thread detected"},
    {t:"Meeting",ic:"📅",col:C.green,u:"5–10 units",d:"Duration from calendar event"},
    {t:"Document",ic:"📄",col:C.blue,u:"3–8 units",d:"File open/edit time tracked"},
    {t:"Call",ic:"📞",col:C.orange,u:"1–3 units",d:"Call duration from Teams/Zoom"},
    {t:"Research",ic:"🔍",col:C.gold,u:"3–6 units",d:"Browser activity monitored"},
  ];
  acts.forEach((a,i)=>{
    const y=1.9+i*0.66;
    accentCard(s,0.4,y,4.5,0.6,a.col);
    s.addShape(pres.shapes.RECTANGLE,{x:0.56,y:y+0.1,w:0.38,h:0.38,fill:{color:a.col+"33"},line:{color:a.col,width:1}});
    s.addText(a.ic,{x:0.56,y:y+0.1,w:0.38,h:0.38,fontSize:14,color:a.col,align:"center",margin:0});
    s.addText(a.t,{x:1.05,y:y+0.07,w:1.4,h:0.24,fontSize:12,bold:true,color:C.text,fontFace:"Calibri",margin:0});
    s.addText(a.d,{x:1.05,y:y+0.33,w:2.6,h:0.22,fontSize:9.5,color:C.muted,fontFace:"Calibri",margin:0});
    s.addShape(pres.shapes.RECTANGLE,{x:3.58,y:y+0.1,w:1.1,h:0.36,fill:{color:a.col+"22"},line:{color:a.col,width:0.5}});
    s.addText(a.u,{x:3.58,y:y+0.1,w:1.1,h:0.36,fontSize:9,color:a.col,fontFace:"Calibri",align:"center",valign:"middle",bold:true,margin:0});
  });
  dCard(s,5.15,1.34,4.5,3.9);
  s.addText("How the Engine Works",{x:5.35,y:1.46,w:4.1,h:0.36,fontSize:14,bold:true,color:C.gold,fontFace:"Georgia",margin:0});
  const steps2=[["1. Poll integrations","Each source polled every 8–15 sec (prototype). Production uses real-time Microsoft Graph webhooks — entry appears the moment an activity ends."],
    ["2. Classify activity","Type determined by source. Matter matched via keyword rules (e.g. 'Nkosi' → 2024/0512-LIT) and title pattern extraction."],
    ["3. Calculate units","Duration converted to 6-minute billing increments, always rounded up — the legal industry standard."],
    ["4. Generate narration","Narration auto-written from metadata. Attorney corrects if needed — never re-types from scratch."],
  ];
  steps2.forEach(([t,b],i)=>{
    const y=2.0+i*0.8;
    s.addText(t,{x:5.35,y,w:4.05,h:0.26,fontSize:11,bold:true,color:C.text,fontFace:"Calibri",margin:0});
    s.addText(b,{x:5.35,y:y+0.26,w:4.05,h:0.46,fontSize:9.5,color:C.muted,fontFace:"Calibri",margin:0});
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 7 — DRAFT & APPROVE WORKFLOW
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide(); ds(s); topBar(s);
  dTitle(s, "Feature 2 — Draft & Approve Workflow", "The core UX shift: attorney reviews, never re-types");
  dCard(s,0.35,1.35,4.35,3.9);
  s.addShape(pres.shapes.RECTANGLE,{x:0.35,y:1.35,w:4.35,h:0.36,fill:{color:C.red+"33"},line:{color:C.red,width:1}});
  s.addText("❌  BEFORE  (Ghost Practice today)",{x:0.5,y:1.35,w:4.05,h:0.36,fontSize:11,bold:true,color:C.red,fontFace:"Calibri",valign:"middle",margin:0});
  ["Attorney finishes a full day","Opens Ghost Practice → New Time Entry","Tries to remember: what did I do?","Types narration from memory","Looks up matter number manually","Calculates time in 6-min units","Repeats for EVERY email, call, meeting","Takes 1–3 hours after a long day"].forEach((b,i)=>{
    s.addText([{text:b,options:{bullet:{code:"25CF",color:C.red},breakLine:i<7}}],{x:0.55,y:1.84+i*0.39,w:3.95,h:0.37,fontSize:10.5,color:C.text,fontFace:"Calibri",margin:0});
  });
  dCard(s,5.0,1.35,4.65,3.9);
  s.addShape(pres.shapes.RECTANGLE,{x:5.0,y:1.35,w:4.65,h:0.36,fill:{color:C.green+"33"},line:{color:C.green,width:1}});
  s.addText("✓  AFTER  (TimeLex)",{x:5.15,y:1.35,w:4.3,h:0.36,fontSize:11,bold:true,color:C.green,fontFace:"Calibri",valign:"middle",margin:0});
  ["TimeLex detects every activity automatically","Draft entry created instantly — narration written","Attorney sees inbox of pending drafts","Assigns matter number (autocomplete list)","Clicks ✓ Approve — done in one click","Or adjusts narration in-line if needed",'"Approve All" clears the full day at once','Entire process: under 5 minutes'].forEach((a,i)=>{
    s.addText([{text:a,options:{bullet:{code:"25CF",color:C.green},breakLine:i<7}}],{x:5.18,y:1.84+i*0.39,w:4.2,h:0.37,fontSize:10.5,color:C.text,fontFace:"Calibri",margin:0});
  });
  s.addText("→",{x:4.6,y:3.1,w:0.5,h:0.4,fontSize:24,color:C.gold,align:"center",margin:0});
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 8 — LIVE DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide(); ds(s); topBar(s);
  dTitle(s, "Feature 3 — Live Dashboard & Target Tracking", "Requested by Lerato Motlhabi, Johan Biggs & Anchané Botha");
  [{v:"2.8 h",l:"Today's Billable Hours",s2:"28 units",c:C.gold},{v:"50.6 h",l:"Month to Date",s2:"of 150 h target",c:C.green},{v:"3",l:"Pending Review",s2:"draft entries",c:C.gold},{v:"8",l:"Matters Active",s2:"today",c:C.blue}].forEach((st,i)=>{
    const x=0.35+i*2.38;
    dCard(s,x,1.35,2.26,1.18);
    s.addText(st.l,{x:x+0.12,y:1.44,w:2.0,h:0.24,fontSize:9,color:C.muted,fontFace:"Calibri",bold:true,charSpacing:1,margin:0});
    s.addText(st.v,{x:x+0.12,y:1.66,w:2.0,h:0.5,fontSize:28,bold:true,color:st.c,fontFace:"Calibri",margin:0});
    s.addText(st.s2,{x:x+0.12,y:2.16,w:2.0,h:0.2,fontSize:9,color:C.dim,fontFace:"Calibri",margin:0});
  });
  dCard(s,0.35,2.72,9.3,0.92);
  s.addText("Monthly Billing Target",{x:0.55,y:2.8,w:3,h:0.26,fontSize:11,bold:true,color:C.muted,fontFace:"Calibri",charSpacing:1,margin:0});
  s.addText("33.7%",{x:8.92,y:2.8,w:0.55,h:0.26,fontSize:14,bold:true,color:C.gold,fontFace:"Calibri",align:"right",margin:0});
  s.addShape(pres.shapes.RECTANGLE,{x:0.55,y:3.16,w:8.85,h:0.22,fill:{color:C.border},line:{color:C.border,width:0}});
  s.addShape(pres.shapes.RECTANGLE,{x:0.55,y:3.16,w:8.85*0.337,h:0.22,fill:{color:C.gold},line:{color:C.gold,width:0}});
  s.addText("50.6 h billed",{x:0.55,y:3.42,w:3,h:0.18,fontSize:9.5,color:C.muted,fontFace:"Calibri",margin:0});
  s.addText("150 h target  ·  99.4 h remaining",{x:6.0,y:3.42,w:3.5,h:0.18,fontSize:9.5,color:C.muted,fontFace:"Calibri",align:"right",margin:0});
  dCard(s,0.35,3.84,4.62,1.52);
  s.addText("Live Activity Feed",{x:0.55,y:3.92,w:3,h:0.26,fontSize:10,bold:true,color:C.muted,fontFace:"Calibri",charSpacing:1,margin:0});
  [{ic:"✉",t:"Re: Discovery — Nkosi v Absa",m:"Email · 1 unit"},{ic:"📄",t:"Drafting founding affidavit",m:"Document · 5 units"}].forEach((fi,i)=>{
    const y=4.28+i*0.5;
    s.addShape(pres.shapes.RECTANGLE,{x:0.45,y,w:4.38,h:0.44,fill:{color:C.card2},line:{color:C.border,width:0.5}});
    s.addText(fi.ic,{x:0.58,y:y+0.06,w:0.3,h:0.3,fontSize:13,color:C.blue,align:"center",margin:0});
    s.addText(fi.t,{x:0.97,y:y+0.05,w:2.9,h:0.18,fontSize:10,bold:true,color:C.text,fontFace:"Calibri",margin:0});
    s.addText(fi.m,{x:0.97,y:y+0.24,w:2.9,h:0.16,fontSize:9,color:C.muted,fontFace:"Calibri",margin:0});
  });
  dCard(s,5.1,3.84,4.55,1.52);
  s.addText("Draft Entries  (pending review)",{x:5.3,y:3.92,w:3.4,h:0.26,fontSize:10,bold:true,color:C.muted,fontFace:"Calibri",charSpacing:1,margin:0});
  s.addShape(pres.shapes.RECTANGLE,{x:5.22,y:4.28,w:4.26,h:0.88,fill:{color:C.card2},line:{color:C.gold+"66",width:1}});
  s.addShape(pres.shapes.RECTANGLE,{x:5.22,y:4.28,w:0.052,h:0.88,fill:{color:C.gold},line:{color:C.gold,width:0}});
  s.addText("✉ EMAIL  ·  1 unit",{x:5.36,y:4.36,w:3,h:0.22,fontSize:9,bold:true,color:C.gold,fontFace:"Calibri",margin:0});
  s.addText("Attending to email: Re: Discovery — Nkosi v Absa",{x:5.36,y:4.6,w:3.95,h:0.22,fontSize:9,color:C.muted,fontFace:"Calibri",margin:0});
  s.addShape(pres.shapes.RECTANGLE,{x:7.32,y:4.86,w:0.9,h:0.24,fill:{color:C.green+"22"},line:{color:C.green,width:0.5}});
  s.addText("✓ Approve",{x:7.32,y:4.86,w:0.9,h:0.24,fontSize:9,bold:true,color:C.green,fontFace:"Calibri",align:"center",valign:"middle",margin:0});
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 9 — INVOICE GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide(); ds(s); topBar(s);
  dTitle(s, "Feature 4 — Invoice Generator", "Requested by Anchané Botha: generate pro-formas without a secretary");
  dCard(s,0.35,1.35,3.6,3.9);
  s.addText("Invoice Settings",{x:0.55,y:1.48,w:3.2,h:0.28,fontSize:12,bold:true,color:C.muted,fontFace:"Calibri",charSpacing:1,margin:0});
  [["Matter","2024/0512-LIT — Nkosi v Absa"],["Invoice Type","Pro-Forma"],["Hourly Rate","R 3 500"],["VAT Rate","15%"]].forEach(([l,v],i)=>{
    const y=1.92+i*0.7;
    s.addText(l.toUpperCase(),{x:0.55,y,w:3.2,h:0.2,fontSize:9,color:C.dim,fontFace:"Calibri",bold:true,charSpacing:1,margin:0});
    s.addShape(pres.shapes.RECTANGLE,{x:0.55,y:y+0.22,w:3.2,h:0.34,fill:{color:C.card2},line:{color:C.border,width:1}});
    s.addText(v,{x:0.68,y:y+0.22,w:3.0,h:0.34,fontSize:11,color:C.text,fontFace:"Calibri",valign:"middle",margin:0});
  });
  s.addShape(pres.shapes.RECTANGLE,{x:0.55,y:4.82,w:3.2,h:0.36,fill:{color:C.gold},line:{color:C.gold,width:0}});
  s.addText("Generate Preview",{x:0.55,y:4.82,w:3.2,h:0.36,fontSize:12,bold:true,color:C.dark,fontFace:"Calibri",align:"center",valign:"middle",margin:0});
  s.addShape(pres.shapes.RECTANGLE,{x:4.15,y:1.35,w:5.5,h:3.95,fill:{color:C.white},line:{color:"D0D5E8",width:1},shadow:makeShadow()});
  s.addText("MOTSOENENG BILL ATTORNEYS",{x:4.3,y:1.46,w:3.5,h:0.28,fontSize:11,bold:true,color:"0D0F14",fontFace:"Georgia",margin:0});
  s.addText("Houghton Estate  ·  +27 11 463 9401  ·  www.mb.co.za",{x:4.3,y:1.74,w:3.5,h:0.18,fontSize:7.5,color:"666666",fontFace:"Calibri",margin:0});
  s.addText("PRO-FORMA INVOICE",{x:7.55,y:1.46,w:2.0,h:0.18,fontSize:7.5,bold:true,color:"B8860B",fontFace:"Calibri",align:"right",charSpacing:1,margin:0});
  s.addText("#PF-2026-0422",{x:7.55,y:1.64,w:2.0,h:0.24,fontSize:13,bold:true,color:"0D0F14",fontFace:"Calibri",align:"right",margin:0});
  s.addShape(pres.shapes.LINE,{x:4.25,y:2.0,w:5.25,h:0,line:{color:"0D0F14",width:1.5}});
  s.addText("BILL TO",{x:4.3,y:2.08,w:2,h:0.18,fontSize:8,color:"888888",fontFace:"Calibri",charSpacing:1,margin:0});
  s.addText("Nkosi v Absa Bank",{x:4.3,y:2.28,w:3,h:0.24,fontSize:11,bold:true,color:"0D0F14",fontFace:"Calibri",margin:0});
  s.addText("Matter: 2024/0512-LIT",{x:4.3,y:2.52,w:3,h:0.18,fontSize:9,color:"555555",fontFace:"Calibri",margin:0});
  s.addShape(pres.shapes.RECTANGLE,{x:4.25,y:2.78,w:5.25,h:0.26,fill:{color:"0D0F14"},line:{color:"0D0F14",width:0}});
  [["Description","Units","Hrs","Amount (R)"],[4.3,7.12,7.57,8.18],[2.7,0.4,0.5,1.1]].slice(0,0);
  const hx=[4.3,7.12,7.57,8.18],hw=[2.7,0.4,0.5,1.1],hl=["Description","Units","Hrs","Amount (R)"];
  hl.forEach((h,i)=>{s.addText(h,{x:hx[i],y:2.78,w:hw[i],h:0.26,fontSize:8,bold:true,color:C.gold,fontFace:"Calibri",valign:"middle",margin:0});});
  [["Attending to email: RE: Settlement — Nkosi","1","0.1","350.00"],["Drafting founding affidavit","6","0.6","2 100.00"],["Call with opposing counsel re: postponement","2","0.2","700.00"]].forEach(([d,u,h,a],i)=>{
    const y=3.08+i*0.27, bg=i%2===0?C.white:"F4F6F9";
    s.addShape(pres.shapes.RECTANGLE,{x:4.25,y,w:5.25,h:0.27,fill:{color:bg},line:{color:"EEEEEE",width:0.5}});
    s.addText(d,{x:4.3,y,w:2.7,h:0.27,fontSize:8,color:"1A1A2E",fontFace:"Calibri",valign:"middle",margin:0});
    [[u,7.12],[h,7.57],[a,8.18]].forEach(([v,vx])=>{s.addText(v,{x:vx,y,w:1.1,h:0.27,fontSize:8,color:"1A1A2E",fontFace:"Calibri",valign:"middle",margin:0});});
  });
  s.addShape(pres.shapes.LINE,{x:4.25,y:3.9,w:5.25,h:0,line:{color:"DDDDDD",width:0.5}});
  [["Subtotal","R 3 150.00"],["VAT (15%)","R 472.50"],["TOTAL DUE","R 3 622.50"]].forEach(([l,v],i)=>{
    const y=3.95+i*0.27;
    s.addText(l,{x:7.42,y,w:1.2,h:0.25,fontSize:i===2?10:9,bold:i===2,color:i===2?"0D0F14":"555555",fontFace:"Calibri",margin:0});
    s.addText(v,{x:8.3,y,w:1.35,h:0.25,fontSize:i===2?10:9,bold:i===2,color:i===2?"0D0F14":"555555",fontFace:"Calibri",align:"right",margin:0});
  });
  s.addText("Generated by TimeLex  ·  Entries verified and approved by fee earner",{x:4.25,y:5.1,w:5.25,h:0.18,fontSize:7,color:"AAAAAA",fontFace:"Calibri",align:"center",margin:0});
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 10 — ★ NEW: ANALYTICS DASHBOARD ★
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide(); ds(s); topBar(s);
  dTitle(s, "Feature 5 — Analytics Dashboard", "New: visual productivity insights — hours by matter, type & week");
  // 4 stat cards
  [{v:"3.6 h",l:"Total Billable Today",c:C.gold},{v:"74%",l:"Auto-Captured",c:C.green},{v:"R 12 600",l:"Billable Value",c:C.blue},{v:"2024/0512",l:"Top Matter",c:C.orange}].forEach((st,i)=>{
    const x=0.35+i*2.38;
    dCard(s,x,1.35,2.26,1.05);
    s.addText(st.l,{x:x+0.12,y:1.44,w:2.0,h:0.22,fontSize:9,color:C.muted,fontFace:"Calibri",bold:true,charSpacing:1,margin:0});
    s.addText(st.v,{x:x+0.12,y:1.66,w:2.0,h:0.44,fontSize:26,bold:true,color:st.c,fontFace:"Calibri",margin:0});
  });
  // Left chart card: Hours by Activity Type
  dCard(s,0.35,2.58,4.62,2.82);
  s.addText("HOURS BY ACTIVITY TYPE",{x:0.55,y:2.68,w:4,h:0.24,fontSize:10,bold:true,color:C.muted,fontFace:"Calibri",charSpacing:1,margin:0});
  s.addChart(pres.charts.DOUGHNUT, [{name:"Hours",labels:["Email","Meeting","Document","Call","Research"],values:[2.2,1.8,3.1,0.8,1.2]}], {
    x:0.4,y:2.96,w:4.5,h:2.3, chartColors:[C.blue,C.green,"8B5CF6",C.orange,C.gold],
    chartArea:{fill:{color:C.card}}, showLegend:true, legendPos:"r",
    legendFontColor:C.muted, legendFontSize:9, dataLabelColor:C.white,
    holeSize:55, showValue:false, showPercent:true,
  });
  // Right chart card: Hours by Matter
  dCard(s,5.1,2.58,4.55,2.82);
  s.addText("HOURS BY MATTER",{x:5.3,y:2.68,w:4,h:0.24,fontSize:10,bold:true,color:C.muted,fontFace:"Calibri",charSpacing:1,margin:0});
  s.addChart(pres.charts.BAR, [{name:"Hours",labels:["2024/0512-LIT","2024/0888-LIT","2025/0103-COM","2025/0217-LAB","2025/0391-CON"],values:[3.6,2.4,1.8,1.2,0.8]}], {
    x:5.12,y:2.96,w:4.48,h:2.3, barDir:"bar",
    chartColors:[C.gold], chartArea:{fill:{color:C.card}},
    catAxisLabelColor:C.muted, valAxisLabelColor:C.muted, catAxisFontSize:9,
    valGridLine:{color:C.border,size:0.5}, catGridLine:{style:"none"},
    showValue:true, dataLabelColor:C.text, showLegend:false,
  });
  s.addText("Also includes: weekly timeline chart, matter breakdown table with billable value, CSV export — all built from approved entries.",{x:0.35,y:5.36,w:9.3,h:0.22,fontSize:10,color:C.dim,fontFace:"Calibri",italic:true,margin:0});
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 11 — TECHNICAL ARCHITECTURE
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide(); ds(s); topBar(s);
  dTitle(s, "Part 3 — Technical Architecture", "Modular ES6+ frontend · Ghost Practice API · POPIA-compliant");
  const layers=[
    {lbl:"ATTORNEY'S TOOLS",items:["Outlook","Google Calendar","Word / Docs","Teams / Zoom","Browser"],col:C.blue,y:1.35},
    {lbl:"TIMELEX CAPTURE ENGINE",items:["Activity classifier","Matter matcher","Unit calculator","Narration generator","Draft creator"],col:C.gold,y:2.38},
    {lbl:"TIMELEX DASHBOARD",items:["Dashboard","Live Capture","Time Entries","Invoice","Analytics ★"],col:C.orange,y:3.41},
    {lbl:"OUTPUT / INTEGRATION",items:["Ghost Practice API","CSV export (fallback)","Pro-forma / Tax invoices"],col:C.green,y:4.44},
  ];
  layers.forEach(layer=>{
    s.addShape(pres.shapes.RECTANGLE,{x:0.35,y:layer.y,w:6.8,h:0.88,fill:{color:C.card},line:{color:layer.col,width:1}});
    s.addShape(pres.shapes.RECTANGLE,{x:0.35,y:layer.y,w:0.052,h:0.88,fill:{color:layer.col},line:{color:layer.col,width:0}});
    s.addText(layer.lbl,{x:0.55,y:layer.y+0.05,w:2.4,h:0.22,fontSize:9,bold:true,color:layer.col,fontFace:"Calibri",charSpacing:1,margin:0});
    layer.items.forEach((item,i)=>{
      const x=0.6+i*(6.35/layer.items.length);
      const iw=(6.35/layer.items.length)-0.12;
      s.addShape(pres.shapes.RECTANGLE,{x,y:layer.y+0.33,w:iw,h:0.4,fill:{color:layer.col+"22"},line:{color:layer.col+"66",width:0.5}});
      s.addText(item,{x,y:layer.y+0.33,w:iw,h:0.4,fontSize:item.length>14?7.5:8.5,color:C.text,fontFace:"Calibri",align:"center",valign:"middle",margin:0});
    });
    if(layer.y<4.44) s.addShape(pres.shapes.LINE,{x:3.75,y:layer.y+0.88,w:0,h:0.15,line:{color:layer.col,width:1.5}});
  });
  dCard(s,7.38,1.35,2.27,3.97);
  s.addText("Tech Stack",{x:7.55,y:1.48,w:1.9,h:0.26,fontSize:12,bold:true,color:C.gold,fontFace:"Georgia",margin:0});
  [["Frontend","HTML · CSS · ES6+"],["Modules","ES6 import/export"],["Styling","CSS vars, 6 CSS files"],["Charts","Native Canvas 2D"],["GP API","REST / OAuth2"],["Prod","React + Node.js"]].forEach(([l,v],i)=>{
    const y=1.88+i*0.53;
    s.addText(l,{x:7.55,y,w:1.0,h:0.2,fontSize:9,color:C.muted,fontFace:"Calibri",bold:true,margin:0});
    s.addText(v,{x:7.55,y:y+0.2,w:1.95,h:0.24,fontSize:9.5,color:C.text,fontFace:"Calibri",margin:0});
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 12 — CODE ARCHITECTURE (updated: 9 files)
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide(); ds(s); topBar(s);
  dTitle(s, "Code Architecture", "9 focused source files — each has one clear responsibility");
  const files=[
    {name:"app.js",size:"~420 lines",role:"Global state, navigation, analytics renderer, CSV export, keyboard shortcuts, idle reminder, localStorage persistence.",col:C.gold,icon:"◈"},
    {name:"capture-engine.js",size:"~500 lines",role:"CaptureEngine + 7 integration classes (Outlook, Calendar, Word, Docs, Teams, Zoom, Browser). ActivityType / CaptureStatus enums.",col:C.blue,icon:"◎"},
    {name:"invoice-generator.js",size:"~300 lines",role:"InvoiceGenerator class. Preview rendering, print output, GP push. InvoiceType enum. Summary box in settings.",col:C.orange,icon:"◫"},
    {name:"gp-integration.js",size:"~280 lines",role:"GhostPracticeIntegration class. OAuth2 auth simulation, batch pushTimeEntries(), syncMatters(), generateInvoice().",col:C.green,icon:"⊕"},
    {name:"utils/date-helpers.js",size:"~150 lines",role:"toBillingUnits(), formatDuration(), getBillingPeriodStart(), isBusinessDay(), getBusinessDaysBetween().",col:C.muted,icon:"⌚"},
    {name:"utils/matter-lookup.js",size:"~200 lines",role:"isValidMatterNumber(), searchMatters(), getMatterSuggestions(), createMatter() — powers the autocomplete datalist.",col:C.muted,icon:"🔍"},
    {name:"utils/toast-notification.js",size:"~150 lines",role:"showToast(), showSuccess/Error/Warning/Info(). Full toast container + animations. initLegacyToast() shim.",col:C.muted,icon:"◉"},
    {name:"styles/ (6 CSS files)",size:"~700 lines",role:"main · dashboard · capture · entries · invoice · analytics.css — CSS custom properties throughout. Print CSS for invoice.",col:C.dim,icon:"◧"},
  ];
  files.forEach((f,i)=>{
    const col2=i<4?0:1, row=i%4;
    const x=0.35+col2*4.88, y=1.35+row*1.03;
    dCard(s,x,y,4.65,0.96);
    s.addShape(pres.shapes.RECTANGLE,{x,y,w:0.052,h:0.96,fill:{color:f.col},line:{color:f.col,width:0}});
    s.addText(f.name,{x:x+0.18,y:y+0.07,w:2.8,h:0.24,fontSize:11,bold:true,color:C.text,fontFace:"Calibri",margin:0});
    s.addShape(pres.shapes.RECTANGLE,{x:x+3.46,y:y+0.09,w:1.0,h:0.22,fill:{color:f.col+"33"},line:{color:f.col+"66",width:0.5}});
    s.addText(f.size,{x:x+3.46,y:y+0.09,w:1.0,h:0.22,fontSize:8,color:f.col,fontFace:"Calibri",align:"center",valign:"middle",margin:0});
    s.addText(f.role,{x:x+0.18,y:y+0.35,w:4.26,h:0.52,fontSize:9.5,color:C.muted,fontFace:"Calibri",margin:0});
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 13 — GHOST PRACTICE INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide(); ds(s); topBar(s);
  dTitle(s, "Ghost Practice Integration", "gp-integration.js · Simulated OAuth2 + REST API flow");
  const fs=["Attorney\nApproves Draft","createGPTimeEntry()\nformat conversion","GP Auth\nOAuth2 token","pushTimeEntries()\nREST POST","Ghost Practice\nDatabase"];
  const fc=[C.gold,C.orange,C.blue,C.green,C.green];
  fs.forEach((step,i)=>{
    const x=0.4+i*1.88;
    s.addShape(pres.shapes.RECTANGLE,{x,y:1.35,w:1.68,h:1.1,fill:{color:C.card},line:{color:fc[i],width:1.5},shadow:makeShadow()});
    s.addShape(pres.shapes.RECTANGLE,{x,y:1.35,w:1.68,h:0.11,fill:{color:fc[i]},line:{color:fc[i],width:0}});
    s.addText(step,{x:x+0.08,y:1.52,w:1.52,h:0.82,fontSize:10.5,color:C.text,fontFace:"Calibri",align:"center",valign:"middle",margin:0});
    if(i<4) s.addShape(pres.shapes.LINE,{x:x+1.68,y:1.9,w:0.2,h:0,line:{color:C.gold,width:1.5}});
  });
  s.addText("Key Methods in GhostPracticeIntegration Class",{x:0.4,y:2.62,w:9.2,h:0.28,fontSize:12,bold:true,color:C.muted,fontFace:"Calibri",charSpacing:1,margin:0});
  const methods=[
    {name:"authenticate()",desc:"Simulates OAuth2. Stores access + refresh tokens. Production: real GP OAuth endpoint."},
    {name:"pushTimeEntry(entry)",desc:"Converts TimeLex entry to GP format. POSTs to /time-entries. Returns success/failure."},
    {name:"pushTimeEntries([])",desc:"Batch push with rate-limit delays. Shows per-entry success/fail summary toast."},
    {name:"syncMatters()",desc:"Fetches active matters from GP. Populates matter autocomplete dropdown."},
    {name:"generateInvoice()",desc:"Generates pro-forma or final invoice in GP. Returns invoice number."},
    {name:"createGPTimeEntries()",desc:"Factory — transforms TimeLex entry array to GP format (YYYY-MM-DD, units, narration, source:'TimeLex')."},
  ];
  methods.forEach((m,i)=>{
    const col2=i<3?0:1, row=i%3;
    const x=0.4+col2*4.88, y=3.05+row*0.82;
    dCard(s,x,y,4.65,0.76);
    s.addShape(pres.shapes.RECTANGLE,{x:x+0.12,y:y+0.1,w:2.55,h:0.24,fill:{color:C.card2},line:{color:C.border,width:0.5}});
    s.addText(m.name,{x:x+0.17,y:y+0.1,w:2.5,h:0.24,fontSize:10,color:C.gold,fontFace:"Calibri",bold:true,margin:0});
    s.addText(m.desc,{x:x+0.17,y:y+0.38,w:4.2,h:0.34,fontSize:9.5,color:C.muted,fontFace:"Calibri",margin:0});
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 14 — RISK & COMPLIANCE
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide(); ds(s); topBar(s,C.red);
  dTitle(s, "Part 5 — Risk & Compliance", "POPIA · Attorney-Client Privilege · Ethics · Adoption");
  const risks=[
    {risk:"Attorney-Client Privilege",imp:"High",detail:"Only metadata captured — no email content stored. Entries stay locally; no third-party cloud used.",mit:"Zero content logging + on-premise deployment option",col:C.red},
    {risk:"POPIA Compliance",imp:"High",detail:"All personal data stays within firm infrastructure. No external analytics, data residency in South Africa.",mit:"Firm-hosted deployment + South African data residency",col:C.red},
    {risk:"Overbilling Risk",imp:"High",detail:"Auto-capture could log non-billable activities as billable if left unchecked.",mit:"Attorney approval required before any entry reaches billing. No blind auto-posting ever.",col:C.orange},
    {risk:"GP API Availability",imp:"Med",detail:"Ghost Practice API may be unavailable during outages or maintenance periods.",mit:"CSV export fallback — entries always exportable regardless of GP status",col:C.orange},
    {risk:"Adoption Resistance",imp:"Med",detail:"Attorneys may resist changing established habits even if those habits are inefficient.",mit:"Minimal behaviour change: review instead of retype. No new login or tool to learn.",col:C.gold},
    {risk:"Inaccurate Matter Matching",imp:"Med",detail:"Keyword-based matching may assign the wrong matter to an activity.",mit:"Matter is always editable before approval. Attorney is the final decision-maker always.",col:C.gold},
  ];
  risks.forEach((r,i)=>{
    const col2=i<3?0:1, row=i%3;
    const x=0.35+col2*4.88, y=1.35+row*1.33;
    dCard(s,x,y,4.65,1.26);
    s.addShape(pres.shapes.RECTANGLE,{x,y,w:0.052,h:1.26,fill:{color:r.col},line:{color:r.col,width:0}});
    s.addShape(pres.shapes.RECTANGLE,{x:x+3.56,y:y+0.1,w:0.9,h:0.24,fill:{color:r.col+"33"},line:{color:r.col,width:0.5}});
    s.addText(r.imp,{x:x+3.56,y:y+0.1,w:0.9,h:0.24,fontSize:9,bold:true,color:r.col,fontFace:"Calibri",align:"center",valign:"middle",margin:0});
    s.addText(r.risk,{x:x+0.2,y:y+0.07,w:3.2,h:0.26,fontSize:11,bold:true,color:C.text,fontFace:"Calibri",margin:0});
    s.addText(r.detail,{x:x+0.2,y:y+0.36,w:4.2,h:0.36,fontSize:9.5,color:C.muted,fontFace:"Calibri",margin:0});
    s.addText(`→ ${r.mit}`,{x:x+0.2,y:y+0.75,w:4.2,h:0.38,fontSize:9.5,bold:true,color:r.col,fontFace:"Calibri",margin:0});
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 15 — ROI & BUSINESS CASE
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide(); ls(s); topBar(s);
  lTitle(s, "ROI & Business Case", "The numbers that justify building TimeLex");
  [{v:"R406k",l:"Annual Ghost Practice cost",s2:"R33 925 × 12 months",c:C.red},{v:"2-3 days",l:"Lost per attorney per month",s2:"to manual fee capture",c:C.orange},{v:"5 min",l:"Daily time to approve entries",s2:"vs hours of reconstruction",c:C.green},{v:"~20%",l:"Estimated billing uplift",s2:"from capturing missed time",c:C.green}].forEach((st,i)=>{
    const x=0.4+i*2.35;
    s.addShape(pres.shapes.RECTANGLE,{x,y:1.35,w:2.2,h:1.32,fill:{color:C.white},line:{color:"D0D5E8",width:1},shadow:makeShadow()});
    s.addText(st.v,{x:x+0.1,y:1.44,w:2.0,h:0.6,fontSize:30,bold:true,color:st.c,fontFace:"Calibri",align:"center",margin:0});
    s.addText(st.l,{x:x+0.1,y:2.04,w:2.0,h:0.3,fontSize:10,bold:true,color:"1E2335",fontFace:"Calibri",align:"center",margin:0});
    s.addText(st.s2,{x:x+0.1,y:2.34,w:2.0,h:0.2,fontSize:8.5,color:"5A6480",fontFace:"Calibri",align:"center",italic:true,margin:0});
  });
  s.addShape(pres.shapes.RECTANGLE,{x:0.4,y:2.9,w:5.2,h:2.4,fill:{color:C.white},line:{color:"D0D5E8",width:1},shadow:makeShadow()});
  s.addText("Why TimeLex Pays For Itself",{x:0.6,y:3.02,w:4.8,h:0.34,fontSize:14,bold:true,color:"1E2335",fontFace:"Georgia",margin:0});
  ["Each attorney who misses 30 min/day = ~R8 750/month at R350/hour","10 attorneys = R87 500+ monthly in lost billable time","TimeLex captures that automatically — ROI is immediate","No per-seat licensing — one web app for the entire firm","Ghost Practice remains — TimeLex is an enhancement layer"].forEach((p,i)=>{
    s.addText([{text:p,options:{bullet:{code:"25CF",color:C.gold},breakLine:i<4}}],{x:0.65,y:3.46+i*0.34,w:4.7,h:0.32,fontSize:10.5,color:"3A4260",fontFace:"Calibri",margin:0});
  });
  s.addChart(pres.charts.BAR,[{name:"Hours Recovered/Month",labels:["Email","Calls","Meetings","Docs","Research"],values:[8.5,3.2,5.1,6.8,2.4]}],{
    x:5.75,y:2.9,w:3.9,h:2.4, barDir:"col",
    chartColors:[C.gold], chartArea:{fill:{color:C.white}},
    catAxisLabelColor:"64748B", valAxisLabelColor:"64748B",
    valGridLine:{color:"E2E8F0",size:0.5}, catGridLine:{style:"none"},
    showValue:true, dataLabelColor:"1E293B", showLegend:false,
    showTitle:true, title:"Hours Recovered Per Month", titleFontSize:10,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 16 — DEMO WALKTHROUGH (updated: includes analytics step)
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide(); ds(s); topBar(s,C.green);
  dTitle(s, "Demo Walkthrough", "9 steps · ~8 minutes · open index.html via Live Server before presenting");
  const steps=[
    {n:"01",t:"Open the app",d:"Dashboard loads with pre-seeded entries and live stats. Show the real-time clock and billing progress bar.",tm:"30s"},
    {n:"02",t:"Live activity feed",d:"Point to the feed — a new activity appears every ~10 seconds automatically. Show email detected → draft created in real time.",tm:"45s"},
    {n:"03",t:"Approve a draft",d:"Show Draft Entries panel. Type matter number — autocomplete fires. Click ✓ Approve. Stats update live immediately.",tm:"60s"},
    {n:"04",t:"Approve All",d:'Accumulate 3-4 drafts. Click "Approve All". Entire day cleared instantly. This is hours of Ghost Practice work in one click.',tm:"30s"},
    {n:"05",t:"Time Entries view",d:"Show entries table with auto/manual source tags. Filter by matter. Show summary line — units and hours total.",tm:"45s"},
    {n:"06",t:"Manual entry",d:"Go to Live Capture. Add Court Attendance manually. 30 minutes → 5 units calculated automatically.",tm:"45s"},
    {n:"07",t:"Invoice Generator",d:"Select matter, R3 500 rate, click Generate Preview. Show formatted invoice with all entries and VAT calculation.",tm:"60s"},
    {n:"08",t:"Analytics Dashboard",d:"Click Analytics (5th nav). Show hours by activity type donut, hours by matter bar chart, weekly timeline.",tm:"45s"},
    {n:"09",t:"Push to Ghost Practice",d:"Click Push to Ghost Practice. Show success toast. Explain GP API integration layer in production.",tm:"30s"},
  ];
  steps.forEach((step,i)=>{
    const col2=i<5?0:1, row=i%5;
    const x=0.35+col2*4.88, y=1.36+row*0.83;
    dCard(s,x,y,4.65,0.77);
    s.addShape(pres.shapes.RECTANGLE,{x:x+0.12,y:y+0.16,w:0.46,h:0.46,fill:{color:C.green+"22"},line:{color:C.green,width:1}});
    s.addText(step.n,{x:x+0.12,y:y+0.16,w:0.46,h:0.46,fontSize:11,bold:true,color:C.green,fontFace:"Calibri",align:"center",valign:"middle",margin:0});
    s.addShape(pres.shapes.RECTANGLE,{x:x+3.9,y:y+0.1,w:0.6,h:0.24,fill:{color:C.dark},line:{color:C.border,width:0.5}});
    s.addText(step.tm,{x:x+3.9,y:y+0.1,w:0.6,h:0.24,fontSize:9,color:C.gold,fontFace:"Calibri",align:"center",valign:"middle",margin:0});
    s.addText(step.t,{x:x+0.72,y:y+0.07,w:3.5,h:0.26,fontSize:11,bold:true,color:C.text,fontFace:"Calibri",margin:0});
    s.addText(step.d,{x:x+0.72,y:y+0.36,w:3.62,h:0.36,fontSize:9,color:C.muted,fontFace:"Calibri",margin:0});
  });
  s.addText("Remember: review not retype · auto-detect not reconstruct · GP-ready output · analytics show the value instantly",{x:0.35,y:5.38,w:9.3,h:0.22,fontSize:10,color:C.dim,fontFace:"Calibri",italic:true,margin:0});
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 17 — PRODUCTION ROADMAP
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide(); ls(s); topBar(s);
  lTitle(s, "Production Roadmap", "From prototype to production — what comes after assessment");
  const phases=[
    {phase:"Phase 1",label:"Foundation",time:"Month 1–2",col:C.blue,items:["Real Microsoft Graph API (Outlook, Calendar, Teams)","Ghost Practice REST API integration","Per-attorney authentication","Matter sync from GP database"]},
    {phase:"Phase 2",label:"Intelligence",time:"Month 3–4",col:C.gold,items:["AI narration generation (GPT/Claude API)","Smarter matter matching from history","Bulk approval queue","Automated daily reminder notifications"]},
    {phase:"Phase 3",label:"Scale",time:"Month 5–6",col:C.green,items:["Mobile app (React Native) for on-the-go","Multi-user team billing dashboards","Monthly report generation","Full POPIA audit trail + data export"]},
  ];
  phases.forEach((ph,i)=>{
    const x=0.4+i*3.15;
    s.addShape(pres.shapes.RECTANGLE,{x,y:1.36,w:3.0,h:3.95,fill:{color:C.white},line:{color:"D0D5E8",width:1},shadow:makeShadow()});
    s.addShape(pres.shapes.RECTANGLE,{x,y:1.36,w:3.0,h:0.56,fill:{color:ph.col},line:{color:ph.col,width:0}});
    s.addText(ph.phase,{x:x+0.15,y:1.38,w:1.2,h:0.26,fontSize:11,bold:true,color:C.white,fontFace:"Calibri",margin:0});
    s.addText(ph.label,{x:x+0.15,y:1.64,w:1.8,h:0.22,fontSize:10,color:C.white,fontFace:"Calibri",italic:true,margin:0});
    s.addText(ph.time,{x:x+1.65,y:1.44,w:1.2,h:0.4,fontSize:9.5,color:C.white+"CC",fontFace:"Calibri",align:"right",margin:0});
    ph.items.forEach((item,j)=>{
      const y=2.08+j*0.72;
      s.addShape(pres.shapes.RECTANGLE,{x:x+0.15,y,w:2.7,h:0.6,fill:{color:"F4F6F9"},line:{color:"D0D5E8",width:0.5}});
      s.addShape(pres.shapes.RECTANGLE,{x:x+0.15,y,w:0.04,h:0.6,fill:{color:ph.col},line:{color:ph.col,width:0}});
      s.addText(item,{x:x+0.26,y,w:2.52,h:0.6,fontSize:10,color:"3A4260",fontFace:"Calibri",valign:"middle",margin:0});
    });
  });
  s.addText("The prototype today is Phase 0 — fully functional, ready to demonstrate core value. Production integration follows this exact architecture.",{x:0.4,y:5.42,w:9.2,h:0.22,fontSize:10,color:"5A6480",fontFace:"Calibri",italic:true,margin:0});
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 18 — CLOSING (updated summary includes Analytics)
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide(); ds(s);
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:4.2,h:5.625,fill:{color:C.gold},line:{color:C.gold,width:0}});
  s.addText("⚖",{x:0.5,y:0.75,w:3.2,h:1.1,fontSize:72,color:C.dark,align:"center"});
  s.addText("TimeLex",{x:0.3,y:1.82,w:3.6,h:0.64,fontSize:34,bold:true,color:C.dark,fontFace:"Georgia",align:"center",margin:0});
  s.addText("Stop reconstructing.\nStart billing.",{x:0.3,y:2.52,w:3.6,h:0.84,fontSize:16,color:C.dark,fontFace:"Georgia",align:"center",italic:true,margin:0});
  s.addShape(pres.shapes.LINE,{x:0.5,y:3.55,w:3.2,h:0,line:{color:C.dark+"66",width:1}});
  s.addText("© 2026 Kone Tshivhinda",{x:0.3,y:3.7,w:3.6,h:0.28,fontSize:10,color:C.dark+"BB",fontFace:"Calibri",align:"center",margin:0});
  s.addText("ASSESSMENT PROTOTYPE",{x:0.3,y:3.98,w:3.6,h:0.24,fontSize:8.5,color:C.dark+"99",fontFace:"Calibri",align:"center",charSpacing:2,margin:0});
  s.addText("github.com/konethegreat/\ntimelex-automated-time-tracking",{x:0.3,y:4.38,w:3.6,h:0.48,fontSize:9,color:C.dark+"BB",fontFace:"Calibri",align:"center",italic:true,margin:0});
  s.addText("Thank you",{x:4.45,y:0.88,w:5.2,h:0.7,fontSize:38,color:C.text,fontFace:"Georgia",margin:0});
  s.addText("What I built",{x:4.45,y:1.8,w:5.2,h:0.34,fontSize:13,bold:true,color:C.gold,fontFace:"Calibri",charSpacing:1,margin:0});
  ["✉  Auto-capture engine — 5 types, 7 integration classes","◈  Draft & approve — 1 click instead of hours","◫  Live dashboard with real-time billing targets","⚖  Self-service invoice generator with VAT","◉  Analytics — charts, export, matter breakdown","🔗  Ghost Practice integration layer (API-ready)","⚙  9 source files · localStorage · keyboard shortcuts"].forEach((it,i)=>{
    s.addText(it,{x:4.45,y:2.22+i*0.41,w:5.1,h:0.37,fontSize:12,color:C.text,fontFace:"Calibri",margin:0});
  });
  s.addText("Questions?",{x:4.45,y:5.0,w:5.1,h:0.38,fontSize:18,color:C.gold,fontFace:"Georgia",italic:true,margin:0});
}

// ─── WRITE ────────────────────────────────────────────────────────────────────
pres.writeFile({ fileName: "TimeLex_Assessment_Presentation.pptx" })
  .then(() => console.log("✅  Done"))
  .catch(e => console.error("❌", e));