import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Divider,
  Link,
  Menu,
  MenuItem,
} from "@mui/material";
import { auth } from "../../firebase";
import { useAuth } from "../Context/AuthContext";
import { makeStyles } from "@mui/styles";

// override the style Accordion Summary
const useStyles = makeStyles({
  customLink: {
    color: "white",
    textDecoration: "none",
  },
});

const Navbar = () => {
  const { currentUser } = useAuth();
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const handleUserMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };
  const handleUserMenuLogout = () => {
    // signout user -> close menu
    auth.signOut();
    setAnchorEl(null);
  };
  return (
    // https://www.color-hex.com/color/6fa8dc
    <AppBar position="static" sx={{ bgcolor: "#3e95c2" }} elevation={0}>
      <Toolbar
        sx={{
          display: "flex",
          // flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          maxHeight: "64px",
        }}
      >
        {/* icon */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            flexBasis: 0,
            justifyContent: "flex-start",
          }}
        >
          <Typography sx={{ fontSize: "1.5em" }}>{"Edium"}</Typography>
        </Box>
        {/* tabs */}
        {/* https://stackoverflow.com/questions/32378953/keep-the-middle-item-centered-when-side-items-have-different-widths */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Link className={classes.customLink} href="/">
            <Typography sx={{ fontSize: "1.1em" }}>{"Projects"}</Typography>
          </Link>
          <Divider sx={{ ml: 3, mr: 3 }} orientation="vertical" flexItem />
          <Typography sx={{ fontSize: "1.1em" }}>{"Events"}</Typography>
          <Divider sx={{ ml: 3, mr: 3 }} orientation="vertical" flexItem />
          <Link className={classes.customLink} href="/students">
            <Typography sx={{ fontSize: "1.1em" }}>{"Students"}</Typography>
          </Link>
        </Box>
        {/* user */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            flexBasis: 0,
            justifyContent: "end",
          }}
        >
          <Typography sx={{ fontSize: "1.1em" }}>
            {currentUser.displayName}
          </Typography>
          <IconButton onClick={handleUserMenu}>
            <Avatar src={currentUser.photoURL} />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
          >
            <MenuItem onClick={handleUserMenuClose}>
              <Link
                style={{
                  textDecoration: "none",
                  color: "#000",
                }}
                href="/student/debugcreate"
              >
                Debug Edit Profile
              </Link>
            </MenuItem>
            <MenuItem onClick={handleUserMenuClose}>
              <Link
                style={{
                  textDecoration: "none",
                  color: "#000",
                }}
                href="/student/create"
              >
                Edit Profile
              </Link>
            </MenuItem>
            <MenuItem onClick={handleUserMenuLogout}>Log Out</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
