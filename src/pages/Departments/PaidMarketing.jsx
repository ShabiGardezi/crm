import React, { useState, useEffect } from "react";
import "../../styles/Forms/formsCommon.css";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import Header from "../Header";
import toast from "react-hot-toast";
const PaidMarketing = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [departments, setDepartments] = useState([]);
  const [remainingPrice, setRemainingPrice] = useState(0); // Initialize remainingPrice

  const [formData, setFormData] = useState({
    priorityLevel: "",
    assignor: user?.username || "",
    dueDate: new Date().toISOString().substr(0, 10), // Initialize with the current date in yyyy-mm-dd format
    price: "",
    advanceprice: "",
    remainingPrice: "",
    serviceName: "",
    serviceDescription: "",
    serviceQuantity: "",
    servicePrice: "",
    adAccountAccess: "",
    dailyBudget: "",
    location: "",
    website: "",
    notes: "",
    clientName: "",
    clientEmail: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    let updatedPrice = parseFloat(formData.price) || 0;
    let updatedAdvancePrice = parseFloat(formData.advanceprice) || 0;

    if (name === "price") {
      updatedPrice = parseFloat(value) || 0;
    } else if (name === "advanceprice") {
      updatedAdvancePrice = parseFloat(value) || 0;
    }

    const remaining = updatedPrice - updatedAdvancePrice;
    setRemainingPrice(remaining);

    setFormData({
      ...formData,
      [name]: value,
      remainingPrice: remaining, // Update remainingPrice in formData
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    try {
      // Make an Axios request here (replace "/api/submit" with your actual API endpoint)
      console.log(formData);
      const selectedDepartment = departments.find(
        (department) => department.name === formData.department
      );

      // Set majorAssignee to the department's ID
      const majorAssignee = selectedDepartment ? selectedDepartment._id : null;

      const response = await axios.post(`http://localhost:5000/api/tickets`, {
        dueDate: formData.dueDate,
        majorAssignee: majorAssignee,
        created_by: user._id,
        assignorDepartment: user.department._id,
        businessdetails: {
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          location: formData.location,
          website: formData.website,
          adAccountAccess: formData.adAccountAccess,
          dailyBudget: formData.dailyBudget,
          notes: formData.notes,
        },
        Services: {
          serviceName: formData.serviceName,
          serviceDescription: formData.serviceDescription,
          serviceQuantity: formData.serviceQuantity,
          servicePrice: formData.servicePrice,
        },
        quotation: {
          price: formData.price,
          advanceprice: formData.advanceprice,
        },
        TicketDetails: {
          assignor: formData.assignor,
          priority: formData.priorityLevel,
        },
      });

      // Handle the response as needed (e.g., show a success message)
      toast.success("Form submitted successfully!");
      console.log("Success:", response);
    } catch (error) {
      // Handle errors (e.g., show an error message)
      toast.error("An error occurred. Please try again.");
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/departments`
        );
        setDepartments(response.data.payload);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDepartments();
  }, []);
  return (
    <div className="styleform">
      <Header />
      <div className="formtitle">
        <Typography variant="h5">Paid Marketing Form</Typography>
      </div>
      <form onSubmit={handleSubmit}>
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
              label="Select Department"
              fullWidth
              name="department"
              value={formData.department}
              onChange={handleChange}
              select
            >
              {departments?.map((d) => (
                <MenuItem key={d._id} value={d.name}>
                  {d.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Assignor"
              fullWidth
              name="assignor"
              value={formData.assignor}
              onChange={handleChange}
              disabled
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
          <Grid item xs={6}>
            <TextField
              label="Remaining Price"
              fullWidth
              name="remainingprice"
              value={remainingPrice} // Display the calculated remaining price
              InputProps={{
                readOnly: true, // Make this field read-only
              }}
            />
          </Grid>
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
        <div className="ticketHeading">
          <Typography variant="h5">Business Details</Typography>
        </div>
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

export default PaidMarketing;
