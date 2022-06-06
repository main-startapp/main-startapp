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
import { ThemeProvider, styled, createTheme } from "@mui/material/styles";
import ExportedImage from "next-image-export-optimizer";

const Navbar = () => {
  const { currentUser } = useAuth();

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
    // https://www.color-hex.com/color/3e95c2
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
          <ExportedImage
            src="/images/EDIUM Platform Logo 256.png"
            placeholder=""
            width={48}
            height={48}
            unoptimized={true}
          />
          <Typography variant="edium" sx={{ fontSize: "2em", ml: 1 }}>
            {"Edium"}
          </Typography>
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
          <StyledLink href="/">
            <Typography sx={{ fontSize: "1.1em" }}>{"Projects"}</Typography>
          </StyledLink>
          <Divider sx={{ ml: 3, mr: 3 }} orientation="vertical" flexItem />
          <StyledLink href="/events">
            <Typography sx={{ fontSize: "1.1em" }}>{"Events"}</Typography>
          </StyledLink>
          <Divider sx={{ ml: 3, mr: 3 }} orientation="vertical" flexItem />
          <StyledLink href="/students">
            <Typography sx={{ fontSize: "1.1em" }}>{"Students"}</Typography>
          </StyledLink>
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
                sx={{
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

const StyledLink = styled(Link)(({ theme }) => ({
  color: "white",
  textDecoration: "none",
}));
