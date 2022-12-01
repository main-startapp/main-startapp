import { useContext, useMemo, useEffect } from "react";
import NextLink from "next/link";
import { Box, Button, Paper, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { GlobalContext, EventContext } from "../Context/ShareContexts";
import EventListItem from "./EventListItem";
import moment from "moment";
import cloneDeep from "lodash/cloneDeep";
import EventListHeader from "./EventListHeader";
import { findItemFromList } from "../Reusable/Resusable";

const EventList = () => {
  // context
  const { events, users, ediumUser, winHeight, onMedia } =
    useContext(GlobalContext);
  const { searchTerm, searchCategory, setEvent, setCreatorUser } =
    useContext(EventContext);
  const theme = useTheme();

  // local vars
  const sortedEvents = useMemo(() => {
    const tempEvents = cloneDeep(events);
    const eventsLength = tempEvents.length;
    for (let i = eventsLength - 1; i > -1; i--) {
      if (
        moment({ hour: 23, minute: 59 }).isAfter(moment(tempEvents[i].end_date))
      ) {
        let temp = tempEvents[i];
        tempEvents.splice(i, 1);
        tempEvents.push(temp);
      }
    }
    return tempEvents;
  }, [events]);

  const filteredEvents = useMemo(
    () =>
      sortedEvents.filter((event) => {
        if (!event.is_visible) return;
        if (searchTerm === "" && searchCategory === "") return event;

        // !todo: is this optimized?
        // lazy evaluation to avoid unnecessary expensive includes()
        const isInTitles =
          searchTerm !== "" &&
          event.title.toLowerCase().includes(searchTerm.toLowerCase());

        const isInCategory =
          searchCategory !== "" &&
          event.category.toLowerCase().includes(searchCategory.toLowerCase());

        if (isInTitles || isInCategory) return event;
      }),
    [sortedEvents, searchTerm, searchCategory]
  );

  // set initial event to be first in list to render out immediately
  useEffect(() => {
    if (!onMedia.onDesktop) return;

    if (filteredEvents?.length > 0) {
      setEvent(filteredEvents[0]);
      setCreatorUser(
        findItemFromList(users, "uid", filteredEvents[0]?.creator_uid)
      );
    } else {
      setEvent(null);
      setCreatorUser(null);
    }
  }, [filteredEvents, onMedia.onDesktop, setCreatorUser, setEvent, users]);

  return (
    <Paper
      elevation={onMedia.onDesktop ? 2 : 0}
      sx={{
        // mt: onMedia.onDesktop ? 4 : 2,
        // ml: onMedia.onDesktop ? 4 : 2,
        // mr: onMedia.onDesktop ? 2 : 0,
        backgroundColor: "background.paper",
        borderTop: onMedia.onDesktop ? 1 : 0,
        borderColor: "divider",
        borderRadius: onMedia.onDesktop
          ? "32px 32px 0px 0px"
          : "32px 0px 0px 0px",
        paddingTop: "32px",
      }}
    >
      {onMedia.onDesktop && <EventListHeader />}

      <Box
        id="eventlist-eventlistitem-box"
        sx={{
          height: onMedia.onDesktop
            ? `calc(${winHeight}px - 65px - ${theme.spacing(
                4
              )} - 1px - 32px - 112px - 96px)` // navbar; spacing; paper t-border; paper t-padding; header; button box
            : `calc(${winHeight}px - 64px - ${theme.spacing(
                2
              )} - 32px + 1px - 65px)`, // mobile bar; spacing margin; inner t-padding; last entry border; bottom navbar
          overflowY: "scroll",
        }}
      >
        {filteredEvents?.map((event, index) => (
          <EventListItem
            key={event.id}
            event={event}
            index={index}
            last={filteredEvents.length - 1}
          />
        ))}
      </Box>

      {onMedia.onDesktop && (
        <Box
          id="eventlist-button-box"
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingY: 3,
            paddingX: 2,
          }}
        >
          <Tooltip
            title={ediumUser?.uid ? "" : "Edit your profile first"}
            style={{ width: "100%" }}
          >
            <span>
              <NextLink
                href={{
                  pathname: "/events/create",
                  query: { isCreateStr: "true" },
                }}
                as="/events/create"
                passHref
              >
                <Button
                  color="secondary"
                  disabled={!ediumUser?.uid}
                  disableElevation
                  fullWidth
                  variant="contained"
                  sx={{
                    height: "48px",
                    borderRadius: 8,
                  }}
                >
                  <Typography variant="button" sx={{ fontSize: "1.125rem" }}>
                    {"Create Event"}
                  </Typography>
                </Button>
              </NextLink>
            </span>
          </Tooltip>
        </Box>
      )}
    </Paper>
  );
};

export default EventList;
