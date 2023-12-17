import React, { useState, useEffect } from "react";
import Header from "../pages/Header";
import GreetingCard from "../Layout/Home/GreetingCard";
import TicketCards from "../Layout/Home/TicketCard";
import UserToDo from "./UserToDo";
import NotificationHome from "../pages/NotificationsHome";
import NotesNotification from "../pages/NotesNotification";
import axios from "axios";
const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const apiUrl = process.env.REACT_APP_API_URL;
  const [notifications, setNotifications] = useState([]);
  // const [notesNotification, setNotesNotification] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processedBusinesses, setProcessedBusinesses] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/tickets/reportingdate-notification?userDepartmentId=${user?.department?._id}&salesDep=true`
        );
        if (response.ok) {
          const data = await response.json();
          // Fetch reporting date for each ticket and assignor user information
          for (const ticket of data.payload) {
            await fetchReportingDate(
              ticket._id,
              ticket.businessdetails.clientName,
              ticket.majorAssignee,
              ticket.assignorDepartment
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
  }, []);

  const fetchReportingDate = async (
    ticketId,
    clientName,
    majorAssignee,
    assignorDepartment
  ) => {
    try {
      const response = await fetch(
        `${apiUrl}/api/tickets/reporting-date/${ticketId}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.payload) {
          const currentDate = new Date();
          const reportingDate = new Date(data.payload);
          const isMajorAssignee = user?.department?._id === majorAssignee?._id;
          const isAssignorDepartment =
            user?.department?._id === assignorDepartment?._id;

          if (
            currentDate >= reportingDate &&
            !processedBusinesses.has(clientName)
          ) {
            if (isMajorAssignee || isAssignorDepartment) {
              let notificationMessage = `Reporting date reached for Business Name: <span class="red-text">${clientName}</span>`;

              if (isMajorAssignee) {
                notificationMessage += ` (assigned by ${assignorDepartment.name})`;
              } else if (isAssignorDepartment) {
                notificationMessage += ` (assigned to ${majorAssignee.name})`;
              }
              const resp = await axios(
                `${apiUrl}/api/notification/all?userId=${user._id}`
              );
              const filterData = resp.data.payload.map((e) => {
                if (e.forInBox === false) {
                  return e.message;
                }
              });
              setNotifications((prevNotifications) => [
                ...filterData,
                notificationMessage,
              ]);

              setProcessedBusinesses((prevBusinesses) =>
                new Set(prevBusinesses).add(clientName)
              );
            }
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
      {/* <NotesNotification notes={notesNotification} /> */}
    </div>
  );
};

export default Home;
