import { useContext, useMemo, useEffect } from "react";
import NextLink from "next/link";
import { Box, Button, Tooltip } from "@mui/material";
import { GlobalContext, EventContext } from "../Context/ShareContexts";
import EventListItem from "./EventListItem";
import moment from "moment";
import cloneDeep from "lodash/cloneDeep";

const EventList = () => {
  // context
  const { events, ediumUser, winHeight, onMedia } = useContext(GlobalContext);
  const { searchTerm, searchCategory } = useContext(EventContext);

  // local vars
  const currentUID = ediumUser?.uid;

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

        // !todo: is this optimized?
        const isInTitles =
          searchTerm !== "" &&
          event.title.toLowerCase().includes(searchTerm.toLowerCase());

        const isInCategory =
          searchCategory !== "" && // lazy evaluation to avoid unnecessary expensive includes()
          event.category.toLowerCase().includes(searchCategory.toLowerCase());

        if (searchTerm === "" && searchCategory === "") {
          // no search
          return event;
        } else if (
          searchCategory === "" &&
          isInTitles // no Category, only search titles
        ) {
          return event;
        } else if (
          searchTerm === "" &&
          isInCategory // no Term, only search category
        ) {
          return event;
        } else if (
          isInTitles &&
          isInCategory // search both
        ) {
          return event;
        }
      }),
    [sortedEvents, searchTerm, searchCategory]
  );

  return (
    <Box sx={{ backgroundColor: "#fafafa" }}>
      <Box
        sx={{
          height: onMedia.onDesktop
            ? `calc(${winHeight}px - 64px - 64px - 1.5px - 36px - 24px)`
            : `calc(${winHeight}px - 48px - 48px - 1.5px - 60px)`, // navbar; appbar; border; button; y-margins
          overflow: "auto",
        }}
      >
        {filteredEvents.map((event, index) => (
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
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: "12px",
          }}
        >
          <Tooltip title={currentUID ? "" : "Edit your profile first"}>
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
                  disabled={!currentUID}
                  disableElevation
                  sx={{
                    border: 1.5,
                    borderColor: "#dbdbdb",
                    borderRadius: "30px",
                    color: "text.primary",
                    backgroundColor: "#ffffff",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#f6f6f6",
                    },
                    textTransform: "none",
                  }}
                  variant="contained"
                >
                  {"Create Event"}
                </Button>
              </NextLink>
            </span>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default EventList;