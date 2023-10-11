import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CardContent,
  Typography,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
} from "@mui/material";
import logoImg from "../assests/Navbarlogo.png"; // Replace with the actual path to your logo image
import "../styles/createTicket.css";
import "../styles/Forms/formsCommon.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function CreateTicketCard() {
  const [formData, setFormData] = useState({
    department: "",
  });
  const [departments, setDepartments] = useState([]);

  const navigate = useNavigate(); // Initialize the navigate function

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

  const handleDepartmentSelect = (departmentId) => {
    // Define a mapping of department names to their respective routes
    const departmentRoutes = {
      "Local SEO / GMB Optimization": "/localseoform",
      "Wordpress Development": "/wordpressform",
      "Website SEO": "/webseoform",
      "Custom Development": "/customdevelopment",
      "Paid Marketing": "/paidmarketingform",
      "Social Media Management": "/socialmediaform",
      "Customer Reviews Management": "/reviewsform",
      Sales: "/sales",
    };

    // Get the route for the selected department
    const selectedRoute = departmentRoutes[departmentId];

    // Navigate to the selected route
    navigate(selectedRoute);
  };
  return (
    <div>
      <div className="logoimg">
        <img src={logoImg} alt="" />
      </div>
      <CardContent>
        <div className="card-description">
          <Typography variant="h6" component="div" className="card-description">
            Please select the department to create a ticket
          </Typography>
        </div>
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel id="department-label">Department</InputLabel>
          <Select
            labelId="department-label"
            id="department"
            name="department"
            value={formData.department}
            label="Department"
          >
            {departments?.map((d) => (
              <MenuItem
                key={d._id}
                value={d._id}
                onClick={() => handleDepartmentSelect(d.name)}
              >
                {d.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </CardContent>
    </div>
  );
}

export default CreateTicketCard;
