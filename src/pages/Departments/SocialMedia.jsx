import React, { useState } from "react";
import {
  Typography,
  Container,
  Grid,
  TextField,
  Button,
  Paper,
} from "@mui/material";
//create field for image upload and on handle it on handleSubmit function
const SocialMediaForm = () => {
  const [formData, setFormData] = useState({
    ProfilePhotos: "",
    coverPhoto: "",
    services: "",
    serviceAreas: "",
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
    monthlyBlogsRequirement: "",
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
  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: "20px" }}>
        <Typography variant="h5" gutterBottom>
          Social Media Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Add more fields for SEO Information */}

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
                name="BlogsRequirement"
                value={formData.monthlyBlogsRequirement}
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
  );
};

export default SocialMediaForm;
