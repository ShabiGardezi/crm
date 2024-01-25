import React, { useState, useEffect } from "react";
import "../../styles/globalfont.css";
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

const SocialMediaForm = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [remainingPrice, setRemainingPrice] = useState(0); // Initialize remainingPrice
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientSuggestions, setClientSuggestions] = useState([]);
  const [showFbReviewsField, setShowFbReviewsField] = useState(false);
  const [showPostField, setShowPostField] = useState(false);
  const [showLikesFollowersField, setShowLikesFollowersField] = useState(false);
  const [showGmbReviewsField, setShowGmbReviewsField] = useState(false);
  const [showOthers, setShowOthers] = useState(false);
  const [projectName, setProjectName] = useState(""); // State for the Department Name field

  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
    // Update the form data
    setFormData({
      ...formData,
      projectName: event.target.value,
    });
  };
  const [formData, setFormData] = useState({
    department: "Social Media / Customer Reviews Management",
    priorityLevel: "",
    assignor: user?.username || "",
    dueDate: new Date().toISOString().substr(0, 10), // Initialize with the current date in yyyy-mm-dd format
    webUrl: "",
    price: "",
    advanceprice: 0, // Set the default value to 0
    fronter: "",
    closer: "",
    supportPerson: "",
    businessName: "",
    street: "",
    WebsiteURL: "",
    clientEmail: "",
    socialProfile: "",
    gmbUrl: "",
    facebookURL: "",
    noOfreviewsGMB: "0",
    logincredentials: "",
    work_status: "",
    notes: "",
    supportPerson: "",
    closer: "",
    fronter: "",
    noOfFbreviews: "0",
    Other_Platform: "",
    no_of_posts: "",
    outsourced_work: "",
    LikesFollowers: "0",
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
    if (name === "work_status") {
      // Update the state
      setFormData({
        ...formData,
        [name]: value,
      });
      setShowFbReviewsField(value === "No. Of FB Reviews");
      setShowLikesFollowersField(value === "Likes/Followers");
      setShowGmbReviewsField(value === "No.Of GMB Reviews");
      setShowOthers(value === "Other_Posts");
      setShowPostField(
        value === "Instaram_Posting" || value === "Facebook_Posting"
      );
    }

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
      let selectedOutsourcedWork = formData.outsourced_work;

      // Make an Axios POST request to your backend API
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
          outsourced_work: formData.outsourced_work,
          projectName: formData.projectName,
          Other_Platform: formData.Other_Platform,
          fronter: formData.fronter,
          closer: formData.closer,
          supportPerson: formData.supportPerson,
          businessName: formData.businessName,
          serviceName: formData.serviceName,
          WebsiteURL: formData.WebsiteURL,
          clientEmail: formData.clientEmail,
          socialProfile: formData.socialProfile,
          gmbUrl: formData.gmbUrl,
          facebookURL: formData.facebookURL,
          work_status: formData.work_status,
          logincredentials: formData.logincredentials,
          noOfreviewsGMB: formData.noOfreviewsGMB,
          noOfFbreviews: formData.noOfFbreviews,
          LikesFollowers: formData.LikesFollowers,
          no_of_posts: formData.no_of_posts,
          // Other_Project: formData.Other_Project,
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
          supportPerson: formData.supportPerson,
          fronter: formData.fronter,
          closer: formData.closer,
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
        socialProfile: response.data.socialProfile,
        facebookURL: response.data.facebookURL,
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
          <Typography variant="h5">
            Social Media / Customer Reviews Form
          </Typography>
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
              label="Work Status"
              fullWidth
              name="work_status"
              value={formData.work_status}
              onChange={handleChange}
              select
              required
            >
              <MenuItem value="No. Of FB Reviews">No. Of FB Reviews </MenuItem>
              <MenuItem value="Likes/Followers">Likes/Followers</MenuItem>
              <MenuItem value="No.Of GMB Reviews">No.Of GMB Reviews</MenuItem>
              <MenuItem value="Instaram_Posting">Instaram Posting</MenuItem>
              <MenuItem value="Facebook_Posting">Facebook Posting</MenuItem>
              <MenuItem value="Other_Posts">Others Posting</MenuItem>
            </TextField>
          </Grid>
          {showFbReviewsField && (
            <>
              <Grid item xs={3}>
                <TextField
                  label="No. Of FB Reviews"
                  fullWidth
                  name="noOfFbreviews"
                  value={formData.noOfFbreviews}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </>
          )}
          {showPostField && (
            <>
              <Grid item xs={3}>
                <TextField
                  label="No. Of Posts"
                  fullWidth
                  name="no_of_posts"
                  value={formData.no_of_posts}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </>
          )}
          {showOthers && (
            <>
              <Grid item xs={3}>
                <TextField
                  label="No. of posts"
                  fullWidth
                  name="no_of_posts"
                  value={formData.no_of_posts}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Platform Name"
                  fullWidth
                  name="Other_Platform"
                  value={formData.Other_Platform}
                  onChange={handleChange}
                  required={showOthers}
                />
              </Grid>
            </>
          )}
          {showGmbReviewsField && (
            <>
              <Grid item xs={3}>
                <TextField
                  label="No. Of GMB Reviews"
                  fullWidth
                  name="noOfreviewsGMB"
                  value={formData.noOfreviewsGMB}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </>
          )}
          {showLikesFollowersField && (
            <>
              <Grid item xs={3}>
                <TextField
                  label="No. Of Likes & Followers"
                  fullWidth
                  name="LikesFollowers"
                  value={formData.LikesFollowers}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Platform Name"
                  fullWidth
                  name="Other_Platform"
                  value={formData.Other_Platform}
                  onChange={handleChange}
                  required={showLikesFollowersField}
                />
              </Grid>
            </>
          )}
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

export default SocialMediaForm;
// WORK TYPE => ISNTAGRAM, FACEBOOK
// No of posts on selected work type
