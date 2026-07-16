import React from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut, Activity, User } from "lucide-react";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar-header">
      <div className="navbar-brand">
        <div className="brand-logo">
          <Activity size={24} color="#0284c7" />
        </div>
        <div className="brand-name">
          <h2>MediCare Plus</h2>
          <span>Hospital Management System</span>
        </div>
      </div>

      {user && (
        <div className="navbar-user">
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role-badge">{user.role}</span>
          </div>
          <div className="user-avatar">
            <User size={18} color="#0284c7" />
          </div>
          <button onClick={logout} className="logout-btn" title="Sign Out">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
