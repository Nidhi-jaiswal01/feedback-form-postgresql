import React, { useEffect, useState } from "react";
import { Users, MessageSquare, Menu, CircleArrowRight } from "lucide-react";
import { LogOut } from "lucide-react";
import {  LineChart } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [userCount, setUserCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const [departmentData, setDepartmentData] = useState([]); 
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
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

useEffect(() => {
  const fetchDepartmentData = async () => {
    try {
      const res = await fetch("/api/feedbacks/department-count", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch department counts");
      const data = await res.json();

      // List all departments you want to show, 
      // so that even departments with zero feedback show up in the chart
      const allDepartments = [
        "HR Department",
        "IT Department",
        "Finance Department",
        "Marketing Department",
      ];

      // Create a map from the fetched data for quick lookup
      const deptMap = {};
      data.forEach(({ department, count }) => {
        deptMap[department] = parseInt(count, 10); // Convert count to number
      });

      // Map through allDepartments and prepare final chart data, 
      // fallback count to 0 if department is not present in fetched data
      const chartData = allDepartments.map((dept) => ({
        department: dept,
        count: deptMap[dept] || 0,
      }));

      setDepartmentData(chartData);
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  fetchDepartmentData();
}, []);

  const colors = {
    "HR Department": "#8884d8",
    "IT Department": "#82ca9d",
    "Finance Department": "#ffc658",
    "Marketing Department": "#ff7f50",
  };

  // Sidebar width logic
  const sidebarWidth = isMobile
    ? sidebarOpen
      ? "w-64"
      : "w-0"
    : sidebarOpen
    ? "w-64"
    : "w-16";

    
  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden absolute top-0 left-0 ">
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
              <Menu className="w-6 h-6 md:ml-5 " />
            </button>
            <Link to="/admin-dashboard" className="flex items-center space-x-2 w-full mr-4 hover:text-gray-600">
                        <span>Home</span>
                        </Link>
              
                  <Link to="/graph" className="flex items-center space-x-2 w-full mr-4 hover:text-gray-600">
                        <span>Graph</span>
                        </Link>
          </div>
        </div>

        <h1 className="md:ml-10 ml-5 text-2xl sm:text-3xl font-semibold mb-2">Dashboard</h1>

        {/* Stats */}
        <div className="p-4 md:p-6 grid grid-cols-1 flex-none md:grid-cols-2 gap-4 md:gap-6 md:mx-6 mx-1">
          {/* Users Card */}
          <div className="bg-orange-300 text-gray-800 h-30 sm:h-36 rounded-lg shadow-lg flex flex-col justify-between">
            <div className="flex justify-between items-center px-4 pt-4">
              <div>
                <p className="text-2xl sm:text-4xl font-bold">{userCount}</p>
                <h2 className="text-sm sm:text-lg font-semibold">Regsitered Users</h2>
                
              </div>
              <img
                src="/group.png"
                alt="Users Icon"
                className="h-16 w-auto sm:h-20 lg:h-20"
              />
            </div>
            <Link to="/user" className="flex items-center space-x-2 w-full">
            <button className="bg-amber-600 h-8 w-full rounded-md font-medium flex items-center justify-center text-sm sm:text-base">
              More info
              <CircleArrowRight className="h-4 sm:h-5 ml-2" />
            </button>
            </Link>
          </div>

          {/* Feedback Card */}
          <div className="bg-rose-300 text-gray-800 h-30 sm:h-36 rounded-lg shadow-lg flex flex-col justify-between">
            <div className="flex justify-between items-center px-4 pt-4">
              <div>
                <p className="text-2xl sm:text-4xl font-bold">{feedbackCount}</p>
                <h3 className="text-sm sm:text-lg font-semibold">Feedbacks Registered</h3>
              </div>
              <img
                src="/social.png"
                alt="Feedback Icon"
                className="h-16 w-auto sm:h-20 lg:h-20"
              />
            </div>
            <Link to="/feedbackr" className="flex items-center space-x-2 w-full">
            <button className="bg-rose-400 h-8 w-full rounded-md font-medium flex items-center justify-center text-sm sm:text-base">
              More info
              <CircleArrowRight className="h-4 sm:h-5 ml-2" />
            </button>
            </Link>
          </div>
        </div>
            {/* Chart */}
   <div className="overflow-x-auto">
  <div className="min-w-[500px] " style={{ height: isMobile ? 250 : 300 }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={departmentData}
        margin={{ top: 20, right: 30, left: 20, bottom: 40 }} >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="department" angle={-19}  textAnchor="end" interval={0}  />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" barSize={30}>
          {departmentData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[entry.department]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

      </div>
    </div>
  );
}

export default Dashboard;
