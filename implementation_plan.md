# MediCare Plus — Hospital Management System

## Complete Implementation Plan (Current Status as of July 2026)

---

## 1. Project Overview

**MediCare Plus** is a full-stack Hospital Management System (HMS) built with:

| Layer    | Technology                                                |
| -------- | --------------------------------------------------------- |
| Frontend | React 19 + TypeScript + Vite + Vanilla CSS                |
| Backend  | Node.js + Express 5 + TypeScript                          |
| Database | MongoDB via Mongoose 9                                    |
| Auth     | JWT (30-day tokens), bcryptjs password hashing            |
| UI Icons | lucide-react                                              |
| Routing  | react-router-dom (not actively used — SPA with tab state) |

**Root:** `/Users/muhammedafthal786gmail.com/Projects/HsptlManagementSys/`

**Three user roles are supported:**

- **Admin** — manages doctors, views all patients/appointments, issues invoices
- **Doctor** — views their assigned appointments, creates medical records (consultations)
- **Patient** — registers, books appointments, views history and bills

---

## 2. Project File Tree

```
HsptlManagementSys/
├── README.md                          ✅ complete
├── backend/
│   ├── .env                           ✅ (PORT, MONGO_URI, JWT_SECRET)
│   ├── package.json                   ✅
│   ├── tsconfig.json                  ✅
│   └── src/
│       ├── server.ts                  ⚠️ (admin seeder bug — see §5)
│       ├── config/
│       │   └── db.ts                  ✅ MongoDB connection
│       ├── middleware/
│       │   └── auth.ts                ✅ protect + authorize guards
│       ├── models/
│       │   ├── User.ts                ⚠️ email/password optional fields (see §5)
│       │   ├── Doctor.ts              ✅ availability slots schema
│       │   ├── Patient.ts             ⚠️ DOB/gender/bloodGroup commented out
│       │   ├── Appointment.ts         ✅ status enum: pending/confirmed/cancelled/completed
│       │   ├── MedicalRecord.ts       ✅ prescription sub-documents
│       │   └── Bill.ts                ✅ itemized bill + paymentStatus
│       ├── controllers/
│       │   ├── authController.ts      ⚠️ login uses name+phone, not email+password (see §5)
│       │   ├── doctorController.ts    ✅ full CRUD
│       │   ├── patientController.ts   ⚠️ deletePatient has a bug (deletes wrong ID)
│       │   ├── appointmentController.ts ✅ book/get/status/edit/cancel
│       │   ├── medicalRecordController.ts ✅ create/get/get-by-id
│       │   └── billController.ts      ✅ create/get/get-by-id/update status
│       └── routes/
│           ├── authRoutes.ts          ✅ POST /register, POST /login, GET /me
│           ├── doctorRoutes.ts        ✅ CRUD /api/doctors
│           ├── patientRoutes.ts       ✅ CRUD /api/patients
│           ├── appointmentRoutes.ts   ✅ full appointment management
│           ├── medicalRecordRoutes.ts ✅ records CRUD
│           └── billRoutes.ts          ✅ billing operations
└── frontend/
    ├── index.html                     ✅
    ├── vite.config.ts                 ✅
    ├── package.json                   ✅
    └── src/
        ├── main.tsx                   ✅
        ├── App.tsx                    ✅ role-based routing shell
        ├── App.css                    ✅ layout + design system (Baby Blue / White)
        ├── index.css                  ✅ global CSS variables
        ├── context/
        │   └── AuthContext.tsx        ⚠️ API_URL hardcoded to port 5003 (README says 5000)
        ├── components/
        │   ├── Navbar.tsx             ✅ top header
        │   └── Sidebar.tsx            ✅ role-based navigation links
        └── pages/
            ├── Login.tsx              ⚠️ UI labels say "Email" but field sends name+phone
            ├── Register.tsx           ✅ patient self-registration
            ├── AdminDashboard.tsx     ⚠️ OLD implementation is commented out; NEW reimplementation exists below (4750 lines)
            ├── DoctorDashboard.tsx    ✅ active, 540 lines
            └── PatientDashboard.tsx   ⚠️ OLD implementation is commented out; NEW reimplementation exists below (1621 lines)
```

---

## 3. Backend — Detailed Status

### 3.1 Database Models

