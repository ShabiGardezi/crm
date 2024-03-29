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
import Header from "./Header";

const SignUp = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
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
        const response = await axios.get(`${apiUrl}/api/departments`);
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
      const response = await axios.post(`${apiUrl}/api/user/signup`, {
        ...userData,
      });

      console.log(response.data);
      toast.success("Successfully added");
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
    }
    setloading(false);
  };

  return (
    <>
      <Header />
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
          <Grid className="signUp-form" item xs={12} sm={6}>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              style={{ marginTop: "20px" }}
            >
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
                style={{ marginLeft: "15px" }}
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
                style={{ marginLeft: "15px" }}
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
                  {departments.map((d) => (
                    <MenuItem key={d._id} value={d._id}>
                      {d.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                variant="outlined"
                fullWidth
                margin="normal"
                style={{ marginLeft: "15px" }}
              >
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Role"
                >
                  <MenuItem value="Tier-1">{`Tier-1 (Admin)`}</MenuItem>
                  <MenuItem value="Tier-2">{`Tier-2 (Sales Manager)`}</MenuItem>
                  <MenuItem value="Tier-3">{`Tier-3 (T.L.)`}</MenuItem>
                  <MenuItem value="Tier-4">{`Tier-4 (Employee)`}</MenuItem>
                </Select>
              </FormControl>

              <div className="btn-signup">
                <Button variant="contained" color="primary" type="submit">
                  Sign Up
                </Button>
              </div>
            </form>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default SignUp;
