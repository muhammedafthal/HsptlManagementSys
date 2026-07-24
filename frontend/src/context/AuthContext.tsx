import React, { createContext, useState, useEffect, useContext } from "react";

interface AuthContextType {
  user: any;
  token: string | null;
  loading: boolean;
  login: (name: string, phoneNumber: string) => Promise<boolean>;
  register: (patientData: any) => Promise<boolean>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  apiUrl: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const API_URL = "http://localhost:5003/api";
// export const API_URL = "https://hsptlmanagementsys.onrender.com/api";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("hms_token"),
  );
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    const currentToken = localStorage.getItem("hms_token");
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      } else {
        // Token is invalid/expired
        logout();
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  const login = async (name: string, phoneNumber: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phoneNumber }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("hms_token", data.token);
        setToken(data.token);
        setUser(data.user);
        return true;
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (err: any) {
      alert(err.message || "Error logging in");
      return false;
    }
  };

  const register = async (patientData: any): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("hms_token", data.token);
        setToken(data.token);
        setUser(data.user);
        return true;
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (err: any) {
      alert(err.message || "Error registering");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("hms_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        fetchUser,
        apiUrl: API_URL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
