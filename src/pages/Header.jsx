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
import Badge from "@mui/material/Badge";
import logoImage from "../assests/Navbarlogo.png";
import { useNavigate } from "react-router-dom";
import TrendingDownSharpIcon from "@mui/icons-material/TrendingDownSharp";
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
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
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
  const user = JSON.parse(localStorage.getItem("user"));
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
        const departmentsToExcludeForAll = ["Sales", "Custom Development"];
        const userDepartmentIdToExclude = "651b3409819ff0aec6af1387";
        const departmentsToExcludeForUser = ["Writers", "Designers"];

        const filteredDepartments = response.data.payload.filter(
          (department) =>
            !departmentsToExcludeForAll.includes(department.name) &&
            !(
              user.department._id === userDepartmentIdToExclude &&
              departmentsToExcludeForUser.includes(department.name)
            )
        );

        setDepartments(filteredDepartments);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDepartments();
  }, [user.department._id]);

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
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const [nCount, setNcount] = useState(0);
  useEffect(() => {
    axios
      .get(`${apiUrl}/api/notification/all?userId=${user._id}`)
      .then(({ data }) => {
        const filtered = data.payload.filter(
          (x) => x.isRead === false && x.forInBox === true
        );
        setNcount(filtered.length);
      })
      .catch((err) => console.error(err));
  }, [user]);
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
  const handleListItemClick = () => {
    const depId = user?.department?._id;

    if (depId === "65195c4b504d80e8f11b0d13") {
      navigate("/localseo_clients?depId=65195c4b504d80e8f11b0d13");
    } else if (depId === "65195c81504d80e8f11b0d14") {
      navigate("/website_sheet?depId=65195c81504d80e8f11b0d14");
    } else if (depId === "65195c8f504d80e8f11b0d15") {
      navigate("/webseo_clients?depId=65195c8f504d80e8f11b0d15");
    } else if (depId === "651ada3c819ff0aec6af1380") {
      navigate("/paid_marketing_sheet?depId=651ada3c819ff0aec6af1380");
    } else if (depId === "651ada78819ff0aec6af1381") {
      navigate("/social_media_client?depId=651ada78819ff0aec6af1381");
    }
  };
  const [isSalesDropdownOpen, setSalesDropdownOpen] = useState(false);

  // Step 4: Function to toggle "Sales" dropdown
  const toggleSalesDropdown = () => {
    setSalesDropdownOpen(!isSalesDropdownOpen);
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
                  <Badge
                    badgeContent={nCount}
                    color="primary"
                    invisible={nCount === 0}
                  >
                    <Inbox />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="Inbox" />
              </ListItem>
            </Link>
            {user?.department?._id !== "651b3409819ff0aec6af1387" && (
              <ListItem button onClick={handleListItemClick}>
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Work Status" />
              </ListItem>
            )}
            {user?.department?._id === "651b3409819ff0aec6af1387" && (
              <React.Fragment>
                <ListItem button onClick={toggleClientHistory}>
                  <ListItemIcon>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Work Status" />
                  <ListItemIcon style={{ marginLeft: "auto" }}>
                    <ExpandMoreIcon />
                  </ListItemIcon>
                </ListItem>

                {isClientHistoryOpen && (
                  <div className="client-history-dropdown">
                    <Link to="/localseo_clients?depId=65195c4b504d80e8f11b0d13">
                      <ListItem button>
                        <ListItemText primary="Local SEO / GMB Optimization" />
                      </ListItem>
                    </Link>
                    <Link to="/website_sheet?depId=65195c81504d80e8f11b0d14">
                      <ListItem button>
                        <ListItemText primary="Wordpress Development" />
                      </ListItem>
                    </Link>
                    <Link to="/webseo_clients?depId=65195c8f504d80e8f11b0d15">
                      <ListItem button>
                        <ListItemText primary="Website SEO" />
                      </ListItem>
                    </Link>
                    <Link to="/paid_marketing_sheet?depId=651ada3c819ff0aec6af1380">
                      <ListItem button>
                        <ListItemText primary="Paid Marketing" />
                      </ListItem>
                    </Link>
                    <Link to="/social_media_client?depId=651ada78819ff0aec6af1381">
                      <ListItem button>
                        <ListItemText primary="Social Media / Customer Reviews Management" />
                      </ListItem>
                    </Link>
                  </div>
                )}
              </React.Fragment>
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
                    <AccountBalanceIcon />
                  </ListItemIcon>
                  <Link to="/single_payment_history">
                    <ListItemText primary="Accounts" />
                  </Link>
                </ListItem>
              </div>
            )}
            {user?.role === "admin" && (
              <React.Fragment>
                <ListItem button onClick={toggleSalesDropdown}>
                  <ListItemIcon>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Sales Sheet" />
                  <ListItemIcon style={{ marginLeft: "auto" }}>
                    <ExpandMoreIcon />
                  </ListItemIcon>
                </ListItem>

                {isSalesDropdownOpen && (
                  <div className="client-history-dropdown">
                    <Link to="/fronter_comission_sheet">
                      <ListItem button>
                        <ListItemText primary="Daily Fronter Sale" />
                      </ListItem>
                    </Link>
                    <Link to="/fronter_salary_sheet">
                      <ListItem button>
                        <ListItemText primary="Monthly Fronter Commission" />
                      </ListItem>
                    </Link>
                    <Link to="/closer_comission_sheet">
                      <ListItem button>
                        <ListItemText primary="Daily Closer Sale" />
                      </ListItem>
                    </Link>
                    <Link to="/closer_salary_sheet">
                      <ListItem button>
                        <ListItemText primary="Closer Monthly Commission" />
                      </ListItem>
                    </Link>
                    <Link to="/refund_history">
                      <ListItem button>
                        <ListItemText primary="Charge Back & Refund" />
                      </ListItem>
                    </Link>
                  </div>
                )}
              </React.Fragment>
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
