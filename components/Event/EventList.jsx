import { useContext, useMemo, useEffect } from "react";
import NextLink from "next/link";
import { Box, Button, Paper, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { GlobalContext, EventContext } from "../Context/ShareContexts";
import EventListItem from "./EventListItem";
import moment from "moment";
import EventListHeader from "./EventListHeader";
import {
  findItemFromList,
  FixedHeightPaper,
  isStrInStr,
  isStrInStrList,
} from "../Reusable/Resusable";

const EventList = () => {
  // context
  const { events, users, ediumUser, onMedia } = useContext(GlobalContext);
  const { setFullEvent, searchTerm, searchTypeList } = useContext(EventContext);
  const theme = useTheme();

  // events with extra info from other dataset (creator, merged tags)
  const fullEvents = useMemo(() => {
    return events?.map((event) => {
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
      eventTags.push(event?.category?.toLowerCase()); // type
      return {
        event: event,
        creator: eventCreator,
        allTags: eventTags,
      };
    });
  }, [events, users]);

  // event list with sorting
  const sortedFullEvents = useMemo(() => {
    const eventsLength = fullEvents.length;
    for (let i = eventsLength - 1; i > -1; i--) {
      if (
        moment({ hour: 23, minute: 59 }).isAfter(
          moment(fullEvents[i].event.end_date)
        )
      ) {
        let temp = fullEvents[i];
        fullEvents.splice(i, 1);
        fullEvents.push(temp);
      }
    }
    return fullEvents;
  }, [fullEvents]);

  const filteredFullEvents = useMemo(
    () =>
      sortedFullEvents?.filter((fullEvent) => {
        if (!fullEvent.event.is_visible) return;

        if (searchTerm === "" && searchTypeList.length === 0) {
          return true; // no search
        } else if (searchTerm !== "" && searchTypeList.length === 0) {
          return isStrInStr(fullEvent.event.title, searchTerm, false); // only term: in event title
        } else if (searchTerm === "" && searchTypeList.length > 0) {
          return searchTypeList.some((type) => {
            return isStrInStrList(fullEvent.allTags, type, true);
          }); // only tags
        } else {
          return (
            searchTypeList.some((type) => {
              return isStrInStrList(fullEvent.allTags, type, true);
            }) && isStrInStr(fullEvent.event.title, searchTerm, false)
          ); // term && tags
        }
      }),
    [searchTerm, searchTypeList, sortedFullEvents]
  );

  // set initial event to be the first in list to render out immediately
  useEffect(() => {
    if (onMedia.onDesktop)
      setFullEvent(
        filteredFullEvents.length > 0 ? filteredFullEvents[0] : null
      );
  }, [filteredFullEvents, onMedia.onDesktop, setFullEvent]);

  return (
    <FixedHeightPaper
      elevation={onMedia.onDesktop ? 2 : 0}
      isdesktop={onMedia.onDesktop ? 1 : 0}
      mobileheight={160}
      sx={{
        paddingTop: onMedia.onDesktop ? "32px" : 0,
      }}
    >
      {onMedia.onDesktop && <EventListHeader />}

      <Box
        id="eventlist-items-box"
        sx={{
          flexGrow: 1,
          overflowY: "scroll",
        }}
      >
        {filteredFullEvents?.map((fullEvent, index) => (
          <EventListItem
            key={fullEvent?.event?.id}
            fullEvent={fullEvent}
            index={index}
            last={filteredFullEvents.length - 1}
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
            style={{ width: "100%" }} // !important: make create button fullwidth
          >
            <span>
              <NextLink
                href={{
                  pathname: "/events/create",
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
    </FixedHeightPaper>
  );
};

export default EventList;
