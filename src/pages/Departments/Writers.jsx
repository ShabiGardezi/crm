import React, {useState, useEffect} from "react";
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
    const apiUrl = process.env.REACT_APP_API_URL;
    const user = JSON.parse(localStorage.getItem("user"));
    const [departments, setDepartments] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedDepartments, setSelectedDepartments] = useState("");
    const [clientSuggestions, setClientSuggestions] = useState([]);
    const [formData, setFormData] = useState({
        priorityLevel: "",
        department: "Writers", // Initialize with "Writers"
        assignor: user?.username || "",
        dueDate: new Date().toISOString().substr(0, 10), // Initialize with the current date in yyyy-mm-dd format
        serviceName: "",
        serviceAreas: "",
        businessName: "",
        ownerName: "",
        street: "",
        Keywords: "",
        quantity: "",
        WebsiteURL: "",
        gmbUrl: "",
        clientEmail: "",
        work_status: "",
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
    const sendNotification = async (ticketId, userId, assignorDepartmentId, majorAssigneeId, dueDate, businessName) => {
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
    }
    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData({
            ...formData,
            [name]: value,
            departmentName: selectedDepartments, // Add this line to update departmentName
        });
        if (name === "department") {
            // If the "department" field is changing, update the form data
            setFormData({
                ...formData,
                [name]: value,
            });
        }
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
                    businessName: formData.businessName,
                    ownerName: formData.ownerName,
                    serviceName: formData.serviceName,
                    street: formData.street,
                    WebsiteURL: formData.WebsiteURL,
                    country: formData.country,
                    state: formData.street,
                    zipcode: formData.zipcode,
                    businessNumber: formData.businessNumber,
                    clientEmail: formData.clientEmail,
                    work_status: formData.work_status,
                    notes: formData.notes,
                    Keywords: formData.Keywords,
                    ReferralWebsite: formData.ReferralWebsite,
                    departmentName: formData.departmentName,
                    serviceAreas: formData.serviceAreas,
                    gmbUrl: formData.gmbUrl,
                    quantity: formData.quantity,
                },
                TicketDetails: {
                    assignor: formData.assignor,
                    priority: formData.priorityLevel,
                },
            });
            toast.success("Form submitted successfully!");

            // Handle the response as needed (e.g., show a success message)
            console.log("Success:", response);
            sendNotification(response.data.payload._id.toString(),user._id, user.department._id, majorAssignee, formData.dueDate, formData.businessName);
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
    // Function to fetch client details when a suggestion is selected
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
                work_status: response.data.work_status,
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
            <Header/>
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
                            label="Department"
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
                    <Grid item xs={2}>
                        <TextField
                            label="Project Name"
                            fullWidth
                            name="departmentName"
                            onChange={(e) => setSelectedDepartments(e.target.value)}
                            select
                        >
                            <MenuItem value="LocalSeo">Local Seo</MenuItem>
                            <MenuItem value="WebSeo">Web Seo</MenuItem>
                            <MenuItem value="Reviews">Reviews</MenuItem>
                            <MenuItem value="Wordpress">Wordpress</MenuItem>
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
                                    name="work_status"
                                    value={formData.work_status}
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
                {selectedDepartments === "Wordpress" && (
                    <>
                        <div className="ticketHeading">
                            <Typography variant="h5">Business Details</Typography>
                        </div>
                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                                <TextField
                                    label="Work Nature"
                                    fullWidth
                                    name="work_status"
                                    value={formData.work_status}
                                    onChange={handleChange}
                                    select
                                >
                                    <MenuItem value="OnePage">One-Page</MenuItem>
                                    <MenuItem value="FullWebsite">Full Website</MenuItem>
                                </TextField>
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
                                    name="work_status"
                                    value={formData.work_status}
                                    onChange={handleChange}
                                    select
                                >
                                    <MenuItem value="GMB Posting">GMB Posting</MenuItem>
                                    <MenuItem value="Product Description">
                                        Product Description
                                    </MenuItem>
                                    <MenuItem value="Business Description">
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
                                    name="work_status"
                                    value={formData.work_status}
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
