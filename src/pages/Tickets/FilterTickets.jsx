import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, Typography } from "@material-ui/core";
import "../../styles/Home/TicketCard.css";
import axios from "axios";
import { Link, useLocation } from "react-router-dom"; // Import the Link component

const TicketCard = ({ heading, counter }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isSelected, setSelected] = useState(false);
  const location = useLocation();
  const cardClass =
    heading === "Created Tickets"
      ? "open-tickets-card"
      : "completed-tickets-card";
  const handleClick = () => {
    if (!isClicked) {
      setIsClicked((prevIsClicked) => !prevIsClicked);
    }
  };
  useEffect(() => {
    location.pathname === "/tickets_created" && heading === "Created Tickets"
      ? setSelected(true)
      : setSelected(false);
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

const FilterTickets = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const [createdTickets, setCreatedTickets] = useState(0); // State for created tickets count

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the count of tickets created by the department
        const createdResponse = await axios.get(
          `${apiUrl}/api/tickets/created-count?departmentId=${user?.department?._id}`
        );
        // Extract the counts from the API response
        const createdCount = createdResponse.data.payload;
        // Set the counts in state
        setCreatedTickets(createdCount);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to fetch data only once

  return (
    <div className="filterticketscard">
      <div className="col-6">
        <Link to="/tickets_created">
          <TicketCard heading="Created Tickets" counter={createdTickets} />
        </Link>
      </div>
    </div>
  );
};

export default FilterTickets;
