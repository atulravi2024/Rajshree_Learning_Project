# 📋 RAJSHREE LEARNING — DATABASE & HOSTING CHANGELOG (v1.0)

> *Log of all research sessions, decisions, and changes related to backend, database, auth, and hosting planning. Load during architecture reviews.*

---

## 📅 Session Log

| Date | Version | Session | Topics Covered |
|:---|:---|:---|:---|
| 2026-02-28 | v1.0 | **Initial Research Session** | GitHub setup, Git LFS, file limits, auth services (Firebase/Supabase/Clerk/Netlify), hosting platforms, Supabase open-source benefits |

---

## 📜 Detailed Change Log

---

### v1.0 — 2026-02-28 — Initial Research Session

**Time:** 01:27 – 03:20 IST

**What was researched:**

#### 1. Git LFS & Audio Storage (01:27 IST)
- **Question:** ~369 MP3 audio files — do we need Git LFS?
- **Finding:** Files are ~32 KB each = ~12 MB total. No LFS needed.
- **Options explored:** Git LFS, Cloudflare R2, Backblaze B2
- **Decision:** ✅ **Normal git push** — no special tools required

#### 2. Cloudflare R2 vs Backblaze B2 (01:32 IST)
- R2: 10 GB free, **zero egress**, built-in CDN, India PoP ✅
- B2: 10 GB free, $0.01/GB egress, no CDN, simpler setup
- **Decision recorded:** R2 preferred for Indian audience (lower latency)
- **Note:** Moot point — audio doesn't need cloud storage at current scale

#### 3. GitHub File & Repo Limits (01:38–01:51 IST)
- Single file limit: 100 MB hard (50 MB warning)
- Repo size: 1 GB recommended, ~5 GB soft cap
- File count: No hard limit — 1,000/folder for Web UI display
- **Key finding:** 1,000 limit is PER SUBFOLDER, not per parent folder
- **Project safety:** ~450 files, ~30 MB — completely safe for 10+ years

#### 4. Images + Audio Scale Estimate (01:49 IST)
- Added ~369 images (WebP/JPG) + current audio across 4 age groups over 10 years
- **10-year estimate:** ~5,000 files, ~350–400 MB — still within GitHub limits
- **Format recommendation:** WebP over JPG (25–35% smaller)

#### 5. GitHub Pages Login/Signup Capability (01:53 IST)
- **Finding:** GitHub Pages is static — no server, no database, no auth
- **Solution:** Third-party auth services (Firebase, Supabase, Clerk, Netlify Identity)
- **Kids app recommendation:** No login for age 3–5 (kids can't type)

#### 6. Auth Services Comparison (02:00 IST)
- **Compared:** Firebase Auth, Supabase, Clerk, Netlify Identity
- **Winner for Phase 2 (parent login):** Firebase Auth (unlimited free, phone OTP when paid)
- **Winner for Phase 3 (progress tracking):** Supabase (SQL database + auth together)

#### 7. Firebase Spark Free Limits (02:14 IST)
- Key limits: 50,000 reads/day, 20,000 writes/day, no Cloud Functions, no Phone OTP
- **Bottleneck:** ~100 active daily users hits read limit if tracking per-card progress

#### 8. Supabase Free vs Firebase Spark (02:20 IST)
- Supabase wins: Unlimited reads/writes, real SQL, Phone OTP free, open source
- Firebase wins: Never pauses (Supabase sleeps after 1 week), 5 GB storage vs 1 GB, hosting included

#### 9. Free Hosting Comparison (02:27 IST)
- **Compared:** Firebase Hosting, Vercel, Netlify, Cloudflare Pages, GitHub Pages
- **Best for India speed:** Cloudflare Pages (300+ PoPs, Mumbai + Chennai)
- **Best ecosystem fit (with auth):** Firebase Hosting
- **Decision:** GitHub Pages ONLY for Phase 1 (per explicit user directive) → Firebase Hosting when auth is added

#### 10. Supabase Open-Source Benefits (02:36 IST)
- **Current (Phase 1):** Minimal benefit — app is static, no backend
- **Future (Phase 2+):** Major benefits
  - No vendor lock-in
  - Self-hosting saves 90–95% cost vs Firebase at scale
  - Real SQL for complex progress queries
  - DPDP Act compliance (Indian server hosting)
  - School institutional use (bulk import, admin panel)

---

## 📌 All Decisions Made This Session

| # | Decision | Chosen Option | Alternative Rejected | Why Chosen |
|:---|:---|:---|:---|:---|
| 1 | Audio storage | Normal git push | Git LFS, Cloud storage | Files only ~12 MB total |
| 2 | Image format | WebP | JPG | 25–35% smaller |
| 3 | Phase 1 auth | None | Firebase Auth | Age 3–5 kids can't use login |
| 4 | Phase 2 auth | Firebase Auth | Clerk, Supabase alone | Unlimited free users, Google sign-in |
| 5 | Phase 3 database | Supabase (PostgreSQL) | Firebase Firestore | SQL power, unlimited reads/writes, open source |
| 6 | Current hosting | GitHub Pages STRICTLY | Cloudflare Pages, Firebase | User explicitly requested only GitHub for now |
| 7 | Future hosting | GitHub Pages → Firebase | Vercel, Netlify | GitHub for Phase 1, Firebase later for Auth |

---

## 🗺️ Backend Architecture Plan (Future Reference)

```
Phase 1 (Current — Age 3–5)
└── Static only
    ├── Hosted on: GitHub Pages (STRICTLY)
    ├── Auth: None
    └── Database: None

Phase 2 (Age 5–8 — Parent Accounts)
└── Firebase Auth
    ├── Hosted on: Firebase Hosting
    ├── Auth: Firebase Auth (Email + Google sign-in)
    └── Database: Firebase Firestore (basic progress)

Phase 3 (Age 8–12 — Full Progress Tracking)
└── Supabase
    ├── Hosted on: Firebase Hosting / Cloudflare Pages
    ├── Auth: Supabase Auth (Email + Google + Phone OTP)
    └── Database: Supabase PostgreSQL
        ├── Table: parent_accounts
        ├── Table: child_profiles
        ├── Table: learning_progress (per card)
        ├── Table: quiz_scores
        └── Table: badges_earned

Phase 4 (Schools & Institutional)
└── Supabase Self-Hosted
    ├── Hosted on: AWS Mumbai / Indian VPS
    ├── Auth: Supabase Auth
    └── Database: PostgreSQL
        └── + Table: school_accounts
        └── + Table: class_rosters
        └── + Table: teacher_reports
```

---

## 📎 Related Memory Files

| File | Content | Load When |
|:---|:---|:---|
| `DATABASE_MEMORY.md` | Full Q&A session log | Planning backend, reviewing decisions |
| `../../05 Infrastructure & Workflows/GITHUB_MEMORY.md` | GitHub repo rules | Git/GitHub operations |
| `../../05 Infrastructure & Workflows/GITHUB_CHANGELOG.md` | GitHub change history | Repo audits |
| `../02.03_Roadmap/AGE_THEMES.md` | 4-phase expansion plan | Planning new age themes |
| `../../01 Current State/01.05_PROJECT_MEMORY.md` | Core app architecture | Any development session |

---

*Created: 2026-02-28 | v1.0 — Initial research session log*
