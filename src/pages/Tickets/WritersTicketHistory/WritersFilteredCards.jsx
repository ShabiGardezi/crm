import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, Typography } from "@material-ui/core";
import "../../../styles/Home/TicketCard.css";
import axios from "axios";
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
  const [openTicketsCounter, setOpenTicketsCounter] = useState(0);
  const [completedTicketsCounter, setCompletedTicketsCounter] = useState(0);

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         // Fetch the count of open tickets
  //         const openResponse = await axios.get(
  //           `http://localhost:5000/api/tickets/notStarted-count?departmentId=${user?.department?._id}`
  //         );

  //         // Fetch the count of completed tickets
  //         const completedResponse = await axios.get(
  //           `http://localhost:5000/api/tickets/completed-count?departmentId=${user?.department?._id}`
  //         );

  //         // Extract the counts from the API response
  //         const openCount = openResponse.data.payload;
  //         const completedCount = completedResponse.data.payload;

  //         // Set the counts in state
  //         setOpenTicketsCounter(openCount);
  //         setCompletedTicketsCounter(completedCount);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     };

  //     fetchData();
  //   }, []);

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
          <Link to="/inactive_website_clients">
            <TicketCard heading="Reviews" />
          </Link>
        </div>
        <div className="col-6">
          <Link to="/inactive_website_clients">
            <TicketCard heading="Wordpress" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default WritersFilteredCards;
