import React from "react";
import { Link } from "react-router-dom";
import "../styles/NoteNotification.css";

const NotesNotification = ({ notes }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const getDepartmentLink = () => {
    const departmentId = user?.department?._id;

    switch (departmentId) {
      case "65195c4b504d80e8f11b0d13":
        return "/localseo_clients?depId=65195c4b504d80e8f11b0d13";
      case "65195c81504d80e8f11b0d14":
        return "/website_sheet?depId=65195c81504d80e8f11b0d14";
      case "65195c8f504d80e8f11b0d15":
        return "/webseo_clients?depId=65195c8f504d80e8f11b0d15";
      case "651ada3c819ff0aec6af1380":
        return "/paid_marketing_sheet?depId=651ada3c819ff0aec6af1380";
      case "651ada78819ff0aec6af1381":
        return "/social_media_client?depId=651ada78819ff0aec6af1381";
      default:
        return "/";
    }
  };
  const extractUsernameAndClientName = (note) => {
    const regex = /(.+) has edited the notes for Business Name: (.+)/;
    const match = note.match(regex);

    if (match) {
      const [, username, clientName] = match;
      return { username, clientName };
    }

    return { username: "", clientName: "" };
  };
  return (
    <div className="notes-notification-container">
      <h3>Client Notes Notification</h3>
      <ul className="notes-list">
        {notes.map((note, index) => {
          const { username, clientName } = extractUsernameAndClientName(note);

          return (
            <li
              key={index}
              onClick={() => (window.location.href = getDepartmentLink(note))}
            >
              <span style={{ color: "red" }}>{username}</span> has edited the
              notes for Business Name:
              <span style={{ color: "red" }}>{clientName}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NotesNotification;
