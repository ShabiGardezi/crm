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
const WordPress = () => {
  const [formData, setFormData] = useState({
    profilePhoto: "",
    coverPhoto: "",
    services: "",
    serviceAreas: "",
    businessNumber: "",
    clientEmail: "",
    socialProfile: "",
    clientName: "",
    businessHours: "",
    gmbUrl: "",
    referralwebsite: "",
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
          Wordpress Form
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
                label="Business Name"
                fullWidth
                name="clientName"
                value={formData.clientName}
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
                label="Social Profile Link"
                fullWidth
                name="socialProfile"
                value={formData.socialProfile}
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

export default WordPress;
