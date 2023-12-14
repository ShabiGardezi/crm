import React, { useEffect } from "react";
import "../styles/NoteNotification.css";

const NotesNotification = ({ notes }) => {
  return (
    <div className="notes-notification-container">
      <h3>Notes Notification</h3>
      <ul className="notes-list">
        {notes.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotesNotification;
