import React from "react";
import axios from "axios";
import SignUp from "../pages/SIgnUp";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/user/logout"); // Adjust the URL as needed
      // You may also want to clear any local storage or state related to the user's session
      console.log("Logout successful");
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div>
      <SignUp />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
