import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Button,
  FormControl,
  TextField,
  Typography,
  Container,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import SigninImg from "../assests/Rank-BPO-PVT-LTD-LOGO-02 copy.png";
import "../styles/SignIn.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const theme = createTheme();

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false); // To show/hide the password reset form
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URL;

  // Load saved email and password from localStorage on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:5000/api/user/signin`,
        {
          email: email,
          password: password,
        }
      );

      console.log(response.data);
      localStorage.setItem("user", JSON.stringify(response.data.payload));
      navigate("/home");
    } catch (error) {
      console.log("Error:", error);
      toast.error(error.response.data.message);
    }
  };
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberedPassword = localStorage.getItem("rememberedPassword");
    if (rememberedEmail && rememberedPassword) {
      setEmail(rememberedEmail);
      setPassword(rememberedPassword);
      setRememberMe(true);
    }
  }, []);

  return (
    // <ThemeProvider theme={theme}>
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <div className="image-container">
            <img
              src={SigninImg}
              alt="Left Img"
              style={{ maxWidth: "80%", height: "auto" }}
            />
          </div>
        </Grid>
        <Grid className="signin-form" item xs={12} md={6}>
          <Typography variant="h4">Sign In</Typography>

          <form onSubmit={handleLogin}>
            <FormControl fullWidth margin="normal">
              <TextField
                type="email"
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                type="password"
                label="Password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormControl>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                }
                label="Remember Me"
              />
            </div>
            <Button
              className="signin-btn"
              type="submit"
              variant="contained"
              color="primary"
            >
              Sign In
            </Button>
          </form>
          <Grid item>
            <Typography variant="body2">
              Don't have an account?
              <Link to="/signup">
                <Button
                  color="primary"
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  Sign Up
                </Button>
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Container>
    // </ThemeProvider>
  );
};

export default SignIn;
