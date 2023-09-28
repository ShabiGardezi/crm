import React from "react";
import { Card, CardHeader, CardContent, Typography } from "@material-ui/core";
import "../../styles/Home/TicketCard.css";

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
  const openTicketsCounter = 10;
  const completedTicketsCounter = 5;

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
