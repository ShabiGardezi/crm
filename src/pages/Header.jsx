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

const Header = ({ onDepartmentSelect }) => {
  const [formData, setFormData] = useState({
    department: "",
  });
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const classes = useStyles();
  const [departments, setDepartments] = useState([]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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

  const handleDepartmentSelection = (selectedDepartment) => {
    // Pass the selected department to the parent component (CRMProjectForm)
    onDepartmentSelect(selectedDepartment);
    console.log(selectedDepartment);
  };

  const user = JSON.parse(localStorage.getItem("user"));

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
            <ListItem button>
              <ListItemIcon>
                <Assignment />
              </ListItemIcon>
              <ListItemText primary="My Tasks" />
            </ListItem>
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
            <Link to="/ticketlist">
              <ListItem button>
                <ListItemIcon>
                  <HistoryIcon />
                </ListItemIcon>
                <ListItemText primary="History" />
              </ListItem>
            </Link>
            {user?.role === "admin" || user?.department === "sales" ? (
              <ListItem button onClick={handleProfileMenuOpen}>
                <ListItemIcon>
                  <DepartmentIcon />
                </ListItemIcon>
                <ListItemText primary="Department" />
                <ListItemIcon style={{ marginLeft: "auto" }}>
                  <ExpandMoreIcon />
                </ListItemIcon>
                <Popover
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={handleProfileMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  PaperProps={{
                    style: {
                      // backgroundColor: "white",
                    },
                  }}
                >
                  {departments.map((d) => (
                    <MenuItem
                      key={d._id}
                      value={d._id}
                      onClick={() => {
                        // Determine the route based on the department name
                        let route = "/";
                        switch (d.name) {
                          case "Website SEO":
                            route = "/webseoform";
                            break;
                          case "Local SEO / GMB Optimization":
                            route = "/localseoform";
                            break;
                          case "Social Media Management":
                            route = "/socialmediaform";
                            break;
                          case "Wordpress Development":
                            route = "/wordpressform";
                            break;
                          case "Customer Reviews Management":
                            route = "/reviewsform";
                            break;
                          case "Custom Development":
                            route = "/customdevelopment";
                            break;
                          case "Paid Marketing":
                            route = "/paidmarketingform";
                            break;
                          // Add more cases for other departments if needed
                          default:
                            break;
                        }
                        // Navigate to the determined route
                        navigate(route);
                        // Close the menu
                        handleProfileMenuClose();
                        // Pass the selected department to the parent component (CRMProjectForm)
                        handleDepartmentSelection(d.name);
                      }}
                    >
                      {d.name}
                    </MenuItem>
                  ))}
                </Popover>
              </ListItem>
            ) : null}
          </List>
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
        </div>
      </Drawer>
    </>
  );
};

export default Header;
