import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Activity, Mail, Lock, LogIn } from "lucide-react";

interface LoginProps {
  onNavigateToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigateToRegister }) => {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phoneNumber) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    await login(name, phoneNumber);
    setIsSubmitting(false);
  };

  const fillDemoAdmin = () => {
    setName("System Admin");
    setPhoneNumber("0000000000");
  };

  return (
    <div className="login-page-container fade-in">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-circle">
            <Activity size={32} color="#0284c7" />
          </div>
          <h1>Welcome to MediCare</h1>
          <p>Sign in to manage appointments, billing, and medical records.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Full Name
            </label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                placeholder="doctor@hospital.com or admin@hospital.com"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Phone Number
            </label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                className="form-control"
                placeholder="••••••••"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary login-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Signing in..."
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            New patient?{" "}
            <button onClick={onNavigateToRegister} className="link-btn">
              Create an account
            </button>
          </p>
        </div>

        <div className="demo-credentials-box">
          <h4>Demo Account (Admin)</h4>
          <p>Login to setup doctor accounts, patients, and view statistics.</p>
          <button onClick={fillDemoAdmin} className="btn btn-secondary btn-sm">
            Autofill Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
