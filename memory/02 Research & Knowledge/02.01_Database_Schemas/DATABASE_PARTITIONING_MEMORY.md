# 💬 RAJSHREE LEARNING — SQLITE ARCHITECTURE & PARTITIONING MEMORY

> *Detailed record of the architecture decisions made on 2026-04-07 regarding the transition from Excel/JSON to a dual-database SQLite system. Use this for Phase 1 storage implementation and Phase 2 Admin Panel development.*

---

## 📅 Session Info

| Field | Value |
|:---|:---|
| **Date** | 2026-04-07 |
| **Topic** | SQLite Architecture, Dual-Partitioning, JSON vs Columns |
| **Status** | **Finalized / Approved** |
| **Applicable From** | Phase 1 (Core Storage) & Phase 2 (Admin Panel) |
| **Project Version** | v2.0 |

---

## 🏗️ ARCHITECTURE OVERVIEW: DUAL-DATABASE PARTITIONING

The project will move from a monolithic Excel master record to a high-performance **Dual-Database Partitioning** system. This ensures the frontend stays fast while the backend maintains a rich, historical, and auditable metadata set.

### 1️⃣ `base.sqlite3` (The "Core" Engine)
Dedicated to production-critical data required for the preschool app's daily operation.
- **Goal:** Maximum speed and minimum file size.
- **Model:** Strictly Relational (No JSON).
- **Core Columns:**
  - `id` (Primary Key)
  - `category_id` (Linking to a `categories` table)
  - `letter_num` (The letter/number being taught)
  - `word_hindi` / `word_english`
  - `emoji`
  - `audio_path`
  - `status` (Active/Inactive)

### 2️⃣ `meta.sqlite3` (The "Heavy" Warehouse)
Dedicated to the 240+ extra columns from the original Master Excel, including internal audits and research.
- **Goal:** Data exhaustiveness and flexibility.
- **Model:** Hybrid (Structured Tables + JSON Metadata column).
- **Structure:**
  - **Relational Tables:** For frequently updated metadata (Audit logs, contributor history).
  - **JSON Blob:** A flexible column (e.g., `extra_attributes`) to hold the remaining ~200 sparse or low-frequency columns without table bloating.

---

## 📑 DATA MANAGEMENT STRATEGY

### 🔵 JSON-to-Column Migration Path
A key part of the vision is the ability to "promote" data from the JSON blob in `meta.sqlite3` to its own dedicated column (in either database) if its importance increases.

**Logic for Promotion:**
1. **Schema Extension:** Use `ALTER TABLE` to add the new column.
2. **Data Extraction:** Use **`json_extract()`** to pull the specific key from the existing JSON blob.
3. **Bulk Update:** Feed the extracted data into the new column.
4. **Validation:** Verify before optionally removing the key from the source JSON to keep it lean.

### 🔵 Multi-Database Connectivity
The backend will manage these files using one of two modes:
1. **Separate Connections:** Best for isolated operations (e.g., just updating meta-data).
2. **ATTACH DATABASE Mode:** Best for joint queries where `base` and `meta` data need to be merged into a single report.

---

## 🚀 BACKEND & HOSTING DECISIONS

| Component | Choice | Rationale |
|:---|:---|:---|
| **Primary Language** | **Node.js (Express.js)** | Full stack consistency. Reuses existing JS expertise from both frontend and build scripts. |
| **Database Engine** | SQLite 3 | Serverless, zero-config, single-file portability for local backups. |
| **Admin UI** | Custom Web-Panel | Required to manage the SQLite databases without using third-party GUI tools. |
| **GitHub Pages** | Static-only (Read-only) | SQLite files on GH Pages will be read-only; dynamic updates require a dedicated server. |
| **Future Hosting** | Cloudflare D1 / Supabase | Ready-made free tiers for SQL-based serverless environments if global sync is needed. |

---

## 📎 KEY DECISIONS RECORDED

- [x] **No Hybrid Model in Base:** `base.sqlite3` must remain "pure" relational for speed.
- [x] **Two-File Split:** Separation of "Primary App Data" and "Secondary Metadata".
- [x] **Node.js Preference:** Abandoned Python/bare JS in favor of **Express.js** for the backend.
- [x] **Meta JSON Flexibility:** Use JSON in `meta` only to prevent SQLite table bloating (avoiding 250+ columns in one table).
- [x] **Manual-to-Auto Workflow:** Validated the path from manual local builds to automated GitHub Actions.

---

## 🏗️ WORKFLOW & AUTOMATION

### 🔵 Manual Development Workflow (Recommended for Initial Phase)
1.  **Local Update**: Update core data in `base.sqlite3` or metadata in `meta.sqlite3` using a local GUI or script.
2.  **Build Execution**: Run the Node.js build script locally (e.g., `node scripts/data_pipeline/build_database.js`).
    - The script pulls data from the two SQLite files.
    - It updates the static `.js` files in `frontend/src/js/data/`.
3.  **Synchronization**: `git push` both the `.sqlite3` files (for Master Backup) and the generated `.js` files to GitHub.
4.  **Result**: GitHub Pages serves the new `.js` files immediately; the app reflects the changes.

### 🔵 Automated Development Workflow (GitHub Actions)
To remove the need for manual script execution, a GitHub Action can be implemented:
-   **Trigger**: Configured to run every time a `git push` includes changes to the `database/` folder.
-   **Execution**: 
    - GitHub spins up a temporary Node.js environment.
    - It installs dependencies and runs the `build_database.js` script on the server.
    - It automatically **commits and pushes** the updated `.js` files back to the branch.
-   **Benefit**: You only need to manage the database files; GitHub handles the "compilation" of database data into frontend assets automatically.

---

*Memory Updated: 2026-04-07 | v1.1 — Added Manual and Automated Workflow Consensus*
