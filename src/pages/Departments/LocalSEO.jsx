import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  FormControl,
  Select,
  InputLabel,
} from "@material-ui/core";
import axios from "axios"; // Import Axios for making API requests
import "../../styles/Forms/customforms.css";
import Header from "../Header";
import toast from "react-hot-toast";

const LocalSEOForm = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const [departments, setDepartments] = useState([]);
  const [remainingPrice, setRemainingPrice] = useState(0); // Initialize remainingPrice
  const [clientSuggestions, setClientSuggestions] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [users, setUsers] = useState([]);
  const [projectName, setProjectName] = useState(""); // State for the Department Name field
  const [formData, setFormData] = useState({
    salesType: "",
    department: "Local SEO / GMB Optimization",
    priorityLevel: "",
    assignor: user?.username || "",
    dueDate: new Date().toISOString().substr(0, 10),
    keywords: "",
    supportPerson: "",
    webUrl: "",
    loginCredentials: "",
    price: "",
    advanceprice: 0, // Set the default value to 0
    remainingPrice: "",
    businessName: "",
    street: "",
    WebsiteURL: "",
    country: "",
    state: "",
    zipcode: "",
    businessNumber: "",
    clientEmail: "",
    reportingDate: "",
    businessHours: "",
    socialProfile: "",
    gmbUrl: "",
    work_status: "",
    notes: "",
    fronter: "",
    closer: "",
    outsourced_work: "",
  });
  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
    // Update the form data
    setFormData({
      ...formData,
      projectName: event.target.value,
    });
  };
  const sendNotification = async (
    ticketId,
    userId,
    assignorDepartmentId,
    majorAssigneeId,
    dueDate,
    businessName
  ) => {
    try {
      const response = await axios.post(`${apiUrl}/api/notification`, {
        ticketId: ticketId,
        userId: userId,
        assignorDepartmentId: assignorDepartmentId,
        majorAssigneeId: majorAssigneeId,
        dueDate: dueDate,
        businessName: businessName,
      });
      if (response.status === 200) {
        console.log("Notification send", response.data.payload);
      }
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

    // If the selected sales type is "Up Sales" and the field being changed is "Closer Person"
    if (formData.salesType === "Up Sales" && name === "closer") {
      // Automatically set the "Fronter" field to the same value as the "Closer Person"
      setFormData({
        ...formData,
        [name]: value,
        fronter: value, // Automatically set the "Fronter" field to the same value
        remainingPrice: remaining,
      });
    } else {
      // Update the state for other fields
      setFormData({
        ...formData,
        [name]: value,
        remainingPrice: remaining,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    try {
      // Find the selected department object
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
        department: formData.department,
        businessdetails: {
          salesType: formData.salesType,
          outsourced_work: formData.outsourced_work,
          projectName: formData.projectName,
          fronter: formData.fronter,
          supportPerson: formData.supportPerson,
          closer: formData.closer,
          businessName: formData.businessName,
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
          work_status: formData.work_status,
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
        payment_history: parseFloat(formData.advanceprice),
        clientReporting: formData.reportingDate,
      });

      // Handle the response as needed (e.g., show a success message)
      toast.success("Form submitted successfully!");
      sendNotification(
        response.data.payload._id.toString(),
        user._id,
        user.department._id,
        majorAssignee,
        formData.dueDate,
        formData.businessName
      );
    } catch (error) {
      // Handle errors (e.g., show an error message)
      toast.error("An error occurred. Please try again.");
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
  const handleClientSelection = async (businessName) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/client/details/${businessName}`
      );
      setSelectedClient(response.data);
      setFormData({
        ...formData,
        businessNumber: response.data.businessNumber,
        clientEmail: response.data.clientEmail,
        businessName: response.data.businessName,
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
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              multiline
              onInput={(e) => fetchSuggestions(e.target.value)}
              required
            />

            {/* Display client suggestions as a dropdown */}
            {clientSuggestions.length > 0 && (
              <div className="scrollable-suggestions">
                <ul>
                  {clientSuggestions.map((client, index) => (
                    <li
                      key={index}
                      onClick={() => handleClientSelection(client.businessName)}
                      className="pointer-cursor" // Apply the CSS class here
                    >
                      {client.businessName}
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
          </Grid>{" "}
          <Grid item xs={1} style={{ display: "none" }}>
            <TextField
              label="Reporting Date"
              fullWidth
              name="reportingDate"
              value={formData.reportingDate}
              onChange={handleChange}
              // defaultValue={new Date()}
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
            <>
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
              {formData.outsourced_work === "Others" && (
                <Grid item xs={3}>
                  <TextField
                    label="Project Name"
                    fullWidth
                    name="projectName"
                    value={projectName}
                    onChange={handleProjectNameChange}
                    required
                  />
                </Grid>
              )}
            </>
          )}

          {user?.department?._id !== "65ae7e27e00c92860edad99c" && (
            <>
              <Grid item xs={3}>
                <FormControl fullWidth required>
                  <InputLabel id="salesTypeLabel">Sales Type</InputLabel>
                  <Select
                    labelId="salesTypeLabel"
                    id="salesType"
                    name="salesType"
                    value={formData.salesType}
                    onChange={handleChange}
                  >
                    <MenuItem value="New Sales">New Sales</MenuItem>
                    <MenuItem value="Up Sales">Up Sales</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {formData.salesType === "Up Sales" && (
                <>
                  <Grid item xs={3}>
                    <FormControl fullWidth required>
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
                </>
              )}

              {formData.salesType === "New Sales" && (
                <>
                  <Grid item xs={3}>
                    <FormControl fullWidth required>
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
                    <FormControl fullWidth required>
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
            </>
          )}
        </Grid>
        <div className="formtitle ticketHeading">
          <Typography variant="h5">Local SEO Form</Typography>
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
              required
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
              value={remainingPrice}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>

        <div className="ticketHeading">
          <Typography variant="h5">Business Details</Typography>
        </div>
        <Grid container spacing={2}>
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
              label="Work Status"
              fullWidth
              name="work_status"
              value={formData.work_status}
              onChange={handleChange}
              select
              required
            >
              <MenuItem value="GMB Full Optimization">
                GMB Full Optimization
              </MenuItem>
              <MenuItem value="GMB Off Page">GMB Off Page</MenuItem>
            </TextField>
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
