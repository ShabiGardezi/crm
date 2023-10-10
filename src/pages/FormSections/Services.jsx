import React from "react";
import { Grid, TextField, Button } from "@material-ui/core";
import "../../styles/Forms/customforms.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

const Services = () => {
  const dispatch = useDispatch();

  const formData = useSelector((state) => state.form);

  const handleChange = (event) => {
    const { name, value } = event.target;

    dispatch({
      type: "UPDATE_FORM_DATA",
      payload: {
        name,
        value,
      },
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    try {
      // Make an Axios POST request to your backend API
      // const response = await axios.post("/api/your-endpoint", formData);

      // Handle the response (e.g., show a success message)
      // console.log("Data submitted successfully:", response.data);

      // Clear the form after submission
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
        <div className="formbtn">
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Services;
