import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem("token");
          setUser(null);
          setLoading(false);
          return;
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (requiredRole && user.role?.toLowerCase() !== requiredRole.toLowerCase()) {
    return <Navigate to="/login" replace />;
  }

  // Optional redirection for root path
  if (location.pathname === "/") {
    if (user.role?.toLowerCase() === "admin") return <Navigate to="/admin-dashboard" />;
    if (user.role?.toLowerCase() === "user") return <Navigate to="/feedback" />;
  }

  return children;
};

export default ProtectedRoute;
