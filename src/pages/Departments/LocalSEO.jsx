import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
} from "@material-ui/core";
import axios from "axios"; // Import Axios for making API requests
import "../../styles/Forms/customforms.css";
import Header from "../Header";
import toast from "react-hot-toast";
const LocalSEOForm = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [departments, setDepartments] = useState([]);
  const [remainingPrice, setRemainingPrice] = useState(0); // Initialize remainingPrice

  const [formData, setFormData] = useState({
    priorityLevel: "",
    assignor: user?.username || "",
    dueDate: new Date().toISOString().substr(0, 10), // Initialize with the current date in yyyy-mm-dd format
    keywords: "",
    webUrl: "",
    loginCredentials: "",
    price: "",
    advanceprice: "",
    remainingPrice: "",
    clientName: "",
    street: "",
    WebsiteURL: "",
    country: "",
    state: "",
    zipcode: "",
    businessNumber: "",
    clientEmail: "",
    businessHours: "",
    socialProfile: "",
    gmbUrl: "",
    workStatus: "",
    notes: "",
    department: "",
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
    if (name === "workStatus") {
      // Log the selected value for debugging
      console.log("Selected workStatus:", value);

      // Update the state
      setFormData({
        ...formData,
        [name]: value,
      });
    }
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
      // Find the selected department object
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
        department: formData.department,
        businessdetails: {
          clientName: formData.clientName,
          street: formData.street,
          WebsiteURL: formData.WebsiteURL,
          country: formData.country,
          state: formData.state,
          zipcode: formData.zipcode,
          businessNumber: formData.businessNumber,
          clientEmail: formData.clientEmail,
          businessHours: formData.businessHours,
          socialProfile: formData.socialProfile,
          gmbUrl: formData.gmb,
          workStatus: formData.workStatus,
          notes: formData.notes,
        },
        quotation: {
          price: formData.price,
          advanceprice: formData.advanceprice,
          remainingPrice: formData.remainingPrice,
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
        <Typography variant="h5">Local SEO Form</Typography>
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
              name="remainingPrice"
              value={remainingPrice} // Display the calculated remaining price
              InputProps={{
                readOnly: true, // Make this field read-only
              }}
            />
          </Grid>
        </Grid>

        <div className="ticketHeading">
          <Typography variant="h5">Business Details</Typography>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Client/Business Name"
              fullWidth
              name="clientName"
              value={formData.clientName}
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
              select
            >
              <MenuItem value="GMB Full Optimization">
                GMB Full Optimization
              </MenuItem>
              <MenuItem value="GMB Off Page">GMB Off Page</MenuItem>
            </TextField>
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
        </Grid>
        {/* Add more fields as needed */}
        <div className="formbtn">
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LocalSEOForm;
