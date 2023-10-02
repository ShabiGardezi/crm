import React, { useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Header from "./Header";

const CreateTicketForm = () => {
  const [formData, setFormData] = useState({
    data: {},
    created_by: "",
    majorAssignee: "",
    status: "Not Started Yet",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    // Implement the logic to send a POST request to your server with formData
    // You can use axios or fetch to make the API call
    // Example:
    // axios.post("http://localhost:5000/api/tickets", formData)
    //   .then((response) => {
    //     // Handle success
    //   })
    //   .catch((error) => {
    //     // Handle error
    //   });
  };

  return (
    <div>
      <Header />
      <h2>Create New Ticket</h2>
      <form>
        <TextField
          label="Data"
          name="data"
          value={formData.data}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Created By"
          name="created_by"
          value={formData.created_by}
          onChange={handleChange}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select name="status" value={formData.status} onChange={handleChange}>
            <MenuItem value="Not Started Yet">Not Started Yet</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
        {/* Add a similar dropdown for 'majorAssignee' using data from your API */}
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Create Ticket
        </Button>
      </form>
    </div>
  );
};

export default CreateTicketForm;
