import React, { useState, useEffect } from "react";
import "../../styles/Forms/formsCommon.css";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  Select,
} from "@material-ui/core";
import axios from "axios";
import Header from "../Header";
import toast from "react-hot-toast";

const WebSeoForm = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [remainingPrice, setRemainingPrice] = useState(0); // Initialize remainingPrice
  const [selectedClient, setSelectedClient] = useState(null);
  const [showNoOfBacklinks, setShowNoOfBacklinks] = useState(false);
  const [showMonthlyBlogs, setShowMonthlyBlogs] = useState(false); // Initialize as hidden
  const [clientSuggestions, setClientSuggestions] = useState([]);
  const [formData, setFormData] = useState({
    department: "Website SEO",
    priorityLevel: "",
    assignor: user?.username || "",
    dueDate: new Date().toISOString().substr(0, 10), // Initialize with the current date in yyyy-mm-dd format
    webUrl: "",
    loginCredentials: "",
    price: "",
    advanceprice: 0, // Set the default value to 0
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
    work_status: "",
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
    const fetchUsers = async () => {
      try {
        const departmentId = "651b3409819ff0aec6af1387";
        const response = await axios.get(
          `${apiUrl}/api/tickets/users/${departmentId}`
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);
  useEffect(() => {
    // Calculate one month later from the current date
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 1);

    setFormData({
      ...formData,
      dueDate: currentDate.toISOString().substr(0, 10),
    });
  }, []);
  const sendNotification = async (
    ticketId,
    userId,
    assignorDepartmentId,
    majorAssigneeId,
    dueDate,
    clientName
  ) => {
    try {
      const response = await axios.post(`${apiUrl}/api/notification`, {
        ticketId: ticketId,
        userId: userId,
        assignorDepartmentId: assignorDepartmentId,
        majorAssigneeId: majorAssigneeId,
        dueDate: dueDate,
        clientName: clientName,
      });
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };
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
      name === "work_status" &&
      (value === "Backlinks" ||
        value === "Paid-Guest-Posting" ||
        value === "Extra-Backlinks")
    ) {
      setShowNoOfBacklinks(true);
    }
    if (name === "work_status" && value === "Monthly-SEO") {
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
        (department) => department.name === formData.department
      );

      // Set majorAssignee to the department's ID
      const majorAssignee = selectedDepartment ? selectedDepartment._id : null;

      const response = await axios.post(`${apiUrl}/api/tickets`, {
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
          work_status: formData.work_status,
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
        payment_history: parseFloat(formData.advanceprice),
      });
      toast.success("Form submitted successfully!");
      sendNotification(
        response.data.payload._id.toString(),
        user._id,
        user.department._id,
        majorAssignee,
        formData.dueDate,
        formData.clientName
      );
      // Handle the response as needed (e.g., show a success message)
    } catch (error) {
      toast.error("An error occurred. Please try again.");

      // Handle errors (e.g., show an error message)
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/departments`);
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
        `${apiUrl}/api/client/suggestions?query=${query}`
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
        `${apiUrl}/api/client/details/${clientName}`
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
        work_status: response.data.work_status,
        gmbUrl: response.data.gmbUrl,
        WebsiteURL: response.data.WebsiteURL,
      });
      setClientSuggestions([]);
    } catch (error) {
      console.error("Error fetching client details:", error);
    }
  };
  const truncateDepartmentName = (departmentName, maxLength) => {
    if (departmentName.length <= maxLength) {
      return departmentName;
    } else {
      // Truncate the department name and add an ellipsis
      return `${departmentName.substr(0, maxLength)}...`;
    }
  };
  return (
    <div className="styleform">
      <Header />
      <form onSubmit={handleSubmit}>
        <div className="formtitle">
          <Typography variant="h5">Customer</Typography>
        </div>
        <Grid container spacing={3}>
          <Grid item xs={5}>
            <TextField
              label="Business Name"
              fullWidth
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
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
              required
            />
          </Grid>
        </Grid>
        {user?.department?._id !== "65ae7e27e00c92860edad99c" && (
          <div className="formtitle ticketHeading">
            <Typography variant="h5">Sale Department</Typography>
          </div>
        )}
        {user?.department?._id === "65ae7e27e00c92860edad99c" && (
          <div className="formtitle ticketHeading">
            <Typography variant="h5">Work Information</Typography>
          </div>
        )}
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

          {user?.department?._id === "65ae7e27e00c92860edad99c" && (
            <Grid item xs={3}>
              <FormControl fullWidth required>
                <InputLabel id="outsourcedWorkLabel">
                  Outsourced Work
                </InputLabel>
                <Select
                  labelId="outsourcedWorkLabel"
                  id="outsourcedWork"
                  name="outsourced_work"
                  value={formData.outsourced_work}
                  onChange={handleChange}
                >
                  <MenuItem value="L.L.G.">L.L.G.</MenuItem>
                  <MenuItem value="Meri Jagga">Meri Jagga</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
          {user?.department?._id !== "65ae7e27e00c92860edad99c" && (
            <>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel id="supportPersonLabel">
                    Support Person
                  </InputLabel>
                  <Select
                    labelId="supportPersonLabel"
                    id="supportPerson"
                    name="supportPerson"
                    value={formData.supportPerson}
                    onChange={handleChange}
                  >
                    {users.map((user) => (
                      <MenuItem key={user._id} value={user.username}>
                        {user.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel id="closerLabel">Closer Person</InputLabel>
                  <Select
                    labelId="closerLabel"
                    id="closer"
                    name="closer"
                    value={formData.closer}
                    onChange={handleChange}
                    required
                  >
                    {users.map((user) => (
                      <MenuItem key={user._id} value={user.username}>
                        {user.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel id="fronterLabel">Fronter</InputLabel>
                  <Select
                    labelId="fronterLabel"
                    id="fronter"
                    name="fronter"
                    value={formData.fronter}
                    onChange={handleChange}
                    required
                  >
                    {users.map((user) => (
                      <MenuItem key={user._id} value={user.username}>
                        {user.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}
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
              value={truncateDepartmentName(formData.department, 10)}
              onChange={handleChange}
              //   select
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
              required
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
              name="work_status"
              value={formData.work_status}
              onChange={handleChange}
              select
              required
            >
              <MenuItem value="On-Page">On-Page</MenuItem>
              <MenuItem value="Backlinks">Backlinks</MenuItem>
              <MenuItem value="Extra-Backlinks">Extra Backlinks</MenuItem>
              <MenuItem value="Paid-Guest-Posting">Paid-Guest Posting</MenuItem>
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
