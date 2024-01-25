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
// import CloudUploadIcon from "@material-ui/icons/CloudUpload"; // Import CloudUploadIcon
import axios from "axios";
import Header from "../Header";
import toast from "react-hot-toast";

//create field for image upload and on handle it on handleSubmit function
const WordPress = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [remainingPrice, setRemainingPrice] = useState(0); // Initialize remainingPrice
  const [clientSuggestions, setClientSuggestions] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedTechDepartment, setSelectedTechDepartment] = useState("");
  const [showWordpressFields, setShowWordpressFields] = useState(false);
  const [showEcommerceFields, setShowEcommerceFields] = useState(false);
  const [selectedWebsiteType, setSelectedWebsiteType] = useState("");
  const [projectName, setProjectName] = useState("");

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
  const [formData, setFormData] = useState({
    department: "Wordpress Development", // Initialize with "Wordpress Development"
    priority: "",
    assignor: user?.username || "",
    dueDate: new Date().toISOString().substr(0, 10), // Initialize with the current date in yyyy-mm-dd format
    keywords: "",
    webUrl: "",
    loginCredentials: "",
    priorityLevel: "",
    price: "",
    advanceprice: 0, // Set the default value to 0

    remainingPrice: "",
    serviceName: "",
    serviceDescription: "",
    businessName: "",
    gmbUrl: "",
    country: "",
    state: "",
    street: "",
    zipcode: "",
    businessNumber: "",
    ownerName: "",
    clientEmail: "",
    WebsiteURL: "",
    fronter: "",
    closer: "",
    supportPerson: "",
    notes: "",
    departmentName: "",
    work_status: "",
    outsourced_work: "",
    projectName: "",
    socialProfile: "",
  });

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
    if (name === "outsourced_work") {
      // If the selected value is "Others", reset the "Project Name" field
      if (value === "Others") {
        setProjectName("");
      }
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    if (name === "work_status") {
      setSelectedWebsiteType(value);
    }
    if (name === "departmentName") {
      // If the "department" field is changing, update the selected department
      setSelectedTechDepartment(value); // Based on the selected department, decide which fields to show
      if (value === "Wordpress") {
        setShowWordpressFields(true);
        setShowEcommerceFields(false);
      } else if (value === "E-commerce") {
        setShowWordpressFields(false);
        setShowEcommerceFields(true);
      } else {
        setShowWordpressFields(false);
        setShowEcommerceFields(false);
      }
    }
    if (name === "department") {
      // If the "department" field is changing, update the form data
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      // For other fields, handle them as usual
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
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    // Make an Axios request here (replace "/api/submit" with your actual API endpoint)
    try {
      const selectedDepartment = departments.find(
        (department) => department.name === formData.department
      );
      // Set majorAssignee to the department's ID
      const majorAssignee = selectedDepartment ? selectedDepartment._id : null;
      const response = await axios.post(`${apiUrl}/api/tickets`, {
        dueDate: formData.dueDate,
        created_by: user._id,
        majorAssignee: majorAssignee,
        assignorDepartment: user.department._id,
        businessdetails: {
          businessName: formData.businessName,
          serviceName: formData.serviceName,
          serviceDescription: formData.serviceDescription,
          street: formData.street,
          gmbUrl: formData.gmbUrl,
          country: formData.country,
          state: formData.state,
          zipcode: formData.zipcode,
          businessNumber: formData.businessNumber,
          ownerName: formData.ownerName,
          clientEmail: formData.clientEmail,
          WebsiteURL: formData.WebsiteURL,
          fronter: formData.fronter,
          closer: formData.closer,
          supportPerson: formData.supportPerson,
          notes: formData.notes,
          departmentName: formData.departmentName,
          outsourced_work: formData.outsourced_work,
          projectName: formData.projectName,
          socialProfile: formData.socialProfile,
          work_status: formData.work_status,
        },

        quotation: {
          price: formData.price,
          advanceprice: formData.advanceprice,
          remainingPrice: formData.remainingPrice,
        },
        TicketDetails: {
          assignor: formData.assignor,
          priority: formData.priority,
        },
        payment_history: parseFloat(formData.advanceprice),
      });
      toast.success("Form submitted successfully!");

      // Handle the response as needed (e.g., show a success message)
      sendNotification(
        response.data.payload._id.toString(),
        user._id,
        user.department._id,
        majorAssignee,
        formData.dueDate,
        formData.businessName
      );
    } catch (error) {
      toast.error("An error occurred. Please try again.");

      // Handle errors (e.g., show an error message)
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
        businessNumber: response.data.businessNumber,
        ownerName: response.data.ownerName,
        clientEmail: response.data.clientEmail,
        businessName: response.data.businessName,
        country: response.data.country,
        state: response.data.state,
        street: response.data.street,
        zipcode: response.data.zipcode,
        socialProfile: response.data.socialProfile,
        businessHours: response.data.businessHours,
        gmbUrl: response.data.gmbUrl,
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
                <FormControl fullWidth>
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
              {/* Conditionally render the "Project Name" field based on the selected value */}
              {formData.outsourced_work === "Others" && (
                <Grid item xs={3}>
                  <TextField
                    label="Project Name"
                    fullWidth
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
              )}
            </>
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
        </Grid>
        <div className="formtitle ticketHeading">
          <Typography variant="h5">Ticket Details</Typography>
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
              label="Department"
              fullWidth
              name="department"
              onChange={handleChange}
              value={truncateDepartmentName(formData.department, 10)}
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
              value={remainingPrice} // Display the calculated remaining price
              InputProps={{
                readOnly: true, // Make this field read-only
              }}
            />
          </Grid>
        </Grid>

        <div className="formtitle ticketHeading">
          <Typography variant="h5">Wordpress Form</Typography>
        </div>
        <Grid item xs={2}>
          <TextField
            label="Department"
            fullWidth
            name="departmentName"
            value={selectedTechDepartment}
            onChange={handleChange}
            select
            required
          >
            <MenuItem value="Wordpress">Wordpress</MenuItem>
            <MenuItem value="E-commerce">E-commerce</MenuItem>
          </TextField>
        </Grid>

        {showWordpressFields && (
          <>
            <div className="ticketHeading">
              <Typography variant="h5">Business Details</Typography>
            </div>

            <Grid container spacing={2}>
              <Grid item xs={2}>
                <TextField
                  label="Services"
                  fullWidth
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Service Areas"
                  fullWidth
                  name="serviceDescription"
                  value={formData.serviceDescription}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Business No."
                  fullWidth
                  name="businessNumber"
                  value={formData.businessNumber}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Client Name"
                  fullWidth
                  name="ownerName"
                  value={formData.ownerName}
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
                  label="Referral Website"
                  fullWidth
                  name="WebsiteURL"
                  value={formData.WebsiteURL}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="GMB URL"
                  fullWidth
                  name="gmbUrl"
                  value={formData.gmbUrl}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Website Type"
                  fullWidth
                  name="work_status"
                  value={selectedWebsiteType}
                  onChange={handleChange}
                  select
                  required
                >
                  <MenuItem value="Ecommerce">Ecommerce</MenuItem>
                  <MenuItem value="Redeisgn-Website">Redeisgn-Website</MenuItem>
                  <MenuItem value="One-Page-Website">One-Page-Website</MenuItem>
                  <MenuItem value="Full-Website">Full</MenuItem>
                </TextField>
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
          </>
        )}
        {showEcommerceFields && (
          <>
            <div className="ticketHeading">
              <Typography variant="h5">Business Details</Typography>
            </div>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <TextField
                  label="Services"
                  fullWidth
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Service Areas"
                  fullWidth
                  name="serviceDescription"
                  value={formData.serviceDescription}
                  onChange={handleChange}
                  multiline
                />
              </Grid>

              <Grid item xs={2}>
                <TextField
                  label="Business No."
                  fullWidth
                  name="businessNumber"
                  value={formData.businessNumber}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Client Name"
                  fullWidth
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="GMB URL"
                  fullWidth
                  name="gmbUrl"
                  value={formData.gmbUrl}
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
                  label="Referral Website"
                  fullWidth
                  name="WebsiteURL"
                  value={formData.WebsiteURL}
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
            </Grid>
          </>
        )}

        <div className="formbtn">
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WordPress;
