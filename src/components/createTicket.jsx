import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
} from "@mui/material";
import logoImg from "../assests/Navbarlogo.png"; // Replace with the actual path to your logo image
import "../styles/createTicket.css";
import "../styles/formsCommon.css";
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDropdownChange = (event) => {
    const selectedDepartmentId = event.target.value;
    const selectedDepartment = departments.find(
      (department) => department._id === selectedDepartmentId
    );
    if (selectedDepartment) {
      // Replace 'route' with the actual route you want to navigate to for each department
      let route = "";
      switch (selectedDepartment.name) {
        case "Local SEO / GMB Optimization":
          route = "/localseoform";
          break;
        case "Wordpress Development":
          route = "/wordpressform";
          break;
        case "Website SEO":
          route = "/webseoform";
          break;
        case "Designing":
          route = "/designingform";
          break;
        case "Content Writing":
          route = "/contentwritingform";
          break;
        case "Custom Development":
          route = "/customdevelopmentform";
          break;
        case "Paid Marketing":
          route = "/paidmarketingform";
          break;
        case "Social Media Management":
          route = "/socialmediaform";
          break;
        case "Customer Reviews Management":
          route = "/reviewsform";
          break;
        case "Sales Department":
          route = "/salesform";
          break;
        default:
          break;
      }
      navigate(route); // Navigate to the selected department's route
    }
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
            onChange={handleDropdownChange}
            label="Department"
          >
            {departments.map((d) => (
              <MenuItem key={d._id} value={d._id}>
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
