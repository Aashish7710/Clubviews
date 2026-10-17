# EVENTMANAGER

EVENTMANAGER is a centralized campus event discovery, club coordination, and student participation platform designed to streamline collegiate extracurricular activities. It replaces fragmented social media notices and bulletin boards with a single, role-aware portal for browsing campus events, managing student clubs, handling registrations, and coordinating administrative oversight.

---

## 1. Problem Statement & Motivation

Collegiate extracurricular ecosystems suffer from information fragmentation. Event announcements, club recruitments, registration forms, and schedule updates are typically dispersed across disparate WhatsApp groups, Instagram pages, posters, and email threads. This causes several operational challenges:

- **Information Loss & Clashes:** Students frequently miss registration deadlines or discover schedule overlaps between major campus events too late.
- **Administrative Overhead:** Club coordinators struggle with manual participant tracking, Google Sheets management, and chaotic email verification.
- **Lack of Institutional Visibility:** College administrators and faculty advisors lack real-time visibility into club activity, event engagement numbers, and venue utilization.

EVENTMANAGER addresses these challenges by offering a unified web platform that integrates club directories, event scheduling, dynamic attendee registration, and administrative oversight.

---

## 2. Project Objectives

- **Centralized Event Discovery:** Provide a searchable, filterable catalog of upcoming, ongoing, and past campus events.
- **Club Directory & Profiling:** Offer dedicated club profile pages featuring faculty advisors, student coordinators, and social links.
- **Streamlined Registration:** Support student registrations with customizable form fields and automated capacity-based waitlisting.
- **Role-Based Workflows:** Deliver distinct interfaces for students (browsing, registration, profile management), club coordinators (event publishing, attendee management), and campus administrators (club approvals, platform analytics).
- **Communication & Record Keeping:** Facilitate automated email confirmations and centralized event data exports.

---

## 3. Implemented Features (Verified in Codebase)

The following capabilities have concrete implementation in the client and server codebases:

### Authentication & User Management (`/api/auth`, `/api/users`)
- **Student Registration & Login:** User account creation with name, email, password (bcrypt hashed), roll number, branch, year, and program (`BTECH`, `MTECH`, etc.).
- **Session Management:** Secure HTTP-only JWT cookie generation (`jwt`, `token`) alongside JSON payload response.
- **Profile Retrieval & Update:** Endpoints (`GET /api/auth/me`, `PUT /api/auth/profile/:id`) to inspect and update user profile details without exposing password hashes.

### Event Management (`/api/events`)
- **Event Catalog:** Listing of campus events sorted chronologically by start time (`GET /api/events`).
- **Event Lookup:** Resolution by URL-friendly slug or MongoDB ObjectId (`GET /api/events/:slug`).
- **Event Creation:** Creation of events with title, description, venue, start/end dates, registration deadlines, seat limits, entry fees, and custom registration fields (`POST /api/events`).
- **Event Registration & Waitlisting:** Student registration tracking (`POST /api/events/:eventId/register`) with automatic seat capacity verification. When total seats are filled, registrants are marked `WAITLISTED`; otherwise `REGISTERED`.
- **Event Deletion:** Endpoint for event removal (`DELETE /api/events/:id`).

### Club Management (`/api/clubs`)
- **Club Directory:** Retrieval of registered student clubs with category filtering, logos, and coordinator listings.
- **Club Details & Slugs:** Auto-generated URL slugs for clean web routing (`/club/:slug`).

### Administrative Controls (`/api/admin`)
- **Platform Analytics:** Real-time statistics aggregation (`GET /api/admin/dashboard/stats`) returning total students, total events, total active clubs, and live events.
- **Coordinator Management:** Dedicated creation and update endpoints for student club coordinators.
- **Club Administration:** Full administrative lifecycle for creating, editing, and toggling club active status (`POST /api/admin/clubs`, `PUT /api/admin/clubs/:id`).
- **Data Export:** Filterable event participation metrics queryable by month, year, and club (`GET /api/admin/events/export`).

---

## 4. Partially Implemented & Planned Features

To maintain strict technical transparency, the following features are present as UI stubs or partial implementations:

| Feature | Current Codebase Status | Remaining Work |
| :--- | :--- | :--- |
| **Razorpay Payment Integration** | Frontend helper exists (`src/utils/razorpay.js`), but backend payment verification route is stubbed. | Implement webhook verification and payment transaction ledger model. |
| **Google Calendar & ICS Sync** | Client utility (`src/utils/calendar.js`) generates valid `.ics` files and web links; not yet tied to user calendar subscriptions. | Add automated calendar invite attachments to registration emails. |
| **Real-time Push Notifications** | Frontend references `SocketContext` in `Navbar.jsx`; WebSocket server is not yet attached to Express. | Set up `socket.io` server instance and real-time room dispatching. |
| **Manual Payout Processing** | Admin route `/api/admin/payout/:eventId` returns a placeholder success JSON. | Integrate financial ledger and payout tracking tables. |
| **QR Code Check-in** | Registration endpoint returns a mock `SAMPLE_QR_CODE` string. | Implement dynamic JWT-signed QR code generator and attendance scanner view. |

