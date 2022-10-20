import { useContext, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import {
  GlobalContext,
  EventContext,
} from "../components/Context/ShareContexts";
import EventList from "../components/Event/EventList";
import EventPageBar from "../components/Header/EventPageBar";
import EventInfo from "../components/Event/EventInfo";
import EventsFilter from "../components/Event/EventsFilter";

function Events() {
  // global context
  const { setChat, setChatPartner, setShowChat, setShowMsg, onMedia } =
    useContext(GlobalContext);
  useEffect(() => {
    setShowChat(true);
    setShowMsg(false);
    setChat(null);
    setChatPartner(null);
  }, [setChat, setChatPartner, setShowChat, setShowMsg]);

  // event state init
  const [event, setEvent] = useState(null); // thec selected project
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({});

  return (
    <EventContext.Provider
      value={{
        event,
        setEvent,
        searchTerm,
        setSearchTerm,
        searchCategory,
        setSearchCategory,
        filterOptions,
        setFilterOptions,
      }}
    >
      {/* Toolbar for searching keywords, category and filter */}
      <EventPageBar toggleFilter={setFilterOpen} />

      <Grid
        container
        spaceing={0}
        direction="row"
        alignItems="start"
        justifyContent="center"
      >
        {/* left part: list */}
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
        {/* right part: info */}
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
      </Grid>
      {/* <ClickAwayListener
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
        onClickAway={() => setFilterOpen(false)}
        disableReactTree={true}
      > */}
      <EventsFilter
        isToggled={filterOpen}
        toggleFilter={setFilterOpen}
      ></EventsFilter>
      {/* </ClickAwayListener> */}
    </EventContext.Provider>
  );
}

export default Events;
