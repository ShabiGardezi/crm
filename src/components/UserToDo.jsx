import React from "react";
import Navbar from "../pages/ToDoList/Navbar";
import AddToDo from "../pages/ToDoList/AddToDo";
import ToDos from "../pages/ToDoList/ToDos";
import ToDoContext from "../context/ToDoContext";
import Header from "../pages/Header";
import { Card, CardContent, Typography } from "@material-ui/core"; // Import Material-UI components
import "../styles/ToDoList/ToDoList.css";

const UserToDo = ({ wrapInCard, showHeader }) => {
  if (wrapInCard) {
    return (
      <>
        <div className="ticketHeading">
          <Typography variant="h5">Personal Notebook</Typography>
        </div>
        {showHeader && <Header />} {/* Conditionally render the Header */}
        <div className="todolists">
          <ToDoContext>
            <Card variant="outlined">
              <CardContent>
                <Navbar />
                <AddToDo />
                <ToDos />
              </CardContent>
            </Card>
          </ToDoContext>
        </div>
      </>
    );
  } else {
    return (
      <>
        {showHeader && <Header />}
        <div className="todolists">
          <ToDoContext>
            <Navbar />
            <AddToDo />
            <ToDos />
          </ToDoContext>
        </div>
      </>
    );
  }
};

export default UserToDo;
