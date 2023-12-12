import React from "react";
import "../styles/Notifications.css";

const NotificationHome = ({ notifications }) => {
  return (
    <div className="notifications-container">
      <h3>Notifications</h3>
      <ul className="notifications-list">
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationHome;
