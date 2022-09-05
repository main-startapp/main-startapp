import { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Divider,
  Link as MuiLink,
  Menu,
  MenuItem,
} from "@mui/material";
import NextLink from "next/link";
import { auth } from "../../firebase";
import { useAuth } from "../Context/AuthContext";
import { ThemeProvider, styled, createTheme } from "@mui/material/styles";
import ExportedImage from "next-image-export-optimizer";
import { GlobalContext } from "../Context/ShareContexts";

const Navbar = () => {
  // currentUser
  const { currentUser } = useAuth();

  // context
  const { onMedia } = useContext(GlobalContext);

  // menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
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
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#3e95c2",
        "&:hover": {
          cursor: "default",
        },
      }}
      elevation={0}
    >
      <Toolbar
        sx={{
          display: "flex",
          // flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          height: "64px",
          paddingX: onMedia.onDesktop ? 3 : 1.5,
        }}
        disableGutters
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
            src="/images/EDIUMPlatformLogo256.png"
            placeholder=""
            width={48}
            height={48}
          />
          {/* <Typography variant="edium" sx={{ fontSize: "2em", ml: 1 }}>
            Edium
          </Typography> */}
        </Box>
        {/* tabs */}
        {/* https://stackoverflow.com/questions/32378953/keep-the-middle-item-centered-when-side-items-have-different-widths */}
        {onMedia.onDesktop && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <NextLink href="/" passHref>
              <PageLink>
                <Typography sx={{ fontSize: "1.1em" }}>Projects</Typography>
              </PageLink>
            </NextLink>
            <Divider
              sx={{
                ml: 3,
                mr: 3,
                borderRightWidth: 1.5,
                borderColor: "black",
              }}
              orientation="vertical"
              flexItem
            />
            <NextLink href="/events" passHref>
              <PageLink>
                <Typography sx={{ fontSize: "1.1em" }}>Events</Typography>
              </PageLink>
            </NextLink>
            <Divider
              sx={{
                ml: 3,
                mr: 3,
                borderRightWidth: 1.5,
                borderColor: "black",
              }}
              orientation="vertical"
              flexItem
            />
            <NextLink href="/students" passHref>
              <PageLink>
                <Typography sx={{ fontSize: "1.1em" }}>Students</Typography>
              </PageLink>
            </NextLink>
          </Box>
        )}
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
          {/* <Typography sx={{ fontSize: "1.1em" }}>
            {currentUser.displayName}
          </Typography> */}
          <IconButton
            id="navbar-menu-button"
            aria-controls={open ? "navbar-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={(e) => handleUserMenu(e)}
          >
            <Avatar
              sx={{
                width: "48px",
                height: "48px",
                border: 1,
                borderColor: "black",
                color: "#dbdbdb",
                backgroundColor: "#ffffff",
              }}
              src={currentUser.photoURL}
              referrerPolicy="no-referrer"
            />
          </IconButton>
          <Menu
            id="navbar-menu"
            anchorEl={anchorEl}
            // anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={open}
            onClose={handleUserMenuClose}
            MenuListProps={{
              "aria-labelledby": "navbar-menu-button",
            }}
          >
            <MenuItem onClick={handleUserMenuClose}>
              <NextLink href="/student/create" passHref>
                <MenuItemLink>Edit Profile</MenuItemLink>
              </NextLink>
            </MenuItem>
            {/* <MenuItem onClick={handleUserMenuClose}>
              <NextLink href="/team/management" passHref>
                <MenuItemLink>Team Management</MenuItemLink>
              </NextLink>
            </MenuItem> */}
            <MenuItem onClick={handleUserMenuLogout}>Log Out</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

const PageLink = styled(MuiLink)(({ theme }) => ({
  color: "#ffffff",
  textDecoration: "none",
}));

const MenuItemLink = styled(MuiLink)(({ theme }) => ({
  color: "#000000",
  textDecoration: "none",
}));
