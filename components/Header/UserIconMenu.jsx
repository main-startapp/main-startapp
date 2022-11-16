import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import { useContext, useState } from "react";
import { auth } from "../../firebase";
import { useAuth } from "../Context/AuthContext";
import { GlobalContext } from "../Context/ShareContexts";
import { MenuItemLink } from "../Reusable/Resusable";
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

  return (
    <>
      <IconButton
        id="navbar-menu-button"
        disabled={!currentUser}
        aria-controls={open ? "navbar-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{
          height: iconHeight,
          width: iconHeight,
          padding: 0,
        }}
        onClick={(e) => handleUserMenu(e)}
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
    </>
  );
};

export default UserIconMenu;
