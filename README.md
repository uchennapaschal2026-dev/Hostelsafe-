# HostelSafe — Student Accommodation & Building Safety Platform

HostelSafe is a specialized, production-ready web platform designed to solve two critical problems for university students across Nigeria (launching in Ifite, Awka near Nnamdi Azikiwe University):
1. **Accommodation Discovery**: Discover affordable, transparent student hostels with verifiable rents in Nigerian Naira (₦), realistic photographs, and confirmed utilities (borehole water, power, security).
2. **Structural & Hazard Safety Reporting**: Empower students to report building hazards (wall/ceiling cracks, sagging balconies, exposed live cables, roof damage, drainage collapse) confidentially, track maintenance repairs, and connect verified hostel managers with licensed structural building inspectors (COREN/MNSE registered).

---

## 🏗 Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Motion.
- **Routing**: React Router v7 with Netlify SPA redirect support (`public/_redirects` and `netlify.toml`).
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) policies and Role-Based Access Control (RBAC).
- **Storage**: Supabase Storage Buckets (`hostel-photos`, `defect-reports`, `inspection-docs`).
- **Geographic Focus**: Initial launch in Ifite, Awka (First Gate, Second Gate, Book Foundation, Aroma, Miracle Junction) with extensible multi-campus architecture.

---

## 🚀 Quick Start & Installation

### 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd hostelsafe
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Provide your Supabase URL and public Anonymous key:
```env
VITE_SUPABASE_URL="https://your-supabase-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
```
*(HostelSafe includes a built-in mock/demo storage engine that immediately activates with sample Ifite Awka hostels and preconfigured role switchers if no live Supabase instance is connected yet, ensuring 100% testability!)*

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 🗄️ Supabase Database & Security Setup

HostelSafe includes SQL migrations in `supabase/migrations/`:
1. `20250101000000_hostelsafe_schema.sql` — Schema with indexes and constraints.
2. `20250101000001_hostelsafe_rls.sql` — Strict Row Level Security policies.
3. `20250101000002_seed_data.sql` — Seed listings for Ifite, Awka.

### Applying Migrations via Supabase Dashboard
1. Go to your Supabase project -> **SQL Editor**.
2. Run `20250101000000_hostelsafe_schema.sql`.
3. Run `20250101000001_hostelsafe_rls.sql`.
4. (Optional) Run `20250101000002_seed_data.sql`.

### Storage Buckets Setup
In Supabase -> **Storage**, create 3 buckets:
- `hostel-photos` (Public bucket for hostel marketing photos)
- `defect-reports` (Restricted bucket for hazard photos)
- `inspection-docs` (Private bucket for certified structural inspection PDF audits)

---

## 👥 Role-Based Access Control (RBAC)

HostelSafe strictly separates privileges across 4 user tiers:

| Role | Permissions & Capabilities |
| :--- | :--- |
| **Student** | Browse verified listings, bookmark hostels, submit building safety defect reports (with anonymous options), send enquiries to managers, and track repair progression in real-time. |
| **Hostel Manager** | Manage properties, update rents & room availability, receive incident tickets, schedule repairs, assign technicians, upload before/after photos, and request independent building inspections. Cannot modify other managers' properties. |
| **Qualified Inspector** | Licensed structural/civil engineers (COREN/MNSE). Conduct on-site safety audits, document concrete/steel degradation, schedule inspections, assign structural risk levels, and issue formal recommendations. Findings cannot be edited or erased by managers or students. |
| **Administrator** | Oversee platform compliance, verify inspector credentials, monitor urgent hazards, review suspicious listings, and view system-wide audit logs. |

---

## ⚠️ Important Safety Disclaimer

> **Critical Notice**: A photograph, resident report, automated risk indicator, or hostel manager statement **cannot** certify a building as structurally safe. Formal verification requires an in-person physical assessment conducted by a qualified and certified structural engineer or authorized building safety authority. In case of immediate life hazards (such as active partial structural collapses or sparking high-voltage lines), students must evacuate immediately and contact local emergency authorities.

---

## 📦 Netlify Deployment

HostelSafe is pre-configured for zero-friction Netlify deployment via `netlify.toml`, `.nvmrc` (Node 22), and `public/_redirects`:

### Option A: Deploy via GitHub + Netlify (Recommended)
1. Push this repository to GitHub/GitLab/Bitbucket.
2. In Netlify, select **Add new site > Import an existing project**.
3. Netlify automatically reads `netlify.toml`:
   - **Node version**: `22`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. (Optional for live database) Under **Site configuration > Environment variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy site**.

### Option B: Deploy via Netlify CLI or Drag-and-Drop
```bash
npm install
npm run build
```
- **Netlify Drop**: Drag the generated `dist/` folder directly into [app.netlify.com/drop](https://app.netlify.com/drop) (`public/_redirects` is copied into `dist/_redirects` automatically for SPA routing).
- **Netlify CLI**: Run `npx netlify-cli deploy --prod --dir=dist`.

