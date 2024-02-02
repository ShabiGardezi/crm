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
  const apiUrl = process.env.REACT_APP_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    department: "",
  });
  const [departments, setDepartments] = useState([]);

  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/departments`);
        const departmentsToExcludeForAll = [
          "Sales",
          "Custom Development",
          "Outsourced",
        ];
        const userDepartmentIdToExclude = "651b3409819ff0aec6af1387";
        const departmentIdToExclude = "654bc9d114e9ed66948b4a01";

        const filteredDepartments = response.data.payload.filter(
          (department) => {
            const isExcludedForAll = departmentsToExcludeForAll.includes(
              department.name
            );
            const isExcludedForUser =
              (user?.department?._id === userDepartmentIdToExclude &&
                department.name === "Designers") ||
              ((user?.department?._id === userDepartmentIdToExclude ||
                user?.department?.name === "Outsourced") &&
                department._id === departmentIdToExclude);

            return !isExcludedForAll && !isExcludedForUser;
          }
        );

        setDepartments(filteredDepartments);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDepartments();
  }, [user?.department?._id]);

  const handleDepartmentSelect = (departmentId) => {
    // Define a mapping of department names to their respective routes
    const departmentRoutes = {
      "Local SEO / GMB Optimization": "/department/localseoform",
      "Wordpress Development": "/department/wordpressform",
      "Website SEO": "/department/webseoform",
      "Custom Development": "/department/customdevelopment",
      "Paid Marketing": "/department/paidmarketingform",
      "Social Media / Customer Reviews Management":
        "/department/socialmediaform",
      "Customer Reviews Management": "/department/reviewsform",
      Sales: "/department/sales",
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
        <div className="selectdepartment">
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
        </div>
      </CardContent>
    </div>
  );
}

export default CreateTicketCard;
