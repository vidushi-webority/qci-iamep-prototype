/* ============================================================
   IAMEP — Integrated Application Management & Evaluation Portal
   QCI · Tender ref QCI/IT/0726/546
   data.js — seed data, questionnaires, state machine, persistence
   Every construct here maps to a Scope-of-Work clause (see README).
   ============================================================ */
(function () {
  "use strict";

  // ---- ROLES (SOW §2 User Persona) -----------------------------------------
  const ROLES = [
    { id: "nominee", name: { en: "Nominee", hi: "नामिती" }, access: { en: "Limited", hi: "सीमित" },
      fn: { en: "Initiates and submits the application", hi: "आवेदन आरंभ एवं जमा करता है" }, av: "NM", accent: "qms" },
    { id: "qc", name: { en: "QC Reviewer", hi: "क्यूसी समीक्षक" }, access: { en: "Limited", hi: "सीमित" },
      fn: { en: "Quality check of parameters — approve / reject responses, add comments", hi: "पैरामीटर की गुणवत्ता जांच — स्वीकृत/अस्वीकृत, टिप्पणी" }, av: "QC", accent: "ems" },
    { id: "admin", name: { en: "QCI Admin", hi: "क्यूसीआई एडमिन" }, access: { en: "Review & export access", hi: "समीक्षा एवं निर्यात" },
      fn: { en: "Assigns QC Reviewer, scrutinises responses, accept/reject, download files, export Excel", hi: "क्यूसी समीक्षक नियुक्त, समीक्षा, स्वीकृत/अस्वीकृत, निर्यात" }, av: "AD", accent: "fsms" },
    { id: "super", name: { en: "Super Admin", hi: "सुपर एडमिन" }, access: { en: "Full master access", hi: "पूर्ण मास्टर एक्सेस" },
      fn: { en: "All Admin access + full dashboard, bulk approve/reject, manage users, rankings, scores, final Excel", hi: "सभी एडमिन अधिकार + पूर्ण डैशबोर्ड, उपयोक्ता प्रबंधन, रैंकिंग, स्कोर" }, av: "SA", accent: "pcb" },
    { id: "comm", name: { en: "Commissioner", hi: "आयुक्त" }, access: { en: "Highly restricted full view", hi: "अत्यंत प्रतिबंधित पूर्ण दृश्य" },
      fn: { en: "View final scores / rankings, download Excel & sensitive outputs, view all processing", hi: "अंतिम स्कोर/रैंकिंग देखें, निर्यात, संपूर्ण प्रक्रिया देखें" }, av: "CM", accent: "enms" }
  ];

  // ---- APPLICATION CATEGORIES (SOW §3.2.1 several categories) ---------------
  const CATEGORIES = [
    { id: "NABL", name: { en: "NABL — Testing & Calibration Labs", hi: "एनएबीएल — परीक्षण एवं अंशांकन" }, dot: "#1B84FF" },
    { id: "NABH", name: { en: "NABH — Hospitals & Healthcare", hi: "एनएबीएच — अस्पताल एवं स्वास्थ्य" }, dot: "#17C653" },
    { id: "NABET", name: { en: "NABET — Education & Training", hi: "एनएबीईटी — शिक्षा एवं प्रशिक्षण" }, dot: "#F6B100" },
    { id: "NABCB", name: { en: "NABCB — Certification Bodies", hi: "एनएबीसीबी — प्रमाणन निकाय" }, dot: "#7239EA" },
    { id: "NBQP", name: { en: "NBQP — Quality Promotion", hi: "एनबीक्यूपी — गुणवत्ता संवर्धन" }, dot: "#C65D0D" }
  ];

  // ---- CATEGORY-SPECIFIC QUESTIONNAIRES (SOW §3.2.1) -----------------------
  // Each question is an assessment parameter/KPI: it carries `weight` used by
  // the scoring engine (§3.2.10) and is individually approvable in QC (§3.2.4).
  function commonSections(catLabel) {
    return [
      { title: { en: "A. Organisation Profile", hi: "क. संगठन प्रोफ़ाइल" }, questions: [
        { id: "org_name", label: { en: "Legal name of applicant organisation", hi: "आवेदक संगठन का वैधानिक नाम" }, type: "text", req: true, weight: 0 },
        { id: "org_type", label: { en: "Type of entity", hi: "इकाई का प्रकार" }, type: "select", opts: ["Private Limited", "LLP", "Partnership", "Government", "Society/Trust"], req: true, weight: 0 },
        { id: "years_op", label: { en: "Years in operation", hi: "संचालन के वर्ष" }, type: "number", req: true, weight: 10 },
        { id: "reg_cert", label: { en: "Registration certificate (PDF)", hi: "पंजीकरण प्रमाणपत्र (PDF)" }, type: "file", req: true, weight: 0 }
      ]},
      { title: { en: "B. Technical Competence — " + catLabel, hi: "ख. तकनीकी सक्षमता" }, questions: [
        { id: "scope", label: { en: "Scope of accreditation sought", hi: "मांगी गई मान्यता का दायरा" }, type: "textarea", req: true, weight: 15 },
        { id: "qual_staff", label: { en: "No. of qualified technical staff", hi: "योग्य तकनीकी कर्मचारियों की संख्या" }, type: "number", req: true, weight: 20 },
        { id: "quality_manual", label: { en: "Quality manual conforms to ISO/IEC standard?", hi: "गुणवत्ता मैनुअल मानक अनुरूप?" }, type: "select", opts: ["Yes — fully", "Partially", "No"], req: true, weight: 20 },
        { id: "prev_audit", label: { en: "Most recent internal audit date", hi: "अंतिम आंतरिक अंकेक्षण तिथि" }, type: "text", req: false, weight: 10 },
        { id: "evidence", label: { en: "Supporting evidence (PDF/JPEG/PNG)", hi: "सहायक साक्ष्य" }, type: "file", req: true, weight: 0 }
      ]},
      { title: { en: "C. Compliance & Declaration", hi: "ग. अनुपालन एवं घोषणा" }, questions: [
        { id: "conflict", label: { en: "Any conflict of interest to declare?", hi: "कोई हित-टकराव?" }, type: "select", opts: ["No", "Yes (attach note)"], req: true, weight: 10 },
        { id: "past_susp", label: { en: "Any past suspension/withdrawal of accreditation?", hi: "पूर्व निलंबन/वापसी?" }, type: "select", opts: ["No", "Yes"], req: true, weight: 15 },
        { id: "declaration", label: { en: "I certify the information is true and complete", hi: "मैं प्रमाणित करता/करती हूँ कि जानकारी सत्य है" }, type: "check", req: true, weight: 0 }
      ]}
    ];
  }
  const QUESTIONNAIRES = {};
  CATEGORIES.forEach(c => QUESTIONNAIRES[c.id] = commonSections(c.id));

  // ---- NOMINEE MASTER (SOW §3.1.1 / §3.1.2 — GSTIN authorised list) --------
  // NOMINEE_MASTER[0] is the "currently logged-in" nominee for the Nominee role.
  const NOMINEE_MASTER = [
    { gstin: "07AABCU9603R1ZM", name: "Aarav Diagnostics Pvt Ltd", entity: "Private Limited", email: "contact@aaravdiag.example", uid: "QCI-N-1001", registered: true },
    { gstin: "27AAECS1234F1Z5", name: "Sundaram Test Labs LLP", entity: "LLP", email: "labs@sundaram.example", uid: "QCI-N-1002", registered: true },
    { gstin: "29AAGCB8901H1ZP", name: "Bhaskar Healthcare Trust", entity: "Society/Trust", email: "admin@bhaskarhc.example", uid: "QCI-N-1003", registered: true },
    { gstin: "19AACCM2345Q1Z8", name: "Meghna Medical College", entity: "Society/Trust", email: "reg@meghnamed.example", uid: "QCI-N-1008", registered: true },
    { gstin: "36AADCK6789R1Z4", name: "Konark Calibration Services", entity: "Private Limited", email: "info@konarkcal.example", uid: "QCI-N-1009", registered: true },
    { gstin: "08AAECR3456T1Z7", name: "Rajputana Skill Institute", entity: "LLP", email: "admin@rajskill.example", uid: "QCI-N-1010", registered: true },
    { gstin: "23AAFCV8765W1Z1", name: "Vindhya Certification Pvt Ltd", entity: "Private Limited", email: "cert@vindhya.example", uid: "QCI-N-1011", registered: true },
    { gstin: "32AAGCT1237Y1Z6", name: "Travancore Analytical Labs", entity: "Private Limited", email: "labs@travanalytics.example", uid: "QCI-N-1012", registered: true },
    { gstin: "21AAHCS4568U1Z0", name: "Sahyadri Health Foundation", entity: "Society/Trust", email: "office@sahyadrihf.example", uid: "QCI-N-1013", registered: true },
    { gstin: "10AAICN7890P1Z2", name: "Nalanda Quality Council", entity: "Partnership", email: "contact@nalandaqc.example", uid: "QCI-N-1014", registered: true },
    { gstin: "09AAACD5678K1Z2", name: "Deccan Skills Academy", entity: "Private Limited", email: "info@deccanskills.example", uid: "QCI-N-1004", registered: false },
    { gstin: "24AAFCM4321L1Z9", name: "Meridian Certification Co", entity: "Private Limited", email: "cert@meridian.example", uid: "QCI-N-1005", registered: false },
    { gstin: "33AABCP7654N1Z3", name: "Pallava Quality Systems", entity: "Partnership", email: "quality@pallava.example", uid: "QCI-N-1006", registered: false }
  ];
  const CURRENT_NOMINEE = NOMINEE_MASTER[0].gstin;   // the nominee "logged in" for the Nominee role

  // ---- INTERNAL USERS (for QC assignment — SOW §3.2.3) ---------------------
  const USERS = [
    { id: "qc1", name: "R. Menon", role: "qc", load: 3 },
    { id: "qc2", name: "S. Iyer", role: "qc", load: 1 },
    { id: "qc3", name: "P. Bhatt", role: "qc", load: 2 },
    { id: "ad1", name: "K. Rao", role: "admin", load: 0 },
    { id: "sa1", name: "V. Sharma", role: "super", load: 0 }
  ];

  // ---- SCORING CONFIG (SOW §3.2.10 / §3.2.13) ------------------------------
  const CONFIG = {
    roundA_weight: 60,      // Round A: Desktop Assessment
    roundB_weight: 40,      // Round B: Field Assessment
    maxReviewCycles: 15,    // §3.2.13 — 10 to 15 review cycles
    maxKpiUpdates: 10,      // §3.2.13 — each KPI updatable 10 times
    fileFormats: "Excel, PDF, DOC, JPEG, PNG"   // §1.7
  };

  // ---- LANDING NOTICES (SOW §3.1.4) ---------------------------------------
  const NOTICES = [
    { type: "notice", title: { en: "Applications open for FY 2026–27 accreditation cycle", hi: "वित्त वर्ष 2026–27 मान्यता चक्र हेतु आवेदन प्रारंभ" }, body: { en: "Registered nominees may submit category-specific applications until 30 Sep 2026.", hi: "पंजीकृत नामिती 30 सितम्बर 2026 तक श्रेणी-विशिष्ट आवेदन जमा कर सकते हैं।" }, date: "01-Aug-2026" },
    { type: "update", title: { en: "GSTIN is mandatory for registration", hi: "पंजीकरण हेतु जीएसटीआईएन अनिवार्य" }, body: { en: "Your GSTIN must match the authorised nominee list uploaded by QCI.", hi: "आपका जीएसटीआईएन क्यूसीआई द्वारा अपलोड सूची से मेल खाना चाहिए।" }, date: "24-Jul-2026" },
    { type: "doc", title: { en: "Applicant guidelines (PDF)", hi: "आवेदक दिशानिर्देश (PDF)" }, body: { en: "Download the step-by-step guidelines document.", hi: "चरण-दर-चरण दिशानिर्देश डाउनलोड करें।" }, date: "20-Jul-2026" },
    { type: "video", title: { en: "Portal walkthrough — video tutorial", hi: "पोर्टल वॉकथ्रू — वीडियो ट्यूटोरियल" }, body: { en: "A full walkthrough of the application process for applicants.", hi: "आवेदकों हेतु आवेदन प्रक्रिया का पूर्ण वॉकथ्रू।" }, date: "20-Jul-2026" }
  ];

  // ---- STATUS MODEL (SOW §3.2 workflow) -----------------------------------
  const STATUS = {
    DRAFT:          { label: { en: "Draft", hi: "प्रारूप" }, badge: "b-grey" },
    SUBMITTED:      { label: { en: "Submitted", hi: "जमा" }, badge: "b-blue" },
    ASSIGNED:       { label: { en: "Assigned to QC", hi: "क्यूसी को सौंपा" }, badge: "b-purple" },
    QC_DRAFT:       { label: { en: "QC in progress", hi: "क्यूसी जारी" }, badge: "b-amber" },
    QC_SUBMITTED:   { label: { en: "QC done — with Admin", hi: "क्यूसी पूर्ण — एडमिन" }, badge: "b-blue" },
    RETURNED_QC:    { label: { en: "Returned to QC", hi: "क्यूसी को लौटाया" }, badge: "b-orange" },
    ADMIN_APPROVED: { label: { en: "Admin approved — with Super Admin", hi: "एडमिन स्वीकृत — सुपर एडमिन" }, badge: "b-blue" },
    SA_REJECTED:    { label: { en: "Rejected by Super Admin", hi: "सुपर एडमिन द्वारा अस्वीकृत" }, badge: "b-red" },
    SA_APPROVED:    { label: { en: "Approved — ready to score", hi: "स्वीकृत — स्कोरिंग हेतु" }, badge: "b-green" },
    SCORED_A:       { label: { en: "Round A scored", hi: "राउंड ए स्कोर" }, badge: "b-green" },
    SCORED_B:       { label: { en: "Round B scored", hi: "राउंड बी स्कोर" }, badge: "b-green" },
    COMPLETED:      { label: { en: "Evaluation complete", hi: "मूल्यांकन पूर्ण" }, badge: "b-green" }
  };

  // ---- SEED APPLICATIONS (generated — rich data for every role/view) -------
  const CAT_SCOPE = {
    NABL: "Mechanical, thermal & electrical testing per ISO/IEC 17025.",
    NABH: "Multi-specialty hospital accreditation programme.",
    NABET: "Vocational training organisation & skill assessment accreditation.",
    NABCB: "Management systems certification body (ISO 9001 / 14001 / 45001).",
    NBQP: "Quality promotion & statistical quality tools programme."
  };
  const QMAN = ["Yes — fully", "Partially", "Yes — fully", "Yes — fully"];

  function buildAns(nom, catId, i) {
    return {
      org_name: nom.name, org_type: nom.entity, years_op: 6 + (i % 18),
      reg_cert: "registration.pdf", scope: CAT_SCOPE[catId],
      qual_staff: 8 + (i * 3) % 40, quality_manual: QMAN[i % QMAN.length],
      prev_audit: (10 + (i % 18)) + "-Mar-2026", evidence: "audit-evidence.pdf",
      conflict: "No", past_susp: i % 7 === 0 ? "Yes" : "No", declaration: true
    };
  }
  const QIDS = ["years_op", "scope", "qual_staff", "quality_manual", "prev_audit", "conflict", "past_susp"];
  function qcAll(mod) {
    const o = {}; QIDS.forEach(id => o[id] = { d: "approve" });
    if (mod) o.quality_manual = { d: "reject", comment: "ISO clause 7.2 not fully evidenced — please update.", modified: true, updates: 1 };
    return o;
  }
  function qcPartial() { return { years_op: { d: "approve" }, scope: { d: "approve" }, qual_staff: { d: "approve" } }; }

  const STEP = {
    created: n => ({ by: "Nominee", act: "Application draft created" }),
    submitted: n => ({ by: "Nominee", act: "Submitted — routed to Admin queue" }),
    assigned: r => ({ by: "QCI Admin", act: "Assigned to QC Reviewer " + r }),
    qcdraft: n => ({ by: "QC Reviewer", act: "Saved review draft" }),
    qcsub: m => ({ by: "QC Reviewer", act: "QC form submitted" + (m ? " — 1 parameter modified" : "") }),
    returned: n => ({ by: "QCI Admin", act: "Returned to QC — 2 parameter(s) flagged" }),
    adminok: n => ({ by: "QCI Admin", act: "Approved — routed to Super Admin" }),
    sareject: n => ({ by: "Super Admin", act: "Rejected — returned to Admin: clarification needed on scope" }),
    saok: n => ({ by: "Super Admin", act: "Approved — ready to score" }),
    scoreA: v => ({ by: "Super Admin", act: "Round A (Desktop) scored: " + v }),
    scoreB: v => ({ by: "Super Admin", act: "Round B (Field) scored: " + v + " — evaluation complete" })
  };
  function hist(status, revName, mod, sA, sB) {
    const h = []; let d = 8;
    const push = s => h.push(Object.assign({ ts: (d++) + "-Jul-2026" }, s));
    push(STEP.created()); if (status === "DRAFT") return h;
    push(STEP.submitted()); if (status === "SUBMITTED") return h;
    push(STEP.assigned(revName)); if (status === "ASSIGNED") return h;
    if (status === "QC_DRAFT") { push(STEP.qcdraft()); return h; }
    if (status === "RETURNED_QC") { push(STEP.qcsub(mod)); push(STEP.returned()); return h; }
    push(STEP.qcsub(mod)); if (status === "QC_SUBMITTED") return h;
    push(STEP.adminok()); if (status === "ADMIN_APPROVED") return h;
    if (status === "SA_REJECTED") { push(STEP.sareject()); return h; }
    push(STEP.saok()); if (status === "SA_APPROVED") return h;
    push(STEP.scoreA(sA)); if (status === "SCORED_A") return h;
    push(STEP.scoreB(sB)); return h;
  }

  const REV = { qc1: "R. Menon", qc2: "S. Iyer", qc3: "P. Bhatt" };
  // spec rows: [status, categoryIndex, nomineeIndex, assignedTo, scoreA, scoreB]
  const SPEC = [
    // ---- current nominee (index 0) — several of their own applications ----
    ["DRAFT", 0, 0], ["SUBMITTED", 2, 0], ["QC_SUBMITTED", 1, 0, "qc1"],
    ["SA_APPROVED", 4, 0, "qc2"], ["COMPLETED", 0, 0, "qc3", 84.5, 90.0],
    // ---- other nominees across every state ----
    ["DRAFT", 3, 3], ["DRAFT", 1, 8],
    ["SUBMITTED", 0, 4], ["SUBMITTED", 3, 5], ["SUBMITTED", 2, 9],
    ["ASSIGNED", 0, 1, "qc2"], ["ASSIGNED", 3, 6, "qc1"],
    ["QC_DRAFT", 2, 3, "qc3"], ["QC_DRAFT", 4, 7, "qc2"],
    ["RETURNED_QC", 1, 5, "qc1", null, null], ["RETURNED_QC", 0, 8, "qc3"],
    ["QC_SUBMITTED", 2, 2, "qc1"], ["QC_SUBMITTED", 3, 6, "qc2"],
    ["ADMIN_APPROVED", 4, 4, "qc3"], ["ADMIN_APPROVED", 1, 7, "qc1"],
    ["SA_REJECTED", 3, 9, "qc2"],
    ["SA_APPROVED", 0, 1, "qc1"],
    ["SCORED_A", 4, 2, "qc3", 78.0], ["SCORED_A", 2, 6, "qc2", 81.5],
    ["COMPLETED", 3, 4, "qc1", 88.0, 79.5], ["COMPLETED", 1, 7, "qc2", 73.0, 82.0], ["COMPLETED", 4, 9, "qc3", 91.0, 86.5]
  ];

  const APPLICATIONS = SPEC.map((row, i) => {
    const [status, catIdx, nomIdx, assignedTo, sA, sB] = row;
    const catId = CATEGORIES[catIdx].id, nom = NOMINEE_MASTER[nomIdx];
    const mod = i % 4 === 0;
    const post = ["QC_SUBMITTED", "RETURNED_QC", "ADMIN_APPROVED", "SA_REJECTED", "SA_APPROVED", "SCORED_A", "COMPLETED"];
    let qc = {};
    if (status === "QC_DRAFT") qc = qcPartial();
    else if (post.includes(status)) qc = qcAll(mod);
    const flags = status === "RETURNED_QC" ? ["scope", "qual_staff"] : [];
    const round = ["SCORED_A", "COMPLETED"].includes(status) ? "B" : "A";
    return {
      id: "a" + (i + 1), appNo: "IAMEP/2026/" + String(101 + i).padStart(6, "0"),
      catId, status, nominee: nom, assignedTo: assignedTo || null,
      answers: buildAns(nom, catId, i), qc, flags, round,
      scoreA: sA != null ? sA : null, scoreB: sB != null ? sB : null,
      cycles: post.includes(status) ? 1 + (i % 3) : 0,
      history: hist(status, REV[assignedTo] || "R. Menon", mod, sA, sB),
      createdAt: (8 + (i % 18)) + "-Jul-2026"
    };
  });

  // ---- AUDIT TRAIL (SOW §1.6 — append-only) --------------------------------
  const AUDIT = [
    { ts: "02-Aug-2026 09:40", actor: "V. Sharma", role: "Super Admin", action: "SCORE_B", entity: "IAMEP/2026/000126", detail: "Round B = 86.5 — evaluation complete" },
    { ts: "01-Aug-2026 17:05", actor: "P. Bhatt", role: "QC Reviewer", action: "QC_SUBMIT", entity: "IAMEP/2026/000103", detail: "1 parameter rejected & modified" },
    { ts: "01-Aug-2026 16:30", actor: "R. Menon", role: "QC Reviewer", action: "QC_SUBMIT", entity: "IAMEP/2026/000118", detail: "QC form submitted" },
    { ts: "01-Aug-2026 12:10", actor: "K. Rao", role: "QCI Admin", action: "ADMIN_RETURN", entity: "IAMEP/2026/000116", detail: "2 parameters flagged, reassigned" },
    { ts: "01-Aug-2026 11:40", actor: "Aarav Diagnostics Pvt Ltd", role: "Nominee", action: "APP_SUBMIT", entity: "IAMEP/2026/000102", detail: "Category NABH" },
    { ts: "31-Jul-2026 14:20", actor: "K. Rao", role: "QCI Admin", action: "ASSIGN_QC", entity: "IAMEP/2026/000111", detail: "Assigned to S. Iyer" },
    { ts: "30-Jul-2026 10:15", actor: "V. Sharma", role: "Super Admin", action: "SA_REJECT", entity: "IAMEP/2026/000120", detail: "Returned to Admin" },
    { ts: "24-Jul-2026 10:00", actor: "V. Sharma", role: "Super Admin", action: "MASTER_UPLOAD", detail: "Nominee master Excel uploaded — 13 GSTINs" }
  ];

  // ---- PERSISTENCE ---------------------------------------------------------
  const KEY = "iamep_state_v2";   // bumped — returning visitors get the richer seed
  const DEFAULT = { applications: APPLICATIONS, master: NOMINEE_MASTER, users: USERS, audit: AUDIT, config: CONFIG, lang: "en" };

  function load() {
    try {
      const s = localStorage.getItem(KEY);
      if (s) return JSON.parse(s);
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULT));
  }
  function save(state) { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function reset() { localStorage.removeItem(KEY); }

  window.IAMEP = {
    ROLES, CATEGORIES, QUESTIONNAIRES, NOTICES, STATUS, DEFAULT, CURRENT_NOMINEE,
    load, save, reset,
    catName: id => (CATEGORIES.find(c => c.id === id) || {}).name || { en: id, hi: id },
    catDot: id => (CATEGORIES.find(c => c.id === id) || {}).dot || "#1B84FF"
  };
})();
