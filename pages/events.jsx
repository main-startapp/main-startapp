import { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import {
  GlobalContext,
  EventContext,
} from "../components/Context/ShareContexts";
import EventList from "../components/Event/EventList";
import EventInfo from "../components/Event/EventInfo";
import { motion } from "framer-motion";
import MobileEventsBar from "../components/Header/MobileEventsBar";

const Events = () => {
  // global context
  const {
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
  const [isSearchingClicked, setIsSearchingClicked] = useState(false); // initialize auto set entry flag for searching
  const [isMobileBackClicked, setIsMobileBackClicked] = useState(false); // initialize auto set entry flag for mobile
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchTypeList, setSearchTypeList] = useState([]);

  return (
    <EventContext.Provider
      value={{
        fullEvent,
        setFullEvent,
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
      }}
    >
      {!onMedia.onDesktop && fullEvent === null && <MobileEventsBar />}

      <Box
        id="events-main-box"
        sx={{
          display: "flex",
          justifyContent: "center",
          overflow: "hidden",
          ":hover": {
            cursor: "default",
          },
        }}
      >
        {onMedia.onDesktop ? (
          <>
            <Box
              id="events-desktop-list-box"
              sx={{
                paddingTop: 4,
                paddingLeft: 4,
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
                paddingRight: 4,
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
          </>
        ) : (
          <>
            <Box
              id="events-mobile-list-box"
              sx={{
                display: fullEvent === null ? "block" : "none",
                paddingTop: 2,
                paddingLeft: 2,
                width: "100%",
                backgroundColor: "hoverGray.main",
              }}
            >
              <EventList />
            </Box>
            <Box
              id="events-mobile-info-box"
              sx={{
                display: fullEvent === null ? "none" : "block",
                paddingTop: 2,
                paddingLeft: 2,
                width: "100%",
                backgroundColor: "hoverGray.main",
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