| Model             | Fields                                                                                                         | Status                                               |
| ----------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **User**          | name, email (optional), password (optional), role, phoneNumber                                                 | ⚠️ Email regex and required validators commented out |
| **Doctor**        | user (ref), specialization, department (7 options), qualification, experience, availability[], consultationFee | ✅                                                   |
| **Patient**       | user (ref), address                                                                                            | ⚠️ DOB, gender, bloodGroup commented out             |
| **Appointment**   | patient, doctor, date, timeSlot, reason, status, notes                                                         | ✅                                                   |
| **MedicalRecord** | appointment, patient, doctor, symptoms, diagnosis, prescription[]                                              | ✅                                                   |
| **Bill**          | patient, appointment, items[], totalAmount, paymentStatus, dueDate                                             | ✅                                                   |

### 3.2 API Endpoints

#### Auth (`/api/auth`)

| Method | Route       | Access  | Status                                                          |
| ------ | ----------- | ------- | --------------------------------------------------------------- |
| POST   | `/register` | Public  | ✅ Creates User + Patient profile                               |
| POST   | `/login`    | Public  | ⚠️ Authenticates by **name + phoneNumber** (not email/password) |
| GET    | `/me`       | Private | ✅ Returns current user + role profile                          |

#### Doctors (`/api/doctors`)

| Method | Route  | Access              | Status                                         |
| ------ | ------ | ------------------- | ---------------------------------------------- |
| GET    | `/`    | Public              | ✅                                             |
| GET    | `/:id` | Public              | ✅                                             |
| POST   | `/`    | Admin               | ✅ Creates User (doctor role) + Doctor profile |
| PUT    | `/:id` | Admin / Doctor self | ✅                                             |
| DELETE | `/:id` | Admin               | ✅ Also deletes User account                   |

#### Patients (`/api/patients`)

| Method | Route  | Access                        | Status                                                                                                          |
| ------ | ------ | ----------------------------- | --------------------------------------------------------------------------------------------------------------- |
| GET    | `/`    | Admin / Doctor                | ✅                                                                                                              |
| GET    | `/:id` | Admin / Doctor / Patient self | ✅                                                                                                              |
| PUT    | `/:id` | Admin / Patient self          | ✅                                                                                                              |
| DELETE | `/:id` | Admin                         | ⚠️ **Bug**: deletes `patient.user` ID using `Patient.findByIdAndDelete()` instead of `User.findByIdAndDelete()` |

#### Appointments (`/api/appointments`)

| Method | Route         | Access                 | Status                               |
| ------ | ------------- | ---------------------- | ------------------------------------ |
| POST   | `/`           | Patient / Admin        | ✅                                   |
| GET    | `/`           | All (filtered by role) | ✅                                   |
| GET    | `/:id`        | All (authorized)       | ✅                                   |
| PUT    | `/:id/status` | Admin / Doctor         | ✅                                   |
| PUT    | `/:id/edit`   | Patient / Admin        | ✅ Reverts to pending if rescheduled |
| PUT    | `/:id/cancel` | All roles              | ✅                                   |

#### Medical Records (`/api/records`)

| Method | Route  | Access                 | Status                                      |
| ------ | ------ | ---------------------- | ------------------------------------------- |
| POST   | `/`    | Doctor                 | ✅ Also auto-marks appointment as completed |
| GET    | `/`    | All (filtered by role) | ✅                                          |
| GET    | `/:id` | All (authorized)       | ✅                                          |

#### Bills (`/api/bills`)

| Method | Route         | Access                | Status                               |
| ------ | ------------- | --------------------- | ------------------------------------ |
| POST   | `/`           | Admin                 | ✅ Auto-calculates totalAmount       |
| GET    | `/`           | Admin / Patient       | ✅ Admin can filter by `?patientId=` |
| GET    | `/:id`        | Admin / Patient owner | ✅                                   |
| PUT    | `/:id/status` | Admin                 | ✅ Toggle paid/unpaid                |

### 3.3 Middleware

- **`protect`** — Validates Bearer JWT, attaches `req.user`
- **`authorize(...roles)`** — Role-based gate (admin/doctor/patient)

---

## 4. Frontend — Detailed Status

### 4.1 Auth Flow (`AuthContext.tsx`)

