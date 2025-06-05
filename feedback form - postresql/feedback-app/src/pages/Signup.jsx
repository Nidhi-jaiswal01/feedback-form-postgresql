import React, { useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { User } from "lucide-react";
import { Lock } from 'lucide-react'
import { Mail } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { BadgeCheck } from 'lucide-react';
import { Calendar } from 'lucide-react';

function Signup() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDate] = useState("");
  const [Name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress]=useState("");
  const[Id,setId]= useState("");

  const navigate = useNavigate();

const handleSignup = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await fetch('http://localhost:5000/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: Name,
        Id,
        dob,
        phone,
        address,
        email,
        password,
      }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText || 'Signup failed' };
      }
      throw new Error(errorData.message || 'Signup failed');
    }

    const data = await response.json();

    // Save token in localStorage
    localStorage.setItem('token', data.token);

    // Navigate to the feedback page or dashboard
    navigate('/feedback');
  } catch (error) {
    alert(error.message);
    console.error('Signup error:', error);
  } finally {
    setLoading(false);
  }
};

  return (
    <> <div className="flex md:flex-row justify-center  px-4">
        <div className="hidden md:flex md:w-1/2 bg-gray-800 text-orange-50 p-6 sm:p-8 md:p-10 rounded-md shadow-md flex-col items-center text-center md:rounded-r-md ">
          <img src="/download.png" alt="Company Logo" className="h-24 ml-44 mr-44 mt-34 w-auto " />
          <h1 className="font-bold  mt-2 ">Come join us!</h1>
          <p className="font-semibold ml-0.5 mr-0.5 mt-1">We are glad for every single feedback of yours. If you haven't already, then create an account to get access to feedback form.</p>
          <p className="font-semibold  mt-1">We hope you you enjoy the experience!</p>
           <p className="mt-4 font-semibold">
                  Already have an account? <Link to="/login" className="text-orange-50 hover:text-orange-300 hover:text-shadow-orange-400 font-semibold underline">Login</Link>
              </p>
      </div>
      <div className="w-full md:w-1/2 bg-orange-50 p-6 sm:p-8 md:p-10 rounded-md md:rounded-r-md shadow-md">
        <div className="w-full py-5 rounded">
          <h1 className="text-lg sm:text-xl md:text-2xl flex font-bold mb-2 text-left ml-1 text-balck ">Sign Up</h1>
      </div> 
              <form onSubmit={handleSignup}>
                  <div className="relative w-full mb-4">
                  <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                      type="text"
                      placeholder="Enter your Name"
                      className="w-full p-2 pl-10 border rounded"
                      value={Name}
                      onChange={(e) => setName(e.target.value)}
                      required />
                      </div>
                       <div className="relative w-full mb-4">
                  <BadgeCheck className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                      type="text"
                      placeholder="Enter your Employee Id"
                      className="w-full p-2 pl-10 border rounded"
                      value={Id}
                      onChange={(e) => setId(e.target.value)}
                      required />
                      </div>
                       <div className="relative w-full mb-4">
                  <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                      type="Date"
                      placeholder="Date of Birth"
                      className="w-full p-2 pl-10 border rounded"
                      value={dob}
                      onChange={(e) => setDate(e.target.value)}
                      required />
                      </div>
                      <div className="relative w-full mb-4">
                  <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                      type="text"
                      placeholder="Enter your phone number"
                      className="w-full p-2 pl-10 border rounded"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required />
                      </div>
                      <div className="relative w-full mb-4">
                  <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                      type="text"
                      placeholder="Enter your address"
                      className="w-full p-2 pl-10 border rounded"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required />
                      </div>

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
                      className="w-full p-2 pl-10 border rounded"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required />
                      </div>

                  <button
                      type="submit"
                      className="w-full  bg-gray-800 text-white py-2 rounded hover:bg-gray-300 hover:text-gray-800"
                  >
                      Signup
                  </button>
              </form>
              <p className="mt-4 text-sm md:hidden lg:hidden">
                  Already have an account? <Link to="/login" className="text-gray-800 hover:text-gray-600 underline">Login</Link>
              </p>
          </div>
          </div></>
  );
}

export default Signup;
