import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import { RefreshCw } from "lucide-react";
import "./App.css";

const MainAppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [page, setPage] = useState<"login" | "register">("login");
  const [activeTab, setActiveTab] = useState("overview");

  // Reset tab to overview when user logs in or role changes
  useEffect(() => {
    if (user) {
      if (user.role === "patient") {
        setActiveTab("book_appointment");
      } else {
        setActiveTab("overview");
      }
    }
  }, [user]);

  if (loading) {
    return (
      <div className="app-loading-screen">
        <RefreshCw className="animate-spin" size={48} color="#0284c7" />
        <h2>MediCare Plus</h2>
        <p>Connecting to hospital core system...</p>
      </div>
    );
  }

  if (!user) {
    return page === "login" ? (
      <Login onNavigateToRegister={() => setPage("register")} />
    ) : (
      <Register onNavigateToLogin={() => setPage("login")} />
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <div className="app-body">
        <Sidebar currentTab={activeTab} setCurrentTab={setActiveTab} />
        <main className="app-main-content">
          {user.role === "admin" && <AdminDashboard currentTab={activeTab} />}
          {user.role === "doctor" && <DoctorDashboard currentTab={activeTab} />}
          {user.role === "patient" && (
            <PatientDashboard
              currentTab={activeTab}
              setCurrentTab={setActiveTab}
            />
          )}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

export default App;
