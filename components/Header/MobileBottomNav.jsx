import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useState, useEffect } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PeopleIcon from "@mui/icons-material/People";
import ForumIcon from "@mui/icons-material/Forum";
import { useRouter } from "next/router";

// !todo: current implementation didn't fully utilize the bottom nav comp. It merely use it as some general layout then wrap the bottomNavAction with Nextlink.

const MobileBottomNav = () => {
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
      value={destination}
      sx={{
        position: "fixed",
        bottom: 0,
        height: "64px",
        width: "100%",
        boxShadow: 2,
        zIndex: 100,
      }}
    >
      <BottomNavigationAction
        value="projects"
        label="Projects"
        icon={<DashboardIcon />}
        onClick={() => {
          router.push("/");
        }}
      />
      <BottomNavigationAction
        value="events"
        label="Events"
        icon={<DateRangeIcon />}
        onClick={() => {
          router.push("/events");
        }}
      />

      <BottomNavigationAction
        value="students"
        label="Students"
        icon={<PeopleIcon />}
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

export default MobileBottomNav;
