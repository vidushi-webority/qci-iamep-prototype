# IAMEP — Integrated Application Management & Evaluation Portal
### Working prototype · QCI Tender **QCI/IT/0726/546** · Prepared by Webority Technologies

A self-contained, browser-based **working prototype** built **point-to-point against the Scope of Work**. No server or install needed — open `index.html` in any modern browser. State persists in the browser (localStorage).

> Indicative prototype for evaluation / mockup demonstration (Technical Evaluation §3 — *Demonstration of mockups*). Not for production use.

---

## How to run
1. Open **`index.html`** in Chrome/Edge/Firefox.
2. On the landing screen, **pick any of the 5 personas** to explore that role.
3. Use the **EN / हि** button (top bar) to switch language.
4. To reset all demo data: open the browser console and run `localStorage.removeItem('iamep_state_v1')`, then refresh.

---

## The 5 personas (SOW §2 — User Persona)
| Role | Access level | What you can do in the prototype |
|---|---|---|
| **Nominee** | Limited | Register (GSTIN), create category applications, fill category-specific questionnaire, save drafts, preview, confirm & submit, get PDF + app-no, track lifecycle |
| **QC Reviewer** | Limited | See only assigned apps, per-parameter approve/reject, update rejected data, optional comments, save review draft, submit; **downloads blocked**, edits only flagged params on return |
| **QCI Admin** | Review & export | Auto-queue of submitted apps, assign QC reviewer, admin review with **modified-parameter highlights**, approve → Super Admin, flag & return to QC (with reassignment), PDF/Excel export |
| **Super Admin** | Full master | All Admin powers, bulk approve, reject-with-comment, **two-round scoring**, rankings, user management, nominee master upload, audit trail, round-weightage settings |
| **Commissioner** | Restricted full view | Read-only oversight of all processing + final scores/rankings + Excel download |

---

## Feature → Scope-of-Work traceability

### Platform characteristics (SOW §1)
- **§1.4 Dashboards for all roles** — every role opens on a role-specific dashboard with counters + tables.
- **§1.5 Bilingual Hindi & English** — global EN/हि toggle across all labels and content.
- **§1.6 Audit trail** — native, append-only chronological log (Super Admin → *Audit Trail*); every action writes an entry.
- **§1.7 File compatibility** — Excel/PDF/DOC/JPEG/PNG upload/download surfaced in forms and settings.

### Registration / Landing (SOW §3.1)
- **§3.1.1–§3.1.2** — GSTIN mandatory; validated against the **authorised nominee master**; auto-generated credentials (simulated email); **duplicate registration prevented**; unique ID key. *(Landing → “Register as Nominee”. Try `09AAACD5678K1Z2`.)*
- **§3.1.3** — Admin/Super Admin re-upload master Excel; system **highlights discrepancies** (registered but absent from new list) to Admin only, no nominee notification. *(Nominee Master → “Re-upload Excel”.)*
- **§3.1.4** — Landing notices (text/image/PDF/video) + **video tutorial** accessible from home.

### Web Portal workflow (SOW §3.2)
- **§3.2.1** — Login → applications under **several categories**; **category-specific questionnaires**; mandatory-field validation; **preview**; **PDF copy** + **unique application number** on submit.
- **§3.2.2** — Save drafts and resume; drafts kept **separately per category**.
- **§3.2.3** — Submitted apps **auto-appear in the Admin queue**; Admin assigns a QC reviewer from available personnel.
- **§3.2.4** — QC form with **question-wise approve/reject** per parameter + **update-data** for rejected; **optional** comment.
- **§3.2.5** — QC reviewers **cannot download** any file; **cannot view** the application after submission (enforced in QC views and app detail).
- **§3.2.6** — QC reviewer can **save review progress as draft** and resume.
- **§3.2.7** — On QC completion, routed to Admin; **modified parameters highlighted**; Admin can approve in full / flag & return to QC / update data directly.
- **§3.2.8** — Admin can **reassign a different QC reviewer** on return; reassigned reviewer sees the full app but edits **only flagged** parameters.
- **§3.2.9** — Admin approval → Super Admin (all Admin powers); Super Admin can **reject the entire form with comment**, returning it to Admin.
- **§3.2.10** — On Super Admin approval, score is calculated by a **configurable KPI formula**.
- **§3.2.11** — Commissioner **oversees the entire proceedings** (read-only).
- **§3.2.12** — **Confirmation pop-up before every final submission** (nominee submit, QC submit, admin/super decisions, scoring).
- **§3.2.13** — Review cycle repeatable (10–15, configurable); **scoring twice** — **Round A (Desktop)** & **Round B (Field)** — with **configurable round weightage**; each KPI updatable up to 10 times.
- **§3.2.14** — Admin/Super Admin **download responses in PDF + Excel**; media referenced by **redirect URLs**.

### Access control & modules (SOW §3.3, §4)
- **§3.3 RBAC** — navigation, views and actions are strictly gated per role.
- **§4 Modules** — the prototype exercises all 8 workstreams: User & Access, Application & Questionnaire, Workflow & QC, Approval & Governance, Scoring/Ranking/Evaluation, Document/Media/Reporting, Dashboard/Notifications/MIS, Security/Audit.

---

## Seeded demo data
7 applications pre-loaded across **every workflow state** (Draft → Submitted → Assigned → QC done → Admin approved → Super-Admin approved → Completed), 6 authorised GSTINs (3 registered), and a populated audit trail — so each role has meaningful content on first open.

## Tech
Plain HTML + CSS + vanilla JS (no build, no dependencies, no backend). QCI navy design system, Inter + Noto Sans Devanagari. Files: `index.html`, `assets/css/style.css`, `assets/js/data.js`, `assets/js/app.js`.

*The real system per the SOW would be built on the QCI-provided AWS infrastructure with a CI/CD pipeline, MeitY-aligned security hardening, VAPT, and data migration to the client server — this prototype demonstrates the functional workflow and UX only.*
