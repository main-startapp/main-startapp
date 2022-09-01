import { useContext, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import {
  GlobalContext,
  EventContext,
} from "../components/Context/ShareContexts";
import EventList from "../components/Event/EventList";
// import ProjectPageBar from "../components/Header/ProjectPageBar";
//import ProjectInfo from "../components/Project/ProjectInfo";

const Events = () => {
  // global context
  const { setChat, setShowChat, setShowMsg, onMedia } =
    useContext(GlobalContext);
  useEffect(() => {
    setShowChat(true);
    setShowMsg(false);
    setChat(null);
  }, [setChat, setShowChat, setShowMsg]);

  // event state init
  const [event, setEvent] = useState(null); // thec selected project
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  return (
    <EventContext.Provider
      value={{
        event,
        setEvent,
        searchTerm,
        setSearchTerm,
        searchCategory,
        setSearchCategory,
      }}
    >
      {/* Toolbar for searching keywords, category and filter */}

      <Grid
        container
        spaceing={0}
        direction="row"
        alignItems="start"
        justifyContent="center"
      >
        {/* left part: event list */}
        {onMedia.onDesktop ? (
          <Grid item xs={4}>
            <EventList />
          </Grid>
        ) : (
          event === null && (
            <Grid item>
              <EventList />
            </Grid>
          )
        )}
        {/* right part: project info */}
        {/* {onMedia.onDesktop ? (
          <Grid item xs={8}>
            <ProjectInfo />
          </Grid>
        ) : (
          project !== null && (
            <Grid item>
              <ProjectInfo />
            </Grid>
          )
        )} */}
      </Grid>
    </EventContext.Provider>
  );
};

export default Events;
