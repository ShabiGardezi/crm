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

const WebSeoForm = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("user", user);
  const [departments, setDepartments] = useState([]);
  const [remainingPrice, setRemainingPrice] = useState(0); // Initialize remainingPrice
  const [selectedClient, setSelectedClient] = useState(null);
  const [showNoOfBacklinks, setShowNoOfBacklinks] = useState(false);
  const [showMonthlyBlogs, setShowMonthlyBlogs] = useState(false); // Initialize as hidden
  const [clientSuggestions, setClientSuggestions] = useState([]);
  const [formData, setFormData] = useState({
    priorityLevel: "",
    assignor: user?.username || "",
    dueDate: new Date().toISOString().substr(0, 10), // Initialize with the current date in yyyy-mm-dd format
    webUrl: "",
    loginCredentials: "",
    price: "",
    advanceprice: "",
    remainingPrice: "",
    serviceName: "",
    serviceQuantity: "",
    servicePrice: "",
    clientName: "",
    street: "",
    Keywords: "",
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
    monthlyBlogsRequirement: "",
    LoginCredentials: "",
    SearchConsoleAccess: "",
    GoogleAnalyticsAccess: "",
    fronter: "",
    closer: "",
    supportPerson: "",
    onceService: "",
    noOfBacklinks: "",
  });
  useEffect(() => {
    // Calculate one month later from the current date
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 1);

    setFormData({
      ...formData,
      dueDate: currentDate.toISOString().substr(0, 10),
    });
  }, []);

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

    // Check if the selected service is "Backlinks" to decide whether to show the "No. of Backlinks" TextField
    if (
      name === "workStatus" &&
      (value === "backlinks" ||
        value === "paid-guest" ||
        value === "extra-backlinks")
    ) {
      setShowNoOfBacklinks(true);
    }
    if (name === "workStatus" && value === "Monthly-SEO") {
      setShowMonthlyBlogs(true);
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
      const selectedDepartment = departments.find(
        (department) => department.name === "Website SEO"
      );

      // Set majorAssignee to the department's ID
      const majorAssignee = selectedDepartment ? selectedDepartment._id : null;

      const response = await axios.post(`http://localhost:5000/api/tickets`, {
        dueDate: formData.dueDate,
        majorAssignee: majorAssignee,
        created_by: user._id,
        assignorDepartment: user.department._id,
        businessdetails: {
          serviceName: formData.serviceName,
          serviceQuantity: formData.serviceQuantity,
          servicePrice: formData.servicePrice,
          SearchConsoleAccess: formData.SearchConsoleAccess,
          GoogleAnalyticsAccess: formData.GoogleAnalyticsAccess,
          LoginCredentials: formData.LoginCredentials,
          monthlyBlogsRequirement: formData.monthlyBlogsRequirement,
          clientName: formData.clientName,
          street: formData.street,
          WebsiteURL: formData.WebsiteURL,
          country: formData.country,
          state: formData.street,
          zipcode: formData.zipcode,
          businessNumber: formData.businessNumber,
          clientEmail: formData.clientEmail,
          businessHours: formData.businessHours,
          socialProfile: formData.socialProfile,
          gmbUrl: formData.gmbUrl,
          workStatus: formData.workStatus,
          notes: formData.notes,
          Keywords: formData.Keywords,
          fronter: formData.fronter,
          closer: formData.closer,
          supportPerson: formData.supportPerson,
          onceService: formData.onceService,
          noOfBacklinks: formData.noOfBacklinks,
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
      toast.success("Form submitted successfully!");

      // Handle the response as needed (e.g., show a success message)
      console.log("Success:", response);
    } catch (error) {
      toast.error("An error occurred. Please try again.");

      // Handle errors (e.g., show an error message)
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
      setFormData({
        ...formData,
        businessNumber: response.data.businessNumber,
        clientEmail: response.data.clientEmail,
        clientName: response.data.clientName,
        country: response.data.country,
        state: response.data.state,
        street: response.data.street,
        zipcode: response.data.zipcode,
        socialProfile: response.data.socialProfile,
        businessHours: response.data.businessHours,
        workStatus: response.data.workStatus,
        gmbUrl: response.data.gmbUrl,
        WebsiteURL: response.data.WebsiteURL,
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
        <div className="formtitle">
          <Typography variant="h5">Custometer</Typography>
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
          <Typography variant="h5">Web SEO Form</Typography>
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
              value={"Website SEO"}
              onChange={handleChange}
              disabled
              select
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
              name="remainingPrice"
              value={remainingPrice} // Display the calculated remaining price
              InputProps={{
                readOnly: true, // Make this field read-only
              }}
            />
          </Grid>
        </Grid>
        <div className="formtitle ticketHeading">
          <Typography variant="h5">Business Details</Typography>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <TextField
              label="Service name"
              fullWidth
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Service Location"
              fullWidth
              name="serviceQuantity"
              value={formData.serviceQuantity}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Business Number"
              fullWidth
              name="businessNumber"
              value={formData.businessNumber}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Business Hours"
              fullWidth
              name="businessHours"
              value={formData.businessHours}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Country"
              fullWidth
              name="country"
              value={formData.country}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="State"
              fullWidth
              name="state"
              value={formData.state}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="ZipCode"
              fullWidth
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Street"
              fullWidth
              name="street"
              value={formData.street}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Website URL"
              fullWidth
              name="WebsiteURL"
              value={formData.WebsiteURL}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Keywords"
              fullWidth
              name="Keywords"
              value={formData.Keywords}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Social Profile"
              fullWidth
              name="socialProfile"
              value={formData.socialProfile}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="GMB Url"
              fullWidth
              name="gmbUrl"
              value={formData.gmbUrl}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Work Nature"
              fullWidth
              name="workStatus"
              value={formData.workStatus}
              onChange={handleChange}
              select
            >
              <MenuItem value="On-Page">On-Page</MenuItem>
              <MenuItem value="backlinks">Backlinks</MenuItem>
              <MenuItem value="extra-backlinks">Extra Backlinks</MenuItem>
              <MenuItem value="paid-guest">Paid-Guest Posting</MenuItem>
              <MenuItem value="Monthly-SEO">Monthly SEO</MenuItem>
            </TextField>
          </Grid>
          {showNoOfBacklinks && (
            <Grid item xs={2}>
              <TextField
                label="Backlink/Guest No."
                fullWidth
                name="noOfBacklinks"
                value={formData.noOfBacklinks}
                onChange={handleChange}
              />
            </Grid>
          )}
          {showMonthlyBlogs && (
            <Grid item xs={2}>
              <TextField
                label="Monthly Blogs"
                fullWidth
                name="monthlyBlogsRequirement"
                value={formData.monthlyBlogsRequirement}
                onChange={handleChange}
                multiline
              />
            </Grid>
          )}
          <Grid item xs={2}>
            <TextField
              label="Login Credentials"
              fullWidth
              name="LoginCredentials"
              value={formData.LoginCredentials}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Console Access"
              fullWidth
              name="SearchConsoleAccess"
              value={formData.SearchConsoleAccess}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Analytics Access"
              fullWidth
              name="GoogleAnalyticsAccess"
              value={formData.GoogleAnalyticsAccess}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={2}>
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

export default WebSeoForm;
