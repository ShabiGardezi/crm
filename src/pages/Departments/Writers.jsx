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

const WritersForm = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("user", user);
  const [departments, setDepartments] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDepartments, setSelectedDepartments] = useState("");
  const [clientSuggestions, setClientSuggestions] = useState([]);
  const [formData, setFormData] = useState({
    priorityLevel: "",
    assignor: user?.username || "",
    dueDate: new Date().toISOString().substr(0, 10), // Initialize with the current date in yyyy-mm-dd format
    serviceName: "",
    serviceAreas: "",
    clientName: "",
    ownerName: "",
    street: "",
    Keywords: "",
    quantity: "",
    WebsiteURL: "",
    gmbUrl: "",
    clientEmail: "",
    workStatus: "",
    notes: "",
    ReferralWebsite: "",
    departmentName: "",
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
    setFormData({
      ...formData,
      [name]: value,
      departmentName: selectedDepartments, // Add this line to update departmentName
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
          clientName: formData.clientName,
          ownerName: formData.ownerName,
          street: formData.street,
          WebsiteURL: formData.WebsiteURL,
          country: formData.country,
          state: formData.street,
          zipcode: formData.zipcode,
          businessNumber: formData.businessNumber,
          clientEmail: formData.clientEmail,
          workStatus: formData.workStatus,
          notes: formData.notes,
          Keywords: formData.Keywords,
          ReferralWebsite: formData.ReferralWebsite,
          departmentName: formData.departmentName,
          serviceAreas: formData.serviceAreas,
          gmbUrl: formData.gmbUrl,
          quantity: formData.quantity,
        },
        Services: {
          serviceName: formData.serviceName,
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
        clientEmail: response.data.clientEmail,
        clientName: response.data.clientName,
        workStatus: response.data.workStatus,
        WebsiteURL: response.data.WebsiteURL,
        ReferralWebsite: response.data.ReferralWebsite,
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
          <Typography variant="h5">Writers Form</Typography>
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
          <Grid item xs={2}>
            <TextField
              label="Select Department"
              fullWidth
              name="department"
              value={"Writers"}
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
              label="Department"
              fullWidth
              name="departmentName"
              onChange={(e) => setSelectedDepartments(e.target.value)}
              select
            >
              <MenuItem value="LocalSeo">Local Seo</MenuItem>
              <MenuItem value="WebSeo">Web Seo</MenuItem>
              <MenuItem value="Reviews">Reviews</MenuItem>
            </TextField>
          </Grid>
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

        {selectedDepartments === "WebSeo" && (
          <>
            <div className="ticketHeading">
              <Typography variant="h5">Business Details</Typography>
            </div>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <TextField
                  label="Work Nature"
                  fullWidth
                  name="workStatus"
                  value={formData.workStatus}
                  onChange={handleChange}
                  select
                >
                  <MenuItem value="OnPage">On-Page</MenuItem>
                  <MenuItem value="Blog">Blog</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Qunatity"
                  fullWidth
                  name="quantity"
                  value={formData.quantity}
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
                  label="Referral URL"
                  fullWidth
                  name="ReferralWebsite"
                  value={formData.ReferralWebsite}
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

        {selectedDepartments === "LocalSeo" && (
          <>
            <div className="ticketHeading">
              <Typography variant="h5">Business Details</Typography>
            </div>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <TextField
                  label="Work Nature"
                  fullWidth
                  name="workStatus"
                  value={formData.workStatus}
                  onChange={handleChange}
                  select
                >
                  <MenuItem value="GMBPosting">GMB Posting</MenuItem>
                  <MenuItem value="ProductDescription">
                    Product Description
                  </MenuItem>
                  <MenuItem value="BusinessDescription">
                    Business Description
                  </MenuItem>
                  <MenuItem value="Blog">Blog</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Qunatity"
                  fullWidth
                  name="quantity"
                  value={formData.quantity}
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
                  label="Referral URL"
                  fullWidth
                  name="ReferralWebsite"
                  value={formData.ReferralWebsite}
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
        {selectedDepartments === "Reviews" && (
          <>
            <div className="ticketHeading">
              <Typography variant="h5">Business Details</Typography>
            </div>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <TextField
                  label="Service Areas"
                  fullWidth
                  name="serviceAreas"
                  value={formData.serviceAreas}
                  onChange={handleChange}
                  multiline
                />
              </Grid>
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
              <Grid item xs={3}>
                <TextField
                  label="Client Name"
                  fullWidth
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
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
                  <MenuItem value="YoutubeVideos">Youtube Videos</MenuItem>
                  <MenuItem value="PostTaglines">Post Taglines</MenuItem>
                  <MenuItem value="GMBReviews">GMB Reviews</MenuItem>
                  <MenuItem value="FBReviews">FB Reviews</MenuItem>
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

export default WritersForm;
