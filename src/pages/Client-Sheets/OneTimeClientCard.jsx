import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Typography, CardHeader, CardContent } from "@mui/material";
import "../../styles/Home/TicketCard.css";

const TicketCard = ({ heading, counter }) => {
  const cardClass =
    heading === "Active Clients"
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

function OneTimeServiceClientsCard() {
  const [monthlySeoCount, setMonthlySeoCount] = useState(0);
  const [oneTimeServiceCount, setOneTimeServiceCount] = useState(0);

  // Fetch the count of one-time service clients when the component mounts
  useEffect(() => {
    fetch(
      "http://localhost:5000/api/tickets/tickets-count-except-monthly-seo/65195c8f504d80e8f11b0d15"
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.count) {
          setOneTimeServiceCount(data.count);
        } else {
          console.error("Error fetching one-time service clients count");
        }
      })
      .catch((error) => {
        console.error("Error fetching one-time service clients count", error);
      });
    // Make an API request to fetch the count of Monthly SEO clients
    fetch("http://localhost:5000/api/tickets/tickets-count-monthly-seo")
      .then((response) => response.json())
      .then((data) => {
        if (data.count) {
          setMonthlySeoCount(data.count);
        } else {
          console.error("Error fetching Monthly SEO clients count");
        }
      })
      .catch((error) => {
        console.error("Error fetching Monthly SEO clients count", error);
      });
  }, []); // Ensure the dependency array is set up correctly

  return (
    <div className="filterticketscard">
      <div className="col-6">
        <Link to="/one_time_service_clients">
          <TicketCard
            heading="One-Time Service Clients"
            counter={oneTimeServiceCount}
          />
        </Link>
      </div>
      <div className="col-6">
        <Link to="/monthly_service_clients">
          <TicketCard heading="Monthly Clients" counter={monthlySeoCount} />
        </Link>
      </div>
    </div>
  );
}

export default OneTimeServiceClientsCard;
