import { useContext, useMemo } from "react";
import NextLink from "next/link";
import { Box, Button, Tooltip } from "@mui/material";
import { GlobalContext, EventContext } from "../Context/ShareContexts";
import EventListItem from "./EventListItem";

const EventList = () => {
  // context
  const { events, ediumUser, onMedia } = useContext(GlobalContext);
  const { searchTerm, searchCategory, filterOptions, filterOpen } =
    useContext(EventContext);

  // local vars
  const currentUID = ediumUser?.uid;

  const filteredEvents = useMemo(
    () =>
      events.filter((event) => {
        if (!event.is_visible) return;

        // !todo: is this optimized?
        const isInTitles =
          searchTerm !== "" &&
          event.title.toLowerCase().includes(searchTerm.toLowerCase());

        const isInCategory =
          searchCategory !== "" && // lazy evaluation to avoid unnecessary expensive includes()
          event.category.toLowerCase().includes(searchCategory.toLowerCase());

        let isInFilterOptions = true;

        for (const optionKey in filterOptions) {
          let tempIsInFilterOptions = false;
          let allOptionsEmpty = true;
          filterOptions[optionKey].forEach((option) => {
            if (
              filterOptions[optionKey].length !== 0 &&
              event.details.toLowerCase().includes(option.toLowerCase())
            )
              tempIsInFilterOptions = true;
            else if (filterOptions[optionKey].length !== 0)
              allOptionsEmpty = false;
          });
          isInFilterOptions = allOptionsEmpty
            ? allOptionsEmpty
            : tempIsInFilterOptions;
        }

        if (searchTerm === "" && searchCategory === "" && isInFilterOptions) {
          // no search
          return event;
        } else if (
          searchCategory === "" &&
          isInTitles // no Category, only search titles
        ) {
          return event;
        } else if (
          searchTerm === "" &&
          isInCategory && // no Term, only search category
          isInFilterOptions
        ) {
          return event;
        } else if (
          isInTitles &&
          isInCategory // search both
        ) {
          return event;
        }
      }),
    // console.log(newEvents);
    // newEvents.filter((event) => {
    //   for (const optionKey in filterOptions) {
    //     optionKey.values.forEach((option) => {
    //       if (event.details.includes(option)) return event;
    //     });
    //   }
    // });
    [events, searchTerm, searchCategory, filterOptions]
  );

  // const filterOptionsFilteredEvents = useMemo(() => {
  //   events.filter((event) => {
  //     for (const optionKey in filterOptions) {
  //       optionKey.values.forEach((option) => {
  //         if (event.details.includes(option)) return event;
  //       });
  //     }
  //   }
  // })

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
