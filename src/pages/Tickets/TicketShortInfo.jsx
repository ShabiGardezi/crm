import React, { useState } from "react";
import { Typography, Grid, TextField, MenuItem } from "@mui/material";
import "../../styles/Tickets/TicketShortInfo.css";
const statuses = ["Pending", "In Progress", "Completed", "Blockage"];

function TicketShortInfo() {
  const [ticketStatus, setTicketStatus] = useState("Pending");

  // Dummy data
  const ticket = {
    id: 1,
    assignor: "John Doe",
    assignedTo: "Jane Doe",
    details: "This is a sample ticket.",
    status: "Pending", // Make sure it matches one of the statuses in the dropdown
    deadline: "25-10-23",
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <div className="ticketinfo">
          <Typography variant="h5">Ticket Information</Typography>
        </div>
      </Grid>
      <Grid item xs={6} className="styleTicketcard">
        <TextField label="Ticket ID" fullWidth value={ticket.id} disabled />
      </Grid>
      <Grid item xs={6} className="styleTicketcard">
        <TextField
          label="Assignor"
          fullWidth
          value={ticket.assignor}
          disabled
        />
      </Grid>
      <Grid item xs={6} className="styleTicketcard">
        <TextField
          label="Assigned To"
          fullWidth
          value={ticket.assignedTo}
          disabled
        />
      </Grid>
      <Grid item xs={6} className="styleTicketcard">
        <TextField
          label="Deadline"
          fullWidth
          value={ticket.deadline}
          disabled
        />
      </Grid>
      <Grid item xs={6} className="styleTicketcard">
        <TextField
          label="Ticket Details"
          fullWidth
          multiline
          value={ticket.details}
          disabled
        />
      </Grid>
      <Grid item xs={6} className="styleTicketcard">
        <TextField
          label="Ticket Status"
          select
          fullWidth
          value={ticketStatus}
          onChange={(e) => setTicketStatus(e.target.value)}
        >
          {statuses.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
}

export default TicketShortInfo;
