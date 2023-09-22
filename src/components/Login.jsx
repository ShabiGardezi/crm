import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Grid, Box, Button, Typography, Avatar } from "@mui/material";
import logo from "../assests/Rank-BPO-PVT-LTD-LOGO-02 copy.png";
import employee from "../assests/Employee.png";
import admin from "../assests/Admin.png";
import sales from "../assests/Sales.png";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
const theme = createTheme();

const Login = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle avatar click and navigate to /signin
  const handleAvatarClick = () => {
    navigate("/signin");
  };
  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <img className="logo" src={logo} alt="Logo" />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography variant="h3">
              Rank BPO: Your CRM partner for better customer relationships.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Button
              className="btn-More"
              variant="outlined"
              sx={{
                ":hover": {
                  color: "white",
                  backgroundColor: "#005bea",
                },
              }}
            >
              More
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography variant="h4">Who Are You?</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Grid container spacing={10}>
              <Grid item xs={4} className="grid-item">
                <Avatar
                  alt="Admin"
                  src={admin}
                  sx={{
                    width: 300,
                    height: 300,
                    borderRadius: 5,
                    boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
                    cursor: "pointer", // Add cursor pointer for clickability
                  }}
                  onClick={handleAvatarClick} // Add onClick handler
                />
              </Grid>
              <Grid item xs={4} className="grid-item">
                <Avatar
                  alt="sales"
                  src={sales}
                  sx={{
                    width: 300,
                    height: 300,
                    borderRadius: 5,
                    boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
                    cursor: "pointer", // Add cursor pointer for clickability
                  }}
                  onClick={handleAvatarClick} // Add onClick handler
                />
              </Grid>
              <Grid item xs={4} className="grid-item">
                <Avatar
                  alt="employee"
                  src={employee}
                  sx={{
                    width: 300,
                    height: 300,
                    borderRadius: 5,
                    boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
                    cursor: "pointer", // Add cursor pointer for clickability
                  }}
                  onClick={handleAvatarClick} // Add onClick handler
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Login;
