import React, { useState } from "react";
import { Grid, TextField, MenuItem, Button } from "@material-ui/core";
import "../../styles/Forms/customforms.css";
import axios from "axios";
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

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    try {
      const response = await axios.post("/api/your-endpoint", formData);
      console.log("Data submitted successfully:", response.data);
      // Clear the form after submission
      setFormData({
        price: "",
        advanceprice: "",
      });
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const formStyle = {
    whiteSpace: "pre-line",
  };

  return (
    <div className="styleform">
      <form onSubmit={handleSubmit}>
        {/* Add onSubmit to the form element */}
        <Grid container spacing={2}>
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
        <div className="formbtn">
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TicketDetails;
