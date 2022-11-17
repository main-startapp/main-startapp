import { useContext, useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import {
  GlobalContext,
  EventContext,
} from "../components/Context/ShareContexts";
import EventList from "../components/Event/EventList";
import EventInfo from "../components/Event/EventInfo";

const Events = () => {
  // global context
  const {
    setChat,
    setChatPartner,
    setShowChat,
    setShowMsg,
    setOldEvent,
    onMedia,
  } = useContext(GlobalContext);
  useEffect(() => {
    setShowChat(true);
    setShowMsg(false);
    setChat(null);
    setChatPartner(null);
    // page related
    setOldEvent(null);
  }, [setChat, setChatPartner, setShowChat, setShowMsg, setOldEvent]);

  // event state init
  const [event, setEvent] = useState(null); // thec selected project
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

      {/* <Grid
        container
        spacing={0}
        direction="row"
        alignItems="start"
        justifyContent="center"
      >

        {onMedia.onDesktop ? (
          <Grid item xs={4}>
            <EventList />
          </Grid>
        ) : (
          event === null && (
            <Grid item xs={12}>
              <EventList />
            </Grid>
          )
        )}

        {onMedia.onDesktop ? (
          <Grid item xs={8}>
            <EventInfo />
          </Grid>
        ) : (
          event !== null && (
            <Grid item xs={12}>
              <EventInfo />
            </Grid>
          )
        )}
      </Grid> */}

      <Box sx={{ display: "flex", justifyContent: "center" }}>
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
            <EventList />
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
            <EventInfo />
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
