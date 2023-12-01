import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, Typography } from "@material-ui/core";
import "../../styles/Home/TicketCard.css";
import axios from "axios";
import { Link } from "react-router-dom";

const TicketCard = ({ heading, counter }) => {
  const [isClicked, setIsClicked] = useState(false);
  const cardClass =
    heading === "Open Tickets" ? "open-tickets-card" : "completed-tickets-card";

  const handleClick = () => {
    if (!isClicked) {
      setIsClicked((prevIsClicked) => !prevIsClicked);
    }
  };
  return (
    <Card
      className={`${cardClass} ${isClicked ? "clicked" : "ticket-card"}`}
      onClick={handleClick}
    >
      <CardHeader title={heading} />
      <CardContent>
        <Typography variant="h6">{counter}</Typography>
      </CardContent>
    </Card>
  );
};
const ClientsCard = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeCount, setActiveCount] = useState(0);
  const [notActiveCount, setNotActiveCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the ticket data
        const response = await axios.get(
          `${apiUrl}/api/tickets?departmentId=${user?.department?._id}&salesDep=true`
        );

        // Set the ticket data in state
        const tickets = response.data.payload;

        // Filter active and not active tickets
        const activeTicketsFiltered = tickets.filter(
          (ticket) => ticket.ActiveNotActive === "Active"
        );

        const notActiveTicketsFiltered = tickets.filter(
          (ticket) => ticket.ActiveNotActive === "Not Active"
        );

        setActiveCount(activeTicketsFiltered.length);
        setNotActiveCount(notActiveTicketsFiltered.length);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <>
      <div className="filterticketscard">
        <div className="col-6">
          <Link to="/active_clients">
            <TicketCard heading="Active Clients" counter={activeCount} />
          </Link>
        </div>
        <div className="col-6">
          <Link to="/notactive_clients">
            <TicketCard heading="InActive Clients" counter={notActiveCount} />
          </Link>
        </div>
      </div>
    </>
  );
};

export default ClientsCard;