---

## 5. Technology Stack

### Frontend
- **Framework:** React 18 / 19 SPA
- **Build Tool:** Vite
- **Routing:** React Router v6 (`react-router-dom`)
- **Styling:** Tailwind CSS (v4 structure)
- **Icons:** Lucide React (`lucide-react`) & RemixIcon
- **HTTP Client:** Axios with cookie-credential support

### Backend
- **Runtime:** Node.js (ES Module syntax: `"type": "module"`)
- **Web Framework:** Express.js 5
- **Database & ODM:** MongoDB with Mongoose ODM (v8)
- **Authentication & Security:** JSON Web Tokens (`jsonwebtoken`), Bcrypt (`bcrypt`), Cookie Parser (`cookie-parser`), CORS middleware
- **Email Delivery:** Nodemailer (`nodemailer`) with SMTP transport configuration

---

## 6. Architecture Overview

EVENTMANAGER follows a decoupled, three-tier client-server architecture:

```
┌────────────────────────────────────────────────────────┐
│                   Presentation Tier                    │
│       React SPA (Vite) + Tailwind CSS + Lucide         │
│  Pages: Home, Events, ClubDetails, AdminDashboard, etc.│
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / REST (JSON & Cookies)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Application Tier                     │
│               Node.js + Express.js API                 │
│  Routers: auth.js, event.js, club.js, admin.js         │
│  Middleware: auth.js (JWT verification & role guards)   │
│  Services: emailService.js (Nodemailer SMTP)          │
└───────────────────────────┬────────────────────────────┘
                            │ Mongoose ODM
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Persistence Tier                     │
│               MongoDB Document Database                │
│  Collections: users, events, clubs                     │
└────────────────────────────────────────────────────────┘
```

---

## 7. Repository Directory Structure

```
EVENTMANAGER/
├── client/                     # Frontend Single Page Application
│   ├── public/                 # Static assets, logos, fonts
│   ├── src/
│   │   ├── Api/                # Axios instance configuration (axios.js)
│   │   ├── assets/             # SVGs and UI media
│   │   ├── components/         # Reusable UI components (Navbar, EventCard, etc.)
│   │   │   ├── skeletons/      # Loading skeletons
│   │   │   └── ui/             # Primitive UI widgets and icons
│   │   ├── config/             # Base API URL configuration
│   │   ├── constants/          # Campus venues and academic programs
│   │   ├── context/            # Theme, Notification, and Socket providers
│   │   ├── lib/                # Tailwind class utility (cn helper)
│   │   ├── pages/              # Route view pages (Home, EventFeed, Admin, etc.)
│   │   ├── types/              # Type definitions and participation shapes
│   │   ├── utils/              # Calendar (.ics) and payment helpers
│   │   ├── App.css
│   │   ├── App.jsx             # Top-level client router and layout wrapper
│   │   ├── index.css           # Global Tailwind CSS definitions
│   │   └── main.jsx            # React root mount point
│   ├── index.html              # HTML5 entry template
│   ├── package.json            # Client package manifest & scripts
│   └── vite.config.js          # Vite build configuration
│
├── server/                     # Backend REST API Service
│   ├── controllers/            # Request handlers (auth, event, club, admin)
│   ├── lib/                    # Database connection pool (db.js)
│   ├── middleware/             # JWT auth & role authorization guards
│   ├── models/                 # Mongoose schemas (user.js, event.js, club.js)
│   ├── routers/                # Express router declarations
│   ├── utils/                  # Token generator & Nodemailer email service
│   ├── .env.example            # Sample safe environment template
│   ├── index.js                # Server entry point and middleware assembly
│   └── package.json            # Server package manifest & scripts
│
└── README.md                   # Repository overview & setup documentation
```

---

## 8. Prerequisites

Ensure the following tools are installed on your workstation:

- **Node.js:** v18.18.0 or later (v20+ recommended)
- **npm:** v9.0.0 or later
- **MongoDB:** A locally running MongoDB instance (e.g., `mongodb://localhost:27017/eventmanager`) or a MongoDB Atlas connection string.
- **Git:** For version control.

---

## 9. Environment Configuration

### Backend Environment (`server/.env`)
Create a file named `.env` inside the `server/` directory:

