import React, { useState, useEffect } from "react";
import "../../styles/globalfont.css";
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

const ReviewsForm = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [departments, setDepartments] = useState([]);
  const [remainingPrice, setRemainingPrice] = useState(0); // Initialize remainingPrice
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientSuggestions, setClientSuggestions] = useState([]);

  const [formData, setFormData] = useState({
    priorityLevel: "",
    assignor: user?.username || "",
    dueDate: new Date().toISOString().substr(0, 10), // Initialize with the current date in yyyy-mm-dd format
    webUrl: "",
    price: "",
    advanceprice: "",
    clientName: "",
    street: "",
    WebsiteURL: "",
    businessNumber: "",
    clientEmail: "",
    socialProfile: "",
    gmbUrl: "",
    facebookURL: "",
    noOfreviewsGMB: "",
    logincredentials: "",
    notes: "",
    supportPerson: "",
    closer: "",
    fronter: "",
    noOfreviews: "",
  });
  console.log(formData);
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
      // Make an Axios POST request to your backend API
      const selectedDepartment = departments.find(
        (department) =>
          department.name === "Social Media / Customer Reviews Management"
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
          serviceName: formData.serviceName,
          WebsiteURL: formData.WebsiteURL,
          clientEmail: formData.clientEmail,
          socialProfile: formData.socialProfile,
          gmbUrl: formData.gmbUrl,
          facebookURL: formData.facebookURL,
          noOfreviewsGMB: formData.noOfreviewsGMB,
          logincredentials: formData.logincredentials,
          notes: formData.notes,
          noOfreviews: formData.noOfreviews,
        },
        quotation: {
          price: formData.price,
          advanceprice: formData.advanceprice,
          remainingPrice: formData.remainingPrice,
        },
        TicketDetails: {
          assignor: formData.assignor,
          priority: formData.priorityLevel,
          supportPerson: formData.supportPerson,
          fronter: formData.fronter,
          closer: formData.closer,
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
  // Function to fetch suggestions as the user types
  const fetchSuggestions = async (query) => {
    if (query.trim() === "") {
      setClientSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/api/client/suggestions?query=${query}`
      );
      setClientSuggestions(response.data);
    } catch (error) {
      console.log(error);
      console.error("Error fetching suggestions:", error);
    }
  };
  // Function to fetch client details when a suggestion is selected
  const handleClientSelection = async (clientName) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/client/details/${clientName}`
      );
      setSelectedClient(response.data);
      console.log(response.data);
      setFormData({
        ...formData,
        businessNumber: response.data.businessNumber,
        clientEmail: response.data.clientEmail,
        clientName: response.data.clientName,
        socialProfile: response.data.socialProfile,
        facebookURL: response.data.facebookURL,
        gmbUrl: response.data.gmbUrl,
        noOfreviewsGMB: response.data.noOfreviewsGMB,
        WebsiteURL: response.data.WebsiteURL,
        noOfreviews: response.data.noOfreviews,
      });
      setClientSuggestions([]);
    } catch (error) {
      console.error("Error fetching client details:", error);
    }
  };
  return (
    <div className="styleform">
      <Header />
      <form onSubmit={handleSubmit}>
        <div className="ticketHeading">
          <Typography variant="h5">Customers</Typography>
        </div>
        <Grid container spacing={3}>
          <Grid item xs={5}>
            <TextField
              label="Client/Business Name"
              fullWidth
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              multiline
              onInput={(e) => fetchSuggestions(e.target.value)}
            />

            {/* Display client suggestions as a dropdown */}
            {clientSuggestions.length > 0 && (
              <div className="scrollable-suggestions">
                <ul>
                  {clientSuggestions.map((client, index) => (
                    <li
                      key={index}
                      onClick={() => handleClientSelection(client.clientName)}
                      className="pointer-cursor" // Apply the CSS class here
                    >
                      {client.clientName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Grid>
          <Grid item xs={5}>
            <TextField
              label="Business Email"
              fullWidth
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              multiline
            />
          </Grid>
        </Grid>
        <div className="formtitle ticketHeading">
          <Typography variant="h5">Sale Department</Typography>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <TextField
              label="Assignor"
              fullWidth
              name="assignor"
              value={formData.assignor}
              onChange={handleChange}
              disabled
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Support Person"
              fullWidth
              name="supportPerson"
              value={formData.supportPerson}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Closer Person"
              fullWidth
              name="closer"
              value={formData.closer}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Fronter"
              fullWidth
              name="fronter"
              value={formData.fronter}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <div className="formtitle ticketHeading">
          <Typography variant="h5">Customer Reviews Form</Typography>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={2}>
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
          <Grid item xs={2}>
            <TextField
              label="Select Department"
              fullWidth
              name="department"
              value={"Social Media / Customer Reviews Management"}
              onChange={handleChange}
              select
              disabled
            >
              {departments?.map((d) => (
                <MenuItem key={d._id} value={d.name}>
                  {d.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={2}>
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
          <Grid item xs={2}>
            <TextField
              label="Price"
              fullWidth
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Advance"
              fullWidth
              name="advanceprice"
              value={formData.advanceprice}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={2}>
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
        <div className="ticketHeading">
          <Typography variant="h5">Business Details</Typography>
        </div>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <TextField
              label="Service name"
              fullWidth
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Facebook URL"
              fullWidth
              name="facebookURL"
              value={formData.facebookURL}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="No. Of FB Reviews"
              fullWidth
              name="noOfreviews"
              value={formData.noOfreviews}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="GMB URL"
              fullWidth
              name="gmbUrl"
              value={formData.gmbUrl}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="No.Of GMB Reviews"
              fullWidth
              name="noOfreviewsGMB"
              value={formData.noOfreviewsGMB}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Website URL"
              fullWidth
              name="WebsiteURL"
              value={formData.WebsiteURL}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Social Profile"
              fullWidth
              name="socialProfile"
              value={formData.socialProfile}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Likes/Followers"
              fullWidth
              name="LikesFollowers"
              value={formData.LikesFollowers}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Login Credentials"
              fullWidth
              name="logincredentials"
              value={formData.logincredentials}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={3}>
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

export default ReviewsForm;
