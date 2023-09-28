import React, { useState } from "react";
import {
  Typography,
  Container,
  Grid,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import Header from "../Header";

const PaidMarketing = () => {
  const [formData, setFormData] = useState({
    adAccountAccess: "",
    dailyBudget: "",
    location: "",
    website: "",
    comments: "",
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
          <form onSubmit={handleSubmit}>
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
