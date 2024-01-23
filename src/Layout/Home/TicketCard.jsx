import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, Typography } from "@material-ui/core";
import "../../styles/Home/TicketCard.css";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import FilterTickets from "../../pages/Tickets/FilterTickets";
const TicketCard = ({ heading, counter, onClick }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isSelected, setSelected] = useState(false);
  const location = useLocation();
  const cardClass =
    heading === "Open Tickets" ? "open-tickets-card" : "completed-tickets-card";

  const handleClick = () => {
    if (!isClicked) {
      setIsClicked((prevIsClicked) => !prevIsClicked);
    }
  };
  useEffect(() => {
    const { pathname } = location;
    if (pathname === "/history" && heading === "Open Tickets") {
      setSelected(true);
    } else if (pathname === "/close_tickets" && heading === "Close Tickets") {
      setSelected(true);
    }
  }, [location]);
  return (
    <Card
      className={`${cardClass} ${isSelected ? "clicked" : "ticket-card"}`}
      onClick={handleClick}
    >
      <CardHeader title={heading} />
      <CardContent>
        <Typography variant="h6">{counter}</Typography>
      </CardContent>
    </Card>
  );
};

const TicketCards = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const [openTicketsCounter, setOpenTicketsCounter] = useState(0);
  const [completedTicketsCounter, setCompletedTicketsCounter] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let openTicketsEndpoint = `${apiUrl}/api/tickets/notStarted-count?departmentId=${user?.department?._id}`;
        let completedTicketsEndpoint = `${apiUrl}/api/tickets/completed-count?departmentId=${user?.department?._id}`;

        // Check if user's department id is equal to the specified value
        if (
          user?.department?._id === "651b3409819ff0aec6af1387" ||
          user?.department?._id === "65ae7e27e00c92860edad99c"
        ) {
          // If yes, update the endpoints
          openTicketsEndpoint = `${apiUrl}/api/tickets/openTickets-count?departmentId=${user?.department?._id}`;
          completedTicketsEndpoint = `${apiUrl}/api/tickets/completedTickets-count?departmentId=${user?.department?._id}`;
        }

        // Fetch the count of open or completed tickets based on the endpoints
        const openResponse = await axios.get(openTicketsEndpoint);
        const completedResponse = await axios.get(completedTicketsEndpoint);

        // Extract the counts from the API response
        const openCount = openResponse.data.payload;
        const completedCount = completedResponse.data.payload;

        // Set the counts in state
        setOpenTicketsCounter(openCount);
        setCompletedTicketsCounter(completedCount);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [user?.department?._id]); // Include user.department._id in the dependency array

  return (
    <>
      <div className="filterticketscard">
        <div className="col-6">
          <Link to="/history">
            <TicketCard heading="Open Tickets" counter={openTicketsCounter} />
          </Link>
        </div>
        <div className="col-6">
          <Link to="/close_tickets">
            <TicketCard
              heading="Close Tickets"
              counter={completedTicketsCounter}
            />
          </Link>
        </div>
        <FilterTickets />
      </div>
    </>
  );
};

export default TicketCards;
