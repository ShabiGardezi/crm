import React, { useState } from "react";
import { Grid, TextField } from "@mui/material";
import "../../styles/Forms/customforms.css";

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

  return (
    <div className="styleform">
      <Grid container spacing={2}>
        {/* <Grid item xs={12}>
        <Typography variant="h6">Business Details</Typography>
      </Grid> */}

        <Grid item xs={6}>
          <TextField
            label="Client Name"
            fullWidth
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            multiline
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Street"
            fullWidth
            name="street"
            value={formData.street}
            onChange={handleChange}
            multiline
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Country"
            fullWidth
            name="country"
            value={formData.country}
            onChange={handleChange}
            multiline
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="State"
            fullWidth
            name="state"
            value={formData.state}
            onChange={handleChange}
            multiline
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="ZipCode"
            fullWidth
            name="zipcode"
            value={formData.zipcode}
            onChange={handleChange}
            multiline
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Business Number"
            fullWidth
            name="businessNumber"
            value={formData.businessNumber}
            onChange={handleChange}
            multiline
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Business Email"
            fullWidth
            name="clientEmail"
            value={formData.clientEmail}
            onChange={handleChange}
            multiline
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Business Hours"
            fullWidth
            name="businessHours"
            value={formData.businessHours}
            onChange={handleChange}
            multiline
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Social Profile"
            fullWidth
            name="socialProfile"
            value={formData.socialProfile}
            onChange={handleChange}
            multiline
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="GMB Url"
            fullWidth
            name="gmbUrl"
            value={formData.gmbUrl}
            onChange={handleChange}
            multiline
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Work Status"
            fullWidth
            name="workStatus"
            value={formData.workStatus}
            onChange={handleChange}
            multiline
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Blog Requirement"
            fullWidth
            name="monthlyBlogsRequirement"
            value={formData.monthlyBlogsRequirement}
            onChange={handleChange}
            multiline
          />
        </Grid>
        <Grid item xs={6}>
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
    </div>
  );
};

export default BusinessDetailsComponent;
