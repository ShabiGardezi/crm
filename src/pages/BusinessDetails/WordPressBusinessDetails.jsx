import React, { useState } from "react";
import { Grid, TextField } from "@material-ui/core";
import "../../styles/Forms/customforms.css";

const WordPressBusinessDetails = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    WebsiteURL: "",
    country: "",
    state: "",
    street: "",
    zipcode: "",
    businessNumber: "",
    clientEmail: "",
    ReferralWebsite: "",
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
            label="Website URL"
            fullWidth
            name="WebsiteURL"
            value={formData.WebsiteURL}
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
            label="Client Email"
            fullWidth
            name="clientEmail"
            value={formData.clientEmail}
            onChange={handleChange}
            multiline
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Referral Website"
            fullWidth
            name="ReferralWebsite"
            value={formData.ReferralWebsite}
            onChange={handleChange}
            multiline
          />
        </Grid>
        <Grid item xs={6}>
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

export default WordPressBusinessDetails;
