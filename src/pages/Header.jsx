import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Button,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import logoImage from "../assests/Navbarlogo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Menu as MenuIcon,
  Add as AddIcon,
  Search as SearchIcon,
  AccountCircle,
  Home,
  Inbox,
  History as HistoryIcon,
  Business as DepartmentIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import AssignmentIcon from "@mui/icons-material/Assignment"; // You can choose a different icon from Material-UI icons
import { makeStyles } from "@mui/styles";
import "../styles/header.css";
import { Link } from "react-router-dom";
import CreateTicketCard from "../components/createTicket";
const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
    height: "100vh",
    width: "25vh",
    marginTop: "50px",
  },
}));

const Header = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isDepartmentOpen, setDepartmentOpen] = useState(false);
  const [isClientHistoryOpen, setClientHistoryOpen] = useState(false);

  const classes = useStyles();
  const [departments, setDepartments] = useState();

  const openCreateModal = () => {
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/departments`);
        const departmentToExclude = "Sales";

        const filteredDepartments = response.data.payload.filter(
          (department) => department.name !== departmentToExclude
        );

        setDepartments(filteredDepartments);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      // Check if the click occurred outside the menu
      if (
        isMenuOpen &&
        e.target.closest(".MuiDrawer-paper") === null &&
        e.target.closest(".MuiIconButton-root") === null
      ) {
        setIsMenuOpen(false);
      }
    };
    // Add the event listener to the window
    window.addEventListener("click", handleOutsideClick);
    return () => {
      // Remove the event listener when the component unmounts
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isMenuOpen]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${apiUrl}/api/user/logout`);
      navigate("/signin");
      localStorage.removeItem("authToken");
      localStorage.clear();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const handleDepartmentSelect = (departmentName) => {
    // Define a mapping of department names to their respective routes
    const departmentRoutes = {
      "Local SEO / GMB Optimization": "/department/localseoform",
      "Wordpress Development": "/department/wordpressform",
      "Website SEO": "/department/webseoform",
      Writers: "/department/writersform",
      Designers: "/department/designersform",
      "Custom Development": "/department/customdevelopment",
      "Paid Marketing": "/department/paidmarketingform",
      "Social Media / Customer Reviews Management":
        "/department/socialmediaform",
      // Sales: "/department/sales",
    };

    // Get the route for the selected department
    const selectedRoute = departmentRoutes[departmentName];

    // Navigate to the selected route
    navigate(selectedRoute);
  };

  // Step 2: Function to toggle "Client History" dropdown
  const toggleClientHistory = () => {
    setClientHistoryOpen(!isClientHistoryOpen);
  };

  // Function to toggle the "Department" dropdown
  const toggleDepartment = () => {
    setDepartmentOpen(!isDepartmentOpen);
  };
  return (
    <>
      <CssBaseline />
      <AppBar position="static" style={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={openCreateModal}
          >
            Create
          </Button>
          <Dialog open={isCreateModalOpen} onClose={closeCreateModal}>
            <DialogContent>
              <CreateTicketCard />
            </DialogContent>
            <DialogActions>
              <Button onClick={closeCreateModal} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
          <div style={{ flexGrow: 1 }} />
          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <SearchIcon />
              <InputBase
                placeholder="Search..."
                inputProps={{ "aria-label": "search" }}
                style={{ marginLeft: "8px", color: "inherit" }}
              />
            </div>
          </div>
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="profile-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
            >
              <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>Settings</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={isMenuOpen} onClose={toggleMenu}>
        <div className={classes.container}>
          <div className="header-logo">
            <img src={logoImage} alt="Logo" className="logo-header" />
          </div>
          <List>
            <Link to="/home">
              <ListItem button>
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
            </Link>
            <Link to="/inbox">
              <ListItem button>
                <ListItemIcon>
                  <Inbox />
                </ListItemIcon>
                <ListItemText primary="Inbox" />
              </ListItem>
            </Link>
            {/* <Link to="/todo">
              <ListItem button>
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText primary="Personal Notebook" />
              </ListItem>
            </Link> */}
            <ListItem button onClick={toggleClientHistory}>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Work Status" />
              {/* Use the same dropdown icon as the "Department" item */}
              <ListItemIcon style={{ marginLeft: "auto" }}>
                <ExpandMoreIcon />
              </ListItemIcon>
            </ListItem>
            {/* Step 4: Add sub-items for "Client History" dropdown */}
            {isClientHistoryOpen && (
              <div className="client-history-dropdown">
                <Link to="/localseo_clients?depId=65195c4b504d80e8f11b0d13">
                  <ListItem button>
                    {/* Local SEO */}
                    <ListItemText primary="Local SEO / GMB Optimization" />
                  </ListItem>
                </Link>
                <Link to="/website_sheet?depId=65195c81504d80e8f11b0d14">
                  <ListItem button>
                    {/* Paid Marketing */}
                    <ListItemText primary="Wordpress Development" />
                  </ListItem>
                </Link>
                <Link to="/webseo_clients?depId=65195c8f504d80e8f11b0d15">
                  <ListItem button>
                    {/* Web SEO */}
                    <ListItemText primary="Website SEO" />
                  </ListItem>
                </Link>
                <Link to="/paid_marketing_sheet?depId=651ada3c819ff0aec6af1380">
                  <ListItem button>
                    {/* Paid Marketing */}
                    <ListItemText primary="Paid Marketing" />
                  </ListItem>
                </Link>
                <Link to="/social_media_client?depId=651ada78819ff0aec6af1381">
                  <ListItem button>
                    {/* Social Media/ Customer Reviews */}
                    <ListItemText primary="Social Media / Customer Reviews Management" />
                  </ListItem>
                </Link>
              </div>
            )}
            <ListItem button onClick={toggleDepartment}>
              <ListItemIcon>
                <DepartmentIcon />
              </ListItemIcon>
              <ListItemText primary="New Ticket" />
              <ListItemIcon style={{ marginLeft: "auto" }}>
                <ExpandMoreIcon />
              </ListItemIcon>
            </ListItem>
            {isDepartmentOpen && (
              <div className="client-history-dropdown">
                {departments?.map((d) => (
                  <ListItem
                    button
                    key={d._id}
                    onClick={() => handleDepartmentSelect(d.name)}
                  >
                    <Link
                      to={`/department/${encodeURIComponent(
                        d.name.toLowerCase()
                      )}`}
                    >
                      <ListItemText primary={d.name} />
                    </Link>
                  </ListItem>
                ))}
              </div>
            )}
            <Link to="/history">
              <ListItem button>
                <ListItemIcon>
                  <HistoryIcon />
                </ListItemIcon>
                <ListItemText primary="Ticket History" />
              </ListItem>
            </Link>

            {user?.role === "admin" && (
              <div className="signup">
                <ListItem button>
                  <ListItemIcon>
                    <AccountCircle />
                  </ListItemIcon>
                  <Link to="/signup">
                    <ListItemText primary="Sign Up" />
                  </Link>
                </ListItem>
              </div>
            )}
          </List>
        </div>
      </Drawer>
    </>
  );
};

export default Header;
