import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, Typography } from "@material-ui/core";
import "../../styles/Home/TicketCard.css";
import axios from "axios";
import { Link } from "react-router-dom"; // Import the Link component

const TicketCard = ({ heading, counter }) => {
  const cardClass =
    heading === "Created Tickets"
      ? "open-tickets-card"
      : "completed-tickets-card";

  return (
    <Card className={cardClass}>
      <CardHeader title={heading} />
      <CardContent>
        <Typography variant="h6">{counter}</Typography>
      </CardContent>
    </Card>
  );
};

const FilterTickets = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [createdTickets, setCreatedTickets] = useState(0); // State for created tickets count
  const [assignedTickets, setAssignedTickets] = useState(0); // State for assigned tickets count

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the count of tickets created by the department
        const createdResponse = await axios
          .get
          //   `http://localhost:5000/api/tickets/created-count?departmentId=${user?.department?._id}`
          ();

        // Fetch the count of tickets assigned to the department
        const assignedResponse = await axios
          .get
          //   `http://localhost:5000/api/tickets/assigned-count?departmentId=${user?.department?._id}`
          ();
        // Extract the counts from the API response
        const createdCount = createdResponse.data.payload;
        const assignedCount = assignedResponse.data.payload;
        // Set the counts in state
        setCreatedTickets(createdCount);
        setAssignedTickets(assignedCount);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to fetch data only once
  const cardLinkStyle = {
    textDecoration: "none", // Remove underline
    color: "inherit", // Inherit text color
  };
  return (
    <div className="filterticketscard">
      <div className="col-6">
        <Link>
          <TicketCard heading="Active Clients" counter={createdTickets} />
        </Link>
      </div>
      <div className="col-6">
        <Link>
          <TicketCard heading="Non Active Clients" counter={assignedTickets} />
        </Link>
      </div>
    </div>
  );
};

export default FilterTickets;
