import React, { useState } from "react";
// import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Activity,
  User,
  // Mail,
  // Lock,
  Phone,
  // Calendar,
  MapPin,
  ArrowLeft,
} from "lucide-react";

// const location = useLocation();
// console.log(location);

interface RegisterProps {
  onNavigateToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onNavigateToLogin }) => {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    // email: "",
    // password: "",
    phoneNumber: "",
    // dateOfBirth: "",
    // gender: "male",
    // bloodGroup: "O+",
    address: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple verification
    if (
      !formData.name ||
      // !formData.email ||
      // !formData.password ||
      !formData.phoneNumber ||
      // !formData.dateOfBirth ||
      !formData.address
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    await register(formData);
    setIsSubmitting(false);
  };

  return (
    <div className="login-page-container fade-in">
      <div className="register-card">
        <div className="login-header">
          <button onClick={onNavigateToLogin} className="back-btn-top">
            <ArrowLeft size={16} />
            <span>Back to Login</span>
          </button>
          <div className="login-logo-circle">
            <Activity size={32} color="#0284c7" />
          </div>
          <h1>Create Patient Account</h1>
          <p>
            Register to book consultations and access your medical history
            online.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="register-grid-form">
          <div className="form-group grid-col-2">
            <label className="form-label" htmlFor="name">
              Full Name *
            </label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address *
            </label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div> */}

          {/* <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password *
            </label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div> */}

          <div className="form-group">
            <label className="form-label" htmlFor="phoneNumber">
              Phone Number *
            </label>
            <div className="input-with-icon">
              <Phone size={18} className="input-icon" />
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                className="form-control"
                placeholder="9876543210"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* <div className="form-group">
            <label className="form-label" htmlFor="dateOfBirth">
              Date of Birth *
            </label>
            <div className="input-with-icon">
              <Calendar size={18} className="input-icon" />
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                className="form-control"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
          </div> */}

          {/* <div className="form-group">
            <label className="form-label" htmlFor="gender">
              Gender *
            </label>
            <select
              id="gender"
              name="gender"
              className="form-control"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div> */}

          {/* <div className="form-group">
            <label className="form-label" htmlFor="bloodGroup">
              Blood Group *
            </label>
            <select
              id="bloodGroup"
              name="bloodGroup"
              className="form-control"
              value={formData.bloodGroup}
              onChange={handleChange}
            >
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div> */}

          <div className="form-group grid-col-2">
            <label className="form-label" htmlFor="address">
              Place *
            </label>
            <div className="input-with-icon">
              <MapPin size={18} className="input-icon textarea-icon" />
              <textarea
                id="address"
                name="address"
                className="form-control"
                rows={3}
                placeholder="Place"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary register-submit-btn grid-col-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering Patient..." : "Next"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
