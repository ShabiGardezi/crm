import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Typography,
  Button,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  // makeStyles,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Container,
  Box,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import "../styles/header.css";
// import makeStyles from "@mui/styles";
import {
  Menu as MenuIcon,
  Add as AddIcon,
  Search as SearchIcon,
  AccountCircle,
  Home,
  Assignment,
  Inbox,
} from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // justifyContent: "center",
    height: "100vh",
    width: "30vh",
    marginTop: "50px",
    // background: "black",
  },
}));

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(true);

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
              <MenuItem onClick={handleProfileMenuClose}>Logout</MenuItem>
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
          </List>
        </div>
      </Drawer>
    </>
  );
};

export default Header;