- Stores JWT in `localStorage` (`hms_token`)
- On app load, calls `GET /api/auth/me` to restore session
- `login(name, phoneNumber)` — name + phone auth (not email/password)
- `register(patientData)` — creates patient and auto-logs in
- `logout()` — clears token + user state

> [!WARNING]
> `API_URL` is hardcoded to `http://localhost:5003/api` but `backend/.env` and README say the server runs on port **5000**. This mismatch will cause all API calls to fail unless backend is explicitly started on port 5003.

### 4.2 App Shell (`App.tsx`)

- Single-page application — no URL-based routing
- `activeTab` state drives which dashboard section is shown
- Role-based dashboard: Admin → `AdminDashboard`, Doctor → `DoctorDashboard`, Patient → `PatientDashboard`
- Patients default to `book_appointment` tab on login; others get `overview`

### 4.3 Pages

#### Login (`Login.tsx`)

- Sends `name` + `phoneNumber` to backend
- UI labels wrongly say "Email Address" and "Password" — cosmetic mismatch
- "Autofill Admin Login" button fills `name="System Admin"` + `phoneNumber="0000000000"`

#### Register (`Register.tsx`)

- Patient self-registration form (name, phone, address)
- Navigates back to Login on success

#### AdminDashboard (`AdminDashboard.tsx`) — 4750 lines

- **Old implementation entirely commented out** (lines 1–~700)
- A **new, complete reimplementation** is active from roughly line 700 onward
- Sections (tabs):
  - `overview` — Summary stats cards (doctors, patients, appointments, revenue, unpaid bills)
  - `doctors` — Doctor list + Add Doctor form (name, email, password, phone, specialization, department, qualification, experience, fee, availability)
  - `patients` — Patient list table (view only)
  - `appointments` — All appointments with Confirm/Cancel actions for admin
  - `bills` — Create invoices + itemized bill builder + Pay Bill action

#### DoctorDashboard (`DoctorDashboard.tsx`) — 540 lines ✅

- `overview` — Today's worklist (pending/confirmed appointments)
- `appointments` — Full appointment list with **Consult** button to open consultation form
- Consultation form: symptoms, diagnosis, prescription (add/remove medicines)
- Submits `POST /api/records` → auto-marks appointment as `completed`
- `records` — List of completed consultations
- `patients` — Patient directory (read-only)

#### PatientDashboard (`PatientDashboard.tsx`) — 1621 lines

- **Old implementation entirely commented out** (lines 1–~700)
- A **new, complete reimplementation** is active below
- `overview` — My Dashboard summary
- `book_appointment` — Browse doctors by department, pick doctor + date + time slot + reason, submit booking
- `appointments` — My Schedule (list of own appointments) with Cancel option
- `records` — Medical History (consultation records)
- `bills` — Invoices & Bills list with **Pay Bill** button

### 4.4 Components

- **`Navbar.tsx`** — Top header bar with app branding and logout button
- **`Sidebar.tsx`** — Role-based left navigation (admin: 5 tabs / doctor: 4 tabs / patient: 5 tabs)

### 4.5 Styling

- **`index.css`** — Global CSS variables (sky blue `#0284c7`, light background `#f0f9ff`, text `#0f172a`)
- **`App.css`** — All layout styles (sidebar, navbar, cards, tables, forms, buttons, badges)

---

## 5. Known Bugs & Issues

| #   | Location                   | Description                                                                                                                                       | Severity          |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| 1   | `AuthContext.tsx:16`       | `API_URL` hardcoded to port **5003** but backend defaults to **5000**                                                                             | 🔴 Critical       |
| 2   | `server.ts:56-57`          | Admin seeder has `email` and `password` **commented out** — admin user is created without credentials, making autofill login unreliable           | 🔴 Critical       |
| 3   | `authController.ts:104`    | `if (!user.phoneNumber === phoneNumber)` — logical bug (comparing boolean to string, always false) — credential validation is effectively skipped | 🔴 Critical       |
| 4   | `patientController.ts:137` | `deletePatient` calls `Patient.findByIdAndDelete(patient.user)` instead of `User.findByIdAndDelete(patient.user)` — User record is never deleted  | 🟡 Medium         |
| 5   | `Login.tsx:45,64`          | Label says "Email Address" / "Password" but actual inputs are `name` / `phoneNumber` — confusing UX                                               | 🟡 Medium         |
| 6   | `User.ts:10-17`            | Email `required: false` and email regex validation is commented out — no format validation                                                        | 🟡 Medium         |
| 7   | `Patient.ts:10-22`         | `dateOfBirth`, `gender`, `bloodGroup` are commented out — profile is just `address`                                                               | 🟠 Low            |
| 8   | `AdminDashboard.tsx`       | The file begins with ~700 lines of commented-out old code cluttering the file                                                                     | 🟠 Low            |
| 9   | `PatientDashboard.tsx`     | Similarly begins with ~700 lines of commented-out old code                                                                                        | 🟠 Low            |
| 10  | `server.ts:29`             | CORS `origin: "*"` — allows any origin. Acceptable for dev, insecure for production                                                               | 🟠 Low (Dev only) |

