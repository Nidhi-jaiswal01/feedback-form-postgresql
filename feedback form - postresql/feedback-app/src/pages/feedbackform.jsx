import React, { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { User } from "lucide-react";
import { Link } from "react-router-dom";


function FeedbackForm({ onSubmit }) {
  const [profiles, setProfiles] = useState([]);
  const [name, setName] = useState("");
  const [userid, setUserid] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState({
  foodservice: "",});
  const [feedback2, setFeedback2] = useState({
  recognition: "",});
  const [feedback3, setFeedback3] = useState({
  diversity: "",});
   const [feedback4, setFeedback4] = useState({
  leadership: "",});
  const [feedback5, setFeedback5] = useState({
  communication: "",});
  const navigate = useNavigate();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);


useEffect(() => {
  const currentEmail = localStorage.getItem("userEmail");
  if (!currentEmail) return;

  const fetchProfile = async () => {
  try {
    const response = await fetch(`http://localhost:5000/api/user/${encodeURIComponent(currentEmail)}`);
    const data = await response.json();
    console.log("Fetched profile:", data);

    if (response.ok && data?.user) {
      setName(data.user.name || "");
      setEmail(data.user.email || "");
      setUserid(data.user.serial_id || "");
    } else {
      console.warn("User not found, resetting profile fields.");
      setName("");
      setEmail("");
      setUserid("");
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    setName("");
    setEmail("");
    setUserid("");
  }
};

  fetchProfile();
}, []);

 const handleSubmit = async (e) => {
    e.preventDefault();

      // Check if this email already submitted feedback
  try {
    const checkResponse = await fetch(`http://localhost:5000/api/feedbacks/check/${email}`);
    const checkResult = await checkResponse.json();

    if (checkResponse.ok && checkResult.exists) {
      alert("You have already submitted feedback. Thank you!");
      return; // Stop submission
    }
  } catch (error) {
    console.error("Error checking existing feedback:", error);
    alert("Unable to verify feedback submission. Please try again later.");
    return;
  }

    const feedbackData = {
      name,
      message,
      category,
      email,
      userid,
      foodservice: feedback.foodservice,
      recognition: feedback2.recognition,
      diversity: feedback3.diversity,
      leadership: feedback4.leadership,
      communication: feedback5.communication,
    };

    try {
      const response = await fetch("http://localhost:5000/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData),
      });

      const result = await response.json();

      if (!response.ok) {
        alert("⚠️ " + result.error);
        return;
      }

      console.log("Feedback submitted successfully!");
      alert("Feedback submitted successfully!");
      if (onSubmit) onSubmit(feedbackData);

      setMessage("");
      setCategory("");
      setFeedback("");
      setFeedback2("");
      setFeedback3("");
      setFeedback4("");
      setFeedback5("");
    } catch (error) {
      console.error("❌ Error submitting feedback:", error);
    }
  };


//---------------------------//
  return (
    <div className="absolute right-0 left-0 top-0">     
    {/* --- Navbar --- */}
    <nav className="bg-gray-800 text-white px-4 py-2 rounded mb-6 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between ">
        {/* Logo / Brand */}
        <div className="text-xl flex font-bold justify-between">
          <img src="/download.png" alt="Company Logo" className="h-13 mr-8 w-auto" /></div>

        <div className="md:hidden flex items-center space-x-4">
  {/* Hamburger Icon */}
  <button
    onClick={() => setMenuOpen(!menuOpen)}
    className="focus:outline-none"
  >
    {menuOpen ? <X size={24} /> : <Menu size={24} />}
  </button>

  {/* User Icon */}
  <div className="relative">
    <button
      onClick={() => setDropdownOpen(!dropdownOpen)}
      className="focus:outline-none"
    >
      <User className="h-7 w-6.5 text-white" />
    </button>

    {/* Dropdown Menu */}
    {dropdownOpen && (
      <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-10">
        <Link
          to="/account"
          className="block px-4 py-2 hover:bg-gray-100"
          onClick={() => setDropdownOpen(false)}
        >
          Account Details
        </Link>
               <Link
                    to="/userf"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                     >
                       Your Feedbacks
                       </Link>
              <Link
                        to="/feedback"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)} >
                        Feedback Form
                      </Link>
              
                          <Link
                          to="/login"
                          onClick={() => {
                           localStorage.removeItem("token"); // ✅ Clear the old token
                            setDropdownOpen(false);           // 🔒 Close the dropdown
                             }}
                              className="block px-4 py-2 hover:bg-gray-100"
                               >
                               Log Out
                               </Link>
        
      </div>
    )}
  </div>
