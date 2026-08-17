# Zelosify Recruit — Frontend Web Application

![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?style=flat&logo=redux&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Tooling-646CFF?style=flat&logo=vite&logoColor=white)

This repository contains the Next.js frontend application for **Zelosify Recruit**. It provides a role-based, highly responsive SaaS interface for IT Vendors, Hiring Managers, and Business Approvers to interact with the recruitment pipeline and AI Recommendation Engine.

---

##  UI/UX Philosophy & Tech Stack

- **Framework**: Built natively on **Next.js 15 (App Router)** and **React 19**.
- **Design System**: Driven by **Tailwind CSS v3** combined with strictly un-opinionated **shadcn/ui** components (Radix UI primitives). 
- **State Management**: **Redux Toolkit 2** manages cross-component states such as active notifications, user context, and UI toggles.
- **Data Fetching**: Axios instances (`src/utils/AxiosInstance.js`) are configured with smart interceptors to manage transparent 401 redirects and automatic token refresh loops gracefully.
- **Theming**: First-class support for System, Light, and Dark modes via `next-themes`.
- **Responsive Architecture**: The entire application is natively optimized for Desktop, Tablet, and Mobile screens. Features fluid typography, a responsive mobile drawer sidebar, and horizontally scrollable data tables.
- **Empty & Error States**: Comprehensive UI handling of edge cases with contextual empty states for empty lists/dashboards, and robust error states with graceful retry capabilities across all API-dependent pages.

---

##  Getting Started

### Prerequisites
- **Node.js**: v22+
- The `Zelosify-Backend` must be running locally on port `5000`.

### 1. Install Dependencies
```bash
cd Zelosify-Frontend
npm install
```

### 2. Environment Variables
Copy the local environment configuration:
```bash
cp .env.example .env.local
```
Make sure `NEXT_PUBLIC_BACKEND_URL` points to your active backend (e.g., `http://localhost:5000/api/v1`).

### 3. Start Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173` to view the application.

---

##  Role-Based Routing & Architecture

The application is structurally divided using Next.js route groups to separate the unauthenticated marketing/login views from the highly-secured, role-specific SaaS dashboards.

### `app/(Landing)/`
Unauthenticated views including the marketing homepage, `/login`, `/register`, and `/setup-totp`.

### `app/(UserDashBoard)/`
Protected views wrapped by a Redux-hydrated Layout. Contains strict role-gated sub-directories:
- `/hiring-manager`: Dashboard for managing open requisitions, evaluating AI recommendation scores, and shortlisting candidates.
- `/vendor`: Portal for IT vendors to browse active openings and utilize the AWS Pre-signed URL flow to directly upload candidate PDFs.
- `/business-user`: Dashboards dedicated to internal business operations.

### Edge Middleware Security
A central `middleware.js` strictly protects route transitions before React even boots. It verifies the presence of Secure HTTP-Only cookies and asserts the Keycloak Role matches the requested route path (e.g., kicking an `IT_VENDOR` out of a `/hiring-manager` route instantly).

---

## 📁 Key Directories

```text
Zelosify-Frontend/src/
├── app/                  # Next.js 15 App Router views
│   ├── (Landing)/        # Public & Auth pages
│   └── (UserDashBoard)/  # Role-gated Dashboards
├── components/
│   ├── UI/shadcn/        # Reusable primitive UI components
│   └── UserDashboardPage/# Complex composite components (Sidebar, Header)
├── contexts/             # React Contexts (e.g. AuthContext)
├── hooks/                # Custom utility hooks
├── redux/                # Global state slices
└── utils/                # Axios instances, Auth logic, Data formatters
```
