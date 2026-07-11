# MediCare Plus - Hospital Management System

MediCare Plus is a modern, beautiful, responsive, and secure Hospital Management System built using **React (Vite + TypeScript)** for the frontend, **Node.js (Express + TypeScript)** for the backend, and **MongoDB (Mongoose)** for the database.

The interface is styled in a professional **Baby Blue & White** color palette.

---

## 🚀 Quick Start Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally (default: `mongodb://127.0.0.1:27017/hospital`)

### 1. Run the Backend Server
Open a terminal in the `/backend` directory and execute:
```bash
# Install dependencies (already completed)
npm install

# Start development server (using nodemon and ts-node)
npm run dev
```
- **Port**: `http://localhost:5000`
- **Database Connection**: Automatically connects and seeds a default **Admin** account if none is found.

### 2. Run the React Frontend
Open another terminal in the `/frontend` directory and execute:
```bash
# Install dependencies (already completed)
npm install

# Start Vite React development server
npm run dev
```
- **Local URL**: `http://localhost:5173`

---

## 🔑 Default Credentials for Testing

### 🛡️ Administrator Account
Use this to log in, register doctor profiles, manage patient lists, check appointments, and issue invoices.
- **Email**: `admin@hospital.com`
- **Password**: `admin123`
- *(Tip: Clicking the "Autofill Admin Login" button on the login screen automatically inputs these credentials)*

### 🩺 Doctor / Patient Flow
1. **Patient Registration**: Click "Create an account" on the login screen to register a new Patient with demographic data.
2. **Book Appointment**: Select a doctor from the interactive list, pick an available slot, and enter medical symptoms.
3. **Admin Panel**: Log in as admin (`admin@hospital.com`), go to **Manage Doctors** to add a doctor. Go to **Appointments** to view or confirm the appointment.
4. **Doctor Panel**: Log in using the registered doctor's credentials. Go to **Appointments**, click **Consult**, write symptoms/diagnosis, prescribe medicines, and click complete.
5. **Billing**: Log in as admin, go to **Billing & Invoices**, select the patient, and issue an itemized invoice.
6. **Patient Billing Portal**: Log in as patient, navigate to **Invoices & Bills**, and click **Pay Bill** to settle payments.

---

## 📂 Project Architecture

```
HsptlManagementSys/
├── backend/                  # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── config/          # MongoDB Connection Config
│   │   ├── controllers/     # Route Business Logic (Auth, Doctor, Patient, Appointment, Record, Bill)
│   │   ├── middleware/      # JWT verification & Role gatekeepers
│   │   ├── models/          # Mongoose Database Schemas
│   │   ├── routes/          # Express API Endpoints
│   │   └── server.ts        # Server Entrypoint & Seed Actions
│   ├── tsconfig.json        # TypeScript Configuration
│   └── package.json
└── frontend/                 # React + TypeScript + Vanilla CSS client
    ├── src/
    │   ├── assets/          # Static assets
    │   ├── components/      # Common components (Navbar, Sidebar Layout shell)
    │   ├── context/         # AuthContext (global state, JWT sessions, fetch hooks)
    │   ├── pages/           # Dashboard screens (Admin, Doctor, Patient, Login, Register)
    │   ├── App.css          # Layout & Aesthetics (Sidebar, forms, tables)
    │   ├── index.css        # Global CSS theme & CSS variables (Baby Blue / White)
    │   └── main.tsx
    └── package.json
```

---

## 🎨 Design System & Colors
- **Main Accent Sky Blue**: `#0284c7`
- **Background Light Blue**: `#f0f9ff`
- **Borders & Dividers**: `#bae6fd`
- **Base Cards & Tables**: `#ffffff`
- **Text Color**: `#0f172a` (Slate Dark)
