import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import { useContext, useState } from "react";
import { auth } from "../../firebase";
import { useAuth } from "../Context/AuthContext";
import { GlobalContext } from "../Context/ShareContexts";
import NextLink from "next/link";

const UserIconMenu = (props) => {
  const iconHeight = props.iconHeight;
  const avatarHeight = props.avatarHeight;

  // context
  const { currentUser } = useAuth();
  const { ediumUser } = useContext(GlobalContext);

  // menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenu = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const handleMenuLogout = (e) => {
    // signout user -> close menu
    e.stopPropagation();
    auth.signOut();
    setAnchorEl(null);
    window.location.reload(true); // do a server refresh
  };

  return (
    <>
      <IconButton
        id="navbar-menu-button"
        disabled={!currentUser}
        aria-controls={open ? "navbar-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={(e) => handleMenu(e)}
        sx={{
          height: iconHeight,
          width: iconHeight,
          padding: 0,
        }}
      >
        <Avatar
          sx={{ height: avatarHeight, width: avatarHeight }}
          src={ediumUser?.photo_url}
          referrerPolicy="no-referrer"
        />
      </IconButton>
      <Menu
        id="navbar-menu"
        anchorEl={anchorEl}
        // anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={open}
        onClose={(e) => {
          handleMenuClose(e);
        }}
        MenuListProps={{
          "aria-labelledby": "navbar-menu-button",
        }}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 2,
          },
        }}
      >
        <MenuItem
          onClick={(e) => {
            handleMenuClose(e);
          }}
        >
          <NextLink
            href={{
              pathname: "/students/create",
            }}
            passHref
          >
            Edit Profile
          </NextLink>
        </MenuItem>
        {/* <MenuItem onClick={handleUserMenuClose}>
              <NextLink href="/team/management" passHref>
                <MenuItemLink>Team Management</MenuItemLink>
              </NextLink>
            </MenuItem> */}
        <MenuItem
          onClick={(e) => {
            handleMenuLogout(e);
          }}
        >
          Log Out
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserIconMenu;
