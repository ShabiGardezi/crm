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
  Popover,
  Dialog,
  DialogContent,
  DialogActions,
  Select,
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
  Assignment,
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
      await axios.post("http://localhost:5000/api/user/logout");
      console.log("Logout successful");
      navigate("/signin");
      localStorage.removeItem("authToken");
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
      "Custom Development": "/department/customdevelopment",
      "Paid Marketing": "/department/paidmarketingform",
      "Social Media Management": "/department/socialmediaform",
      "Customer Reviews Management": "/department/reviewsform",
      Sales: "/department/sales",
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
      <AppBar position="static">
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
            <Link to="/info">
              <ListItem button>
                <ListItemIcon>
                  <Assignment />
                </ListItemIcon>
                <ListItemText primary="My Tasks" />
              </ListItem>
            </Link>
            <Link to="/todo">
              <ListItem button>
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText primary="Personal Notebook" />
              </ListItem>
            </Link>
            <ListItem button>
              <ListItemIcon>
                <Inbox />
              </ListItemIcon>
              <ListItemText primary="Inbox" />
            </ListItem>
            <Link to="/history">
              <ListItem button>
                <ListItemIcon>
                  <HistoryIcon />
                </ListItemIcon>
                <ListItemText primary="Ticket History" />
              </ListItem>
            </Link>
            <ListItem button onClick={toggleClientHistory}>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Client History" />
              {/* Use the same dropdown icon as the "Department" item */}
              <ListItemIcon style={{ marginLeft: "auto" }}>
                <ExpandMoreIcon />
              </ListItemIcon>
            </ListItem>

            {/* Step 4: Add sub-items for "Client History" dropdown */}
            {isClientHistoryOpen && (
              <div className="client-history-dropdown">
                <Link to="/webseo_clients">
                  <ListItem button>
                    {/* Web SEO */}
                    <ListItemText primary="Web SEO" />
                  </ListItem>
                </Link>

                <ListItem button>
                  {/* Local SEO */}
                  <ListItemText primary="Local SEO" />
                </ListItem>
                <ListItem button>
                  {/* Paid Marketing */}
                  <ListItemText primary="Paid Marketing" />
                </ListItem>
                <ListItem button>
                  {/* Wordpress */}
                  <ListItemText primary="Wordpress" />
                </ListItem>
              </div>
            )}
            <ListItem button onClick={toggleDepartment}>
              <ListItemIcon>
                <DepartmentIcon />
              </ListItemIcon>
              <ListItemText primary="Department" />
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
                    <Link to={`/department/${d.name}`}>
                      <ListItemText primary={d.name} />
                    </Link>
                  </ListItem>
                ))}
              </div>
            )}

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
