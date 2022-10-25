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
import { styled } from "@mui/material/styles";
import ExportedImage from "next-image-export-optimizer";
import { GlobalContext } from "../Context/ShareContexts";

const Navbar = () => {
  // context
  const { currentUser } = useAuth();
  const { ediumUser, onMedia } = useContext(GlobalContext);

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
    // window.location.reload();
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
          minHeight: 0,
          "@media (min-width: 600px)": {
            minHeight: 0,
          },
          height: onMedia.onDesktop ? "64px" : "48px",
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
            width={onMedia.onDesktop ? 48 : 36}
            height={onMedia.onDesktop ? 48 : 36}
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
            <NextLink href="/">
              <PageLink>Projects</PageLink>
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
            <NextLink href="/events">
              <PageLink>Events</PageLink>
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
            <NextLink href="/students">
              <PageLink>Students</PageLink>
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
          <IconButton
            id="navbar-menu-button"
            disabled={!currentUser}
            aria-controls={open ? "navbar-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            sx={
              onMedia.onDesktop
                ? {
                    width: "64px",
                    height: "64px",
                  }
                : {
                    width: "48px",
                    height: "48px",
                  }
            }
            onClick={(e) => handleUserMenu(e)}
          >
            <Avatar
              sx={
                onMedia.onDesktop
                  ? {
                      width: "48px",
                      height: "48px",
                    }
                  : {
                      width: "36px",
                      height: "36px",
                    }
              }
              src={ediumUser?.photo_url}
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
              <NextLink href="/students/create" passHref>
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
  fontSize: "1.1em",
  ":hover": {
    cursor: "pointer",
  },
}));

const MenuItemLink = styled(MuiLink)(({ theme }) => ({
  color: "#000000",
  textDecoration: "none",
}));
