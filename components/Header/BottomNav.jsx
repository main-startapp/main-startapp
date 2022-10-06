import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useState, useEffect } from "react";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import ForumIcon from "@mui/icons-material/Forum";
import { useRouter } from "next/router";

// !todo: current implementation didn't fully utilize the bottom nav comp. It merely use it as some general layout then wrap the bottomNavAction with Nextlink.

const BottomNav = () => {
  const [destination, setDestination] = useState("");
  const router = useRouter();

  useEffect(() => {
    router.pathname === "/" && setDestination("projects");
    router.pathname === "/events" && setDestination("events");
    router.pathname === "/students" && setDestination("students");
    router.pathname === "/chats" && setDestination("chats");
  }, [router.pathname]);

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
        zIndex: 100,
      }}
      value={destination}
    >
      <BottomNavigationAction
        value="projects"
        label="Projects"
        icon={<ListAltRoundedIcon />}
        onClick={() => {
          router.push("/");
        }}
      />
      <BottomNavigationAction
        value="events"
        label="Events"
        icon={<EventRoundedIcon />}
        onClick={() => {
          router.push("/events");
        }}
      />

      <BottomNavigationAction
        value="students"
        label="Students"
        icon={<PeopleRoundedIcon />}
        onClick={() => {
          router.push("/students");
        }}
      />

      <BottomNavigationAction
        value="chats"
        label="Chats"
        icon={<ForumIcon />}
        onClick={() => {
          router.push("/chats");
        }}
      />
    </BottomNavigation>
  );
};

export default BottomNav;
