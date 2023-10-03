import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, Typography } from "@material-ui/core";
import "../../styles/Home/TicketCard.css";
import axios from "axios";

const TicketCard = ({ heading, counter }) => {
  const cardClass =
    heading === "Open Tickets" ? "open-tickets-card" : "completed-tickets-card";

  return (
    <Card className={cardClass}>
      <CardHeader title={heading} />
      <CardContent>
        <Typography variant="h6">{counter}</Typography>
      </CardContent>
    </Card>
  );
};

const TicketCards = () => {
  const [openTicketsCounter, setOpenTicketsCounter] = useState(0);
  const [completedTicketsCounter, setCompletedTicketsCounter] = useState(0);

  useEffect(() => {
    // Make API requests to get open and completed ticket counts
    axios
      .get("http://localhost:5000/api/tickets/completed-count")
      .then((response) => {
        setCompletedTicketsCounter(response.data.payload);
      });

    axios
      .get("http://localhost:5000/api/tickets/notStarted-count")
      .then((response) => {
        setOpenTicketsCounter(response.data.payload);
      });
  }, []);

  return (
    <div className="ticketcard">
      <TicketCard heading="Open Tickets" counter={openTicketsCounter} />
      <TicketCard
        heading="Completed Tickets"
        counter={completedTicketsCounter}
      />
    </div>
  );
};

export default TicketCards;
