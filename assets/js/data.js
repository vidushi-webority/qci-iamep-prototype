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
  const NOMINEE_MASTER = [
    { gstin: "07AABCU9603R1ZM", name: "Aarav Diagnostics Pvt Ltd", entity: "Private Limited", email: "contact@aaravdiag.example", uid: "QCI-N-1001", registered: true },
    { gstin: "27AAECS1234F1Z5", name: "Sundaram Test Labs LLP", entity: "LLP", email: "labs@sundaram.example", uid: "QCI-N-1002", registered: true },
    { gstin: "29AAGCB8901H1ZP", name: "Bhaskar Healthcare Trust", entity: "Society/Trust", email: "admin@bhaskarhc.example", uid: "QCI-N-1003", registered: true },
    { gstin: "09AAACD5678K1Z2", name: "Deccan Skills Academy", entity: "Private Limited", email: "info@deccanskills.example", uid: "QCI-N-1004", registered: false },
    { gstin: "24AAFCM4321L1Z9", name: "Meridian Certification Co", entity: "Private Limited", email: "cert@meridian.example", uid: "QCI-N-1005", registered: false },
    { gstin: "33AABCP7654N1Z3", name: "Pallava Quality Systems", entity: "Partnership", email: "quality@pallava.example", uid: "QCI-N-1006", registered: false }
  ];

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

  // ---- SEED APPLICATIONS (one per workflow state for demonstration) -------
  function ans(cat, over) {
    const base = {
      org_name: NOMINEE_MASTER[0].name, org_type: "Private Limited", years_op: 12,
      reg_cert: "registration.pdf", scope: "Mechanical & thermal testing per ISO/IEC 17025.",
      qual_staff: 18, quality_manual: "Yes — fully", prev_audit: "12-Mar-2026",
      evidence: "audit-evidence.pdf", conflict: "No", past_susp: "No", declaration: true
    };
    return Object.assign(base, over || {});
  }
  function mkApp(o) {
    return Object.assign({
      round: "A", answers: {}, qc: {}, flags: [], assignedTo: null,
      scoreA: null, scoreB: null, cycles: 0, history: [], createdAt: "01-Aug-2026"
    }, o);
  }

  const APPLICATIONS = [
    mkApp({ id: "a1", appNo: "IAMEP/2026/000101", catId: "NABL", status: "DRAFT",
      nominee: NOMINEE_MASTER[0], answers: ans("NABL", { qual_staff: 18 }),
      history: [{ ts: "01-Aug-2026 10:12", by: "Nominee", act: "Application draft created" }] }),

    mkApp({ id: "a2", appNo: "IAMEP/2026/000102", catId: "NABH", status: "SUBMITTED",
      nominee: NOMINEE_MASTER[2], answers: ans("NABH", { org_name: NOMINEE_MASTER[2].name, org_type: "Society/Trust", scope: "Hospital accreditation — 220 beds, multi-specialty.", qual_staff: 42 }),
      history: [{ ts: "01-Aug-2026 11:40", by: "Nominee", act: "Submitted — routed to Admin queue" }] }),

    mkApp({ id: "a3", appNo: "IAMEP/2026/000103", catId: "NABL", status: "ASSIGNED", assignedTo: "qc2",
      nominee: NOMINEE_MASTER[1], answers: ans("NABL", { org_name: NOMINEE_MASTER[1].name, org_type: "LLP", qual_staff: 9 }),
      history: [{ ts: "31-Jul-2026 09:00", by: "Nominee", act: "Submitted" }, { ts: "31-Jul-2026 14:20", by: "QCI Admin", act: "Assigned to QC Reviewer S. Iyer" }] }),

    mkApp({ id: "a4", appNo: "IAMEP/2026/000104", catId: "NABET", status: "QC_SUBMITTED", assignedTo: "qc1",
      nominee: NOMINEE_MASTER[3], answers: ans("NABET", { org_name: NOMINEE_MASTER[3].name, scope: "Vocational training organisation accreditation.", qual_staff: 14, quality_manual: "Partially" }),
      qc: { years_op: { d: "approve" }, scope: { d: "approve" }, qual_staff: { d: "approve" },
            quality_manual: { d: "reject", comment: "ISO clause 7.2 not evidenced — please update.", modified: true, updates: 1 },
            prev_audit: { d: "approve" }, conflict: { d: "approve" }, past_susp: { d: "approve" } },
      history: [{ ts: "30-Jul-2026 09:00", by: "Nominee", act: "Submitted" }, { ts: "30-Jul-2026 12:00", by: "QCI Admin", act: "Assigned to R. Menon" }, { ts: "01-Aug-2026 16:30", by: "QC Reviewer", act: "QC form submitted — 1 parameter modified" }] }),

    mkApp({ id: "a5", appNo: "IAMEP/2026/000105", catId: "NABCB", status: "ADMIN_APPROVED", assignedTo: "qc3",
      nominee: NOMINEE_MASTER[4], answers: ans("NABCB", { org_name: NOMINEE_MASTER[4].name, scope: "Management systems certification body.", qual_staff: 26 }),
      qc: { years_op: { d: "approve" }, scope: { d: "approve" }, qual_staff: { d: "approve" }, quality_manual: { d: "approve" }, prev_audit: { d: "approve" }, conflict: { d: "approve" }, past_susp: { d: "approve" } },
      history: [{ ts: "28-Jul-2026", by: "Nominee", act: "Submitted" }, { ts: "29-Jul-2026", by: "QC Reviewer", act: "QC submitted" }, { ts: "31-Jul-2026", by: "QCI Admin", act: "Approved — routed to Super Admin" }] }),

    mkApp({ id: "a6", appNo: "IAMEP/2026/000106", catId: "NBQP", status: "SA_APPROVED", assignedTo: "qc1", round: "A",
      nominee: NOMINEE_MASTER[5], answers: ans("NBQP", { org_name: NOMINEE_MASTER[5].name, org_type: "Partnership", scope: "Quality promotion & statistical tools programme.", qual_staff: 11 }),
      qc: { years_op: { d: "approve" }, scope: { d: "approve" }, qual_staff: { d: "approve" }, quality_manual: { d: "approve" }, prev_audit: { d: "approve" }, conflict: { d: "approve" }, past_susp: { d: "approve" } },
      history: [{ ts: "25-Jul-2026", by: "Nominee", act: "Submitted" }, { ts: "26-Jul-2026", by: "QC Reviewer", act: "QC submitted" }, { ts: "27-Jul-2026", by: "QCI Admin", act: "Approved" }, { ts: "28-Jul-2026", by: "Super Admin", act: "Approved — ready to score" }] }),

    mkApp({ id: "a7", appNo: "IAMEP/2026/000107", catId: "NABL", status: "COMPLETED", assignedTo: "qc2", round: "B",
      nominee: { gstin: "07AAAAA0000A1Z1", name: "Vega Metrology Labs", entity: "Private Limited", email: "vega@example", uid: "QCI-N-1007" },
      answers: ans("NABL", { org_name: "Vega Metrology Labs", scope: "Dimensional & electrical calibration.", qual_staff: 31 }),
      qc: { years_op: { d: "approve" }, scope: { d: "approve" }, qual_staff: { d: "approve" }, quality_manual: { d: "approve" }, prev_audit: { d: "approve" }, conflict: { d: "approve" }, past_susp: { d: "approve" } },
      scoreA: 82.5, scoreB: 88.0,
      history: [{ ts: "10-Jul-2026", by: "Nominee", act: "Submitted" }, { ts: "12-Jul-2026", by: "QC Reviewer", act: "QC submitted" }, { ts: "14-Jul-2026", by: "QCI Admin", act: "Approved" }, { ts: "15-Jul-2026", by: "Super Admin", act: "Approved" }, { ts: "18-Jul-2026", by: "Super Admin", act: "Round A (Desktop) scored: 82.5" }, { ts: "28-Jul-2026", by: "Super Admin", act: "Round B (Field) scored: 88.0 — evaluation complete" }] })
  ];

  // ---- AUDIT TRAIL (SOW §1.6 — append-only) --------------------------------
  const AUDIT = [
    { ts: "01-Aug-2026 16:30", actor: "R. Menon", role: "QC Reviewer", action: "QC_SUBMIT", entity: "IAMEP/2026/000104", detail: "1 parameter rejected & modified" },
    { ts: "01-Aug-2026 11:40", actor: "Bhaskar Healthcare Trust", role: "Nominee", action: "APP_SUBMIT", entity: "IAMEP/2026/000102", detail: "Category NABH" },
    { ts: "31-Jul-2026 14:20", actor: "K. Rao", role: "QCI Admin", action: "ASSIGN_QC", entity: "IAMEP/2026/000103", detail: "Assigned to S. Iyer" },
    { ts: "28-Jul-2026 09:15", actor: "V. Sharma", role: "Super Admin", action: "SCORE_B", entity: "IAMEP/2026/000107", detail: "Round B = 88.0" },
    { ts: "24-Jul-2026 10:00", actor: "V. Sharma", role: "Super Admin", action: "MASTER_UPLOAD", detail: "Nominee master Excel uploaded — 6 GSTINs" }
  ];

  // ---- PERSISTENCE ---------------------------------------------------------
  const KEY = "iamep_state_v1";
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
    ROLES, CATEGORIES, QUESTIONNAIRES, NOTICES, STATUS, DEFAULT,
    load, save, reset,
    catName: id => (CATEGORIES.find(c => c.id === id) || {}).name || { en: id, hi: id },
    catDot: id => (CATEGORIES.find(c => c.id === id) || {}).dot || "#1B84FF"
  };
})();
