import "../../styles/Forms/formsCommon.css";
import React, { useState } from "react";
import { Grid, TextField, Button, MenuItem } from "@material-ui/core";
import axios from "axios"; // Import Axios for making API requests

const CustomDevelopment = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    priorityLevel: "",
    assignor: user?.username || "",
    dueDate: new Date().toISOString().substr(0, 10), // Initialize with the current date in yyyy-mm-dd format
    keywords: "",
    webUrl: "",
    loginCredentials: "",
    price: "",
    advanceprice: "",
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

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    try {
      // Make an Axios request here (replace with your actual API endpoint)
      const response = await axios.post("/api/submit", formData);

      // Handle the response as needed (e.g., show a success message)
      console.log("Success:", response.data);

      // Clear the form after successful submission
      setFormData({
        priorityLevel: "",
        assignor: user?.username || "",
        dueDate: new Date().toISOString().substr(0, 10), // Initialize with the current date in yyyy-mm-dd format
        keywords: "",
        webUrl: "",
        loginCredentials: "",
        price: "",
        advanceprice: "",
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
              label="Price"
              fullWidth
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Advance"
              fullWidth
              name="advanceprice"
              value={formData.advanceprice}
              onChange={handleChange}
            />
          </Grid>
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
          <Grid container spacing={2}>
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
            <Grid item xs={6}>
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
          </Grid>

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
        <div className="formbtn">
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomDevelopment;
