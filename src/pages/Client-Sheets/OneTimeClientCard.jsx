import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, Typography, CardHeader, CardContent } from "@mui/material";
import "../../styles/Home/TicketCard.css";

const TicketCard = ({ heading, counter }) => {
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
    if (
      pathname === "/one_time_service_clients" &&
      heading === "One-Time Service Clients"
    ) {
      setSelected(true);
    } else if (
      pathname === "/monthly_service_clients" &&
      heading === "Monthly Clients"
    ) {
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
function OneTimeServiceClientsCard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const apiUrl = process.env.REACT_APP_API_URL;
  const [monthlySeoCount, setMonthlySeoCount] = useState(0);
  const [oneTimeServiceCount, setOneTimeServiceCount] = useState(0);
  const depart_id = "65195c8f504d80e8f11b0d15";
  // Fetch the count of one-time service clients when the component mounts

  useEffect(() => {
    fetch(
      `${apiUrl}/api/tickets/tickets-count-except-monthly-seo/${depart_id}&salesDep=true`
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
    fetch(`${apiUrl}/api/tickets/tickets-count-monthly-seo`)
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
