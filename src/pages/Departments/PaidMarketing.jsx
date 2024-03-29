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

const PaidMarketing = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const [departments, setDepartments] = useState([]);
  const [remainingPrice, setRemainingPrice] = useState(0); // Initialize remainingPrice
  const [clientSuggestions, setClientSuggestions] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [ShowBudgetPrice, setShowBudgetPrice] = useState(null);
  const [ShowPlatform, setShowPlatform] = useState(null);
  const [users, setUsers] = useState([]);
  const [projectName, setProjectName] = useState(""); // State for the Department Name field
  const [formData, setFormData] = useState({
    salesType: "",
    department: "Paid Marketing",
    priorityLevel: "",
    assignor: user?.username || "",
    dueDate: new Date().toISOString().substr(0, 10), // Initialize with the current date in yyyy-mm-dd format
    price: "",
    advanceprice: 0, // Set the default value to 0
    fronter: "",
    closer: "",
    supportPerson: "",
    remainingPrice: "",
    serviceName: "",
    adAccountAccess: "",
    budget: "",
    location: "",
    WebsiteURL: "",
    notes: "",
    businessName: "",
    clientEmail: "",
    selectedBudget: "",
    work_status: "",
    selectedPlatform: "",
  });
  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
    // Update the form data
    setFormData({
      ...formData,
      projectName: event.target.value,
    });
  };

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
  const handleChange = (event) => {
    const { name, value } = event.target;
    let updatedPrice = parseFloat(formData.price) || 0;
    let updatedAdvancePrice = parseFloat(formData.advanceprice) || 0;

    if (name === "price") {
      updatedPrice = parseFloat(value) || 0;
    } else if (name === "advanceprice") {
      updatedAdvancePrice = parseFloat(value) || 0;
    }
    if (
      (name === "budget" && value === "dailyBudget") ||
      "weeklyBudget" ||
      "monthlyBudget"
    ) {
      setShowBudgetPrice(true);
    } else {
      setShowBudgetPrice(false);
    }
    if (name === "work_status" && value === "Other-Ads") {
      setShowPlatform(true);
    }
    const remaining = updatedPrice - updatedAdvancePrice;
    setRemainingPrice(remaining);
    setFormData({
      ...formData,
      [name]: value,
      remainingPrice: remaining, // Update remainingPrice in formData
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
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    try {
      // Make an Axios request here (replace "/api/submit" with your actual API endpoint)
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
          salesType: formData.salesType,
          businessName: formData.businessName,
          clientEmail: formData.clientEmail,
          serviceName: formData.serviceName,
          outsourced_work: formData.outsourced_work,
          projectName: formData.projectName,
          work_status: formData.work_status,
          selectedPlatform: formData.selectedPlatform,
          selectedBudget: formData.selectedBudget,
          budget: formData.budget,
          location: formData.location,
          WebsiteURL: formData.WebsiteURL,
          adAccountAccess: formData.adAccountAccess,
          notes: formData.notes,
          fronter: formData.fronter,
          closer: formData.closer,
          supportPerson: formData.supportPerson,
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
  const handleClientSelection = async (businessName) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/client/details/${businessName}`
      );
      setSelectedClient(response.data);
      setFormData({
        ...formData,
        clientEmail: response.data.clientEmail,
        businessName: response.data.businessName,
        WebsiteURL: response.data.WebsiteURL,
      });
      setClientSuggestions([]);
    } catch (error) {
      console.error("Error fetching client details:", error);
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
        <div className="ticketHeading">
          <Typography variant="h5">Customers</Typography>
        </div>
        <Grid container spacing={3}>
          <Grid item xs={5}>
            <TextField
              label="Business Name"
              fullWidth
              name="businessName"
              value={formData.businessName}
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
          <Typography variant="h5">Paid Marketing Form</Typography>
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
          <Grid item xs={3}>
            <TextField
              label="Select Department"
              fullWidth
              name="department"
              value={truncateDepartmentName(formData.department, 10)}
              onChange={handleChange}
              // select
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
          <Grid item xs={1}>
            <TextField
              label="Price"
              fullWidth
              name="price"
              required
              value={formData.price}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={1}>
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
              label="Location"
              fullWidth
              name="location"
              value={formData.location}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Ad Account Access"
              fullWidth
              name="adAccountAccess"
              value={formData.adAccountAccess}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Budget"
              fullWidth
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              select
              required
            >
              <MenuItem value="dailyBudget">Daily</MenuItem>
              <MenuItem value="weeklyBudget">Weekly</MenuItem>
              <MenuItem value="monthlyBudget">Monthly</MenuItem>
            </TextField>
          </Grid>
          {ShowBudgetPrice && (
            <Grid item xs={2}>
              <TextField
                label="Budget Price"
                fullWidth
                name="selectedBudget"
                value={formData.selectedBudget}
                onChange={handleChange}
                required
              />
            </Grid>
          )}
          <Grid item xs={2}>
            <TextField
              label="Platform"
              fullWidth
              name="work_status"
              value={formData.work_status}
              onChange={handleChange}
              select
              required
            >
              <MenuItem value="Facebook-Ads">Facebook</MenuItem>
              <MenuItem value="Google-Ads">Google</MenuItem>
              <MenuItem value="Other-Ads">Other</MenuItem>
            </TextField>
          </Grid>
          {ShowPlatform && (
            <Grid item xs={2}>
              <TextField
                label="Platform Name"
                fullWidth
                name="selectedPlatform"
                value={formData.selectedPlatform}
                onChange={handleChange}
                required={ShowPlatform}
              />
            </Grid>
          )}
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
          <Grid item xs={3}>
            <TextField
              label="Clients Objective"
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