</div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          <li><a href="https://www.hindalco.com/" className="hover:text-gray-300">Home</a></li>
          <li><a href="https://www.hindalco.com/about-us" className="hover:text-gray-300">About Us</a></li>
          <li><a href="https://www.hindalco.com/businesses" className="hover:text-gray-300">Businesses</a></li>
          <li><a href="https://www.hindalco.com/industries" className="hover:text-gray-300">Industries we Serve</a></li>
          <li><a href="https://www.hindalco.com/our-brands" className="hover:text-gray-300">Our Brands</a></li>
          <li><a href="https://www.hindalco.com/contact-us" className="hover:text-gray-300">Contact</a></li>
          <li className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="focus:outline-none"
          >
            < User  className="h-7 w-6.5 text-white" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-10">
              <Link
          to="/account"
          className="block px-4 py-2 hover:bg-gray-100"
          onClick={() => setDropdownOpen(false)}
        >
          Account Details
        </Link>
               <Link
                    to="/userf"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                     >
                       Your Feedbacks
                       </Link>
                             <Link
                                       to="/feedback"
                                       className="block px-4 py-2 hover:bg-gray-100"
                                       onClick={() => setDropdownOpen(false)} >
                                       Feedback Form
                                     </Link>
              <Link
                                to="/login"
                                onClick={() => {
                                 localStorage.removeItem("token"); // ✅ Clear the old token
                                  setDropdownOpen(false);           // 🔒 Close the dropdown
                                   }}
                                    className="block px-4 py-2 hover:bg-gray-100"
                                     >
                                     Log Out
                                     </Link>
              
            </div>
          )}
          </li>
        </ul>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden mt-4 space-y-2">
          <li><a href="https://www.hindalco.com/" className="block hover:text-gray-300">Home</a></li>
          <li><a href="https://www.hindalco.com/about-us" className="block hover:text-gray-300">About Us</a></li>
          <li><a href="https://www.hindalco.com/businesses" className="block hover:text-gray-300">Businesses</a></li>
          <li><a href="https://www.hindalco.com/our-brands" className="block hover:text-gray-300">Our Brands</a></li>
          <li><a href="https://www.hindalco.com/contact-us" className="block hover:text-gray-300">Contact</a></li>
        </ul>
      )}
    </nav>

    {/* --- Feedback Form Card --- */}
<div className="w-full bg-gray-800 py-5 rounded">
  <h1 className="text-lg sm:text-xl md:text-2xl flex font-bold mb-2 text-left mx-6 text-white ">Employee Feedback Form<img src="/clipboard-pen-line.png" alt="icon" className="h-8 w-8 ml-3 justify justify-between" /></h1>
  <p className="mb-3 text-white mx-6 ">Please take a minute to provide your feedback about your recent experience in the company.</p>
</div>
    <div className="w-full mx-auto bg-orange-50 p-6 sm:p-8 md:p-10 rounded shadow-md">
        <form onSubmit={handleSubmit}>
      <label className="block mb-4">
 <p className="mt-5 flex font-semibold"><img src="/department.png" alt="icon" className="h-6 w-6 mr-1 justify justify-between" />Department:</p> 
  <select
    className="w-full p-2 border border-gray-300 rounded mt-1 bg-white"
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    required
  >
    <option value="">Select your department</option>
    <option value="HR Department">HR Department</option>
    <option value="IT Department">IT Department</option>
    <option value="Finance Department">Finance Department</option>
    <option value="Marketing Department">Marketing Department</option>
    <option value="Other">other</option>
  </select>
</label>
<label className="block mb-2">
         <p className="mt-7 flex font-semibold"><img src="/email.png" alt="icon" className="h-5 w-5 mr-1 justify justify-between" /> User Autogenerated Id:</p>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-1 bg-white"
            value={userid}
            readOnly
          />
          </label>
<label className="block mb-2">
         <p className="mt-7 flex font-semibold"><img src="/email.png" alt="icon" className="h-5 w-5 mr-1 justify justify-between" /> Email:</p>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-1 bg-white"
            value={email}
            readOnly
          />
        </label>
        <label className="block mb-2">
         <p className="mt-7 flex font-semibold"><img src="/id-card.png" alt="icon" className="h-6 w-6 mr-1 justify justify-between" /> Name:</p>{""}
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-1 bg-white"
            value={name}
            readOnly
          />
        </label>
        <label className="block mb-2 font-medium text-black">
  <p className="mt-7">1.How are the food services in the company?</p>
