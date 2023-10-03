import React, { useState } from "react";
import {
  Typography,
  Container,
  Grid,
  TextField,
  Button,
  Paper,
  MenuItem,
} from "@mui/material";
import Header from "../Header";
import "../../styles/formsCommon.css";

const PaidMarketing = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    adAccountAccess: "",
    dailyBudget: "",
    location: "",
    website: "",
    comments: "",
    price: "",
    advanceprice: "",
    assignor: user?.username || "",
    priorityLevel: "",
    dueDate: new Date().toISOString().substr(0, 10), // Initialize with the current date in yyyy-mm-dd format
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here, you can send the formData to your server or perform other actions.
    console.log(formData);
  };

  const formStyle = {
    whiteSpace: "pre-line",
  };

  const giveDetailsStyle = {
    width: "100%", // Set the width to 100% for full width
    // minHeight: "250px", // Set the minimum height to make it taller
  };

  return (
    <>
      <Header />
      <Container maxWidth="md">
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Typography variant="h5" gutterBottom>
            Paid Marketing Form
          </Typography>
          <div className="description">
            <h5>Please fill the form to generate ticket.</h5>
          </div>
          <form onSubmit={handleSubmit}>
            <Grid item xs={12}>
              <Typography variant="h6">Quotation</Typography>
            </Grid>
            <Grid item xs={6} style={formStyle}>
              <TextField
                label="Price"
                fullWidth
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6} style={formStyle}>
              <TextField
                label="Advance"
                fullWidth
                name="advanceprice"
                value={formData.advanceprice}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Ticket Details</Typography>
            </Grid>
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
            <Grid container spacing={3}>
              {/* Ad Account Access */}
              <Grid item xs={12} style={formStyle}>
                <TextField
                  label="Ad Account Access"
                  fullWidth
                  name="adAccountAccess"
                  value={formData.adAccountAccess}
                  onChange={handleChange}
                  multiline
                />
              </Grid>

              {/* Daily Budget */}
              <Grid item xs={12} style={formStyle}>
                <TextField
                  label="Daily Budget"
                  fullWidth
                  name="dailyBudget"
                  value={formData.dailyBudget}
                  onChange={handleChange}
                  multiline
                />
              </Grid>

              {/* Location */}
              <Grid item xs={12} style={formStyle}>
                <TextField
                  label="Location"
                  fullWidth
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  multiline
                />
              </Grid>

              {/* Website */}
              <Grid item xs={12} style={formStyle}>
                <TextField
                  label="Website"
                  fullWidth
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
            </Grid>

            {/* Comment Section */}
            <Grid item xs={12} style={formStyle}>
              <Typography variant="h6" style={{ marginTop: "20px" }}>
                What Client's Want
              </Typography>
              <TextField
                label="Give Details"
                fullWidth
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                multiline
                style={giveDetailsStyle} // Apply custom styles for width and height
              />
            </Grid>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: "20px" }}
            >
              Submit
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default PaidMarketing;
