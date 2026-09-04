# Government College (Autonomous), Rajahmundry — Alumni Connect Platform

A centralized institutional web platform for **Government College (Autonomous), Rajahmundry (Estd. 1853, NAAC A++ Accredited)**, inspired by the information architecture, usability, and professional standard of Microsoft Alumni Connect, designed with an institutional **Light Theme**.

---

## 🏛️ Platform Highlights & Architecture

### 1. Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite, Lucide Icons, Leaflet OpenStreetMap, Recharts, Canvas-Confetti, Axios, Socket.IO Client.
- **Backend**: Node.js, Express.js, TypeScript, Socket.IO Server, Multer, CSV-Parser, Json2csv, JWT, BcryptJS.
- **Database & ORM**: Prisma ORM with SQLite database (normalized schema with 14 relational models).
- **Theme**: Institutional Light Theme (`#0a2540` Navy, `#c89116` Gold, `#ffffff` Crisp White, `#f8fafc` Off-white backgrounds).

---

## ⚡ Real-Time Live Synchronization Engine
Whenever administrators perform actions in the Admin Portal, updates are broadcasted instantly across all connected user sessions via WebSockets without requiring a page refresh:
- **Events & Webinars**: Immediate updates when events are scheduled, updated, or capacity changes.
- **News & Announcements**: Instant live toast notifications and banner popups for new bulletins.
- **Success Stories & Gallery**: Live injection of newly featured alumni profiles and campus photo media.
- **Site Branding & Configuration**: Dynamic live rebranding (colors, college tagline, hero texts, counters).
- **Registrations & Approvals**: Real-time ticket updates and profile approval badges.

---

## 🔑 Demo Access Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@gcrjy.ac.in` | `Admin@GCRJY2026` | Full system control, user RBAC, audit logs, CSV import/export, branding |
| **Content Manager** | `editor@gcrjy.ac.in` | `Editor@GCRJY2026` | Events CMS, News CMS, Success Stories CMS, Gallery CMS |
| **Alumni Member** | `ramesh.sharma@alumni.gcrjy.ac.in` | `Alumni@2026` | User dashboard, profile editor, event registrations, peer directory |

*Tip: The login page includes **One-Click Quick Demo Login** buttons for instant role testing.*

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or higher)
- npm

### 2. Start Both Server & Client
From the project root directory, run:
```bash
npm run dev
```
This concurrently starts:
- **API Server & Socket Hub**: `http://localhost:5000`
- **Vite React Frontend**: `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```

### 4. Database Management & Seeding
```bash
npm run db:seed
```

---

## 🧭 Site Map & Navigation

### Public Platform
- `/` — Homepage (Hero, Live Counters, Featured Alumni, Upcoming Events, Success Stories, Interactive World Map, News)
- `/about` — Heritage, NAAC A++ accreditation, administrative leadership, and alumni association mission
- `/directory` — Comprehensive searchable alumni registry (multi-facet filters by batch, department, location, industry, grid/list toggle)
- `/directory/:id` — Detailed Alumni Profile view with career timeline, education, verified badge, and mentorship coordinates
- `/events` — Events hub (Upcoming/Past filter, live registration modal, e-ticket generation)
- `/stories` — In-depth alumni success stories and spotlights
- `/news` — College bulletins, notifications, placements, and press releases
- `/gallery` — Campus heritage, batch reunions, and annual conventions with full-screen lightbox
- `/contact` — Alumni Relations office desk and real-time contact intake
- `/login` — Secure sign-in with fast demo buttons and password recovery
- `/register` — Multi-step alumni onboarding wizard

### User Portal (`/user`)
- `/user/dashboard` — Personalized dashboard, profile strength meter, registered events roster, and department peer recommendations
- `/user/settings` — Profile editor, work experience manager, skills tags, and granular privacy switches (Public / Alumni Only / Private)

### Admin Portal (`/admin`)
- `/admin` — Executive analytics, Recharts charts, KPI metrics, recent registrations, and live audit feed
- `/admin/alumni` — Alumni management, one-click verification, profile editing, and CSV export
- `/admin/users` — RBAC user account management, role switching, approvals, suspensions, and password resets
- `/admin/events` — Events CMS, registration roster inspection, and attendance marking
- `/admin/news` — News & Announcements CMS
- `/admin/stories` — Success Stories CMS
- `/admin/gallery` — Media gallery manager
- `/admin/messages` — Contact inquiries inbox and response tracker
- `/admin/import-export` — Bulk CSV import wizard with column mapping and database export tools
- `/admin/audit-logs` — Immutable audit log trail
- `/admin/settings` — Live branding CMS and real-time site configuration

---

## 🛡️ Privacy & Security Features
- **Granular Privacy Preferences**: Alumni can choose whether their email, phone, and company are visible publicly, to logged-in alumni only, or strictly private.
- **Role-Based Access Control (RBAC)**: JWT authentication with strict server-side middleware enforcement (`authMiddleware`, `requireRole`).
- **Administrative Audit Logging**: All changes to settings, alumni verifications, event registrations, and publications are automatically logged with admin credentials and timestamps.
