import React, { useState } from "react";
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
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import signupimg from "../assests/Rank-BPO-PVT-LTD-LOGO-02 copy.png";
import "../styles/SignUp.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Custom Dev",
  });
  const [loading, setloading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your form submission logic here
    try {
      setloading(true);
      const { username, email, password, role, confirmPassword } = formData;
      const userData = { username, email, password, role, confirmPassword };
      const response = await axios.post("http://localhost:5000/api/signup/signup", {
        ...userData,
      });

      console.log(response.data);
      toast.success("Successfully added");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response.data.message);
    }
    setloading(false);
  };

  return (
    <Container maxWidth="lg">
      {/* <Paper elevation={3} className="signup-form"> */}
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
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Role"
              >
                <MenuItem value="Custom Dev">Custom Dev</MenuItem>
                <MenuItem value="Wordpress Dev">Wordpress Dev</MenuItem>
                <MenuItem value="Local SEO">Local SEO</MenuItem>
                <MenuItem value="Web SEO">Web SEO</MenuItem>
                <MenuItem value="Social Media">Social Media</MenuItem>
                <MenuItem value="Paid Marketing">Paid Marketing</MenuItem>
                <MenuItem value="Sales">Sales</MenuItem>
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
      {/* </Paper> */}
    </Container>
  );
};

export default SignUp;
