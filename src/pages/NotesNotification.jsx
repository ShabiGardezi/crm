import React, { useState, useEffect } from "react";
import "../styles/NoteNotification.css";
import axios from "axios";

const NotesNotification = ({ notes, onNotificationClick }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const [notesNotification, setNotesNotification] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/notification/all?userId=${user._id}`
        );
        if (response.data.payload) {
          const updatedNotes = response.data.payload
            .filter((e) => !e.forInBox)
            .map((e) => ({
              id: e._id,
              message: e.message,
              majorAssigneeId: e.majorAssigneeId,
              assignorDepartmentId: e.assignorDepartmentId,
            }));
          setNotesNotification(updatedNotes);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, user._id]);
  const getDepartmentLink = (majorAssigneeId, assignorDepartmentId) => {
    const userDepartmentId = user?.department?._id;

    if (
      assignorDepartmentId === "65195c4b504d80e8f11b0d13" ||
      majorAssigneeId === "651b3409819ff0aec6af1387"
    ) {
      return "/localseo_clients?depId=65195c4b504d80e8f11b0d13";
    }
    if (userDepartmentId === "65195c4b504d80e8f11b0d13") {
      return "/localseo_clients?depId=65195c4b504d80e8f11b0d13";
    } else if (
      (majorAssigneeId === "651b3409819ff0aec6af1387" &&
        assignorDepartmentId === "65195c81504d80e8f11b0d14") ||
      userDepartmentId === "65195c81504d80e8f11b0d14"
    ) {
      return "/website_sheet?depId=65195c81504d80e8f11b0d14";
    } else if (
      (majorAssigneeId === "651b3409819ff0aec6af1387" &&
        assignorDepartmentId === "65195c8f504d80e8f11b0d15") ||
      userDepartmentId === "65195c8f504d80e8f11b0d15"
    ) {
      return "/webseo_clients?depId=65195c8f504d80e8f11b0d15";
    } else if (
      (majorAssigneeId === "651b3409819ff0aec6af1387" &&
        assignorDepartmentId === "651ada3c819ff0aec6af1380") ||
      userDepartmentId === "651ada3c819ff0aec6af1380"
    ) {
      return "/paid_marketing_sheet?depId=651ada3c819ff0aec6af1380";
    } else if (
      (majorAssigneeId === "651b3409819ff0aec6af1387" &&
        assignorDepartmentId === "651ada78819ff0aec6af1381") ||
      userDepartmentId === "651ada78819ff0aec6af1381"
    ) {
      return "/social_media_client?depId=651ada78819ff0aec6af1381";
    } else {
      return "/home";
    }
  };
  const extractUsernameAndbusinessName = (note, index) => {
    const noteData = notesNotification[index];
    if (!noteData || typeof note !== "string") {
      return {
        username: "",
        businessName: "",
        majorAssigneeId: "",
        assignorDepartmentId: "",
      };
    }

    const { id, majorAssigneeId, assignorDepartmentId } = noteData;

    const regex = /(.+) has edited the notes for Business Name: (.+)/;
    const match = note.match(regex);

    if (match) {
      const [, username, businessName] = match;
      return {
        id: id,
        username,
        businessName,
        majorAssigneeId,
        assignorDepartmentId,
      };
    }

    return {
      id: "",
      username: "",
      businessName: "",
      majorAssigneeId: "",
      assignorDepartmentId: "",
    };
  };
  return (
    <div className="notes-notification-container">
      {!loading && (
        <React.Fragment>
          <h3>Client Notes Notification</h3>
          <ul className="notes-list" style={{ cursor: "pointer" }}>
            {notes.map((note, index) => {
              const {
                id,
                username,
                businessName,
                majorAssigneeId,
                assignorDepartmentId,
              } = extractUsernameAndbusinessName(note, index);
              const departmentLink = getDepartmentLink(
                majorAssigneeId,
                assignorDepartmentId
              );
              return (
                <React.Fragment>
                  {username && businessName && (
                    <li
                      key={index}
                      onClick={() => {
                        window.location.href = departmentLink;
                        onNotificationClick(id);
                      }}
                    >
                      <span style={{ color: "red" }}>{username}</span> has
                      edited the notes for Business Name:
                      <span style={{ color: "red" }}>{businessName}</span>
                    </li>
                  )}
                </React.Fragment>
              );
            })}
          </ul>
        </React.Fragment>
      )}
    </div>
  );
};

export default NotesNotification;
