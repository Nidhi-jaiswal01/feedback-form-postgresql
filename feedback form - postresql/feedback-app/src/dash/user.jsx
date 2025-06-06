import React, { useEffect, useState } from "react";
import { Users, MessageSquare, Menu} from "lucide-react";
import { LogOut } from "lucide-react";
import {  LineChart } from "lucide-react";
import { Link } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper'; 
import { CheckCircle } from "lucide-react";
import { XCircle } from "lucide-react";


function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [id, setId] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile); // open sidebar on large screens, closed on mobile
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

// Fetch user and feedback counts from backend API
useEffect(() => {
  const fetchCounts = async () => {
    try {
      const response = await fetch('/api/counts'); // Your backend endpoint
      if (!response.ok) throw new Error("Failed to fetch counts");
      const data = await response.json();
      setUserCount(data.userCount);
      setFeedbackCount(data.feedbackCount);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };
  fetchCounts();
}, []);

// Fetch current user info and profiles from backend API
useEffect(() => {
  const fetchUserAndProfiles = async () => {
    try {
      // Get current authenticated user info
      const userRes = await fetch('/api/auth/me');
      if (!userRes.ok) throw new Error("Failed to fetch user info");
      const currentUser = await userRes.json();
      const currentEmail = currentUser.email || "";
      setEmail(currentEmail);

      // Fetch profiles, excluding email "jaiswal1@gmail.com"
      const profilesRes = await fetch('/api/user');
      if (!profilesRes.ok) throw new Error("Failed to fetch profiles");
      let profilesData = await profilesRes.json();

      profilesData = profilesData.filter(profile => profile.email !== "jaiswal1@gmail.com");
      setProfiles(profilesData);

      // Find matched profile of current user
      const matchedProfile = profilesData.find(profile => profile.email === currentEmail);
      if (matchedProfile) {
        setId(matchedProfile.id); 
        setName(matchedProfile.name);      // use lowercase keys, consistent with your DB schema
        setPhone(matchedProfile.phone);
        setId(matchedProfile.Id);          // If your DB column is uppercase 'Id', keep it, otherwise lowercase 'id'
        setAddress(matchedProfile.address);
        setDate(matchedProfile.dob);
      }
    } catch (error) {
      console.error("Error fetching user/profile data:", error);
    }
  };

  fetchUserAndProfiles();
}, []);


  const sidebarWidth = isMobile
    ? sidebarOpen
      ? "w-64"
      : "w-0"
    : sidebarOpen
    ? "w-64"
    : "w-16";

  return (
    <div className="flex h-screen w-full bg-gray-100 absolute left-0 right-0 top-0 overflow-hidden">
  {/* Sidebar */}
    <div
    className={`fixed top-0 left-0 h-screen bg-gray-800 text-white z-50
      ${isMobile ? (sidebarOpen ? "w-64" : "w-0") : sidebarOpen ? "w-64" : "w-16"}
      transition-all duration-300
      overflow-y-auto
    `}
  >
    <div className="flex items-center px-4 py-6">
       <img src="/admin.png" alt="Company Logo" className="h-8 w-auto"/>
      {sidebarOpen && (
        <span className="ml-2 text-xl font-bold whitespace-nowrap">Admin</span>
      )}
    </div>
    <hr className="border-t border-gray-600  w-full" />

    {(sidebarOpen || !isMobile) && (
      <ul className="space-y-4 px-2 flex-grow">
           <li className="hover:text-orange-200 px-2 cursor-pointer rounded-md ml-1 mt-4">
         <Link to="/user" className="flex items-center space-x-2 w-full">
          <Users className="w-5 h-5" />
          {sidebarOpen && <span>Registered Users</span>}
          </Link>
        </li>
         <hr className="border-t border-gray-600  w-full" />
            <li className="hover:text-orange-200 px-2 cursor-pointer rounded-md ml-1">
         <Link to="/feedbackr" className="flex items-center space-x-2 w-full">
          <MessageSquare className="w-5 h-5 mt-1" />
          {sidebarOpen && <span>Feedback Registered</span>}
          </Link>
        </li>
         <hr className="border-t border-gray-600  w-full" />
         <li className="hover:text-orange-200 px-2 cursor-pointer rounded-md ml-1">
  <Link to="/graph" className="flex items-center space-x-2 w-full">
          <LineChart className="w-5 h-5" />
          {sidebarOpen && <span>Graph Comparison</span>}
          </Link>
        </li>
         <hr className="border-t border-gray-600  w-full" />
         <li className="hover:text-orange-200 px-2 cursor-pointer rounded-md ml-1">
                    <Link to="/attend" className="flex items-center space-x-2 w-full">
                            <CheckCircle className="w-5 h-5" />
                            {sidebarOpen && <span>Respondents</span>}
                            </Link>
                          </li>
                           <hr className="border-t border-gray-600  w-full" />
                                    <li className="hover:text-orange-200 px-2 cursor-pointer rounded-md ml-1">
                    <Link to="/notattend" className="flex items-center space-x-2 w-full">
                            <XCircle className="w-5 h-5" />
                            {sidebarOpen && <span>Non Respondents</span>}
                            </Link>
                          </li>
                           <hr className="border-t border-gray-600  w-full" />
         <li className="hover:text-orange-200 px-2 cursor-pointer rounded-md ml-1">
  <Link to="/login" className="flex items-center space-x-2 w-full">
    <LogOut className="w-5 h-5" />
    {sidebarOpen && <span>Log Out</span>}
  </Link>
</li>
<hr className="border-t border-gray-600 w-full" />

      
      </ul>
    )}
  </div>

  {isMobile && sidebarOpen && (
    <div
      className="fixed inset-0 bg-opacity-30 z-20"
      onClick={() => setSidebarOpen(false)}
    ></div>
  )}

      {/* Main content */}
     <div
  className={`flex-1 ml-0 ${
    sidebarOpen ? (isMobile ? "" : "ml-64") : isMobile ? "" : "ml-16"
  } flex flex-col h-screen overflow-y-auto transition-all duration-300`}
>
       
        {/* Navbar */}
        <div className="flex items-center flex-none justify-between bg-white px-4 py-2 shadow-md rounded-lg mb-4">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="text-gray-700 mr-4">
              <Menu className="w-6 h-6 md:ml-5" />
            </button>
            <Link to="/admin-dashboard" className="flex items-center space-x-2 w-full mr-4 hover:text-gray-600">
                                    <span>Home</span>
                                    </Link>
                          
                              <Link to="/graph" className="flex items-center space-x-2 w-full mr-4 hover:text-gray-600">
                                    <span>Graph</span>
                                    </Link>
          </div>
        </div>

        <h1 className="ml-5 md:ml-10 text-2xl sm:text-3xl font-semibold mb-2">Dashboard</h1>

<div className="overflow-x-auto max-w-screen md:mx-10 mx-5 mt-4">
  <TableContainer component={Paper}>
       <div className="sm:min-w-[800px] min-w-[610px]  px-4 py-2">
      <h1 className="font-bold mb-2">User Profile</h1>
      <hr className="border-t border-gray-600" />
    </div>
    <Table aria-label="user profile table">
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }} align="right">ID</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }} align="right">Address</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }} align="right">DOB</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }} align="right">Email</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }} align="right">Phone</TableCell>
           <TableCell sx={{ fontWeight: 'bold' }} align="right">Feedback Status</TableCell> 
        </TableRow>
      </TableHead>
      <TableBody>
        {profiles.map((profile) => (
          <TableRow key={profile.id}>
            <TableCell component="th" scope="row">{profile.name}</TableCell>
            <TableCell align="right">{profile.id}</TableCell>
            <TableCell align="right">{profile.address}</TableCell>
            <TableCell align="right">{profile.dob}</TableCell>
            <TableCell align="right">{profile.email}</TableCell>
            <TableCell align="right">{profile.phone}</TableCell>
             <TableCell align="right">
        {profile.has_submitted_feedback ? (
          <span className="text-green-600 font-semibold">Submitted</span>
        ) : (
          <span className="text-red-600 font-semibold">Not Submitted</span>
        )}
      </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</div>
      </div>
    </div>
  );
}

export default Dashboard;
