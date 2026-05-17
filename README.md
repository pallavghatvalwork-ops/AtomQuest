# 🎯 AtomQuest — Enterprise Goal Setting & Tracking Portal

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.0-61DAFB.svg?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC.svg?logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green.svg)

AtomQuest is a comprehensive, HRMS-style performance management platform designed to align employee objectives with organizational strategy. Built for the modern enterprise, it facilitates a seamless workflow between employees, managers, and administrators to track quarterly check-ins, manage strict goal-setting governance, and visualize organization-wide analytics.

---

## ✨ Features

- **Role-Based Workflows:** Distinct, customized dashboard experiences for Employees, Managers, and Admins.
- **Enterprise Approval Engine:** Robust goal submission process including Approve, Reject (with mandatory comments), and Return for Rework.
- **Strict Validation Governance:** Built-in business logic enforcing a maximum of 8 goals, minimum 10% weightage per goal, and exactly 100% total weightage before submission.
- **Goal Locking & Security:** Goals are automatically locked upon approval to prevent tampering, requiring Admin intervention for unlocking.
- **Quarterly Check-ins:** Structured progress tracking allowing employees to log achievements and comments per quarter.
- **Advanced Analytics:** Real-time data visualization covering Quarter-over-Quarter (QoQ) trends, goal status distribution, and departmental completion rates.
- **Shared Departmental Goals:** Capability to create global KPIs and seamlessly push them to linked employee profiles.
- **Comprehensive Audit Trail:** Immutable action logging for all critical system events (creation, approval, locking, rejection).
- **Enterprise Activity Feed:** Real-time stream of organizational updates with role-based indicators.

---

## 🛠 Tech Stack

| Technology | Role | Description |
|------------|------|-------------|
| **React 18** | Frontend Framework | Component-based UI rendering |
| **Vite** | Build Tool | Lightning-fast HMR and optimized production builds |
| **Tailwind CSS v3** | Styling | Utility-first CSS framework for rapid enterprise UI |
| **React Router DOM** | Routing | Secure, protected, role-based navigation |
| **Recharts** | Data Visualization | Composable charting library for analytics dashboards |
| **Lucide React** | Iconography | Clean, consistent enterprise icon set |
| **Context API** | State Management | Decentralized, scalable state management (Auth, Goals, Analytics) |
| **LocalStorage** | Persistence | Secure, password-less local persistence for hackathon demo |

---

## 🏗 Architecture

AtomQuest utilizes a clean, layered architecture designed for hackathon agility while maintaining enterprise scalability principles.

```text
[ Presentation Layer ]  (React Components, Tailwind UI)
          ↓
[   Context Layer    ]  (AuthContext, GoalContext, AnalyticsContext)
          ↓
[   Service Layer    ]  (Validation, Calculations, Helpers)
          ↓
[   Storage Layer    ]  (LocalStorage Mock Engine / Supabase Stub)
```

**Why this architecture?**
- **Hackathon Optimized:** The mock-first approach using `localStorage` allows judges to experience the full app without database setup.
- **Scalable:** State is decoupled into distinct domains (Auth, Goals, Analytics) rather than a single monolith.
- **Enterprise Oriented:** The service layer abstracts complex business logic (e.g., progress calculation formulas, weightage validation) away from the UI.
- **Supabase-Ready:** The `supabaseClient.js` stub is pre-configured to swap the local storage engine for a real PostgreSQL backend via environment variables.

---

## 🔄 Workflow Lifecycle

### 👤 Employee
1. **Draft:** Create goals setting targets, thrust areas, deadlines, and weightages.
2. **Submit:** Validate total weightage (100%) and submit the batch for manager review.
3. **Check-in:** Log quarterly achievements against approved goals to drive overall progress.

### 👥 Manager
1. **Review:** Monitor team submissions via the Team Goals dashboard.
2. **Action:** Approve, reject, or return goals for rework (enforcing mandatory feedback comments).
3. **Refine:** Inline edit goal targets or weightages during the review process.

### 🛡 Admin
1. **Oversee:** Monitor organization-wide analytics and departmental completion rates.
2. **Audit:** Track every system action via the filterable Audit Log.
3. **Govern:** Unlock previously approved goals if strategic shifts require adjustments.

---

## ⚖️ Validation Rules

To ensure data integrity, the system strictly enforces:
- **Maximum Goal Cap:** Employees cannot exceed **8 active goals**.
- **Minimum Weightage:** Every goal must have at least **10%** weightage.
- **Total Weightage Lock:** An employee cannot submit their goals for approval unless the sum of all draft and active goals equals **exactly 100%**.

---

## 📊 Analytics Dashboard

Powered by Recharts, the analytics module calculates performance entirely on the client side using `useMemo` optimizations:
- **QoQ Performance Trends:** A line chart plotting average goal progress across Q1–Q4, segmented by department.
- **Status Distribution:** A pie chart illustrating the health of the organization's goals (Draft vs. Pending vs. Approved).
- **Department Comparison:** A bar chart tracking raw completion rates across cross-functional teams.

---

## 📸 Screenshots

| Login Portal | Employee Dashboard |
| :---: | :---: |
| *(Screenshot Placeholder: `/docs/login.png`)* | *(Screenshot Placeholder: `/docs/employee.png`)* |

| Manager Approval Workflow | Analytics & Audit |
| :---: | :---: |
| *(Screenshot Placeholder: `/docs/manager.png`)* | *(Screenshot Placeholder: `/docs/admin.png`)* |

---

## 🔐 Demo Credentials

Use the following credentials to explore the different role-based views. Alternatively, use the **Quick Access** buttons on the login screen.

| Role | Email | Password |
|------|-------|----------|
| **Employee** | `emp@demo.com` | `demo123` |
| **Manager** | `mgr@demo.com` | `demo123` |
| **Admin** | `admin@demo.com` | `demo123` |

---

## 🚀 Setup Instructions

To run AtomQuest locally on your machine:

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/AtomQuest.git

# 2. Navigate into the project directory
cd AtomQuest

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Visit `http://localhost:5173` in your browser to view the application.

---

## 🌍 Deployment

- **Live Demo:** [Insert Netlify/Vercel URL Here]
- **GitHub Repository:** [Insert GitHub URL Here]

---

## 🎨 UI Design Philosophy

AtomQuest's aesthetic was heavily inspired by industry-leading HRMS platforms like **Workday** and **SAP SuccessFactors**. 
- **Enterprise-First UX:** Emphasizes data density, readable data tables, and explicit status indicators.
- **Clean Aesthetic:** Utilizes a professional blue color palette with soft UI elements and rounded cards.
- **Typography:** Uses the highly legible **Inter** font family tailored for complex user interfaces.

---

## 💡 Hackathon Focus

This project was built with a strict focus on **workflow and governance**. Rather than focusing solely on flashy animations, AtomQuest demonstrates a deep understanding of enterprise architecture, role-based access control (RBAC), edge-case validation, and robust application state management. It is designed to feel like a production-ready MVP.

---

## 🔮 Future Enhancements

- **Real-time Backend:** Fully implement the Supabase PostgreSQL backend.
- **Microsoft Teams Sync:** Push goal updates and approval requests directly to Teams channels.
- **SSO Integration:** Implement Azure AD / Microsoft OAuth for corporate single sign-on.
- **Escalation Engine:** Automated alerts for goals stuck in "Pending" for more than 7 days.
- **Automated Email Notifications:** Weekly digest emails for check-ins.
