import { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Avatar,
  Link as MuiLink,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import NextLink from "next/link";
import { auth } from "../../firebase";
import { useAuth } from "../Context/AuthContext";
import { styled } from "@mui/material/styles";
import ExportedImage from "next-image-export-optimizer";
import { GlobalContext } from "../Context/ShareContexts";
import { MenuItemLink } from "../Reusable/Resusable";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PeopleIcon from "@mui/icons-material/People";

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
          // minHeight: 0,
          // "@media (min-width: 600px)": {
          //   minHeight: 0,
          // },
          height: "64px",
          paddingLeft: "12.5%",
          paddingRight: `calc(12.5% - 12px)`,
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
            width={40}
            height={40}
          />
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
          <Stack direction="row" spacing={8}>
            <NextLink href="/">
              <LinkIconBox
                sx={{
                  ":hover": {
                    cursor: "pointer",
                  },
                  borderBottom: url.pathname === "/" ? 2 : 0,
                }}
              >
                <DashboardIcon
                  color={
                    url.pathname === "/" ? "text.primary" : "unselectedIcon"
                  }
                  sx={{
                    height: "44px",
                    fontSize: "28px",
                  }}
                />
                <PageLink
                  color={
                    url.pathname === "/"
                      ? "text.primary"
                      : "unselectedIcon.main"
                  }
                >
                  {"Projects"}
                </PageLink>
              </LinkIconBox>
            </NextLink>
            <NextLink href="/events/">
              <LinkIconBox
                sx={{
                  ":hover": {
                    cursor: "pointer",
                  },
                  borderBottom: url.pathname === "/events/" ? 2 : 0,
                }}
              >
                <DateRangeIcon
                  color={
                    url.pathname === "/events/"
                      ? "text.primary"
                      : "unselectedIcon"
                  }
                  sx={{
                    height: "44px",
                    fontSize: "28px",
                  }}
                />
                <PageLink
                  color={
                    url.pathname === "/events/"
                      ? "text.primary"
                      : "unselectedIcon.main"
                  }
                >
                  {"Events"}
                </PageLink>
              </LinkIconBox>
            </NextLink>
            <NextLink href="/students/">
              <LinkIconBox
                sx={{
                  ":hover": {
                    cursor: "pointer",
                  },
                  borderBottom: url.pathname === "/students/" ? 2 : 0,
                }}
              >
                <PeopleIcon
                  color={
                    url.pathname === "/students/"
                      ? "text.primary"
                      : "unselectedIcon"
                  }
                  sx={{
                    height: "44px",
                    fontSize: "28px",
                  }}
                />
                <PageLink
                  color={
                    url.pathname === "/students/"
                      ? "text.primary"
                      : "unselectedIcon.main"
                  }
                >
                  {"Students"}
                </PageLink>
              </LinkIconBox>
            </NextLink>
          </Stack>
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
          <IconButton
            id="navbar-menu-button"
            disabled={!currentUser}
            aria-controls={open ? "navbar-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            sx={{
              width: "64px",
              height: "64px",
              padding: 0,
            }}
            onClick={(e) => handleUserMenu(e)}
          >
            <Avatar
              sx={{ height: "40px", width: "40px" }}
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
            sx={{
              "& .MuiPaper-root": {
                borderRadius: 2,
              },
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
  fontSize: "16px",
  fontWeight: theme.typography.fontWeightMedium,
  textDecoration: "none",
  height: "20px",
  display: "flex",
  alignItems: "end",
}));
