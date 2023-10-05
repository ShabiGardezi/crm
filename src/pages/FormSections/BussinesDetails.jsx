import React, { useState } from "react";
import { Grid, TextField, Button } from "@mui/material";
import "../../styles/Forms/customforms.css";
import axios from "axios";
const BusinessDetailsComponent = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    street: "",
    country: "",
    state: "",
    zipcode: "",
    businessNumber: "",
    clientEmail: "",
    businessHours: "",
    socialProfile: "",
    gmbUrl: "",
    workStatus: "",
    monthlyBlogsRequirement: "",
    comments: "",
    notes: "",
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
      // Make an Axios POST request to your backend API
      const response = await axios.post("/api/your-endpoint", formData);

      // Handle the response (e.g., show a success message)
      console.log("Data submitted successfully:", response.data);

      // Clear the form after submission
      setFormData({
        clientName: "",
        street: "",
        country: "",
        state: "",
        zipcode: "",
        businessNumber: "",
        clientEmail: "",
        businessHours: "",
        socialProfile: "",
        gmbUrl: "",
        workStatus: "",
        monthlyBlogsRequirement: "",
        comments: "",
        notes: "",
      });
    } catch (error) {
      // Handle errors (e.g., show an error message)
      console.error("Error submitting data:", error);
    }
  };
  const formStyle = {
    whiteSpace: "pre-line",
  };
  return (
    <div className="styleform">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
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
              label="Social Profile"
              fullWidth
              name="socialProfile"
              value={formData.socialProfile}
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
              label="Blog Requirement"
              fullWidth
              name="monthlyBlogsRequirement"
              value={formData.monthlyBlogsRequirement}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={6} style={formStyle}>
            <TextField
              label="What Client Wants?"
              fullWidth
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
            />
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default BusinessDetailsComponent;
