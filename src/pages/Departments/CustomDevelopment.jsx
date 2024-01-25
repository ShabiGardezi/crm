import "../../styles/Forms/formsCommon.css";
import React, {useState, useEffect} from "react";
import {
    Grid,
    TextField,
    Button,
    MenuItem,
    Typography,
} from "@material-ui/core";
import axios from "axios"; // Import Axios for making API requests
import Header from "../Header";
import toast from "react-hot-toast";

const CustomDevelopment = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const user = JSON.parse(localStorage.getItem("user"));
    const [departments, setDepartments] = useState([]);
    const [remainingPrice, setRemainingPrice] = useState(0); // Initialize remainingPrice

    const [formData, setFormData] = useState({
        priorityLevel: "",
        assignor: user?.username || "",
        dueDate: new Date().toISOString().substr(0, 10), // Initialize with the current date in yyyy-mm-dd format
        price: "",
            advanceprice: 0, // Set the default value to 0

        remainingPrice: "",

        serviceName: "",
        serviceDescription: "",
        serviceQuantity: "",
        servicePrice: "",
        businessName: "",
        WebsiteURL: "",
        country: "",
        state: "",
        street: "",
        zipcode: "",
        businessNumber: "",
        clientEmail: "",
        ReferralWebsite: "",
        notes: "",
    });

    const handleChange = (event) => {
        const {name, value} = event.target;
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
                    street: formData.street,
                    WebsiteURL: formData.WebsiteURL,
                    country: formData.country,
                    state: formData.state,
                    zipcode: formData.zipcode,
                    businessNumber: formData.businessNumber,
                    clientEmail: formData.clientEmail,
                    ReferralWebsite: formData.ReferralWebsite,
                    notes: formData.notes,
                },
                Services: {
                    serviceName: formData.serviceName,
                    serviceDescription: formData.serviceDescription,
                    serviceQuantity: formData.serviceQuantity,
                    servicePrice: formData.servicePrice,
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

            // Handle the response as needed (e.g., show a success message)
            console.log("Success:", response);
            toast.success("Form submitted successfully!");
            sendNotification(response.data.payload._id.toString(),user._id, user.department._id, majorAssignee, formData.dueDate, formData.businessName);

        } catch (error) {
            // Handle errors (e.g., show an error message)
            console.error("Error:", error);
            toast.error("An error occurred. Please try again.");
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
    return (
        <div className="styleform">
            <Header/>
            <div className="formtitle">
                <Typography variant="h5">Custom Development Form</Typography>
            </div>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
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
                    <Grid item xs={6}>
                        <TextField
                            label="Select Department"
                            fullWidth
                            name="department"
                            value={"Custom Development"}
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
                    <Grid item xs={6}>
                        <TextField
                            label="Assignor"
                            fullWidth
                            name="assignor"
                            value={formData.assignor}
                            onChange={handleChange}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={6}>
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
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            label="Price"
                            fullWidth
                            name="price"
                            required
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Advance"
                            fullWidth
                            name="advanceprice"
                            value={formData.advanceprice}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Remaining Price"
                            fullWidth
                            name="remainingPrice"
                            value={remainingPrice}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
                <div className="ticketHeading">
                    <Typography variant="h5">Business Details</Typography>
                </div>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            label="Service name"
                            fullWidth
                            name="serviceName"
                            value={formData.serviceName}
                            onChange={handleChange}
                            multiline
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Service description"
                            fullWidth
                            name="serviceDescription"
                            value={formData.serviceDescription}
                            onChange={handleChange}
                            multiline
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Service quantity"
                            fullWidth
                            name="serviceQuantity"
                            value={formData.serviceQuantity}
                            onChange={handleChange}
                            multiline
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Service price"
                            fullWidth
                            name="servicePrice"
                            value={formData.servicePrice}
                            onChange={handleChange}
                            multiline
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Business Name"
                            fullWidth
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleChange}
                            multiline
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Business Number"
                            fullWidth
                            name="businessNumber"
                            value={formData.businessNumber}
                            onChange={handleChange}
                            multiline
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Business Email"
                            fullWidth
                            name="clientEmail"
                            value={formData.clientEmail}
                            onChange={handleChange}
                            multiline
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Website URL"
                            fullWidth
                            name="WebsiteURL"
                            value={formData.WebsiteURL}
                            onChange={handleChange}
                            multiline
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Country"
                            fullWidth
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            multiline
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="State"
                            fullWidth
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            multiline
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Street"
                            fullWidth
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            multiline
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="ZipCode"
                            fullWidth
                            name="zipcode"
                            value={formData.zipcode}
                            onChange={handleChange}
                            multiline
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Referral Website"
                            fullWidth
                            name="ReferralWebsite"
                            value={formData.ReferralWebsite}
                            onChange={handleChange}
                            multiline
                        />
                    </Grid>
                    <Grid item xs={6}>
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

export default CustomDevelopment;
