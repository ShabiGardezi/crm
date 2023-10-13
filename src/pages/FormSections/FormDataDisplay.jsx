import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TicketShortInfo from "../Tickets/TicketShortInfo";
import "../../styles/Tickets/ticketInfo.css";
import Header from "../Header";
import axios from "axios";
import "../../styles/Forms/customforms.css";

const FormDataDisplay = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [ticketData, setTicketData] = useState([]);

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        // Make an API request to get the actual ticket data for the logged-in user
        const response = await axios.get(
          `http://localhost:5000/api/tickets?departmentId=${user?.department?._id}`
        );
        setTicketData(response.data.payload);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTicketData();
  }, [user.department._id]);
  const renderFields = (data) => {
    return Object.entries(data).map(([key, value]) => (
      <div key={key} className="displayFields">
        <Typography variant="subtitle2">{key}:</Typography>
        <div>
          <Typography>{value}</Typography>
        </div>
      </div>
    ));
  };

  const renderTicket = (ticket) => (
    <Accordion key={ticket._id}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1" className="ticketHeading">
          {ticket.businessdetails.clientName}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="subtitle1" className="ticketHeading">
          Ticket Details
        </Typography>
        {renderFields(ticket.TicketDetails)}
        <Typography variant="subtitle1" className="ticketHeading">
          Services
        </Typography>
        {renderFields(ticket.Services)}
        <Typography variant="subtitle1" className="ticketHeading">
          Business Details
        </Typography>
        {renderFields(ticket.businessdetails)}
      </AccordionDetails>
    </Accordion>
  );

  return (
    <div>
      <Header />
      <TicketShortInfo />
      <div className="submittedCard">
        <Paper elevation={3} style={{ padding: "20px", margin: "20px" }}>
          <Typography variant="h5" gutterBottom>
            Tickets Data for {user.department.name}
          </Typography>
          {ticketData.map((ticket) => renderTicket(ticket))}
        </Paper>
      </div>
    </div>
  );
};

export default FormDataDisplay;
