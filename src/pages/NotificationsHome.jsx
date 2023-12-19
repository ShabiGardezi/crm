import React from "react";
import "../styles/Notifications.css";

const NotificationHome = ({ notifications }) => {
  return (
    <div className="notifications-container">
      <h3>Reporting Date Notifications</h3>
      <ul className="notifications-list" style={{ cursor: "pointer" }}>
        {notifications.map((notification, index) => (
          <li
            key={index}
            dangerouslySetInnerHTML={{ __html: notification }}
          ></li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationHome;
