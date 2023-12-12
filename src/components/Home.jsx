import React, { useState, useEffect } from "react";
import Header from "../pages/Header";
import GreetingCard from "../Layout/Home/GreetingCard";
import TicketCards from "../Layout/Home/TicketCard";
import UserToDo from "./UserToDo";
import NotificationHome from "../pages/NotificationsHome";

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const apiUrl = process.env.REACT_APP_API_URL;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processedBusinesses, setProcessedBusinesses] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/tickets?departmentId=${user?.department?._id}&salesDep=true`
        );
        if (response.ok) {
          const data = await response.json();
          // Fetch reporting date for each ticket
          for (const ticket of data.payload) {
            await fetchReportingDate(
              ticket._id,
              ticket.businessdetails.clientName
            );
          }
        } else {
          console.error("Error fetching data");
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // This effect will run once when the component mounts

  const fetchReportingDate = async (ticketId, clientName) => {
    try {
      const response = await fetch(
        `${apiUrl}/api/tickets/reporting-date/${ticketId}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.payload) {
          const currentDate = new Date();
          const reportingDate = new Date(data.payload);

          if (
            currentDate >= reportingDate &&
            !processedBusinesses.has(clientName)
          ) {
            // Add a notification
            setNotifications((prevNotifications) => [
              ...prevNotifications,
              `Reporting date reached for Business Name: ${clientName}`,
            ]);
            setProcessedBusinesses((prevBusinesses) =>
              new Set(prevBusinesses).add(clientName)
            );
          }
        }
      } else {
        console.error("Error fetching reporting date");
      }
    } catch (error) {
      console.error("Error fetching reporting date", error);
    }
  };

  return (
    <div>
      <Header />
      <GreetingCard />

      <div className="homeCards" style={{ marginTop: "5%" }}>
        <TicketCards />
      </div>
      <div className="homeTodo" style={{ marginTop: "5%" }}>
        <UserToDo wrapInCard={true} showHeader={false} />
      </div>
      {!loading && notifications.length > 0 && (
        <NotificationHome notifications={notifications} />
      )}
    </div>
  );
};

export default Home;
