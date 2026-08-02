/* ============================================================
   IAMEP — app.js · SPA workflow engine
   QCI · Tender ref QCI/IT/0726/546 · Webority Technologies
   Each handler is annotated with the Scope-of-Work clause it realises.
   ============================================================ */
(function () {
  "use strict";
  const API = window.IAMEP;
  let S = API.load();
  let ROLE = null;
  let LANG = S.lang || "en";
  let VIEW = "dashboard";
  let CTX = {};                 // transient view context (selected app, wizard step…)

  // ---------- icons ----------
  const IC = {
    dash: '<path d="M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    edit: '<path d="M11 4H4v16h16v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/>',
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.5 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.5A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.5z"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="m8.2 13.9-1.2 7 5-3 5 3-1.2-7"/>',
    chart: '<path d="M3 3v18h18"/><rect x="7" y="10" width="3" height="8"/><rect x="12" y="6" width="3" height="12"/><rect x="17" y="13" width="3" height="5"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    chev: '<path d="m6 9 6 6 6-6"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    play: '<path d="m5 3 14 9-14 9z"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>'
  };
  const ico = (k, cls) => `<svg class="ic ${cls || ""}" viewBox="0 0 24 24">${IC[k] || ""}</svg>`;

  // ---------- helpers ----------
  const $ = s => document.querySelector(s);
  const el = (id) => document.getElementById(id);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const t = o => o == null ? "" : (typeof o === "string" ? o : (o[LANG] || o.en || ""));
  const persist = () => { S.lang = LANG; API.save(S); };
  const role = () => API.ROLES.find(r => r.id === ROLE) || {};
  const roleName = () => t(role().name);
  const now = () => "02-Aug-2026 " + new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const st = k => API.STATUS[k] || { label: { en: k }, badge: "b-grey" };
  const apps = () => S.applications;
  const app = id => apps().find(a => a.id === id);
  const uid = () => "a" + Math.random().toString(36).slice(2, 7);

  function audit(action, entity, detail) {
    S.audit.unshift({ ts: now(), actor: roleName(), role: roleName(), action, entity: entity || "", detail: detail || "" });
    persist();
  }
  function badge(k) { const s = st(k); return `<span class="badge2 ${s.badge}">${esc(t(s.label))}</span>`; }
  function catTag(id) { return `<span class="scheme-tag"><span class="scheme-dot" style="background:${API.catDot(id)}"></span>${esc(id)}</span>`; }

  function toast(msg, icon) {
    const wrap = el("toasts"); const d = document.createElement("div");
    d.className = "toast"; d.innerHTML = ico(icon || "check") + `<span>${esc(msg)}</span>`;
    wrap.appendChild(d); setTimeout(() => { d.style.opacity = "0"; d.style.transform = "translateX(40px)"; setTimeout(() => d.remove(), 250); }, 3200);
  }

  // ---------- modal ----------
  function modal(title, bodyHTML, footHTML, opts) {
    opts = opts || {};
    const root = el("modalRoot");
    root.innerHTML = `<div class="modal-bg"><div class="modal ${opts.lg ? "lg" : ""}">
      <div class="mh"><h3>${title}</h3><span class="x" id="mX">${ico("x")}</span></div>
      <div class="mb">${bodyHTML}</div>
      ${footHTML ? `<div class="mf">${footHTML}</div>` : ""}
    </div></div>`;
    const close = () => root.innerHTML = "";
    el("mX").onclick = close;
    root.querySelector(".modal-bg").onclick = e => { if (e.target.classList.contains("modal-bg")) close(); };
    return { close, root };
  }
  // Confirmation pop-up — SOW §3.2.12 (before every final submission)
  function confirmPop(msg, onYes, yesLabel) {
    const m = modal(t({ en: "Please confirm", hi: "कृपया पुष्टि करें" }),
      `<div class="note">${ico("info")}<div>${esc(msg)}</div></div>
       <p class="muted" style="margin-top:12px;font-size:12.5px">${t({ en: "Review the information entered before proceeding. This action is logged in the audit trail.", hi: "आगे बढ़ने से पहले दर्ज जानकारी की समीक्षा करें। यह क्रिया ऑडिट ट्रेल में दर्ज होगी।" })}</p>`,
      `<button class="btn" id="cNo">${t({ en: "Cancel", hi: "रद्द" })}</button><button class="btn primary" id="cYes">${yesLabel || t({ en: "Confirm & proceed", hi: "पुष्टि करें" })}</button>`);
    el("cNo").onclick = m.close;
    el("cYes").onclick = () => { m.close(); onYes(); };
  }

  // Stub download (PDF/Excel) — SOW §3.2.1 (PDF copy) / §3.2.14 (PDF+Excel export)
  function fakeDownload(name, kind) {
    const content = kind === "xlsx"
      ? "IAMEP export (prototype)\nApplication,Category,Status,Round A,Round B\n" + apps().map(a => [a.appNo, a.catId, t(st(a.status).label), a.scoreA ?? "", a.scoreB ?? ""].join(",")).join("\n")
      : "IAMEP — " + name + "\nGenerated by prototype for QCI/IT/0726/546.\nMedia files are referenced by redirect URL (see SOW §3.2.14).";
    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast(t({ en: "Downloaded: ", hi: "डाउनलोड: " }) + name, "download");
  }

  // ---------- questionnaire access ----------
  const qOf = catId => API.QUESTIONNAIRES[catId] || [];
  const allQ = catId => qOf(catId).flatMap(s => s.questions);
  const scoreable = catId => allQ(catId).filter(q => q.weight > 0);

  // ---------- scoring engine (SOW §3.2.10 / §3.2.13) ----------
  function computeRound(a, kpiMap) {
    const qs = scoreable(a.catId); let num = 0, den = 0;
    qs.forEach(q => { const v = Number(kpiMap[q.id] != null ? kpiMap[q.id] : 70); num += v * q.weight; den += q.weight; });
    return den ? Math.round((num / den) * 10) / 10 : 0;
  }
  const finalScore = a => (a.scoreA == null || a.scoreB == null) ? null
    : Math.round((a.scoreA * S.config.roundA_weight + a.scoreB * S.config.roundB_weight) / 100 * 10) / 10;

  /* =========================================================
     NAV / RBAC (SOW §3.3 — strict Role-Based Access Control)
     ========================================================= */
  function navFor() {
    const n = {
      nominee: [
        ["dashboard", { en: "Dashboard", hi: "डैशबोर्ड" }, "dash"],
        ["myapps", { en: "My Applications", hi: "मेरे आवेदन" }, "file"],
        ["new", { en: "New Application", hi: "नया आवेदन" }, "plus"],
        ["drafts", { en: "Drafts", hi: "प्रारूप" }, "edit"],
        ["notices", { en: "Notices & Updates", hi: "सूचनाएँ" }, "bell"],
        ["tutorial", { en: "Video Tutorial", hi: "वीडियो ट्यूटोरियल" }, "play"]
      ],
      qc: [
        ["dashboard", { en: "Dashboard", hi: "डैशबोर्ड" }, "dash"],
        ["qcqueue", { en: "Assigned to Me", hi: "मुझे सौंपे" }, "inbox"]
      ],
      admin: [
        ["dashboard", { en: "Dashboard", hi: "डैशबोर्ड" }, "dash"],
        ["queue", { en: "Application Queue", hi: "आवेदन कतार" }, "inbox"],
        ["adminreview", { en: "Admin Review", hi: "एडमिन समीक्षा" }, "check"],
        ["master", { en: "Nominee Master", hi: "नामिती मास्टर" }, "users"],
        ["exports", { en: "Exports", hi: "निर्यात" }, "download"]
      ],
      super: [
        ["dashboard", { en: "Dashboard", hi: "डैशबोर्ड" }, "dash"],
        ["allapps", { en: "All Applications", hi: "सभी आवेदन" }, "file"],
        ["approvals", { en: "Approvals", hi: "अनुमोदन" }, "check"],
        ["scoring", { en: "Scoring & Rounds", hi: "स्कोरिंग एवं राउंड" }, "award"],
        ["rankings", { en: "Rankings", hi: "रैंकिंग" }, "chart"],
        ["usermgmt", { en: "User Management", hi: "उपयोक्ता प्रबंधन" }, "users"],
        ["master", { en: "Nominee Master", hi: "नामिती मास्टर" }, "users"],
        ["audit", { en: "Audit Trail", hi: "ऑडिट ट्रेल" }, "shield"],
        ["settings", { en: "Round Settings", hi: "राउंड सेटिंग" }, "settings"],
        ["exports", { en: "Exports", hi: "निर्यात" }, "download"]
      ],
      comm: [
        ["dashboard", { en: "Dashboard", hi: "डैशबोर्ड" }, "dash"],
        ["rankings", { en: "Final Scores & Rankings", hi: "अंतिम स्कोर एवं रैंकिंग" }, "chart"],
        ["processing", { en: "Processing View", hi: "प्रक्रिया दृश्य" }, "eye"],
        ["exports", { en: "Exports", hi: "निर्यात" }, "download"]
      ]
    };
    return n[ROLE] || [];
  }

  function renderNav() {
    const nav = navFor();
    el("nav").innerHTML = nav.map(([v, lab, icn]) => {
      let b = "";
      if (v === "queue") b = countBadge(apps().filter(a => a.status === "SUBMITTED").length);
      if (v === "qcqueue") b = countBadge(apps().filter(a => ["ASSIGNED", "QC_DRAFT", "RETURNED_QC"].includes(a.status)).length);
      if (v === "adminreview") b = countBadge(apps().filter(a => a.status === "QC_SUBMITTED").length);
      if (v === "approvals") b = countBadge(apps().filter(a => a.status === "ADMIN_APPROVED").length);
      if (v === "scoring") b = countBadge(apps().filter(a => ["SA_APPROVED", "SCORED_A"].includes(a.status)).length);
      return `<a data-v="${v}" class="${v === VIEW ? "active" : ""}">${ico(icn)}<span>${esc(t(lab))}</span>${b}</a>`;
    }).join("");
    el("nav").querySelectorAll("a").forEach(a => a.onclick = () => go(a.dataset.v));
  }
  const countBadge = n => n ? `<span class="badge">${n}</span>` : "";

  function go(v, ctx) { VIEW = v; CTX = ctx || {}; renderNav(); render(); window.scrollTo(0, 0); }

  /* =========================================================
     TOP-LEVEL RENDER
     ========================================================= */
  function render() {
    const nav = navFor().find(x => x[0] === VIEW);
    el("crumbs").innerHTML = `<a>${esc(roleName())}</a><span class="sep">/</span><span class="cur">${esc(nav ? t(nav[1]) : t({ en: "Detail", hi: "विवरण" }))}</span>`;
    const map = {
      dashboard: vDashboard, myapps: vMyApps, new: vNew, drafts: vDrafts, notices: vNotices, tutorial: vTutorial,
      qcqueue: vQcQueue, qcreview: vQcReview,
      queue: vQueue, adminreview: vAdminReview, adminreviewone: vAdminReviewOne, master: vMaster, exports: vExports,
      allapps: vAllApps, approvals: vApprovals, approveone: vApproveOne, scoring: vScoring, scoreone: vScoreOne,
      rankings: vRankings, usermgmt: vUserMgmt, audit: vAudit, settings: vSettings, processing: vProcessing,
      appdetail: vAppDetail
    };
    (map[VIEW] || vDashboard)();
  }

  const page = (title, sub, actions) =>
    `<div class="page-head"><div><h1>${esc(t(title))}</h1>${sub ? `<div class="sub">${esc(t(sub))}</div>` : ""}</div>${actions ? `<div class="flex gap8 wrap">${actions}</div>` : ""}</div>`;

  /* ---------------- shared app table ---------------- */
  function appRow(a, actionsHTML) {
    return `<tr>
      <td><span class="linklike" data-app="${a.id}">${esc(a.appNo)}</span></td>
      <td>${catTag(a.catId)}</td>
      <td>${esc(t(a.nominee.name ? { en: a.nominee.name } : a.nominee))}</td>
      <td>${badge(a.status)}</td>
      <td class="mono">${a.round || "A"}</td>
      <td class="mono">${finalScore(a) != null ? finalScore(a) : (a.scoreA != null ? a.scoreA + " / —" : "—")}</td>
      <td class="actions">${actionsHTML || ""}</td>
    </tr>`;
  }
  function wireAppLinks() {
    $("#view").querySelectorAll("[data-app]").forEach(x => x.onclick = () => go("appdetail", { id: x.dataset.app, back: VIEW }));
  }
  function tableShell(head, rows) {
    return `<div class="card"><div class="cb flush"><div class="table-wrap"><table class="tbl">
      <thead><tr>${head.map(h => `<th>${esc(t(h))}</th>`).join("")}</tr></thead>
      <tbody>${rows || `<tr><td colspan="${head.length}" class="center muted" style="padding:34px">${t({ en: "No records.", hi: "कोई रिकॉर्ड नहीं।" })}</td></tr>`}</tbody>
    </table></div></div></div>`;
  }
  const APPHEAD = [{ en: "Application No.", hi: "आवेदन क्र." }, { en: "Category", hi: "श्रेणी" }, { en: "Nominee", hi: "नामिती" }, { en: "Status", hi: "स्थिति" }, { en: "Round", hi: "राउंड" }, { en: "Score", hi: "स्कोर" }, { en: "Actions", hi: "क्रिया" }];

  /* =========================================================
     DASHBOARD (role-specific — SOW §1.4 dashboards for all roles)
     ========================================================= */
  function counter(v, label, accent) {
    return `<div class="counter ${accent || ""}"><div class="v">${v}</div><div class="l">${esc(t(label))}</div></div>`;
  }
  function vDashboard() {
    const A = apps();
    let cards = "", body = "";
    if (ROLE === "nominee") {
      const mine = A;
      cards = counter(mine.length, { en: "My Applications", hi: "मेरे आवेदन" }, "qms")
        + counter(mine.filter(a => a.status === "DRAFT").length, { en: "Drafts", hi: "प्रारूप" }, "enms")
        + counter(mine.filter(a => !["DRAFT", "COMPLETED", "SA_REJECTED"].includes(a.status)).length, { en: "In Process", hi: "प्रक्रियाधीन" }, "ems")
        + counter(mine.filter(a => a.status === "COMPLETED").length, { en: "Completed", hi: "पूर्ण" }, "fsms");
      body = tableShell(APPHEAD, A.map(a => appRow(a, a.status === "DRAFT"
        ? `<button class="btn sm" data-edit="${a.id}">${ico("edit", "sm")}${t({ en: "Continue", hi: "जारी" })}</button>`
        : `<button class="btn sm" data-app="${a.id}">${ico("eye", "sm")}${t({ en: "Track", hi: "ट्रैक" })}</button>`)).join(""));
    } else if (ROLE === "qc") {
      const q = A.filter(a => ["ASSIGNED", "QC_DRAFT", "RETURNED_QC"].includes(a.status));
      cards = counter(q.length, { en: "Assigned to Me", hi: "मुझे सौंपे" }, "ems")
        + counter(A.filter(a => a.status === "QC_DRAFT").length, { en: "In Progress (draft)", hi: "प्रारूप जारी" }, "enms")
        + counter(A.filter(a => a.status === "RETURNED_QC").length, { en: "Returned for Correction", hi: "सुधार हेतु लौटाए" }, "pcb")
        + counter(A.filter(a => a.status === "QC_SUBMITTED").length, { en: "Submitted by Me", hi: "मेरे द्वारा जमा" }, "fsms");
      body = `<div class="note">${ico("shield")}<div><b>${t({ en: "Download restricted", hi: "डाउनलोड प्रतिबंधित" })}:</b> ${t({ en: "As a QC Reviewer you cannot download application PDFs, Excel or media (SOW §3.2.5). After submission you can no longer view application data.", hi: "क्यूसी समीक्षक फाइलें डाउनलोड नहीं कर सकते (SOW §3.2.5)।" })}</div></div>
        <div class="mt16">${tableShell(APPHEAD, q.map(a => appRow(a, `<button class="btn sm primary" data-qc="${a.id}">${ico("check", "sm")}${t({ en: "QC Review", hi: "क्यूसी समीक्षा" })}</button>`)).join(""))}</div>`;
    } else if (ROLE === "admin") {
      cards = counter(A.filter(a => a.status === "SUBMITTED").length, { en: "New in Queue", hi: "कतार में नए" }, "ems")
        + counter(A.filter(a => a.status === "QC_SUBMITTED").length, { en: "Awaiting Admin Review", hi: "एडमिन समीक्षा हेतु" }, "enms")
        + counter(A.filter(a => a.status === "ADMIN_APPROVED").length, { en: "Sent to Super Admin", hi: "सुपर एडमिन को भेजे" }, "ems")
        + counter(A.filter(a => a.status === "SA_REJECTED").length, { en: "Returned by Super Admin", hi: "सुपर एडमिन से लौटे" }, "pcb");
      body = tableShell(APPHEAD, A.filter(a => a.status !== "DRAFT").map(a => appRow(a, adminAction(a))).join(""));
    } else if (ROLE === "super") {
      cards = counter(A.length, { en: "Total Applications", hi: "कुल आवेदन" }, "qms")
        + counter(A.filter(a => a.status === "ADMIN_APPROVED").length, { en: "Pending Approval", hi: "अनुमोदन शेष" }, "enms")
        + counter(A.filter(a => ["SA_APPROVED", "SCORED_A"].includes(a.status)).length, { en: "To Score", hi: "स्कोर हेतु" }, "ems")
        + counter(A.filter(a => a.status === "COMPLETED").length, { en: "Completed", hi: "पूर्ण" }, "fsms")
        + counter(S.master.length, { en: "Registered Nominees", hi: "पंजीकृत नामिती" }, "pcb");
      body = `<div class="grid g-2"><div class="card"><div class="ch"><h3>${t({ en: "Applications by Category", hi: "श्रेणीवार आवेदन" })}</h3></div><div class="cb">${byCategoryBars()}</div></div>
        <div class="card"><div class="ch"><h3>${t({ en: "Recent Audit Events", hi: "हाल की ऑडिट घटनाएँ" })}</h3><span class="linklike" id="allAudit">${t({ en: "View all", hi: "सभी देखें" })}</span></div><div class="cb">${S.audit.slice(0, 5).map(auditRow).join("")}</div></div></div>`;
    } else { // commissioner
      const done = A.filter(a => a.status === "COMPLETED");
      cards = counter(A.length, { en: "Applications Overseen", hi: "अवलोकित आवेदन" }, "qms")
        + counter(done.length, { en: "Fully Evaluated", hi: "पूर्ण मूल्यांकित" }, "fsms")
        + counter(A.filter(a => !["DRAFT", "COMPLETED"].includes(a.status)).length, { en: "In Processing", hi: "प्रक्रियाधीन" }, "enms")
        + counter(done.length ? Math.max(...done.map(finalScore)) : "—", { en: "Top Final Score", hi: "शीर्ष स्कोर" }, "pcb");
      body = `<div class="note">${ico("eye")}<div>${t({ en: "Commissioner has a highly-restricted, read-only view of the entire proceedings and final outputs (SOW §2, §3.2.11).", hi: "आयुक्त को संपूर्ण कार्यवाही का केवल-पठन दृश्य (SOW §3.2.11)।" })}</div></div>
        <div class="mt16">${tableShell(APPHEAD, A.map(a => appRow(a, `<button class="btn sm" data-app="${a.id}">${ico("eye", "sm")}${t({ en: "View", hi: "देखें" })}</button>`)).join(""))}</div>`;
    }
    $("#view").innerHTML = page({ en: "Welcome, " + roleName(), hi: "स्वागत है, " + roleName() },
      role().fn, ROLE === "nominee" ? `<button class="btn primary" id="newBtn">${ico("plus")}${t({ en: "New Application", hi: "नया आवेदन" })}</button>` : "")
      + `<div class="grid ${ROLE === "super" ? "g-5" : "g-4"}" style="margin-bottom:18px">${cards}</div>` + body;
    wireAppLinks();
    $("#view").querySelectorAll("[data-edit]").forEach(x => x.onclick = () => startWizard(x.dataset.edit));
    $("#view").querySelectorAll("[data-qc]").forEach(x => x.onclick = () => go("qcreview", { id: x.dataset.qc }));
    wireAdminActions();
    if (el("newBtn")) el("newBtn").onclick = () => go("new");
    if (el("allAudit")) el("allAudit").onclick = () => go("audit");
  }
  function byCategoryBars() {
    const max = Math.max(1, ...API.CATEGORIES.map(c => apps().filter(a => a.catId === c.id).length));
    return API.CATEGORIES.map(c => {
      const n = apps().filter(a => a.catId === c.id).length;
      return `<div style="margin:9px 0"><div class="flex between" style="font-size:12.5px;margin-bottom:4px"><span>${esc(c.id)}</span><b>${n}</b></div>
        <div style="height:9px;background:var(--bg);border-radius:6px;overflow:hidden"><div style="height:100%;width:${n / max * 100}%;background:${c.dot};border-radius:6px"></div></div></div>`;
    }).join("");
  }
  const auditRow = e => `<div class="audit-row"><span class="tag">${esc(e.action)}</span><div><b>${esc(e.actor)}</b> · ${esc(e.detail || "")} ${e.entity ? `<span class="muted">(${esc(e.entity)})</span>` : ""}<div class="muted" style="font-size:11px">${esc(e.ts)}</div></div></div>`;

  /* =========================================================
     NOMINEE — applications, new-application wizard, drafts
     ========================================================= */
  function vMyApps() {
    $("#view").innerHTML = page({ en: "My Applications", hi: "मेरे आवेदन" }, { en: "Track every application and download the generated PDF copy.", hi: "प्रत्येक आवेदन ट्रैक करें और जनित PDF प्रति डाउनलोड करें।" },
      `<button class="btn primary" id="newBtn">${ico("plus")}${t({ en: "New Application", hi: "नया आवेदन" })}</button>`)
      + tableShell(APPHEAD, apps().map(a => appRow(a,
        (a.status === "DRAFT" ? `<button class="btn sm" data-edit="${a.id}">${ico("edit", "sm")}${t({ en: "Continue", hi: "जारी" })}</button>` :
          `<button class="btn sm" data-app="${a.id}">${ico("eye", "sm")}${t({ en: "Track", hi: "ट्रैक" })}</button>
           <button class="btn sm" data-pdf="${a.id}">${ico("download", "sm")}PDF</button>`))).join(""));
    wireAppLinks();
    $("#view").querySelectorAll("[data-edit]").forEach(x => x.onclick = () => startWizard(x.dataset.edit));
    $("#view").querySelectorAll("[data-pdf]").forEach(x => x.onclick = () => fakeDownload(app(x.dataset.pdf).appNo + ".pdf", "pdf"));
    el("newBtn").onclick = () => go("new");
  }
  function vDrafts() {
    const d = apps().filter(a => a.status === "DRAFT");
    $("#view").innerHTML = page({ en: "Drafts", hi: "प्रारूप" }, { en: "Drafts are kept separately per category — you can work on several category applications in parallel (SOW §3.2.2).", hi: "प्रत्येक श्रेणी हेतु अलग प्रारूप (SOW §3.2.2)।" })
      + tableShell([APPHEAD[0], APPHEAD[1], APPHEAD[3], { en: "Actions", hi: "क्रिया" }],
        d.map(a => `<tr><td>${esc(a.appNo)}</td><td>${catTag(a.catId)}</td><td>${badge(a.status)}</td>
          <td class="actions"><button class="btn sm primary" data-edit="${a.id}">${ico("edit", "sm")}${t({ en: "Continue", hi: "जारी" })}</button></td></tr>`).join(""));
    $("#view").querySelectorAll("[data-edit]").forEach(x => x.onclick = () => startWizard(x.dataset.edit));
  }

  // New application — category picker then wizard (SOW §3.2.1)
  function vNew() {
    $("#view").innerHTML = page({ en: "New Application", hi: "नया आवेदन" }, { en: "Select a category. A category-specific questionnaire will be presented.", hi: "श्रेणी चुनें। श्रेणी-विशिष्ट प्रश्नावली प्रस्तुत होगी।" })
      + `<div class="grid g-3">${API.CATEGORIES.map(c => `<div class="card" style="cursor:pointer;border-left:4px solid ${c.dot}" data-cat="${c.id}">
        <div class="cb"><div class="flex aic gap8"><span class="scheme-dot" style="background:${c.dot};width:12px;height:12px"></span><b>${esc(c.id)}</b></div>
        <div class="muted mt8" style="font-size:12.5px">${esc(t(c.name))}</div>
        <div class="mt16"><span class="btn sm primary">${t({ en: "Start", hi: "प्रारंभ" })} ${ico("plus", "sm")}</span></div></div></div>`).join("")}</div>`;
    $("#view").querySelectorAll("[data-cat]").forEach(x => x.onclick = () => {
      const a = mkNewApp(x.dataset.cat); startWizard(a.id);
    });
  }
  function mkNewApp(catId) {
    const n = S.master[0];
    const a = { id: uid(), appNo: "IAMEP/2026/" + String(100 + apps().length + 10).padStart(6, "0").slice(-6), catId, status: "DRAFT",
      nominee: n, round: "A", answers: {}, qc: {}, flags: [], assignedTo: null, scoreA: null, scoreB: null, cycles: 0,
      history: [{ ts: now(), by: "Nominee", act: "Draft created" }], createdAt: now() };
    apps().unshift(a); persist(); return a;
  }

  function startWizard(id) { CTX = { id, step: 0, answers: Object.assign({}, app(id).answers) }; VIEW = "wizard"; wizard(); }
  function wizard() {
    const a = app(CTX.id); const secs = qOf(a.catId); const step = CTX.step;
    const isPreview = step >= secs.length;
    el("crumbs").innerHTML = `<a id="cbBack">${t({ en: "New Application", hi: "नया आवेदन" })}</a><span class="sep">/</span><span class="cur">${esc(a.appNo)}</span>`;
    const stepsBar = secs.map((s, i) => `<div class="tab ${i === step ? "active" : ""}">${esc(t(s.title).split(".")[0] || (i + 1))}</div>`).join("")
      + `<div class="tab ${isPreview ? "active" : ""}">${t({ en: "Preview", hi: "पूर्वावलोकन" })}</div>`;
    let body;
    if (!isPreview) {
      const s = secs[step];
      body = `<div class="card"><div class="ch"><h3>${esc(t(s.title))}</h3><span class="muted" style="font-size:12px">${t({ en: "Category", hi: "श्रेणी" })}: ${esc(a.catId)}</span></div><div class="cb">
        ${s.questions.map(q => fieldHTML(q, CTX.answers[q.id])).join("")}</div></div>`;
    } else {
      body = `<div class="note">${ico("info")}<div>${t({ en: "Review your complete application below. Mandatory fields are validated. Upon submission a PDF copy and a unique application number are generated (SOW §3.2.1).", hi: "नीचे पूर्ण आवेदन की समीक्षा करें (SOW §3.2.1)।" })}</div></div>
        <div class="card mt16"><div class="cb">${previewHTML(a, CTX.answers)}</div></div>`;
    }
    $("#view").innerHTML = page({ en: "Application — " + a.catId, hi: "आवेदन — " + a.catId }, a.appNo)
      + `<div class="tabs">${stepsBar}</div>` + body
      + `<div class="flex between mt24">
          <button class="btn" id="wPrev" ${step === 0 ? "disabled" : ""}>${t({ en: "Back", hi: "पीछे" })}</button>
          <div class="flex gap8">
            <button class="btn" id="wSave">${ico("edit", "sm")}${t({ en: "Save Draft", hi: "प्रारूप सहेजें" })}</button>
            ${isPreview
              ? `<button class="btn success" id="wSubmit">${ico("check", "sm")}${t({ en: "Submit Application", hi: "आवेदन जमा करें" })}</button>`
              : `<button class="btn primary" id="wNext">${t({ en: "Next", hi: "आगे" })} ${ico("chev", "sm")}</button>`}
          </div></div>`;
    el("cbBack").onclick = () => go("new");
    collectInputs();
    if (el("wPrev")) el("wPrev").onclick = () => { collectInputs(); CTX.step--; wizard(); };
    if (el("wNext")) el("wNext").onclick = () => {
      collectInputs();
      const miss = secs[step].questions.filter(q => q.req && !valFilled(CTX.answers[q.id]));
      if (miss.length) { toast(t({ en: "Please complete mandatory fields.", hi: "अनिवार्य फ़ील्ड भरें।" }), "alert"); return; }
      CTX.step++; wizard();
    };
    el("wSave").onclick = () => { collectInputs(); a.answers = Object.assign({}, CTX.answers); persist(); toast(t({ en: "Draft saved.", hi: "प्रारूप सहेजा गया।" }), "check"); };
    if (el("wSubmit")) el("wSubmit").onclick = () => {
      collectInputs();
      const miss = allQ(a.catId).filter(q => q.req && !valFilled(CTX.answers[q.id]));
      if (miss.length) { toast(t({ en: miss.length + " mandatory field(s) missing.", hi: "अनिवार्य फ़ील्ड शेष।" }), "alert"); return; }
      // §3.2.12 confirmation pop-up before final submission
      confirmPop(t({ en: "Submit this application for QC review? You will receive a PDF copy and a unique application number.", hi: "क्या यह आवेदन जमा करें?" }), () => {
        a.answers = Object.assign({}, CTX.answers); a.status = "SUBMITTED";
        a.history.push({ ts: now(), by: "Nominee", act: "Submitted — routed to Admin queue" });
        audit("APP_SUBMIT", a.appNo, "Category " + a.catId); persist();
        toast(t({ en: "Submitted. App no " + a.appNo, hi: "जमा हुआ। " + a.appNo }), "check");
        go("myapps");
      }, t({ en: "Confirm & submit", hi: "पुष्टि करें" }));
    };
  }
  const valFilled = v => v !== undefined && v !== "" && v !== false && v !== null;
  function fieldHTML(q, v) {
    const lab = `<label>${esc(t(q.label))}${q.req ? ' <span style="color:var(--error)">*</span>' : ""}${q.weight ? ` <span class="hint">· KPI ${q.weight}</span>` : ""}</label>`;
    let inp;
    if (q.type === "textarea") inp = `<textarea class="f" rows="3" data-q="${q.id}">${esc(v || "")}</textarea>`;
    else if (q.type === "select") inp = `<select class="f" data-q="${q.id}"><option value="">${t({ en: "— select —", hi: "— चुनें —" })}</option>${q.opts.map(o => `<option ${v === o ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>`;
    else if (q.type === "file") inp = `<div class="pill-input">${ico("upload", "sm")}${esc(v || t({ en: "Choose file (PDF/JPEG/PNG…)", hi: "फ़ाइल चुनें" }))}</div><input type="hidden" data-q="${q.id}" value="${esc(v || "")}">`;
    else if (q.type === "check") inp = `<label class="switchbox"><span class="switch ${v ? "on" : ""}" data-toggle="${q.id}"></span><input type="hidden" data-q="${q.id}" value="${v ? "1" : ""}"><span class="muted" style="font-size:12.5px">${t({ en: "Tick to certify", hi: "प्रमाणित करें" })}</span></label>`;
    else inp = `<input class="f" type="${q.type === "number" ? "number" : "text"}" data-q="${q.id}" value="${esc(v == null ? "" : v)}">`;
    return `<div class="form-row">${lab}<div>${inp}</div></div>`;
  }
  function collectInputs() {
    $("#view").querySelectorAll("[data-q]").forEach(i => { CTX.answers[i.dataset.q] = i.type === "hidden" && i.value === "1" ? true : i.value; });
    $("#view").querySelectorAll("[data-toggle]").forEach(sw => sw.onclick = () => {
      const id = sw.dataset.toggle; sw.classList.toggle("on");
      const on = sw.classList.contains("on"); CTX.answers[id] = on;
      const h = $(`[data-q="${id}"]`); if (h) h.value = on ? "1" : "";
    });
    // file pick simulation
    $("#view").querySelectorAll(".pill-input").forEach(p => p.onclick = () => {
      const h = p.nextElementSibling; if (!h) return;
      h.value = "uploaded-" + Math.random().toString(36).slice(2, 6) + ".pdf"; CTX.answers[h.dataset.q] = h.value;
      p.innerHTML = ico("check", "sm") + h.value; toast(t({ en: "File attached (simulated).", hi: "फ़ाइल संलग्न (सिमुलेटेड)।" }), "upload");
    });
  }
  function previewHTML(a, answers) {
    return qOf(a.catId).map(s => `<fieldset class="box"><legend>${esc(t(s.title))}</legend>${s.questions.map(q =>
      `<div class="detail-row"><span class="k">${esc(t(q.label))}</span><span class="v">${esc(q.type === "check" ? (answers[q.id] ? "✔" : "—") : (answers[q.id] || "—"))}</span></div>`).join("")}</fieldset>`).join("");
  }

  function vNotices() {
    $("#view").innerHTML = page({ en: "Notices & Updates", hi: "सूचनाएँ एवं अद्यतन" }, { en: "Information published by QCI on the landing page (SOW §3.1.4).", hi: "क्यूसीआई द्वारा प्रकाशित सूचनाएँ (SOW §3.1.4)।" })
      + `<div class="grid g-2">${API.NOTICES.map(n => `<div class="card"><div class="cb">
        <div class="flex aic gap8"><span class="badge2 ${n.type === "notice" ? "b-blue" : n.type === "video" ? "b-purple" : n.type === "doc" ? "b-amber" : "b-green"}">${esc(n.type)}</span><span class="muted" style="font-size:12px">${esc(n.date)}</span></div>
        <h3 class="mt8">${esc(t(n.title))}</h3><p class="muted mt8" style="font-size:13px">${esc(t(n.body))}</p>
        ${n.type === "video" ? `<button class="btn sm primary mt16" id="tut2">${ico("play", "sm")}${t({ en: "Watch", hi: "देखें" })}</button>` : n.type === "doc" ? `<button class="btn sm mt16" data-dl="${esc(t(n.title))}">${ico("download", "sm")}${t({ en: "Download", hi: "डाउनलोड" })}</button>` : ""}
      </div></div>`).join("")}</div>`;
    if (el("tut2")) el("tut2").onclick = () => go("tutorial");
    $("#view").querySelectorAll("[data-dl]").forEach(x => x.onclick = () => fakeDownload("applicant-guidelines.pdf", "pdf"));
  }
  function vTutorial() {
    $("#view").innerHTML = page({ en: "Video Tutorial", hi: "वीडियो ट्यूटोरियल" }, { en: "A walkthrough of the portal for applicants, accessible from the home page (SOW §3.1.4).", hi: "आवेदकों हेतु पोर्टल वॉकथ्रू (SOW §3.1.4)।" })
      + `<div class="card"><div class="cb">
        <div style="aspect-ratio:16/9;background:linear-gradient(135deg,#1A4C8D,#0F2E58);border-radius:10px;display:grid;place-items:center;color:#fff">
          <div class="center"><div style="width:74px;height:74px;border-radius:50%;background:rgba(255,255,255,.16);display:grid;place-items:center;margin:0 auto 12px">${ico("play", "lg")}</div>
          <b>IAMEP — ${t({ en: "Applicant Walkthrough", hi: "आवेदक वॉकथ्रू" })}</b><div style="color:#c8d9f0;font-size:12.5px;margin-top:4px">${t({ en: "05:20 · Registration → Application → PDF copy", hi: "05:20 · पंजीकरण → आवेदन → PDF" })}</div></div>
        </div></div></div>`;
  }

  /* =========================================================
     QC REVIEWER (SOW §3.2.4 – §3.2.6)
     ========================================================= */
  function vQcQueue() {
    const q = apps().filter(a => ["ASSIGNED", "QC_DRAFT", "RETURNED_QC"].includes(a.status));
    $("#view").innerHTML = page({ en: "Assigned to Me", hi: "मुझे सौंपे" }, { en: "Complete the QC form: approve/reject each parameter and, where rejected, update the data (SOW §3.2.4).", hi: "क्यूसी फॉर्म पूर्ण करें (SOW §3.2.4)।" })
      + `<div class="note">${ico("shield")}<div>${t({ en: "You cannot download any file (SOW §3.2.5). Reassigned/returned applications let you edit only the flagged parameters (SOW §3.2.8).", hi: "आप कोई फ़ाइल डाउनलोड नहीं कर सकते (SOW §3.2.5)।" })}</div></div>
      <div class="mt16">${tableShell(APPHEAD, q.map(a => appRow(a, `<button class="btn sm primary" data-qc="${a.id}">${ico("check", "sm")}${a.status === "RETURNED_QC" ? t({ en: "Fix Flagged", hi: "फ्लैग सुधारें" }) : t({ en: "QC Review", hi: "क्यूसी समीक्षा" })}</button>`)).join(""))}</div>`;
    wireAppLinks();
    $("#view").querySelectorAll("[data-qc]").forEach(x => x.onclick = () => go("qcreview", { id: x.dataset.qc }));
  }

  function vQcReview() {
    const a = app(CTX.id);
    const returned = a.status === "RETURNED_QC";
    a.qc = a.qc || {};
    el("crumbs").innerHTML = `<a id="cbBack">${t({ en: "Assigned to Me", hi: "मुझे सौंपे" })}</a><span class="sep">/</span><span class="cur">${esc(a.appNo)}</span>`;
    const rows = qOf(a.catId).map(s => `<fieldset class="box"><legend>${esc(t(s.title))}</legend>
      ${s.questions.map(q => qcParam(a, q, returned)).join("")}</fieldset>`).join("");
    $("#view").innerHTML = page({ en: "QC Review — " + a.appNo, hi: "क्यूसी समीक्षा — " + a.appNo }, { en: "Question-wise approval / rejection. Comments are optional (SOW §3.2.4).", hi: "प्रश्नवार स्वीकृति/अस्वीकृति (SOW §3.2.4)।" })
      + (returned ? `<div class="note" style="background:var(--orange-lt);border-color:#f3d9c0">${ico("alert")}<div><b>${t({ en: "Returned by QCI Admin", hi: "एडमिन द्वारा लौटाया" })}.</b> ${t({ en: "You may modify only the flagged parameters.", hi: "केवल फ्लैग किए पैरामीटर संपादित करें।" })}</div></div><div class="mt16"></div>` : "")
      + rows
      + `<div class="flex between mt24"><button class="btn" id="qcBack2">${t({ en: "Cancel", hi: "रद्द" })}</button>
        <div class="flex gap8"><button class="btn" id="qcSaveDraft">${ico("edit", "sm")}${t({ en: "Save Review Draft", hi: "समीक्षा प्रारूप सहेजें" })}</button>
        <button class="btn success" id="qcSubmit">${ico("check", "sm")}${t({ en: "Submit QC Form", hi: "क्यूसी फॉर्म जमा करें" })}</button></div></div>`;
    el("cbBack").onclick = el("qcBack2").onclick = () => go("qcqueue");
    wireQcParams(a, returned);
    el("qcSaveDraft").onclick = () => { readQc(a); a.status = "QC_DRAFT"; a.history.push({ ts: now(), by: "QC Reviewer", act: "Saved review draft" }); persist(); toast(t({ en: "Review draft saved (SOW §3.2.6).", hi: "समीक्षा प्रारूप सहेजा (SOW §3.2.6)।" }), "check"); go("qcqueue"); };
    el("qcSubmit").onclick = () => {
      readQc(a);
      const scope = returned ? a.flags : allQ(a.catId).map(q => q.id);
      const undone = scope.filter(id => !a.qc[id] || !a.qc[id].d);
      if (undone.length) { toast(t({ en: undone.length + " parameter(s) not yet decided.", hi: "पैरामीटर शेष।" }), "alert"); return; }
      confirmPop(t({ en: "Submit the QC form? It will be routed to the QCI Admin and you will no longer be able to view this application (SOW §3.2.5, §3.2.7).", hi: "क्यूसी फॉर्म जमा करें?" }), () => {
        const mod = Object.values(a.qc).filter(x => x.modified).length;
        a.status = "QC_SUBMITTED"; a.flags = [];
        a.history.push({ ts: now(), by: "QC Reviewer", act: "QC form submitted" + (mod ? " — " + mod + " parameter(s) modified" : "") });
        audit("QC_SUBMIT", a.appNo, mod + " parameter(s) modified"); persist();
        toast(t({ en: "QC form submitted.", hi: "क्यूसी फॉर्म जमा।" }), "check"); go("qcqueue");
      }, t({ en: "Confirm & submit", hi: "पुष्टि करें" }));
    };
  }
  function qcParam(a, q, returned) {
    const editable = !returned || a.flags.includes(q.id);
    const d = (a.qc[q.id] || {});
    const av = q.type === "check" ? (a.answers[q.id] ? "✔ certified" : "—") : (a.answers[q.id] || "—");
    return `<div class="qc-param ${d.d === "approve" ? "ap" : d.d === "reject" ? "rj" : ""}" style="padding:12px 0;border-bottom:1px solid var(--outline)">
      <div class="flex between wrap gap8"><div style="flex:1;min-width:220px"><b style="font-size:13px">${esc(t(q.label))}</b>${q.weight ? ` <span class="hint">· KPI ${q.weight}</span>` : ""}
        <div class="muted" style="font-size:12.5px;margin-top:3px">${t({ en: "Response", hi: "उत्तर" })}: <b style="color:var(--heading)">${esc(av)}</b></div></div>
        <div class="flex gap8">${editable ? `
          <button class="btn sm ${d.d === "approve" ? "success" : ""}" data-ap="${q.id}">${ico("check", "sm")}${t({ en: "Approve", hi: "स्वीकृत" })}</button>
          <button class="btn sm ${d.d === "reject" ? "danger" : ""}" data-rj="${q.id}">${ico("x", "sm")}${t({ en: "Reject", hi: "अस्वीकृत" })}</button>`
          : `<span class="badge2 b-grey">${t({ en: "Locked", hi: "लॉक" })}</span>`}</div></div>
      <div id="rjbox-${q.id}" class="${d.d === "reject" && editable ? "" : "hidden"}" style="margin-top:10px;padding-left:2px">
        <input class="f" placeholder="${t({ en: "Comment (optional)", hi: "टिप्पणी (वैकल्पिक)" })}" data-cm="${q.id}" value="${esc(d.comment || "")}" style="margin-bottom:8px">
        <div class="form-row" style="grid-template-columns:210px 1fr;padding:4px 0"><label>${t({ en: "Update data (rejected)", hi: "डेटा अपडेट" })} <span class="hint">${t({ en: "≤10 updates/KPI", hi: "≤10 अपडेट" })}</span></label>
          <input class="f" data-up="${q.id}" value="${esc(a.answers[q.id] || "")}" placeholder="${t({ en: "Corrected value", hi: "सही मान" })}"></div></div>`;
  }
  function wireQcParams(a, returned) {
    $("#view").querySelectorAll("[data-ap]").forEach(b => b.onclick = () => { setQc(a, b.dataset.ap, "approve"); vQcReview(); });
    $("#view").querySelectorAll("[data-rj]").forEach(b => b.onclick = () => { setQc(a, b.dataset.rj, "reject"); vQcReview(); });
  }
  function setQc(a, id, d) { readQc(a); a.qc[id] = Object.assign(a.qc[id] || {}, { d }); }
  function readQc(a) {
    $("#view").querySelectorAll("[data-cm]").forEach(i => { a.qc[i.dataset.cm] = a.qc[i.dataset.cm] || {}; a.qc[i.dataset.cm].comment = i.value; });
    $("#view").querySelectorAll("[data-up]").forEach(i => {
      const id = i.dataset.up; if (i.value !== "" && i.value !== a.answers[id]) {
        const rec = a.qc[id] = a.qc[id] || {}; rec.updates = (rec.updates || 0) + ((rec._last !== i.value) ? 1 : 0);
        if ((rec.updates || 0) > S.config.maxKpiUpdates) { rec.updates = S.config.maxKpiUpdates; return; }
        rec._last = i.value; rec.modified = true; a.answers[id] = i.value;
      }
    });
  }

  /* =========================================================
     QCI ADMIN (SOW §3.2.3, §3.2.7, §3.2.8, §3.2.14)
     ========================================================= */
  function adminAction(a) {
    if (a.status === "SUBMITTED") return `<button class="btn sm primary" data-assign="${a.id}">${ico("users", "sm")}${t({ en: "Assign QC", hi: "क्यूसी सौंपें" })}</button>`;
    if (a.status === "QC_SUBMITTED") return `<button class="btn sm primary" data-adrev="${a.id}">${ico("check", "sm")}${t({ en: "Review", hi: "समीक्षा" })}</button>`;
    return `<button class="btn sm" data-app="${a.id}">${ico("eye", "sm")}${t({ en: "View", hi: "देखें" })}</button>`;
  }
  function wireAdminActions() {
    $("#view").querySelectorAll("[data-assign]").forEach(x => x.onclick = () => assignModal(x.dataset.assign));
    $("#view").querySelectorAll("[data-adrev]").forEach(x => x.onclick = () => go("adminreviewone", { id: x.dataset.adrev }));
  }
  function vQueue() {
    const q = apps().filter(a => ["SUBMITTED", "ASSIGNED", "QC_DRAFT", "SA_REJECTED"].includes(a.status));
    $("#view").innerHTML = page({ en: "Application Queue", hi: "आवेदन कतार" }, { en: "Submitted applications appear here automatically. Assign a QC Reviewer (SOW §3.2.3).", hi: "जमा आवेदन स्वतः दिखते हैं (SOW §3.2.3)।" })
      + tableShell(APPHEAD, q.map(a => appRow(a, adminAction(a) + (a.assignedTo ? ` <span class="muted" style="font-size:11.5px">→ ${esc(userName(a.assignedTo))}</span>` : ""))).join(""));
    wireAppLinks(); wireAdminActions();
  }
  const userName = id => (S.users.find(u => u.id === id) || {}).name || "—";
  function assignModal(id) {
    const a = app(id); const revs = S.users.filter(u => u.role === "qc");
    const m = modal(t({ en: "Assign QC Reviewer", hi: "क्यूसी समीक्षक सौंपें" }),
      `<p class="muted" style="font-size:13px;margin-bottom:12px">${esc(a.appNo)} · ${esc(a.catId)}</p>
       <div class="vmenu">${revs.map(u => `<div class="vp" data-u="${u.id}">${ico("users", "sm")}${esc(u.name)}<span class="badge">${u.load} ${t({ en: "active", hi: "सक्रिय" })}</span></div>`).join("")}</div>`,
      `<button class="btn" id="asC">${t({ en: "Cancel", hi: "रद्द" })}</button>`);
    el("asC").onclick = m.close;
    m.root.querySelectorAll("[data-u]").forEach(x => x.onclick = () => {
      a.assignedTo = x.dataset.u; a.status = "ASSIGNED";
      a.history.push({ ts: now(), by: "QCI Admin", act: "Assigned to " + userName(x.dataset.u) });
      audit("ASSIGN_QC", a.appNo, "Assigned to " + userName(x.dataset.u)); persist(); m.close();
      toast(t({ en: "Assigned to " + userName(x.dataset.u), hi: "सौंपा गया" }), "users"); render();
    });
  }
  function vAdminReview() {
    const q = apps().filter(a => a.status === "QC_SUBMITTED");
    $("#view").innerHTML = page({ en: "Admin Review", hi: "एडमिन समीक्षा" }, { en: "QC-completed applications awaiting your decision. Modified parameters are highlighted (SOW §3.2.7).", hi: "क्यूसी-पूर्ण आवेदन (SOW §3.2.7)।" })
      + tableShell(APPHEAD, q.map(a => appRow(a, `<button class="btn sm primary" data-adrev="${a.id}">${ico("check", "sm")}${t({ en: "Review", hi: "समीक्षा" })}</button>`)).join(""));
    wireAppLinks(); wireAdminActions();
  }
  function vAdminReviewOne() {
    const a = app(CTX.id);
    el("crumbs").innerHTML = `<a id="cbBack">${t({ en: "Admin Review", hi: "एडमिन समीक्षा" })}</a><span class="sep">/</span><span class="cur">${esc(a.appNo)}</span>`;
    const rows = qOf(a.catId).map(s => `<fieldset class="box"><legend>${esc(t(s.title))}</legend>
      ${s.questions.map(q => {
        const d = a.qc[q.id] || {}; const mod = d.modified;
        return `<div class="detail-row" style="${mod ? "background:var(--warning-lt);margin:0 -8px;padding-left:8px;padding-right:8px;border-radius:6px" : ""}">
          <span class="k">${esc(t(q.label))} ${d.d === "reject" ? '<span class="badge2 b-red">rejected</span>' : d.d === "approve" ? '<span class="badge2 b-green">approved</span>' : ""} ${mod ? `<span class="badge2 b-amber">${t({ en: "MODIFIED", hi: "संशोधित" })}</span>` : ""}</span>
          <span class="v">${esc(q.type === "check" ? (a.answers[q.id] ? "✔" : "—") : (a.answers[q.id] || "—"))}${d.comment ? `<div class="muted" style="font-size:11.5px;font-weight:400">💬 ${esc(d.comment)}</div>` : ""}</span></div>`;
      }).join("")}</fieldset>`).join("");
    $("#view").innerHTML = page({ en: "Admin Review — " + a.appNo, hi: "एडमिन समीक्षा — " + a.appNo }, { en: "Approve in full, return flagged parameters to QC, or update data directly (SOW §3.2.7 / §3.2.8).", hi: "पूर्ण स्वीकृति / फ्लैग लौटाएँ / सीधे अपडेट (SOW §3.2.7)।" })
      + rows
      + `<div class="flex between mt24"><button class="btn" id="arBack">${t({ en: "Cancel", hi: "रद्द" })}</button>
         <div class="flex gap8">
           <button class="btn" id="arExport">${ico("download", "sm")}PDF / Excel</button>
           <button class="btn danger" id="arReturn">${ico("x", "sm")}${t({ en: "Flag & Return to QC", hi: "फ्लैग कर लौटाएँ" })}</button>
           <button class="btn success" id="arApprove">${ico("check", "sm")}${t({ en: "Approve → Super Admin", hi: "स्वीकृत → सुपर एडमिन" })}</button>
         </div></div>`;
    el("cbBack").onclick = el("arBack").onclick = () => go("adminreview");
    el("arExport").onclick = () => exportModal(a);
    el("arApprove").onclick = () => confirmPop(t({ en: "Approve this application in its entirety and route to the Super Admin?", hi: "पूर्ण स्वीकृति और सुपर एडमिन को भेजें?" }), () => {
      a.status = "ADMIN_APPROVED"; a.history.push({ ts: now(), by: "QCI Admin", act: "Approved — routed to Super Admin" });
      audit("ADMIN_APPROVE", a.appNo, ""); persist(); toast(t({ en: "Approved.", hi: "स्वीकृत।" }), "check"); go("adminreview");
    });
    el("arReturn").onclick = () => returnModal(a);
  }
  function returnModal(a) {
    // §3.2.7/§3.2.8 — flag specific parameters, optionally reassign a different QC reviewer
    const revs = S.users.filter(u => u.role === "qc");
    const m = modal(t({ en: "Flag parameters & return to QC", hi: "पैरामीटर फ्लैग कर लौटाएँ" }),
      `<p class="muted" style="font-size:13px;margin-bottom:10px">${t({ en: "Select parameters requiring clarification/correction. The QC Reviewer may edit only these.", hi: "स्पष्टीकरण हेतु पैरामीटर चुनें।" })}</p>
       <div style="max-height:280px;overflow:auto">${allQ(a.catId).filter(q => q.type !== "check").map(q => `<label class="flex aic gap8" style="padding:7px 0;border-bottom:1px solid var(--outline);font-size:13px"><input type="checkbox" data-flag="${q.id}"> ${esc(t(q.label))}</label>`).join("")}</div>
       <div class="form-row mt16" style="grid-template-columns:170px 1fr"><label>${t({ en: "Reassign to", hi: "पुनः सौंपें" })}</label>
         <select class="f" id="reassign"><option value="${a.assignedTo || ""}">${t({ en: "Same reviewer", hi: "वही समीक्षक" })} (${esc(userName(a.assignedTo))})</option>${revs.filter(u => u.id !== a.assignedTo).map(u => `<option value="${u.id}">${esc(u.name)}</option>`).join("")}</select></div>`,
      `<button class="btn" id="rmC">${t({ en: "Cancel", hi: "रद्द" })}</button><button class="btn danger" id="rmGo">${t({ en: "Return to QC", hi: "क्यूसी को लौटाएँ" })}</button>`, { lg: false });
    el("rmC").onclick = m.close;
    el("rmGo").onclick = () => {
      const flags = [...m.root.querySelectorAll("[data-flag]:checked")].map(c => c.dataset.flag);
      if (!flags.length) { toast(t({ en: "Select at least one parameter.", hi: "कम से कम एक चुनें।" }), "alert"); return; }
      a.flags = flags; a.status = "RETURNED_QC";
      const re = el("reassign").value; if (re && re !== a.assignedTo) a.assignedTo = re;
      a.history.push({ ts: now(), by: "QCI Admin", act: "Returned to QC (" + userName(a.assignedTo) + ") — " + flags.length + " parameter(s) flagged" });
      audit("ADMIN_RETURN", a.appNo, flags.length + " flagged"); persist(); m.close();
      toast(t({ en: "Returned to QC.", hi: "क्यूसी को लौटाया।" }), "check"); go("adminreview");
    };
  }
  function exportModal(a) {
    // §3.2.14 — download responses in PDF + Excel; media as redirect URLs
    modal(t({ en: "Export application responses", hi: "आवेदन उत्तर निर्यात" }),
      `<div class="note">${ico("info")}<div>${t({ en: "Media files (images/documents) are included as redirect URLs to the source files (SOW §3.2.14).", hi: "मीडिया फाइलें रीडायरेक्ट URL के रूप में (SOW §3.2.14)।" })}</div></div>
       <div class="flex gap12 mt16"><button class="btn primary" id="exPdf">${ico("download", "sm")}PDF</button><button class="btn success" id="exXls">${ico("download", "sm")}Excel</button></div>`,
      `<button class="btn" id="exC">${t({ en: "Close", hi: "बंद" })}</button>`);
    el("exC").onclick = () => el("modalRoot").innerHTML = "";
    el("exPdf").onclick = () => fakeDownload(a.appNo + ".pdf", "pdf");
    el("exXls").onclick = () => fakeDownload(a.appNo + ".xlsx", "xlsx");
  }

  /* =========================================================
     SUPER ADMIN (SOW §3.2.9, §3.2.10, §3.2.13, §3.3, users, settings)
     ========================================================= */
  function vAllApps() {
    $("#view").innerHTML = page({ en: "All Applications", hi: "सभी आवेदन" }, { en: "Full master view across every category and status.", hi: "सभी श्रेणी/स्थिति का पूर्ण दृश्य।" },
      `<button class="btn" id="bulkBtn">${ico("check", "sm")}${t({ en: "Bulk Approve", hi: "बल्क स्वीकृति" })}</button>`)
      + tableShell(APPHEAD, apps().map(a => appRow(a, `<button class="btn sm" data-app="${a.id}">${ico("eye", "sm")}${t({ en: "Open", hi: "खोलें" })}</button>`)).join(""));
    wireAppLinks();
    el("bulkBtn").onclick = () => {
      const pend = apps().filter(a => a.status === "ADMIN_APPROVED");
      if (!pend.length) { toast(t({ en: "Nothing pending approval.", hi: "कुछ शेष नहीं।" }), "info"); return; }
      confirmPop(t({ en: "Bulk-approve " + pend.length + " application(s) pending Super Admin approval?", hi: pend.length + " आवेदन बल्क स्वीकृत करें?" }), () => {
        pend.forEach(a => { a.status = "SA_APPROVED"; a.history.push({ ts: now(), by: "Super Admin", act: "Bulk approved — ready to score" }); });
        audit("BULK_APPROVE", "", pend.length + " approved"); persist(); toast(t({ en: pend.length + " approved.", hi: pend.length + " स्वीकृत।" }), "check"); render();
      });
    };
  }
  function vApprovals() {
    const q = apps().filter(a => a.status === "ADMIN_APPROVED");
    $("#view").innerHTML = page({ en: "Approvals", hi: "अनुमोदन" }, { en: "Admin-approved applications. Approve to enable scoring, or reject with comment back to Admin (SOW §3.2.9).", hi: "एडमिन-स्वीकृत आवेदन (SOW §3.2.9)।" })
      + tableShell(APPHEAD, q.map(a => appRow(a, `<button class="btn sm primary" data-apprv="${a.id}">${ico("eye", "sm")}${t({ en: "Open", hi: "खोलें" })}</button>`)).join(""));
    wireAppLinks();
    $("#view").querySelectorAll("[data-apprv]").forEach(x => x.onclick = () => go("approveone", { id: x.dataset.apprv }));
  }
  function vApproveOne() {
    const a = app(CTX.id);
    el("crumbs").innerHTML = `<a id="cbBack">${t({ en: "Approvals", hi: "अनुमोदन" })}</a><span class="sep">/</span><span class="cur">${esc(a.appNo)}</span>`;
    $("#view").innerHTML = page({ en: "Approval — " + a.appNo, hi: "अनुमोदन — " + a.appNo }, { en: "Super Admin has all Admin powers and may reject the entire form with a comment (returns to Admin).", hi: "सुपर एडमिन संपूर्ण फॉर्म अस्वीकृत कर सकते हैं।" })
      + `<div class="card"><div class="cb">${previewHTML(a, a.answers)}</div></div>`
      + `<div class="flex between mt24"><button class="btn" id="apBack">${t({ en: "Cancel", hi: "रद्द" })}</button>
         <div class="flex gap8"><button class="btn" id="apExport">${ico("download", "sm")}PDF / Excel</button>
         <button class="btn danger" id="apReject">${ico("x", "sm")}${t({ en: "Reject with comment", hi: "टिप्पणी सहित अस्वीकृत" })}</button>
         <button class="btn success" id="apApprove">${ico("check", "sm")}${t({ en: "Approve — ready to score", hi: "स्वीकृत — स्कोरिंग हेतु" })}</button></div></div>`;
    el("cbBack").onclick = el("apBack").onclick = () => go("approvals");
    el("apExport").onclick = () => exportModal(a);
    el("apApprove").onclick = () => confirmPop(t({ en: "Approve this application? Scoring for Round A can then begin (SOW §3.2.10).", hi: "स्वीकृत करें?" }), () => {
      a.status = "SA_APPROVED"; a.history.push({ ts: now(), by: "Super Admin", act: "Approved — ready to score" });
      audit("SA_APPROVE", a.appNo, ""); persist(); toast(t({ en: "Approved.", hi: "स्वीकृत।" }), "check"); go("approvals");
    });
    el("apReject").onclick = () => {
      const m = modal(t({ en: "Reject entire form", hi: "पूर्ण फॉर्म अस्वीकृत" }),
        `<div class="form-row" style="grid-template-columns:1fr"><label>${t({ en: "Comment (returned to QCI Admin)", hi: "टिप्पणी (एडमिन को लौटेगी)" })}</label><textarea class="f" id="rjc" rows="3"></textarea></div>`,
        `<button class="btn" id="rjC">${t({ en: "Cancel", hi: "रद्द" })}</button><button class="btn danger" id="rjG">${t({ en: "Reject", hi: "अस्वीकृत" })}</button>`);
      el("rjC").onclick = m.close;
      el("rjG").onclick = () => {
        const c = el("rjc").value || "(no comment)"; a.status = "SA_REJECTED";
        a.history.push({ ts: now(), by: "Super Admin", act: "Rejected — returned to Admin: " + c });
        audit("SA_REJECT", a.appNo, c); persist(); m.close(); toast(t({ en: "Rejected & returned to Admin.", hi: "अस्वीकृत।" }), "check"); go("approvals");
      };
    };
  }

  function vScoring() {
    const q = apps().filter(a => ["SA_APPROVED", "SCORED_A"].includes(a.status));
    $("#view").innerHTML = page({ en: "Scoring & Rounds", hi: "स्कोरिंग एवं राउंड" }, { en: "Scoring happens twice — Round A (Desktop) and Round B (Field). Weightage: A " + S.config.roundA_weight + "% · B " + S.config.roundB_weight + "% (SOW §3.2.13).", hi: "राउंड ए (डेस्कटॉप) एवं राउंड बी (फील्ड) (SOW §3.2.13)।" })
      + tableShell([APPHEAD[0], APPHEAD[1], { en: "Round A", hi: "राउंड ए" }, { en: "Round B", hi: "राउंड बी" }, { en: "Final", hi: "अंतिम" }, { en: "Actions", hi: "क्रिया" }],
        q.map(a => `<tr><td><span class="linklike" data-app="${a.id}">${esc(a.appNo)}</span></td><td>${catTag(a.catId)}</td>
          <td class="mono">${a.scoreA != null ? a.scoreA : "—"}</td><td class="mono">${a.scoreB != null ? a.scoreB : "—"}</td>
          <td class="mono"><b>${finalScore(a) != null ? finalScore(a) : "—"}</b></td>
          <td class="actions">${a.scoreA == null ? `<button class="btn sm primary" data-score="${a.id}" data-round="A">${ico("award", "sm")}${t({ en: "Score Round A", hi: "राउंड ए" })}</button>`
            : `<button class="btn sm primary" data-score="${a.id}" data-round="B">${ico("award", "sm")}${t({ en: "Score Round B", hi: "राउंड बी" })}</button>`}</td></tr>`).join(""));
    wireAppLinks();
    $("#view").querySelectorAll("[data-score]").forEach(x => x.onclick = () => go("scoreone", { id: x.dataset.score, round: x.dataset.round }));
  }
  function vScoreOne() {
    const a = app(CTX.id); const round = CTX.round; const qs = scoreable(a.catId);
    const existing = round === "A" ? (a._kpiA || {}) : (a._kpiB || {});
    el("crumbs").innerHTML = `<a id="cbBack">${t({ en: "Scoring", hi: "स्कोरिंग" })}</a><span class="sep">/</span><span class="cur">${esc(a.appNo)} · Round ${round}</span>`;
    $("#view").innerHTML = page({ en: "Score Round " + round + " — " + a.appNo, hi: "राउंड " + round + " स्कोर — " + a.appNo }, { en: round === "A" ? "Round A — Desktop Assessment. Enter a 0–100 score per KPI; each KPI can be updated up to " + S.config.maxKpiUpdates + " times." : "Round B — Field Assessment.", hi: "राउंड " + round })
      + `<div class="card"><div class="cb">${qs.map(q => `<div class="form-row"><label>${esc(t(q.label))} <span class="hint">· KPI weight ${q.weight}</span></label>
        <input class="f" type="number" min="0" max="100" data-kpi="${q.id}" value="${existing[q.id] != null ? existing[q.id] : 70}"></div>`).join("")}
        <div class="detail-row mt16"><span class="k">${t({ en: "Round weightage", hi: "राउंड भारांक" })}</span><span class="v">A ${S.config.roundA_weight}% · B ${S.config.roundB_weight}%</span></div></div></div>`
      + `<div class="flex between mt24"><button class="btn" id="scBack">${t({ en: "Cancel", hi: "रद्द" })}</button>
         <button class="btn success" id="scSave">${ico("award", "sm")}${t({ en: "Compute & Save Round " + round, hi: "गणना करें" })}</button></div>`;
    el("cbBack").onclick = el("scBack").onclick = () => go("scoring");
    el("scSave").onclick = () => {
      const kpi = {}; $("#view").querySelectorAll("[data-kpi]").forEach(i => kpi[i.dataset.kpi] = Math.max(0, Math.min(100, Number(i.value) || 0)));
      const val = computeRound(a, kpi);
      confirmPop(t({ en: "Save Round " + round + " score of " + val + " for " + a.appNo + "?", hi: "स्कोर सहेजें?" }), () => {
        if (round === "A") { a.scoreA = val; a._kpiA = kpi; a.status = "SCORED_A"; a.round = "B"; a.history.push({ ts: now(), by: "Super Admin", act: "Round A (Desktop) scored: " + val }); audit("SCORE_A", a.appNo, "Round A = " + val); }
        else { a.scoreB = val; a._kpiB = kpi; a.status = "COMPLETED"; a.history.push({ ts: now(), by: "Super Admin", act: "Round B (Field) scored: " + val + " — evaluation complete" }); audit("SCORE_B", a.appNo, "Round B = " + val); }
        persist(); toast(t({ en: "Round " + round + " = " + val, hi: "राउंड " + round + " = " + val }), "award"); go("scoring");
      });
    };
  }

  function vRankings() {
    const readOnly = ROLE === "comm";
    const done = apps().filter(a => a.status === "COMPLETED" || a.scoreA != null).slice()
      .sort((x, y) => (finalScore(y) ?? y.scoreA ?? 0) - (finalScore(x) ?? x.scoreA ?? 0));
    $("#view").innerHTML = page({ en: readOnly ? "Final Scores & Rankings" : "Rankings", hi: "रैंकिंग" }, { en: "Ranked by final weighted score (Round A × " + S.config.roundA_weight + "% + Round B × " + S.config.roundB_weight + "%).", hi: "अंतिम भारित स्कोर अनुसार।" },
      `<button class="btn" id="rkX">${ico("download", "sm")}${t({ en: "Export Excel", hi: "एक्सेल निर्यात" })}</button>`)
      + tableShell([{ en: "Rank", hi: "रैंक" }, APPHEAD[0], APPHEAD[1], { en: "Nominee", hi: "नामिती" }, { en: "Round A", hi: "राउंड ए" }, { en: "Round B", hi: "राउंड बी" }, { en: "Final", hi: "अंतिम" }],
        done.map((a, i) => `<tr><td><b class="mono">${i + 1}</b></td><td><span class="linklike" data-app="${a.id}">${esc(a.appNo)}</span></td><td>${catTag(a.catId)}</td>
          <td>${esc(a.nominee.name || "")}</td><td class="mono">${a.scoreA ?? "—"}</td><td class="mono">${a.scoreB ?? "—"}</td>
          <td class="mono"><b>${finalScore(a) != null ? finalScore(a) : (a.scoreA != null ? t({ en: "A only", hi: "केवल ए" }) : "—")}</b></td></tr>`).join(""));
    wireAppLinks();
    el("rkX").onclick = () => fakeDownload("iamep-rankings.xlsx", "xlsx");
  }

  function vUserMgmt() {
    $("#view").innerHTML = page({ en: "User Management", hi: "उपयोक्ता प्रबंधन" }, { en: "Manage users and their roles. RBAC restricts functions, views and data per role (SOW §3.3).", hi: "भूमिका-आधारित पहुँच (SOW §3.3)।" },
      `<button class="btn primary" id="addUser">${ico("plus")}${t({ en: "Add User", hi: "उपयोक्ता जोड़ें" })}</button>`)
      + `<div class="grid g-2" style="margin-bottom:18px">${API.ROLES.map(r => `<div class="card"><div class="cb"><div class="flex aic gap8"><div class="avatar">${r.av}</div><div><b>${esc(t(r.name))}</b><div class="muted" style="font-size:12px">${esc(t(r.access))}</div></div></div><p class="muted mt8" style="font-size:12.5px">${esc(t(r.fn))}</p></div></div>`).join("")}</div>`
      + tableShell([{ en: "Name", hi: "नाम" }, { en: "Role", hi: "भूमिका" }, { en: "Active Load", hi: "सक्रिय भार" }, { en: "Actions", hi: "क्रिया" }],
        S.users.map(u => `<tr><td><b>${esc(u.name)}</b></td><td>${esc(t((API.ROLES.find(r => r.id === u.role) || {}).name))}</td><td class="mono">${u.load}</td>
          <td class="actions"><button class="btn sm">${ico("edit", "sm")}${t({ en: "Edit", hi: "संपादित" })}</button></td></tr>`).join(""));
    el("addUser").onclick = () => {
      const m = modal(t({ en: "Add User", hi: "उपयोक्ता जोड़ें" }),
        `<div class="form-row" style="grid-template-columns:130px 1fr"><label>${t({ en: "Name", hi: "नाम" })}</label><input class="f" id="uN"></div>
         <div class="form-row" style="grid-template-columns:130px 1fr"><label>${t({ en: "Role", hi: "भूमिका" })}</label><select class="f" id="uR">${API.ROLES.map(r => `<option value="${r.id}">${esc(t(r.name))}</option>`).join("")}</select></div>`,
        `<button class="btn" id="uC">${t({ en: "Cancel", hi: "रद्द" })}</button><button class="btn primary" id="uG">${t({ en: "Add", hi: "जोड़ें" })}</button>`);
      el("uC").onclick = m.close;
      el("uG").onclick = () => { const n = el("uN").value.trim(); if (!n) return; S.users.push({ id: uid(), name: n, role: el("uR").value, load: 0 }); persist(); m.close(); toast(t({ en: "User added.", hi: "जोड़ा गया।" }), "users"); render(); };
    };
  }

  function vMaster() {
    // §3.1.1 upload, §3.1.3 re-upload with discrepancy highlight
    $("#view").innerHTML = page({ en: "Nominee Master", hi: "नामिती मास्टर" }, { en: "Authorised nominees with GSTIN. Upload / re-upload the master Excel; the system validates registration against this list (SOW §3.1.1–§3.1.3).", hi: "जीएसटीआईएन सहित अधिकृत नामिती (SOW §3.1.1–3.1.3)।" },
      `<button class="btn" id="reup">${ico("upload", "sm")}${t({ en: "Re-upload Excel", hi: "पुनः अपलोड" })}</button><button class="btn primary" id="up">${ico("upload", "sm")}${t({ en: "Upload Excel", hi: "एक्सेल अपलोड" })}</button>`)
      + tableShell([{ en: "GSTIN", hi: "जीएसटीआईएन" }, { en: "Nominee", hi: "नामिती" }, { en: "Entity", hi: "इकाई" }, { en: "Email", hi: "ईमेल" }, { en: "Unique ID", hi: "विशिष्ट आईडी" }, { en: "Registered", hi: "पंजीकृत" }],
        S.master.map(m => `<tr><td class="mono">${esc(m.gstin)}</td><td><b>${esc(m.name)}</b></td><td>${esc(m.entity)}</td><td class="muted">${esc(m.email)}</td><td class="mono">${esc(m.uid)}</td><td>${m.registered ? '<span class="badge2 b-green">Yes</span>' : '<span class="badge2 b-grey">No</span>'}</td></tr>`).join(""));
    el("up").onclick = () => { audit("MASTER_UPLOAD", "", "Master Excel uploaded — " + S.master.length + " GSTINs"); persist(); toast(t({ en: "Master Excel uploaded (simulated).", hi: "मास्टर एक्सेल अपलोड।" }), "upload"); };
    el("reup").onclick = () => {
      // simulate re-upload where 1 registered nominee is absent from the new list → discrepancy (§3.1.3)
      const registered = S.master.filter(m => m.registered);
      const missing = registered.slice(0, 1);
      modal(t({ en: "Re-upload — discrepancy review", hi: "पुनः अपलोड — विसंगति समीक्षा" }),
        `<div class="note">${ico("alert")}<div>${t({ en: "These nominees are registered in the portal but absent from the newly uploaded list. Shown only to Admin/Super Admin — no notification is sent to nominees (SOW §3.1.3).", hi: "ये नामिती पोर्टल में पंजीकृत परंतु नई सूची में अनुपस्थित (SOW §3.1.3)।" })}</div></div>
         <table class="tbl mt16"><thead><tr><th>GSTIN</th><th>${t({ en: "Nominee", hi: "नामिती" })}</th></tr></thead><tbody>${missing.map(m => `<tr><td class="mono">${esc(m.gstin)}</td><td>${esc(m.name)}</td></tr>`).join("") || `<tr><td colspan="2" class="muted center">${t({ en: "No discrepancies.", hi: "कोई विसंगति नहीं।" })}</td></tr>`}</tbody></table>`,
        `<button class="btn primary" id="dOk">${t({ en: "Acknowledge", hi: "स्वीकार" })}</button>`);
      el("dOk").onclick = () => { el("modalRoot").innerHTML = ""; audit("MASTER_REUPLOAD", "", missing.length + " discrepancy(ies) flagged"); persist(); };
    };
  }

  function vAudit() {
    $("#view").innerHTML = page({ en: "Audit Trail", hi: "ऑडिट ट्रेल" }, { en: "Native, continuous, append-only chronological record of all system events (SOW §1.6).", hi: "मूल, सतत, केवल-जोड़ ऑडिट रिकॉर्ड (SOW §1.6)।" })
      + `<div class="card"><div class="cb">${S.audit.map(auditRow).join("")}</div></div>`;
  }

  function vSettings() {
    $("#view").innerHTML = page({ en: "Round Settings", hi: "राउंड सेटिंग" }, { en: "Configure round weightage and cycle limits. Round weightage is decided with the Authority (SOW §3.2.13).", hi: "राउंड भारांक एवं चक्र सीमा (SOW §3.2.13)।" })
      + `<div class="card"><div class="cb">
        <div class="form-row"><label>${t({ en: "Round A — Desktop weightage (%)", hi: "राउंड ए भारांक (%)" })}</label><input class="f" type="number" id="setA" value="${S.config.roundA_weight}"></div>
        <div class="form-row"><label>${t({ en: "Round B — Field weightage (%)", hi: "राउंड बी भारांक (%)" })}</label><input class="f" type="number" id="setB" value="${S.config.roundB_weight}"></div>
        <div class="form-row"><label>${t({ en: "Max review cycles", hi: "अधिकतम समीक्षा चक्र" })} <span class="hint">10–15</span></label><input class="f" type="number" id="setC" value="${S.config.maxReviewCycles}"></div>
        <div class="form-row"><label>${t({ en: "Max updates per KPI", hi: "प्रति KPI अधिकतम अपडेट" })}</label><input class="f" type="number" id="setK" value="${S.config.maxKpiUpdates}"></div>
        <div class="form-row"><label>${t({ en: "Supported file formats", hi: "समर्थित प्रारूप" })}</label><div class="pill-input">${esc(S.config.fileFormats)}</div></div>
        <div class="mt16"><button class="btn primary" id="setSave">${ico("check", "sm")}${t({ en: "Save Settings", hi: "सहेजें" })}</button></div></div></div>`;
    el("setSave").onclick = () => {
      const A = Number(el("setA").value) || 0, B = Number(el("setB").value) || 0;
      if (A + B !== 100) { toast(t({ en: "Round A + B must equal 100%.", hi: "राउंड ए+बी = 100% होना चाहिए।" }), "alert"); return; }
      S.config.roundA_weight = A; S.config.roundB_weight = B; S.config.maxReviewCycles = Number(el("setC").value) || 15; S.config.maxKpiUpdates = Number(el("setK").value) || 10;
      audit("CONFIG_UPDATE", "", "Round A=" + A + "% B=" + B + "%"); persist(); toast(t({ en: "Settings saved.", hi: "सहेजा गया।" }), "check");
    };
  }

  /* =========================================================
     COMMISSIONER (SOW §3.2.11 — read-only oversight)
     ========================================================= */
  function vProcessing() {
    $("#view").innerHTML = page({ en: "Processing View", hi: "प्रक्रिया दृश्य" }, { en: "Read-only oversight of the entire proceedings for every application (SOW §3.2.11).", hi: "प्रत्येक आवेदन की केवल-पठन निगरानी (SOW §3.2.11)।" })
      + tableShell(APPHEAD, apps().map(a => appRow(a, `<button class="btn sm" data-app="${a.id}">${ico("eye", "sm")}${t({ en: "View", hi: "देखें" })}</button>`)).join(""));
    wireAppLinks();
  }

  /* =========================================================
     APPLICATION DETAIL (shared — read view + lifecycle timeline)
     ========================================================= */
  function vAppDetail() {
    const a = app(CTX.id); const back = CTX.back || "dashboard";
    el("crumbs").innerHTML = `<a id="cbBack">${esc(roleName())}</a><span class="sep">/</span><span class="cur">${esc(a.appNo)}</span>`;
    const canExport = ["admin", "super", "comm"].includes(ROLE);
    $("#view").innerHTML = page({ en: a.appNo, hi: a.appNo }, API.catName(a.catId), canExport ? `<button class="btn" id="dExport">${ico("download", "sm")}PDF / Excel</button>` : "")
      + `<div class="grid g-2">
        <div class="card"><div class="ch"><h3>${t({ en: "Application", hi: "आवेदन" })}</h3><div class="flex gap8">${catTag(a.catId)} ${badge(a.status)}</div></div>
          <div class="cb"><div class="detail-row"><span class="k">${t({ en: "Nominee", hi: "नामिती" })}</span><span class="v">${esc(a.nominee.name || "")}</span></div>
          <div class="detail-row"><span class="k">GSTIN</span><span class="v mono">${esc(a.nominee.gstin || "—")}</span></div>
          <div class="detail-row"><span class="k">${t({ en: "Round", hi: "राउंड" })}</span><span class="v">${a.round || "A"}</span></div>
          <div class="detail-row"><span class="k">${t({ en: "Round A / B", hi: "राउंड ए/बी" })}</span><span class="v mono">${a.scoreA ?? "—"} / ${a.scoreB ?? "—"}</span></div>
          <div class="detail-row"><span class="k">${t({ en: "Final score", hi: "अंतिम स्कोर" })}</span><span class="v mono"><b>${finalScore(a) != null ? finalScore(a) : "—"}</b></span></div>
          ${ROLE !== "qc" ? `<div class="mt16">${previewHTML(a, a.answers)}</div>` : `<div class="note mt16">${ico("shield")}<div>${t({ en: "QC Reviewers cannot view submitted application documents after submission (SOW §3.2.5).", hi: "जमा के बाद क्यूसी समीक्षक दस्तावेज़ नहीं देख सकते (SOW §3.2.5)।" })}</div></div>`}</div></div>
        <div class="card"><div class="ch"><h3>${t({ en: "Lifecycle / Audit", hi: "जीवनचक्र / ऑडिट" })}</h3></div><div class="cb"><div class="tl">
          ${a.history.map((h, i) => `<div class="ev ${i < a.history.length - 1 ? "done" : ""}"><div class="et">${esc(h.act)}</div><div class="em">${esc(h.by)} · ${esc(h.ts)}</div></div>`).join("")}
        </div></div></div></div>`;
    el("cbBack").onclick = () => go(back);
    if (el("dExport")) el("dExport").onclick = () => exportModal(a);
  }

  /* =========================================================
     LANDING (public) & REGISTRATION (SOW §3.1)
     ========================================================= */
  function landingNotices() {
    const m = modal(t({ en: "Public Landing — Notices & Updates", hi: "सार्वजनिक लैंडिंग" }),
      `<div class="grid" style="gap:12px">${API.NOTICES.map(n => `<div class="card"><div class="cb"><div class="flex aic gap8"><span class="badge2 ${n.type === "notice" ? "b-blue" : n.type === "video" ? "b-purple" : n.type === "doc" ? "b-amber" : "b-green"}">${esc(n.type)}</span><span class="muted" style="font-size:12px">${esc(n.date)}</span></div><b class="mt8" style="display:block">${esc(t(n.title))}</b><div class="muted" style="font-size:12.5px;margin-top:4px">${esc(t(n.body))}</div></div></div>`).join("")}</div>
       <div class="mt16 center"><button class="btn primary" id="regBtn">${ico("plus", "sm")}${t({ en: "Register as Nominee (GSTIN)", hi: "नामिती पंजीकरण (GSTIN)" })}</button></div>`, "", { lg: true });
    el("regBtn").onclick = () => { m.close(); registerModal(); };
  }
  function registerModal() {
    // §3.1.2 — validate GSTIN against master; auto-generate credentials; prevent duplicates
    const m = modal(t({ en: "Nominee Registration", hi: "नामिती पंजीकरण" }),
      `<div class="note">${ico("info")}<div>${t({ en: "GSTIN is mandatory and is validated against the authorised nominee list uploaded by QCI (SOW §3.1.1–§3.1.2).", hi: "जीएसटीआईएन अनिवार्य एवं सत्यापित (SOW §3.1.1–3.1.2)।" })}</div></div>
       <div class="form-row mt16" style="grid-template-columns:130px 1fr"><label>GSTIN <span style="color:var(--error)">*</span></label><input class="f mono" id="regG" placeholder="e.g. 09AAACD5678K1Z2"></div>
       <div id="regOut"></div>
       <p class="muted" style="font-size:12px;margin-top:8px">${t({ en: "Try an unregistered authorised GSTIN, e.g. 09AAACD5678K1Z2 or 24AAFCM4321L1Z9.", hi: "उदाहरण: 09AAACD5678K1Z2" })}</p>`,
      `<button class="btn" id="regC">${t({ en: "Cancel", hi: "रद्द" })}</button><button class="btn primary" id="regGo">${t({ en: "Validate & Register", hi: "सत्यापित कर पंजीकृत करें" })}</button>`);
    el("regC").onclick = m.close;
    el("regGo").onclick = () => {
      const g = el("regG").value.trim().toUpperCase();
      const rec = S.master.find(x => x.gstin.toUpperCase() === g);
      const out = el("regOut");
      if (!rec) { out.innerHTML = `<div class="note mt16" style="background:var(--error-lt);border-color:var(--error-cl)">${ico("x")}<div>${t({ en: "GSTIN not found in the authorised list. Registration denied.", hi: "जीएसटीआईएन सूची में नहीं। पंजीकरण अस्वीकृत।" })}</div></div>`; return; }
      if (rec.registered) { out.innerHTML = `<div class="note mt16" style="background:var(--warning-lt);border-color:var(--warning-cl)">${ico("alert")}<div>${t({ en: "This nominee is already onboarded — duplicate registration prevented (SOW §3.1.2).", hi: "पहले से पंजीकृत — दोहराव रोका गया (SOW §3.1.2)।" })}</div></div>`; return; }
      rec.registered = true; audit("NOMINEE_REGISTER", "", rec.name + " (" + rec.gstin + ")"); persist();
      out.innerHTML = `<div class="note mt16" style="background:var(--success-lt);border-color:var(--success-cl)">${ico("check")}<div><b>${t({ en: "Verified", hi: "सत्यापित" })}: ${esc(rec.name)}.</b> ${t({ en: "Login credentials auto-generated and sent to " + rec.email + " (simulated). Unique ID " + rec.uid + ".", hi: "क्रेडेंशियल " + rec.email + " पर भेजे (सिमुलेटेड)।" })}</div></div>`;
      toast(t({ en: "Registered: " + rec.name, hi: "पंजीकृत: " + rec.name }), "check");
    };
  }

  /* =========================================================
     LANGUAGE (SOW §1.5 — Hindi & English)
     ========================================================= */
  function applyLangChrome() {
    const isEn = LANG === "en";
    if (el("langLabel")) el("langLabel").textContent = isEn ? "EN" : "हि";
    el("app").style.fontFamily = isEn ? "" : "'Noto Sans Devanagari','Inter',sans-serif";
  }
  function toggleLang() { LANG = LANG === "en" ? "hi" : "en"; persist(); applyLangChrome(); if (ROLE) { renderNav(); render(); } toast(LANG === "en" ? "Language: English" : "भाषा: हिन्दी", "info"); }

  /* =========================================================
     LOGIN / BOOT
     ========================================================= */
  function renderLogin() {
    el("loginFeats").innerHTML = [
      [ico("shield"), { en: "Strict RBAC · 5 personas", hi: "सख्त RBAC · 5 भूमिकाएँ" }],
      [ico("award"), { en: "Two-round scoring — Desktop & Field", hi: "दो-राउंड स्कोरिंग" }],
      [ico("file"), { en: "Category-specific questionnaires", hi: "श्रेणी-विशिष्ट प्रश्नावली" }],
      [ico("shield"), { en: "Native append-only audit trail", hi: "मूल ऑडिट ट्रेल" }]
    ].map(([i, l]) => `<div class="feat">${i}<span>${esc(t(l))}</span></div>`).join("");
    el("rolePick").innerHTML = API.ROLES.map(r => `<button data-r="${r.id}"><span class="chip">${esc(t(r.access))}</span><span class="rn">${esc(t(r.name))}</span><span class="rd">${esc(t(r.fn))}</span></button>`).join("");
    el("rolePick").querySelectorAll("[data-r]").forEach(b => b.onclick = () => login(b.dataset.r));
    el("landingNoticesBtn").onclick = landingNotices;
    el("langToggleLogin").onclick = toggleLang;
  }
  function login(r) {
    ROLE = r; VIEW = "dashboard"; CTX = {};
    el("login").classList.add("hidden"); el("app").classList.remove("hidden");
    const ro = role();
    el("avatar").textContent = ro.av; el("whoName").textContent = t(ro.name); el("whoRole").textContent = t(ro.access);
    applyLangChrome(); renderNav(); render();
  }
  // hydrate static icon placeholders in the shell FIRST (this replaces
  // topbar/sidebar child nodes), THEN attach handlers to the fresh elements.
  document.querySelectorAll(".logout-btn,.topbar,.usermenu").forEach(n => n.innerHTML = n.innerHTML.replace(/__IC_(\w+)__/g, (m, k) => ico(k)));

  el("logoutBtn").onclick = () => { ROLE = null; el("app").classList.add("hidden"); el("login").classList.remove("hidden"); renderLogin(); };
  el("langToggle").onclick = toggleLang;
  el("notifBtn").onclick = () => toast(t({ en: "No new notifications.", hi: "कोई नई सूचना नहीं।" }), "bell");
  el("userMenu").onclick = () => { if (ROLE === "nominee") go("myapps"); };

  renderLogin();
})();
