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
  const [notes, setNotes] = useState([]);
  const [notificationId, setNotificationIds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [processedBusinesses, setProcessedBusinesses] = useState(new Set());
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/notification/all?userId=${user._id}`
        );
        if (response.data.payload) {
          const updatedNotes = response.data.payload
            .filter((e) => !e.forInBox)
            .map((e) => `${e.message} `);

          setNotes(updatedNotes);
          const ids = response.data.payload
            .filter((e) => !e.forInBox)
            .map((e) => e._id);
          setNotificationIds(ids);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, user._id]);

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

              setNotifications((prevNotifications) => [
                ...prevNotifications,
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

  const onNotificationClick = async (
    notificationId,
    majorAssigneeId,
    assignorDepartmentId
  ) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/api/notification/${notificationId}`
      );

      if (response.status === 200) {
        // Update the state to remove the clicked notification
        setNotes((prevNotes) =>
          prevNotes.filter(
            (note) =>
              note.majorAssigneeId !== majorAssigneeId ||
              note.assignorDepartmentId !== assignorDepartmentId
          )
        );

        // Filter out the clicked notification ID from the notificationIds state
        setNotificationIds((prevIds) =>
          prevIds.filter((id) => id !== notificationId)
        );
      } else {
        console.error("Error deleting notification", response.data);
      }
    } catch (error) {
      console.error("Error deleting notification", error.message);
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
      {!loading && notes.length > 0 && (
        <NotesNotification
          notes={notes}
          onNotificationClick={onNotificationClick}
        />
      )}
    </div>
  );
};

export default Home;
