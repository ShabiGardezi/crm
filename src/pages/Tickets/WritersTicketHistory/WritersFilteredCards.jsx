import React from "react";
import { Card, CardHeader, CardContent, Typography } from "@material-ui/core";
import "../../../styles/Home/TicketCard.css";
import { Link } from "react-router-dom";
const TicketCard = ({ heading, counter, onClick }) => {
  const cardClass =
    heading === "Open Tickets" ? "open-tickets-card" : "completed-tickets-card";

  return (
    <Card className={cardClass} onClick={onClick}>
      <CardHeader title={heading} />
      <CardContent>
        <Typography variant="h6">{counter}</Typography>
      </CardContent>
    </Card>
  );
};

const WritersFilteredCards = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <>
      <div className="filterticketscard">
        <div className="col-6">
          <Link to="/local_seo_tickets">
            <TicketCard heading="Local SEO" />
          </Link>
        </div>
        <div className="col-6">
          <Link to="/web_seo_tickets">
            <TicketCard heading="Web SEO" />
          </Link>
        </div>
        <div className="col-6">
          <Link to="/reviews_writer_tickets">
            <TicketCard heading="Reviews" />
          </Link>
        </div>
        <div className="col-6">
          <Link to="/wordpress_writer_tickets">
            <TicketCard heading="Wordpress" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default WritersFilteredCards;
