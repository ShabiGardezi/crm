import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { MenuItem } from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddClient() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    clientName: "",
    businessEmail: "",
    department: "", // Add a department field
  });
  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    try {
      // Make an Axios request here (replace "/api/submit" with your actual API endpoint)
      // Find the selected department object
      const selectedDepartment = departments.find(
        (department) => department.name === formData.department
      );

      // Set majorAssignee to the department's ID
      const majorAssignee = selectedDepartment ? selectedDepartment._id : null;

      const response = await axios.post(``, {
        clientName: formData.clientName,
        businessEmail: formData.businessEmail,
        department: majorAssignee, // Send department data to your API
      });

      // Handle the response as needed (e.g., show a success message)
      toast.success("Form submitted successfully!");
      console.log("Success:", response);
    } catch (error) {
      // Handle errors (e.g., show an error message)
      toast.error("An error occurred. Please try again.");
      console.error("Error:", error);
    }
    // Close the dialog after submission
    closeDialog();
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

  return (
    <div>
      <div className="client-history-dropdown">
        {/* Add Client Button */}
        <Button variant="outlined" color="primary" onClick={openDialog}>
          Add Client
        </Button>
      </div>

      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              label="Client/Business Name"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Business Email"
              name="businessEmail"
              value={formData.businessEmail}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Select Department"
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
          </DialogContent>
          <div className="formbtn">
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
