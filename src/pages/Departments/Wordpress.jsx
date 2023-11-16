import React, { useState, useEffect } from "react";
import "../../styles/Forms/formsCommon.css";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
} from "@material-ui/core";
// import CloudUploadIcon from "@material-ui/icons/CloudUpload"; // Import CloudUploadIcon
import axios from "axios";
import Header from "../Header";
import toast from "react-hot-toast";

//create field for image upload and on handle it on handleSubmit function
const WordPress = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const [departments, setDepartments] = useState([]);
  const [remainingPrice, setRemainingPrice] = useState(0); // Initialize remainingPrice
  const [clientSuggestions, setClientSuggestions] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedTechDepartment, setSelectedTechDepartment] = useState("");
  const [showWordpressFields, setShowWordpressFields] = useState(false);
  const [showEcommerceFields, setShowEcommerceFields] = useState(false);
  const [selectedWebsiteType, setSelectedWebsiteType] = useState("");

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
    advanceprice: "",
    remainingPrice: "",
    serviceName: "",
    serviceDescription: "",
    clientName: "",
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
    websiteType: "",
    socialProfile: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "websiteType") {
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
    try {
      // Make an Axios request here (replace "/api/submit" with your actual API endpoint)
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
          clientName: formData.clientName,
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
          socialProfile: formData.socialProfile,
          websiteType: formData.websiteType,
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
  const handleClientSelection = async (clientName) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/client/details/${clientName}`
      );
      setSelectedClient(response.data);
      setFormData({
        ...formData,
        businessNumber: response.data.businessNumber,
        ownerName: response.data.ownerName,
        clientEmail: response.data.clientEmail,
        clientName: response.data.clientName,
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
        const response = await axios.get(
          `${apiUrl}/api/departments`
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
        `${apiUrl}/api/client/suggestions?query=${query}`
      );
      setClientSuggestions(response.data);
    } catch (error) {
      console.log(error);
      console.error("Error fetching suggestions:", error);
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
                  label="Client Name."
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
                  name="websiteType"
                  value={selectedWebsiteType}
                  onChange={handleChange}
                  select
                >
                  <MenuItem value="Ecommerce">Ecommerce</MenuItem>
                  <MenuItem value="Redeisgn">Redeisgn</MenuItem>
                  <MenuItem value="One-Page">One-Page</MenuItem>
                  <MenuItem value="Full">Full</MenuItem>
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
                  label="Website-Type"
                  fullWidth
                  name="websiteType"
                  value={selectedWebsiteType}
                  onChange={handleChange}
                  select
                >
                  <MenuItem value="Ecommerce">Ecommerce</MenuItem>
                  <MenuItem value="Redeisgn">Redeisgn</MenuItem>
                  <MenuItem value="One-Page">One-Page</MenuItem>
                  <MenuItem value="Full">Full</MenuItem>
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
              {/* Add more fields as needed */}
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
