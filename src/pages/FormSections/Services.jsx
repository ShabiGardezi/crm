import React, { useState } from "react";
import { Grid, TextField } from "@material-ui/core";
import "../../styles/Forms/customforms.css";

const Services = () => {
  const [formData, setFormData] = useState({
    keywords: "",
    webUrl: "",
    loginCredentials: "",
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
            label="Service name"
            fullWidth
            name="serviceName"
            value={formData.serviceName}
            onChange={handleChange}
            multiline
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Service description"
            fullWidth
            name="serviceDescription"
            value={formData.serviceDescription}
            onChange={handleChange}
            multiline
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Service quantity"
            fullWidth
            name="serviceQuantity"
            value={formData.serviceQuantity}
            onChange={handleChange}
            multiline
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Service price"
            fullWidth
            name="servicePrice"
            value={formData.servicePrice}
            onChange={handleChange}
            multiline
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Services;
