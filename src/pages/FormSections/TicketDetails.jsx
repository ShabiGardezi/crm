import React, { useState } from "react";
import { Grid, TextField, MenuItem } from "@material-ui/core";
import "../../styles/Forms/customforms.css";

const TicketDetails = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    priorityLevel: "",
    assignor: user?.username || "",
    dueDate: new Date().toISOString().substr(0, 10), // Initialize with the current date in yyyy-mm-dd format
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const formStyle = {
    whiteSpace: "pre-line",
  };

  return (
    <div className="styleform">
      <Grid container spacing={2}>
        {/* <Grid item xs={12}>
          <Typography variant="h6">Ticket Details</Typography>
        </Grid> */}
        <Grid item xs={6}>
          <TextField
            label="Priority Level"
            fullWidth
            name="priorityLevel"
            value={formData.priorityLevel}
            onChange={handleChange}
            select
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Moderate">Moderate</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Assignor"
            fullWidth
            name="assignor"
            value={formData.assignor}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6} style={formStyle}>
          <TextField
            label="Deadline"
            fullWidth
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            type="date"
            defaultValue={new Date()}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default TicketDetails;
