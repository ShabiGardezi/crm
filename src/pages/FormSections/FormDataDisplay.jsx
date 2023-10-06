import React from "react";
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
const FormDataDisplay = ({ departmentData }) => {
  // Dummy data for each section (replace with actual data)
  const dummyData = {
    name: "Local SEO / GMB Optimization",
    quotation: {
      price: "$500",
      advanceprice: "$100",
    },
    ticketdetails: {
      priorityLevel: "High",
      assignor: "John Doe",
      dueDate: "2023-12-31",
    },
    services: {
      keywords: "SEO, GMB",
      webUrl: "https://example.com",
      loginCredentials: "username:password",
    },
    businessDetails: {
      clientName: "Client ABC",
      street: "123 Main St",
      WebsiteURL: "https://clientabc.com",
      country: "USA",
      state: "CA",
      zipcode: "12345",
      businessNumber: "123-456-7890",
      clientEmail: "client@example.com",
      businessHours: "9:00 AM - 5:00 PM",
      socialProfile: "https://facebook.com/clientabc",
      gmbUrl: "https://gmb.example.com",
      workStatus: "In Progress",
      notes: "This is a note about the client.",
    },
  };

  // If departmentData is not provided, use dummy data
  const dataToDisplay = departmentData || dummyData;

  // Function to render fields for a department
  const renderFields = (sectionName, sectionData) => {
    if (!sectionData) {
      return null; // Return null if the section data is missing
    }

    return (
      <Grid container spacing={2}>
        {Object.keys(sectionData).map((fieldName) => (
          <Grid item xs={12} key={fieldName}>
            <Typography variant="subtitle2">{fieldName}:</Typography>
            <Typography>{sectionData[fieldName]}</Typography>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <div>
      <Header />
      <TicketShortInfo />
      <div className="submittedCard">
        <Paper elevation={3} style={{ padding: "20px", margin: "20px" }}>
          <Typography variant="h5" gutterBottom>
            Submitted Data for {dataToDisplay.name}
          </Typography>

          {/* Render Quotation section */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Quotation Data</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {renderFields("quotation", dataToDisplay.quotation)}
            </AccordionDetails>
          </Accordion>

          {/* Render Ticket Details section */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Ticket Details Data</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {renderFields("ticketdetails", dataToDisplay.ticketdetails)}
            </AccordionDetails>
          </Accordion>

          {/* Render Services section */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Services Data</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {renderFields("services", dataToDisplay.services)}
            </AccordionDetails>
          </Accordion>

          {/* Render Business Details section */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Business Details Data</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {renderFields("businessDetails", dataToDisplay.businessDetails)}
            </AccordionDetails>
          </Accordion>
        </Paper>
      </div>
    </div>
  );
};

export default FormDataDisplay;
