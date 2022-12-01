import { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import {
  GlobalContext,
  EventContext,
} from "../components/Context/ShareContexts";
import EventList from "../components/Event/EventList";
import EventInfo from "../components/Event/EventInfo";
import { motion } from "framer-motion";

const Events = () => {
  // global context
  const {
    setChat,
    setChatPartner,
    setShowChat,
    setShowMsg,
    setOldEvent,
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
    // page related
    setOldEvent(null);
  }, [setChat, setChatPartner, setOldEvent, setShowChat, setShowMsg]);

  // turn off introduction animation after initialization
  useEffect(() => {
    setIsAnimated({ ...isAnimated, events: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // event state init
  const [event, setEvent] = useState(null); // the selected project
  const [creatorUser, setCreatorUser] = useState(null); // the user info of project's creator
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  return (
    <EventContext.Provider
      value={{
        event,
        setEvent,
        creatorUser,
        setCreatorUser,
        searchTerm,
        setSearchTerm,
        searchCategory,
        setSearchCategory,
      }}
    >
      {/* Toolbar for searching keywords, category and filter */}
      {/* <EventsPageBar /> */}

      <Box
        sx={{ display: "flex", justifyContent: "center", overflow: "hidden" }}
      >
        {onMedia.onDesktop ? (
          <Box
            sx={{
              paddingTop: 4,
              paddingLeft: 4,
              paddingRight: 2,
              width: "38.46%",
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
        ) : (
          event === null && (
            <Box
              sx={{
                paddingTop: 2,
                paddingLeft: 2,
                width: "100%",
                backgroundColor: "hoverGray.main",
              }}
            >
              <EventList />
            </Box>
          )
        )}
        {onMedia.onDesktop ? (
          <Box
            sx={{
              paddingTop: 4,
              paddingLeft: 2,
              paddingRight: 4,
              width: "61.54%",
              maxWidth: "896px",
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
        ) : (
          event !== null && (
            <Box
              sx={{
                paddingTop: 2,
                paddingLeft: 2,
                paddingRight: 2,
                width: "100%",
                backgroundColor: "hoverGray.main",
              }}
            >
              <EventInfo />
            </Box>
          )
        )}
      </Box>
    </EventContext.Provider>
  );
};

export default Events;
