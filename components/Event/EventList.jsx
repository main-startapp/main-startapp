import { useContext, useMemo } from "react";
import NextLink from "next/link";
import { Box, Button, Tooltip } from "@mui/material";
import { GlobalContext, EventContext } from "../Context/ShareContexts";
import EventListItem from "./EventListItem";

const EventList = () => {
  // context
  const { events, currentStudent, onMedia } = useContext(GlobalContext);
  const { searchTerm, searchCategory } = useContext(EventContext);

  // local vars
  const currentUID = currentStudent?.uid;

  const filteredEvents = useMemo(
    () =>
      events.filter((event) => {
        if (!event.is_visible) return;

        // !todo: is this optimized?
        const isInTitles =
          searchTerm !== "" && // lazy evaluation
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
    [events, searchTerm, searchCategory]
  );

  return (
    <Box
      sx={{
        backgroundColor: "#fafafa",
        height: onMedia.onDesktop
          ? "calc(100vh - 64px - 64px - 1.5px)"
          : "calc(100vh - 48px - 48px - 1.5px)", // navbar; appbar; border
      }}
    >
      <Box
        sx={{
          height: onMedia.onDesktop
            ? "calc(100vh - 64px - 64px - 1.5px - 36px - 24px)"
            : "calc(100vh - 48px - 48px - 1.5px - 36px - 24px)", // navbar; appbar; border; button; y-margins
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
                  pathname: "/event/create",
                  query: { isCreateStr: "true" },
                }}
                as="/event/create"
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
