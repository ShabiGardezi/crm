import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, Typography } from "@material-ui/core";
import "../../styles/Home/TicketCard.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Import useHistory from react-router-dom

const TicketCard = ({ heading, counter, onClick }) => {
  // Pass onClick function
  const cardClass =
    heading === "Active Clients"
      ? "active-clients-card"
      : "non-active-clients-card";
  const navigate = useNavigate();
  return (
    <Card className={cardClass} onClick={onClick}>
      <CardHeader title={heading} />
      <CardContent>
        <Typography variant="h6">{counter}</Typography>
      </CardContent>
    </Card>
  );
};

const ActiveNotActiveCard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [activeClients, setActiveClients] = useState(0);
  const [nonActiveClients, setNonActiveClients] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the count of non-active clients
        const nonActiveResponse = await axios.get(
          `http://localhost:5000/api/tickets/activeee?departmentId=${
            user?.department?._id
          }&status=${"Active"}`
        );

        const nonActiveCount = nonActiveResponse.data.payload;

        setNonActiveClients(nonActiveCount);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleActiveClientsClick = () => {
    navigate.push("/active-clients"); // Navigate to the "active-clients" route
  };

  const handleNonActiveClientsClick = () => {
    navigate.push("/non-active-clients"); // Navigate to the "non-active-clients" route
  };

  const cardLinkStyle = {
    textDecoration: "none",
    color: "inherit",
  };

  return (
    <div className="filter-tickets-card">
      <div className="col-6">
        <TicketCard
          heading="Active Clients"
          counter={activeClients}
          onClick={handleActiveClientsClick}
        />
      </div>
      <div className="col-6">
        <TicketCard
          heading="Non Active Clients"
          counter={nonActiveClients}
          onClick={handleNonActiveClientsClick}
        />
      </div>
    </div>
  );
};

export default ActiveNotActiveCard;
