import { useContext, useEffect, useState } from "react";
import { Box, Paper, Tooltip } from "@mui/material";
import {
  GlobalContext,
  EventContext,
} from "../components/Context/ShareContexts";
import EventList from "../components/Event/EventList";
import EventInfo from "../components/Event/EventInfo";
import { motion } from "framer-motion";
import MobileEventsBar from "../components/Header/MobileEventsBar";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventCalendar from "../components/Event/EventCalendar";
import { styled } from "@mui/material/styles";
import { findItemFromList } from "../components/Reusable/Resusable";

const Events = () => {
  // global context
  const {
    events,
    users,
    setChat,
    setChatPartner,
    setShowChat,
    setShowMsg,
    onMedia,
    isAnimated,
    setIsAnimated,
  } = useContext(GlobalContext);

  // page setup
  useEffect(() => {
    setShowChat(true);
    setShowMsg(false);
    setChat(null);
    setChatPartner(null);
  }, [setChat, setChatPartner, setShowChat, setShowMsg]);

  // turn off introduction animation after initialization
  useEffect(() => {
    setIsAnimated({ ...isAnimated, events: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // event state init
  const [fullEvent, setFullEvent] = useState(null); // the selected event with extra data
  const [fullEvents, setFullEvents] = useState([]); // the events list with extra data
  const [isSearchingClicked, setIsSearchingClicked] = useState(false); // initialize auto set entry flag for searching
  const [isMobileBackClicked, setIsMobileBackClicked] = useState(false); // initialize auto set entry flag for mobile
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchTypeList, setSearchTypeList] = useState([]);

  const [modeType, setModeType] = useState("list");

  // build data for this page
  // events with extra info from other dataset (creator, merged tags)
  useEffect(() => {
    setFullEvents(
      events?.map((event) => {
        // creator
        const eventCreator = findItemFromList(users, "uid", event?.creator_uid);
        // allTags
        let eventTags = [];
        if (event?.tags?.length > 0) {
          eventTags = eventTags.concat(event.tags); // event tags
        }
        if (
          eventCreator?.role === "org_admin" &&
          eventCreator?.org_tags?.length > 0
        ) {
          eventTags = eventTags.concat(eventCreator.org_tags); // org tags
        }
        // category
        eventTags.push(event?.category?.toLowerCase());
        return {
          event: event,
          creator: eventCreator,
          allTags: eventTags,
        };
      })
    );
  }, [events, users]);

  return (
    <EventContext.Provider
      value={{
        fullEvent,
        setFullEvent,
        fullEvents,
        setFullEvents,
        isSearchingClicked,
        setIsSearchingClicked,
        isMobileBackClicked,
        setIsMobileBackClicked,
        searchTerm,
        setSearchTerm,
        searchCategory,
        setSearchCategory,
        searchTypeList,
        setSearchTypeList,
        setModeType,
      }}
    >
      {!onMedia.onDesktop && fullEvent === null && <MobileEventsBar />}

      <Box
        id="events-main-box"
        sx={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          ":hover": {
            cursor: "default",
          },
        }}
      >
        {onMedia.onDesktop ? (
          <>
            <Box
              id="events-desktop-regular-view-box"
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                visibility: modeType === "list" ? "visible" : "hidden",
                width: modeType === "list" ? "100%" : "0%",
              }}
            >
              <Box
                id="events-desktop-list-box"
                sx={{
                  paddingTop: 4,
                  paddingLeft: 8,
                  paddingRight: 2,
                  width: "38.88889%",
                  maxWidth: "560px",
                }}
              >
                <motion.div
                  initial={isAnimated.events ? false : { x: -200, opacity: 0 }}
                  animate={isAnimated.events ? false : { x: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <EventList />
                </motion.div>
              </Box>
              <Box
                id="events-desktop-info-box"
                sx={{
                  paddingTop: 4,
                  paddingLeft: 2,
                  paddingRight: 8,
                  width: "61.11111%",
                  maxWidth: "880px",
                }}
              >
                <motion.div
                  initial={isAnimated.events ? false : { y: 200, opacity: 0 }}
                  animate={isAnimated.events ? false : { y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <EventInfo />
                </motion.div>
              </Box>
            </Box>
            <Box
              id="events-desktop-calendar-view-box"
              sx={{
                visibility: modeType === "calendar" ? "visible" : "hidden",
                width: modeType === "calendar" ? "100%" : "0%",
                maxWidth: "1440px",
              }}
            >
              <Box sx={{ paddingTop: 4, paddingX: 8 }}>
                <EventCalendar />
              </Box>
            </Box>
            <Tooltip title="List View" placement="right">
              <ViewPaper
                id="events-list-view-button"
                elevation={3}
                onClick={() => {
                  setModeType("list");
                }}
                sx={{
                  backgroundColor:
                    modeType === "list" ? "lightPrimary.main" : "default",
                  width: modeType === "list" ? "54px" : "40px",
                  top: `calc(64px + 32px)`,
                  ":hover": {
                    cursor: "pointer",
                  },
                }}
              >
                <ListAltIcon />
              </ViewPaper>
            </Tooltip>
            <Tooltip title="Calendar View" placement="right">
              <ViewPaper
                id="events-calendar-view-button"
                elevation={3}
                onClick={() => {
                  setModeType("calendar");
                }}
                sx={{
                  backgroundColor:
                    modeType === "calendar" ? "lightPrimary.main" : "default",
                  width: modeType === "calendar" ? "54px" : "42px",
                  top: `calc(64px + 32px + 56px + 8px)`,
                  ":hover": {
                    cursor: "pointer",
                  },
                }}
              >
                <CalendarMonthIcon />
              </ViewPaper>
            </Tooltip>
          </>
        ) : (
          <>
            <Box
              id="events-mobile-list-box"
              sx={{
                display: fullEvent === null ? "block" : "none",
                // paddingTop: 2,
                // paddingLeft: 2,
                width: "100%",
                backgroundColor: "gray100.main",
              }}
            >
              <EventList />
            </Box>
            <Box
              id="events-mobile-info-box"
              sx={{
                display: fullEvent === null ? "none" : "block",
                // paddingTop: 2,
                // paddingLeft: 2,
                width: "100%",
                backgroundColor: "gray100.main",
              }}
            >
              <EventInfo />
            </Box>
          </>
        )}
      </Box>
    </EventContext.Provider>
  );
};

export default Events;

const ViewPaper = styled(Paper)(({ theme }) => ({
  height: "56px",
  position: "absolute",
  left: 0,
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  paddingRight: "12px",
  borderRadius: "0px 16px 16px 0px",
}));