```env
# Server Network Port
PORT=8000
NODE_ENV=development

# MongoDB Connection String (Replace with your own credentials)
# IMPORTANT: Never commit production credentials to version control.
MONGODB_URI=mongodb://localhost:27017/eventmanager

# Authentication Secrets
JWT_SECRET=your_development_jwt_secret_key_at_least_32_chars_long

# SMTP Email Configuration (Optional for registration emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@domain.com
SMTP_PASS=your_email_app_password
```

### Frontend Environment (`client/.env`)
Create a file named `.env` inside the `client/` directory if connecting to a non-default backend port:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_MAINTENANCE_MODE=false
```

---

## 10. Installation & Setup Instructions

### 1. Backend Setup
Navigate to the `server` directory, install dependencies, and start the development server:

```bash
cd server
npm install
npm start
```

*Expected output:*
```
Server running on port 8000
Connecting to MongoDB Atlas...
MongoDB Connected Successfully
```

For automatic server reload during development (requires `nodemon`):
```bash
npm run dev
```

### 2. Frontend Setup
In a separate terminal, navigate to the `client` directory, install dependencies, and start the Vite development server:

```bash
cd client
npm install
npm run dev
```

*Expected output:*
```
  VITE v5.x.x  ready in 350 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open `http://localhost:5173` in your web browser to access the portal.

---

## 11. API Overview

The backend exposes JSON REST endpoints under the `/api` prefix:

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new student account | No |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT cookie | No |
| `POST` | `/api/auth/logout` | Clear auth cookies | Yes |
| `GET` | `/api/auth/me` | Fetch active authenticated user profile | Yes |
| `PUT` | `/api/auth/profile/:id` | Update profile information | Yes |
| `GET` | `/api/events` | List all events (chronological order) | No |
| `POST` | `/api/events` | Create a new event | Yes |
| `GET` | `/api/events/:slug` | Retrieve single event by slug or ID | No |
| `POST` | `/api/events/:eventId/register` | Register student for an event | Optional (Student/Guest) |
| `DELETE`| `/api/events/:id` | Delete event | Yes (Admin/Lead) |
| `GET` | `/api/clubs` | List registered student clubs | No |
| `GET` | `/api/admin/dashboard/stats` | Platform summary statistics | Yes (Admin) |
| `GET` | `/api/admin/coordinators` | List club coordinators | Yes (Admin) |
| `POST` | `/api/admin/coordinators` | Create new coordinator account | Yes (Admin) |
| `GET` | `/api/admin/events/export` | Export event participation data | Yes (Admin) |

---

## 12. Testing Status

- **Automated Testing Suite:** Currently unconfigured in original repository (`npm test` script not initially provided).
- **Manual API Verification:** End-to-end endpoints for user registration, user authentication, event listing, event creation, and event registration have been executed and verified against a working MongoDB instance.
- **Static Analysis & Linting:** Codebase audited for module resolution, missing schema declarations, and hardcoded secrets.

---

## 13. Known Limitations

1. **Database Schema Dependencies:** The original upstream repository omitted model definitions in `server/models/user.js` and `server/models/event.js`, which prevented fresh installations from executing database queries until schemas were populated.
2. **Hardcoded Database String:** Upstream `server/lib/db.js` previously contained a fallback cloud database connection string. This has been flagged for rotation and replaced with strict environment variable resolution.
3. **Missing Frontend Manifest:** Upstream `client/package.json` was missing script and dependency definitions; running `npm install` directly on the unmodified upstream archive failed without manifest reconstruction.
4. **Context Provider References:** `client/src/App.jsx` references `ThemeProvider`, `NotificationContext`, and `SocketContext`, which were omitted in the initial upstream commit.
5. **Partial Payment Workflow:** Online fee payment via Razorpay requires completing server-side webhook signing and transaction verification before paid event registrations can be marked confirmed.

---

## 14. Future Improvements

- **Attendance Verification:** Dynamic QR code generation for registered students with mobile-friendly scanner for coordinators at event entry gates.
- **Automated Certificate Generation:** PDF generation pipeline sending verifiable completion/participation certificates upon event conclusion.
- **WebSocket Push Notifications:** Real-time push updates for sudden venue changes, schedule revisions, or waitlist clearances.
- **Role-Based Access Control Hardening:** Granular permissions distinguishing Faculty Advisors, Student Club Presidents, and System Administrators.

---

## 15. Contribution & Development Guidelines

1. Fork the repository and create your feature branch:
   ```bash
   git checkout -b feature/event-analytics
   ```
2. Adhere to ES module standards in `server` and modern functional React with Hooks in `client`.
3. Never commit credentials, `.env` files, or production database connection strings.
4. Test changes locally before submitting a Pull Request with a clear description of the problem solved.

---

## 16. License

This project is licensed under the **ISC License** as specified in `server/package.json`.
