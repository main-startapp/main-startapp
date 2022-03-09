import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
} from "@mui/material";
import { auth } from "../../firebase";
import { useAuth } from "../Context/AuthContext";
// import useStyles from './styles'

const Navbar = () => {
  // const classes = useStyles()
  const { currentUser } = useAuth();
  return (
    // https://www.color-hex.com/color/6fa8dc
    <AppBar position="static" sx={{ background: "#6fa8dc" }} elevation={0}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5">Edium</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6">{currentUser.displayName}</Typography>
          <IconButton onClick={() => auth.signOut()}>
            <Avatar src={currentUser.photoURL} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
