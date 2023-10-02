import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import toast from "react-hot-toast";
import axios from "axios";
import signupimg from "../assests/Rank-BPO-PVT-LTD-LOGO-02 copy.png";
import "../styles/SignUp.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    role: "",
  });
  const [loading, setloading] = useState(false);
  const [departments, setDepartments] = useState([]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your form submission logic here
    try {
      setloading(true);
      const { username, email, password, role, confirmPassword, department } =
        formData;
      const userData = {
        username,
        email,
        password,
        role,
        confirmPassword,
        department,
      };
      const response = await axios.post(
        "http://localhost:5000/api/user/signup",
        {
          ...userData,
        }
      );

      console.log(response.data);
      toast.success("Successfully added");
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
    }
    setloading(false);
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <div className="image-container">
            <img
              src={signupimg}
              alt="Left Img"
              style={{ maxWidth: "90%", height: "auto" }}
            />
          </div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h4" align="center" gutterBottom>
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              type="password"
              required
              margin="normal"
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              type="password"
              required
              margin="normal"
            />
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel id="department-label">Department</InputLabel>
              <Select
                labelId="department-label"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                label="Department"
              >
                {/* <MenuItem value="Custom Dev">Custom Dev</MenuItem> */}
                {departments.map((d) => {
                  return <MenuItem value={d._id}>{d.name}</MenuItem>;
                })}
                {/* <MenuItem value="Wordpress Dev">Wordpress Dev</MenuItem>
                <MenuItem value="Local SEO">Local SEO</MenuItem>
                <MenuItem value="Web SEO">Web SEO</MenuItem>
                <MenuItem value="Social Media">Social Media</MenuItem>
                <MenuItem value="Paid Marketing">Paid Marketing</MenuItem>
                <MenuItem value="Sales">Sales</MenuItem> */}
              </Select>
            </FormControl>

            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Role"
              >
                <MenuItem value="admin">admin</MenuItem>
                <MenuItem value="employee">employee</MenuItem>
              </Select>
            </FormControl>

            <div className="btn-signup">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Sign Up
              </Button>
            </div>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignUp;