</label>
<div className="flex flex-col sm:flex-row sm:space-x-4 mb-2">
  <label className="form-check block">
    <input
      className="form-check-input mr-1 ml-2"
      type="radio"
      name="foodservice"
      value="Very Good"
      checked={feedback.foodservice === "Very Good"}
      onChange={(e) =>
        setFeedback({ ...feedback, foodservice: e.target.value })
      }
    />
   <span>Very Good</span>
  </label>
  <label className="form-check block ">
    <input
      className="form-check-input mr-1 ml-2"
      type="radio"
      name="foodservice"
      value="Good"
      checked={feedback.foodservice === "Good"}
      onChange={(e) =>
        setFeedback({ ...feedback, foodservice: e.target.value })
      }
    />
   <span>Good</span>
  </label>

  <label className="form-check block">
    <input
      className="form-check-input mr-1 ml-2"
      type="radio"
      name="foodservice"
      value="Average"
      checked={feedback.foodservice === "Average"}
      onChange={(e) =>
        setFeedback({ ...feedback, foodservice: e.target.value })
      }
    />
   <span>Average</span>
  </label>

  <label className="form-check block ">
    <input
      className="form-check-input mr-1 ml-2"
      type="radio"
      name="foodservice"
      value="Poor"
      checked={feedback.foodservice === "Poor"}
      onChange={(e) =>
        setFeedback({ ...feedback, foodservice: e.target.value })
      }
    />
   <span>Poor</span>
  </label>
  <label className="form-check block ">
    <input
      className="form-check-input mr-1 ml-2"
      type="radio"
      name="foodservice"
      value="Very Poor"
      checked={feedback.foodservice === "Very Poor"}
      onChange={(e) =>
        setFeedback({ ...feedback, foodservice: e.target.value })
      }
    />
   <span>Very Poor</span>
  </label>
</div>

 <label className="block mb-2 font-medium text-black">
  <p className="mt-7">2.How do you feel about the level of recognition you receive for your contributions?</p>
</label>
<div className="flex flex-col sm:flex-row sm:space-x-4 mb-2">
  <label className="form-check block">
    <input
      className="form-check-input mr-1 ml-2"
      type="radio"
      name="recognition"
      value="Very Good"
      checked={feedback2.recognition === "Very Good"}
      onChange={(e) =>
        setFeedback2({ ...feedback2, recognition: e.target.value })
      }
    />
   <span>Very Good</span>
  </label>
  <label className="form-check block ">
    <input
      className="form-check-input mr-1 ml-2"
      type="radio"
      name="recognition"
      value="Good"
      checked={feedback2.recognition === "Good"}
      onChange={(e) =>
        setFeedback2({ ...feedback2, recognition: e.target.value })
      }
    />
   <span>Good</span>
  </label>

  <label className="form-check block">
    <input
      className="form-check-input mr-1 ml-2"
      type="radio"
      name="recognition"
      value="Average"
      checked={feedback2.recognition === "Average"}
      onChange={(e) =>
        setFeedback2({ ...feedback2, recognition: e.target.value })
      }
    />
   <span>Average</span>
  </label>

  <label className="form-check block ">
    <input
      className="form-check-input mr-1 ml-2"
      type="radio"
      name="recognition"
      value="Poor"
      checked={feedback2.recognition === "Poor"}
      onChange={(e) =>
        setFeedback2({ ...feedback2, recognition: e.target.value })
      }
    />
   <span>Poor</span>
  </label>
  <label className="form-check block ">
    <input
      className="form-check-input mr-1 ml-2"
      type="radio"
      name="recognition"
      value="Very Poor"
      checked={feedback2.recognition === "Very Poor"}
      onChange={(e) =>
        setFeedback2({ ...feedback2, recognition: e.target.value })
      }
    />
   <span>Very Poor</span>
  </label>
</div>
 <label className="block mb-2 font-medium text-black">
 <p className="mt-7">3.How would you rate the company's commitment to diversity and inclusion?</p>
</label>
<div className="flex flex-col sm:flex-row sm:space-x-4 mb-2">
  <label className="form-check block">
    <input
      className="form-check-input mr-1 ml-2"
      type="radio"
      name="diversity"
      value="Very Good"
      checked={feedback3.diversity === "Very Good"}
      onChange={(e) =>
        setFeedback3({ ...feedback3, diversity: e.target.value })
      }
    />
   <span>Very Good</span>
  </label>
  <label className="form-check block ">
    <input
      className="form-check-input mr-1 ml-2"
      type="radio"
      name="diversity"
      value="Good"
      checked={feedback3.diversity === "Good"}
      onChange={(e) =>
        setFeedback3({ ...feedback3, diversity: e.target.value })
      }
    />
   <span>Good</span>
  </label>

  <label className="form-check block">
    <input
      className="form-check-input mr-1 ml-2"
      type="radio"
      name="diversity"
      value="Average"
      checked={feedback3.diversity === "Average"}
      onChange={(e) =>
        setFeedback3({ ...feedback3, diversity: e.target.value })
      }
    />
   <span>Average</span>
  </label>

  <label className="form-check block ">
    <input
      className="form-check-input mr-1 ml-2"
      type="radio"
      name="diversity"
      value="Poor"
      checked={feedback3.diversity === "Poor"}
      onChange={(e) =>
        setFeedback3({ ...feedback3, diversity: e.target.value })
      }
    />
   <span>Poor</span>
  </label>
  <label className="form-check block ">
    <input
      className="form-check-input mr-1 ml-2"
      type="radio"
      name="diversity"
      value="Very Poor"
      checked={feedback3.diversity === "Very Poor"}
      onChange={(e) =>
        setFeedback3({ ...feedback3, diversity: e.target.value })
      }
    />
   <span>Very Poor</span>
  </label>
