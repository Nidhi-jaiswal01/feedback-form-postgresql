import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock } from 'lucide-react'
import { Mail } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      console.log("Started connecting to db");
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Logged in user data:", data);

      if (response.ok && data) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userEmail", data.user.email);

        console.log("User role:", data.user.role);
        const role = data.user.role?.toLowerCase();
        if (role === "admin") {
          navigate("/admin-dashboard");
        } else if (role === "user") {
          navigate("/feedback");
        } else {
          alert("Unknown role. Please contact support.");
        }
      } else {
        alert(data?.message || "Login failed. Please try again.");
      }
    } catch (error) {
      alert("Login error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <>
  <div className="flex md:flex-row justify-center mt-14 px-4">
  <div className="hidden md:flex md:w-1/2 bg-gray-800 text-orange-50 p-6 sm:p-8 md:p-10 rounded-md md:rounded-r-md shadow-md flex-col items-center text-center">
            <img src="/download.png" alt="Company Logo" className="h-24 ml-44 mr-44 mt-10 w-auto  " />
            <h1 className="font-bold  mt-2 text-2xl">Welcome Back!</h1>
            <p className="font-semibold ml-0.5 mr-0.5 mt-1">We are glad for every single feedback of yours. Already have an account, then log back in to access the feedback form.</p>
            <p className="font-semibold  mt-1">We hope you you enjoy the experience!</p>
             <p className="mt-4 mb-10 font-semibold ">
                    Don't have an account? <Link to="/signup" className="text-orange-50 hover:text-orange-300 hover:text-shadow-orange-400 font-semibold underline">Sign Up</Link>
                </p>
        </div>
  <div className="w-full md:w-1/2 bg-orange-50 p-6 sm:p-8 md:p-10 rounded-md md:rounded-r-md shadow-md">
  <div className="w-full py-5 rounded">
          <h1 className="text-lg sm:text-xl md:text-2xl flex font-bold mb-2 text-left ml-1 text-balck lg:mt-8 md:mt-16">Login</h1>
      </div> 
          <form onSubmit={handleLogin}>
            <div className="relative w-full mb-4">
  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-2 pl-10 border rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required />
                  </div>

<div className="relative w-full mb-4">
  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                  type="password"
                  placeholder="Password"
                  className="w-full  pl-10 p-2  border rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required />
                  </div>
              <button
                  type="submit"
                  disabled={loading}
  className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-300 hover:text-gray-800 disabled:opacity-50"
>
  {loading ? "Logging in..." : "Login"}
                
              </button>
          </form>
          <p className="mt-4 text-sm md:hidden lg:hidden">
              Don't have an account? <Link to="/signup" className="text-gray-800 hover:text-gray-600  underline">Signup</Link>
          </p>
      </div>
      </div>
      </>
  );
}

export default Login;