---

## 6. Authentication Design (Current — Non-Standard)

> [!IMPORTANT]
> The current auth system does **not use email/password**. Instead, it authenticates users by matching **full name + phone number**. This is a design decision made during development.
>
> - Admins log in with: `name = "System Admin"`, `phone = "0000000000"`
> - Doctors log in with: the name and phone number set when the admin created their profile
> - Patients log in with: the name and phone number they registered with

---

## 7. Environment Configuration

### Backend `.env`

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hospital
JWT_SECRET=<your-secret>
```

### Frontend

No `.env` file — `API_URL` is hardcoded in `AuthContext.tsx` (needs to match backend PORT).

---

## 8. How to Run

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run dev       # Starts on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev       # Starts on http://localhost:5173
```

---

## 9. Suggested Next Steps (Prioritized)

### 🔴 Critical Fixes (Must-do before testing)

1. **Fix `API_URL`** in `AuthContext.tsx` — change port from `5003` → `5000`
2. **Fix admin seeder** in `server.ts` — uncomment `email` and `password` fields so admin can be properly seeded, OR switch the seeder to use the name+phone auth approach
3. **Fix `authController.ts` login bug** — the `!user.phoneNumber === phoneNumber` condition always evaluates to false. The entire credential check is commented out; decide and implement proper validation.

### 🟡 Medium Fixes

4. **Fix `deletePatient`** in `patientController.ts` — change `Patient.findByIdAndDelete(patient.user)` to `User.findByIdAndDelete(patient.user)`
5. **Fix Login UI labels** — update `Login.tsx` to show "Full Name" and "Phone Number" instead of "Email Address" and "Password"
6. **Clean up commented-out code** in `AdminDashboard.tsx` and `PatientDashboard.tsx`

### 🟢 Enhancements (Future)

7. **Restore Patient fields** — Uncomment and implement `dateOfBirth`, `gender`, `bloodGroup` in `Patient.ts` model and `patientController.ts`
8. **Add email validation** — Restore the email regex in `User.ts`
9. **Switch to email+password auth** — Implement proper email+password login for doctors and admins; keep name+phone for patients
10. **Add `.env` support for frontend** — Move `API_URL` to `VITE_API_URL` environment variable
11. **Add input validation** — Add server-side validation using express-validator or similar
12. **Restrict CORS** — Set `origin` to `http://localhost:5173` instead of `*` for development safety
13. **Add loading states** — Add skeleton loaders or spinners for all dashboard data fetches
14. **Add React Router** — Implement URL-based navigation instead of `activeTab` state for bookmarkable pages
15. **Add unit/integration tests** — Backend: Jest + Supertest; Frontend: Vitest + React Testing Library

---

## 10. Data Flow Diagrams

### Doctor Onboarding (Admin)

```
Admin → POST /api/doctors → Creates User (role=doctor) + Doctor profile
Doctor receives credentials (name + phone) → Logs in → Doctor Dashboard
```

### Patient Appointment Flow

```
Patient registers → POST /api/auth/register → User + Patient profile created
Patient logs in → views doctor list → books appointment → POST /api/appointments
Admin confirms → PUT /api/appointments/:id/status { status: "confirmed" }
Doctor consults → POST /api/records → Appointment auto-marked "completed"
Admin issues bill → POST /api/bills
Patient pays → PUT /api/bills/:id/status { paymentStatus: "paid" }
```
