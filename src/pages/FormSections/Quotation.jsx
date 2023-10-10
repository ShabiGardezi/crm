import React, { useState } from "react";
import { Grid, TextField, Button } from "@material-ui/core";
import axios from "axios"; // Import Axios

import "../../styles/Forms/customforms.css";

const QuotationComponent = () => {
  const [formData, setFormData] = useState({
    price: "",
    advanceprice: "",
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
      const response = await axios.post("/api/your-endpoint", formData);
      console.log("Data submitted successfully:", response.data);
      // Clear the form after submission
      setFormData({
        price: "",
        advanceprice: "",
      });
    } catch (error) {
      // Handle errors (e.g., show an error message)
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="styleform">
      <form onSubmit={handleSubmit}>
        {/* Add onSubmit to the form element */}
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

export default QuotationComponent;
