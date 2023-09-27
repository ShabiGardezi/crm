import React from "react";
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
} from "@mui/material";
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
import WebSeoForm from "./Departments/WebSEO";
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
const departmentItems = [
  "Local SEO / GMB Optimization",
  "Wordpress Development",
  "Website SEO",
  "Designing",
  "Content Writing",
  "Custom Development",
  "Paid Marketing",
  "Social Media Management",
  "Customer Reviews Management",
  "Sales Department",
];

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const classes = useStyles();

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
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  const handleWebsiteSEOClick = () => {
    // Navigate to the WebSeoForm component when Website SEO is clicked
    navigate("/webseoform");
  };
  const handleLocalSEOClick = () => {
    // Navigate to the WebSeoForm component when Website SEO is clicked
    navigate("/localseoform");
  };
  const handleSocilaMediaClick = () => {
    // Navigate to the WebSeoForm component when Website SEO is clicked
    navigate("/socialmediaform");
  };
  const handleWordpressClick = () => {
    // Navigate to the WebSeoForm component when Website SEO is clicked
    navigate("/wordpressform");
  };
  const handleReviewClick = () => {
    // Navigate to the WebSeoForm component when Website SEO is clicked
    navigate("/reviewsform");
  };
  const handlePaidMarketingClick = () => {
    // Navigate to the WebSeoForm component when Website SEO is clicked
    navigate("/paidmarketingform");
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
          <Button color="inherit" startIcon={<AddIcon />}>
            Create
          </Button>
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
          <List>
            <ListItem button>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <Assignment />
              </ListItemIcon>
              <ListItemText primary="My Tasks" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <Inbox />
              </ListItemIcon>
              <ListItemText primary="Inbox" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="History" />
            </ListItem>
            <ListItem button onClick={handleProfileMenuOpen}>
              <ListItemIcon>
                <DepartmentIcon />
              </ListItemIcon>
              <ListItemText primary="Department" />
              <ListItemIcon style={{ marginLeft: "auto" }}>
                <ExpandMoreIcon />
              </ListItemIcon>
            </ListItem>
          </List>
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
            {departmentItems.map((item) => (
              <MenuItem
                key={item}
                onClick={
                  item === "Website SEO"
                    ? handleWebsiteSEOClick
                    : item === "Local SEO / GMB Optimization"
                    ? handleLocalSEOClick
                    : item === "Social Media Management"
                    ? handleSocilaMediaClick
                    : item === "Wordpress Development"
                    ? handleWordpressClick
                    : item === "Customer Reviews Management"
                    ? handleReviewClick
                    : item === "Paid Marketing"
                    ? handlePaidMarketingClick
                    : handleProfileMenuClose
                }
              >
                {item}
              </MenuItem>
            ))}
          </Popover>
        </div>
      </Drawer>
    </>
  );
};

export default Header;
