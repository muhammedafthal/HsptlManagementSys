import React from "react";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  FileText,
  CreditCard,
  PlusCircle,
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
}) => {
  const { user } = useAuth();

  if (!user) return null;

  const renderAdminLinks = () => (
    <>
      <button
        className={`sidebar-link ${currentTab === "overview" ? "active" : ""}`}
        onClick={() => setCurrentTab("overview")}
      >
        <LayoutDashboard size={18} />
        <span>System Summary</span>
      </button>
      <button
        className={`sidebar-link ${currentTab === "doctors" ? "active" : ""}`}
        onClick={() => setCurrentTab("doctors")}
      >
        <UserCheck size={18} />
        <span>Manage Doctors</span>
      </button>
      <button
        className={`sidebar-link ${currentTab === "patients" ? "active" : ""}`}
        onClick={() => setCurrentTab("patients")}
      >
        <Users size={18} />
        <span>Manage Patients</span>
      </button>
      <button
        className={`sidebar-link ${currentTab === "appointments" ? "active" : ""}`}
        onClick={() => setCurrentTab("appointments")}
      >
        <Calendar size={18} />
        <span>Appointments</span>
      </button>
      <button
        className={`sidebar-link ${currentTab === "bills" ? "active" : ""}`}
        onClick={() => setCurrentTab("bills")}
      >
        <CreditCard size={18} />
        <span>Billing & Invoices</span>
      </button>
    </>
  );

  const renderDoctorLinks = () => (
    <>
      <button
        className={`sidebar-link ${currentTab === "overview" ? "active" : ""}`}
        onClick={() => setCurrentTab("overview")}
      >
        <LayoutDashboard size={18} />
        <span>Today's Worklist</span>
      </button>
      <button
        className={`sidebar-link ${currentTab === "appointments" ? "active" : ""}`}
        onClick={() => setCurrentTab("appointments")}
      >
        <Calendar size={18} />
        <span>All Appointments</span>
      </button>
      <button
        className={`sidebar-link ${currentTab === "records" ? "active" : ""}`}
        onClick={() => setCurrentTab("records")}
      >
        <FileText size={18} />
        <span>Consultations</span>
      </button>
      <button
        className={`sidebar-link ${currentTab === "patients" ? "active" : ""}`}
        onClick={() => setCurrentTab("patients")}
      >
        <Users size={18} />
        <span>Patients Directory</span>
      </button>
    </>
  );

  const renderPatientLinks = () => (
    <>
      <button
        className={`sidebar-link ${currentTab === "overview" ? "active" : ""}`}
        onClick={() => setCurrentTab("overview")}
      >
        <LayoutDashboard size={18} />
        <span>My Dashboard</span>
      </button>
      <button
        className={`sidebar-link ${currentTab === "book_appointment" ? "active" : ""}`}
        onClick={() => setCurrentTab("book_appointment")}
      >
        <PlusCircle size={18} />
        <span>Book Appointment</span>
      </button>
      <button
        className={`sidebar-link ${currentTab === "appointments" ? "active" : ""}`}
        onClick={() => setCurrentTab("appointments")}
      >
        <Calendar size={18} />
        <span>My Schedule</span>
      </button>
      <button
        className={`sidebar-link ${currentTab === "records" ? "active" : ""}`}
        onClick={() => setCurrentTab("records")}
      >
        <FileText size={18} />
        <span>Medical History</span>
      </button>
      <button
        className={`sidebar-link ${currentTab === "bills" ? "active" : ""}`}
        onClick={() => setCurrentTab("bills")}
      >
        <CreditCard size={18} />
        <span>Invoices & Bills</span>
      </button>
    </>
  );

  return (
    <aside className="sidebar-container">
      <div className="sidebar-menu">
        {user.role === "admin" && renderAdminLinks()}
        {user.role === "doctor" && renderDoctorLinks()}
        {user.role === "patient" && renderPatientLinks()}
      </div>
    </aside>
  );
};

export default Sidebar;
