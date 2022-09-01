import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useState } from "react";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import NextLink from "next/link";

// !todo: current implementation didn't fully utilize the bottom nav comp. It merely use it as some general layout then wrap the bottomNavAction with Nextlink.

const BottomNav = () => {
  //const [destination, setDestination] = useState(null);
  //console.log(destination);
  return (
    <BottomNavigation
      sx={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        height: "60px",
        borderTop: 1.5,
        borderColor: "#dbdbdb",
        backgroundColor: "#ffffff",
        "&:hover": {
          cursor: "default",
        },
      }}
      //   value={destination}
      //   onChange={(event, newDestination) => {
      //     setDestination(newDestination);
      //   }}
    >
      <NextLink href="/">
        <BottomNavigationAction
          //   value="/"
          label="Projects"
          icon={<ListAltRoundedIcon />}
        />
      </NextLink>

      <NextLink href="/events">
        <BottomNavigationAction
          //   value="/events"
          label="Events"
          icon={<EventRoundedIcon />}
        />
      </NextLink>
      <NextLink href="/students">
        <BottomNavigationAction
          //   value="/students"
          label="Students"
          icon={<PeopleRoundedIcon />}
        />
      </NextLink>
    </BottomNavigation>
  );
};

export default BottomNav;
