import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../pages/Header";
import GreetingCard from "../Layout/Home/GreetingCard";
import { useNavigate } from "react-router-dom";
import TicketCards from "../Layout/Home/TicketCard";
const Home = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  // useEffect(() => {
  //   // Check if the user is authenticated before making the request
  //   axios
  //     .get("http://localhost:5000/api/user/userdata")
  //     .then((response) => {
  //       setUsername(response.data.username);
  //     })
  //     .catch((error) => {
  //       if (error.response && error.response.status === 401) {
  //         // Handle unauthenticated user, e.g., redirect to login
  //         console.log(error);
  //         // You can redirect the user to the login page or handle it as needed.
  //         navigate("/login");
  //       } else {
  //         console.error(error);
  //       }
  //     });
  // }, []);

  return (
    <div>
      <Header />
      <GreetingCard username={username} />
      <TicketCards />
    </div>
  );
};

export default Home;
