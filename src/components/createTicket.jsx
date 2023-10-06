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
  const [isCardOpen, setIsCardOpen] = useState(true); // State to control card visibility
  const [isOpen, setIsOpen] = useState(true); // State to control component visibility

  const navigate = useNavigate(); // Initialize the navigate function
  const handleDepartmentSelect = (departmentName) => {
    // Update the URL with the selected department as a query parameter
    const encodedDepartment = encodeURIComponent(departmentName);
    navigate(`/crmform/${encodedDepartment}`); // Use navigate for navigation
    setIsOpen(false); // Close the component when a department is selected
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

  const handleChange = (e) => {
    // const { name, value } = e.target;
    // setFormData({ ...formData, [name]: value });
    // setIsCardOpen(false);
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
            // onChange={handleDepartmentSelect}
          >
            {departments?.map((d) => (
              <MenuItem
                key={d._id}
                value={d._id}
                onClick={() => {
                  // Update the URL with the selected department as a query parameter
                  const newDepartment = encodeURIComponent(d.name);
                  navigate(`/crmform/${newDepartment}`); // Use navigate for navigation
                  setIsOpen(false); // Close the component when a department is selected
                }}
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
