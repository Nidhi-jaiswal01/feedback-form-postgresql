import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FeedbackForm from "./pages/feedbackform";
import Account from "./pages/account";
import Userf from "./pages/userf";
import Dashboard from "./dash/dashboard";
import User from "./dash/user";
import Feedbackr from "./dash/feedbackr";
import Graph from "./dash/graph";
import ProtectedRoute from "./protectedroute";

function App() {
  // Store user info (e.g., id, email, name) and token
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check token & user info from localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      // Optionally verify token expiration here or by calling backend API
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, userInfo) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onLogin={handleLogin} />} />

        {/* Protect routes: user must be logged in */}
        <Route
          path="/feedback"
          element={
            user ? <FeedbackForm userId={user.id} onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/account"
          element={
            user ? <Account userId={user.id} onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/userf"
          element={
            user ? <Userf userId={user.id} onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />

        {/* Admin/Protected Routes wrapped with ProtectedRoute component */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute user={user}>
              <User onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedbackr"
          element={
            <ProtectedRoute user={user}>
              <Feedbackr onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/graph"
          element={
            <ProtectedRoute user={user}>
              <Graph onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
