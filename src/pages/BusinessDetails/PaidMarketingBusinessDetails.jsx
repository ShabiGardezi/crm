import React, { useState } from "react";
import { Grid, TextField, Button } from "@material-ui/core";
import axios from "axios"; // Import Axios for making API requests
import "../../styles/Forms/customforms.css";

const PaidMarketingBusinessDetails = () => {
  const [formData, setFormData] = useState({
    adAccountAccess: "",
    dailyBudget: "",
    location: "",
    website: "",
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
      // Make an Axios request here (replace "/api/submit" with your actual API endpoint)
      const response = await axios.post("/api/submit", formData);

      // Handle the response as needed (e.g., show a success message)
      console.log("Success:", response.data);

      // Clear the form after successful submission
      setFormData({
        adAccountAccess: "",
        dailyBudget: "",
        location: "",
        website: "",
        notes: "",
      });
    } catch (error) {
      // Handle errors (e.g., show an error message)
      console.error("Error:", error);
    }
  };

  return (
    <div className="styleform">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Ad Account Access"
              fullWidth
              name="adAccountAccess"
              value={formData.adAccountAccess}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Daily Budget"
              fullWidth
              name="dailyBudget"
              value={formData.dailyBudget}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Location"
              fullWidth
              name="location"
              value={formData.location}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Website"
              fullWidth
              name="website"
              value={formData.website}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Notes"
              fullWidth
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
            />
          </Grid>
          {/* Add more fields as needed */}
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

export default PaidMarketingBusinessDetails;
