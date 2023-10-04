import React, { useState } from "react";
import { Grid, TextField } from "@material-ui/core";
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

  return (
    <div className="styleform">
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
    </div>
  );
};

export default PaidMarketingBusinessDetails;
