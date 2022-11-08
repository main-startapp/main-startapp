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
  Stack,
  Tabs,
  Tab,
} from "@mui/material";
import NextLink from "next/link";
import { auth } from "../../firebase";
import { useAuth } from "../Context/AuthContext";
import { styled } from "@mui/material/styles";
import ExportedImage from "next-image-export-optimizer";
import { GlobalContext } from "../Context/ShareContexts";
import Diversity2Icon from "@mui/icons-material/Diversity2";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { useMemo } from "react";

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
    window.location.reload(true); // do a server refresh
  };

  // url
  const url = new URL(window.location.href);

  return (
    <AppBar
      color="background"
      elevation={0}
      position="static"
      sx={{
        borderBottom: 1.5,
        borderColor: "divider",
        "&:hover": {
          cursor: "default",
        },
      }}
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
        {/* edium icon */}
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
            width={onMedia.onDesktop ? 40 : 30}
            height={onMedia.onDesktop ? 40 : 30}
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
            <Stack direction="row" spacing={8}>
              <NextLink href="/">
                <LinkIconBox sx={url.pathname === "/" && { borderBottom: 1.5 }}>
                  <Diversity2Icon
                    color={
                      url.pathname === "/" ? "text.primary" : "unselectedIcon"
                    }
                    sx={{ mt: 1.5, mb: 0.5, fontSize: "32px" }}
                  />
                  <PageLink
                    color={
                      url.pathname === "/"
                        ? "text.primary"
                        : "unselectedIcon.main"
                    }
                    sx={{ mb: "3px" }}
                  >
                    Projects
                  </PageLink>
                </LinkIconBox>
              </NextLink>
              <NextLink href="/events/">
                <LinkIconBox
                  sx={url.pathname === "/events/" && { borderBottom: 1.5 }}
                >
                  <LocalActivityIcon
                    color={
                      url.pathname === "/events/"
                        ? "text.primary"
                        : "unselectedIcon"
                    }
                    sx={{ mt: 1.5, mb: 0.5, fontSize: "32px" }}
                  />
                  <PageLink
                    color={
                      url.pathname === "/events/"
                        ? "text.primary"
                        : "unselectedIcon.main"
                    }
                    sx={{ mb: "3px" }}
                  >
                    Events
                  </PageLink>
                </LinkIconBox>
              </NextLink>
              <NextLink href="/students/">
                <LinkIconBox
                  sx={url.pathname === "/students/" && { borderBottom: 1.5 }}
                >
                  <PersonSearchIcon
                    color={
                      url.pathname === "/students/"
                        ? "text.primary"
                        : "unselectedIcon"
                    }
                    sx={{ mt: 1.5, mb: 0.5, fontSize: "32px" }}
                  />
                  <PageLink
                    color={
                      url.pathname === "/students/"
                        ? "text.primary"
                        : "unselectedIcon.main"
                    }
                    sx={{ mb: "3px" }}
                  >
                    Students
                  </PageLink>
                </LinkIconBox>
              </NextLink>
            </Stack>
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
                      width: "40px",
                      height: "40px",
                    }
                  : {
                      width: "30px",
                      height: "30px",
                    }
              }
              src={currentUser?.photoURL}
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

const LinkIconBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
}));

// since the nav bar is fixed height, the font should also use fixed size
const PageLink = styled(MuiLink)(({ theme }) => ({
  fontSize: "12px",
  fontWeight: "600",
  textDecoration: "none",
  ":hover": {
    cursor: "pointer",
  },
}));

const MenuItemLink = styled(MuiLink)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: "none",
}));