</div>
 <label className="block mb-2 font-medium text-black">
 <p className="mt-7">4.How would you rate the leadership provided by senior management? </p>
</label>
<div className="flex flex-col sm:flex-row sm:space-x-4 mb-2">
  <label className="form-check block">
    <input
      className="form-check-input mr-1 ml-2"
      type="radio"
      name="leadership"
      value="Very Good"
      checked={feedback4.leadership === "Very Good"}
      onChange={(e) =>
        setFeedback4({ ...feedback4, leadership: e.target.value })
      }
    />
   <span>Very Good</span>
  </label>
  <label className="form-check block ">
    <input
      className="form-check-input mr-1 ml-2"
      type="radio"
      name="leadership"
      value="Good"
      checked={feedback4.leadership === "Good"}
      onChange={(e) =>
        setFeedback4({ ...feedback4,leadership: e.target.value })
      }
    />
   <span>Good</span>
  </label>

  <label className="form-check block">
    <input
      className="form-check-input mr-1 ml-2"
      type="radio"
      name="leadership"
      value="Average"
      checked={feedback4.leadership === "Average"}
      onChange={(e) =>
        setFeedback4({ ...feedback4, leadership: e.target.value })
      }
    />
   <span>Average</span>
  </label>

  <label className="form-check block ">
    <input
      className="form-check-input mr-1 ml-2"
      type="radio"
      name="leadership"
      value="Poor"
      checked={feedback4.leadership === "Poor"}
      onChange={(e) =>
        setFeedback4({ ...feedback4, leadership: e.target.value })
      }
    />
   <span>Poor</span>
  </label>
  <label className="form-check block ">
    <input
      className="form-check-input mr-1 ml-2"
      type="radio"
      name="leadership"
      value="Very Poor"
      checked={feedback4.leadership === "Very Poor"}
      onChange={(e) =>
        setFeedback4({ ...feedback4, leadership: e.target.value })
      }
    />
   <span>Very Poor</span>
  </label>
</div>
<label className="block mb-2 font-medium text-black">
 <p className="mt-7">5.How effective is the communication within your team and across the company?</p>
</label>
<div className="flex flex-col sm:flex-row sm:space-x-4 mb-2">
  <label className="form-check block">
    <input
      className="form-check-input mr-1 ml-2"
      type="radio"
      name="communication"
      value="Very Good"
      checked={feedback5.communication === "Very Good"}
      onChange={(e) =>
        setFeedback5({ ...feedback5,communication: e.target.value })
      }
    />
   <span>Very Good</span>
  </label>
  <label className="form-check block ">
    <input
      className="form-check-input mr-1 ml-2"
      type="radio"
      name="communication"
      value="Good"
      checked={feedback5.communication === "Good"}
      onChange={(e) =>
        setFeedback5({ ...feedback5, communication: e.target.value })
      }
    />
   <span>Good</span>
  </label>

  <label className="form-check block">
    <input
      className="form-check-input mr-1 ml-2"
      type="radio"
      name="communication"
      value="Average"
      checked={feedback5.communication === "Average"}
      onChange={(e) =>
        setFeedback5({ ...feedback5, communication: e.target.value })
      }
    />
   <span>Average</span>
  </label>

  <label className="form-check block ">
    <input
      className="form-check-input mr-1 ml-2"
      type="radio"
      name="communication"
      value="Poor"
      checked={feedback5.communication === "Poor"}
      onChange={(e) =>
        setFeedback5({ ...feedback5, communication: e.target.value })
      }
    />
   <span>Poor</span>
  </label>
  <label className="form-check block ">
    <input
      className="form-check-input mr-1 ml-2"
      type="radio"
      name="communication"
      value="Very Poor"
      checked={feedback5.communication === "Very Poor"}
      onChange={(e) =>
        setFeedback5({ ...feedback5,communication: e.target.value })
      }
    />
   <span>Very Poor</span>
  </label>
</div>
        <label className="block mb-6 ">
         <p className="mt-5  flex font-semibold"><img src="chat.png" alt="icon" className="h-6 w-6 mr-1 justify justify-between" /> Message:</p>
          <textarea
          placeholder="Any additional comment?"
            className="w-full p-2 border border-gray-300 rounded mt-1 h-48 bg-white"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-300 hover:text-gray-800"
        >Submit
        </button>
      </form>
    </div>
    </div>
  );
}

export default FeedbackForm;
