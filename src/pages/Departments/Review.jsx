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

const Reviews = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    services: "",
    serviceAreas: "",
    websitelink: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    businessNumber: "",
    clientEmail: "",
    socialProfile: "",
    clientName: "",
    businessHours: "",
    gmbUrl: "",
    workStatus: "",
    dailybudget: "",
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
            Customer Reviews Form
          </Typography>
          <div className="description">
            <h5>Please fill the form to generate ticket.</h5>
          </div>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Add more fields for SEO Information */}
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
              {/* Services */}
              <Grid item xs={12}>
                <Typography variant="h6">Services</Typography>
              </Grid>
              <Grid item xs={6} style={formStyle}>
                <TextField
                  label="Services"
                  fullWidth
                  name="services"
                  value={formData.services}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
              <Grid item xs={6} style={formStyle}>
                <TextField
                  label="Service Areas"
                  fullWidth
                  name="serviceAreas"
                  value={formData.serviceAreas}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
              <Grid item xs={6} style={formStyle}>
                <TextField
                  label="Code Mails With Different Domains"
                  fullWidth
                  name="codemails"
                  value={formData.codemails}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
              {/* Business Details */}
              <Grid item xs={12}>
                <Typography variant="h6">Business Details</Typography>
              </Grid>
              <Grid item xs={6} style={formStyle}>
                <TextField
                  label="Client Name"
                  fullWidth
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
              <Grid item xs={6} style={formStyle}>
                <TextField
                  label="Street"
                  fullWidth
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
              <Grid item xs={6} style={formStyle}>
                <TextField
                  label="Country"
                  fullWidth
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
              <Grid item xs={6} style={formStyle}>
                <TextField
                  label="State"
                  fullWidth
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
              <Grid item xs={6} style={formStyle}>
                <TextField
                  label="ZipCode"
                  fullWidth
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
              <Grid item xs={6} style={formStyle}>
                <TextField
                  label="Business Number"
                  fullWidth
                  name="businessNumber"
                  value={formData.businessNumber}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
              <Grid item xs={6} style={formStyle}>
                <TextField
                  label="Business Email"
                  fullWidth
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
              <Grid item xs={6} style={formStyle}>
                <TextField
                  label="Business Hours"
                  fullWidth
                  name="businessHours"
                  value={formData.businessHours}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
              <Grid item xs={6} style={formStyle}>
                <TextField
                  label="GMB Url"
                  fullWidth
                  name="gmbUrl"
                  value={formData.gmbUrl}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
              <Grid item xs={6} style={formStyle}>
                <TextField
                  label="Work Status"
                  fullWidth
                  name="workStatus"
                  value={formData.workStatus}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
              <Grid item xs={6} style={formStyle}>
                <TextField
                  label="Daily Budget"
                  fullWidth
                  name="dailybudget"
                  value={formData.dailybudget}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
              <Grid item xs={6} style={formStyle}>
                <TextField
                  label="Social Profile Link"
                  fullWidth
                  name="socialProfile"
                  value={formData.socialProfile}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
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
              {/* Add more fields for Business Details */}
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

export default Reviews;
