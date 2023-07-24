import { useContext, useMemo, useEffect } from "react";
import NextLink from "next/link";
import Router from "next/router";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { GlobalContext, EventContext } from "../Context/ShareContexts";
import EventListItem from "./EventListItem";
import EventListHeader from "./EventListHeader";
import {
  FixedHeightPaper,
  isStrInStr,
  isStrInStrList,
  shallowUpdateURLQuery,
} from "../Reusable/Resusable";
import dayjs from "dayjs";

const EventList = () => {
  // context
  const { ediumUser, onMedia } = useContext(GlobalContext);
  const {
    fullEvent,
    setFullEvent,
    fullEvents,
    isSearchingClicked,
    setIsSearchingClicked,
    isMobileBackClicked,
    setIsMobileBackClicked,
    searchTerm,
    searchCateList,
    searchTypeList,
  } = useContext(EventContext);
  const theme = useTheme();

  // event list with predefined sorting
  const sortedFullEvents = useMemo(() => {
    // const eventsLength = fullEvents.length;
    // for (let i = eventsLength - 1; i > -1; i--) {
    //   if (dayjs().isAfter(dayjs(fullEvents[i].event.end_date))) {
    //     let temp = fullEvents[i];
    //     fullEvents.splice(i, 1);
    //     fullEvents.push(temp);
    //   }
    // }
    return fullEvents;
  }, [fullEvents]);

  // event list with filtering
  // 1st, filtering visibility and category
  const fullEventsWIP1st = useMemo(() => {
    return sortedFullEvents?.filter((fullEvent) => {
      // filter out invisible entry
      if (!fullEvent.event.is_visible) return false;
      // return everything else if no category search
      if (searchCateList.length === 0) return true;
      // else return entries match category
      return searchCateList.some((cate) => {
        return fullEvent.event.category === cate;
      });
    });
  }, [searchCateList, sortedFullEvents]);

  // 2nd, filtering type
  const fullEventsWIP2nd = useMemo(() => {
    // return prev list if no type search
    if (searchTypeList.length === 0) return fullEventsWIP1st;

    // else return entries match type
    return fullEventsWIP1st?.filter((fullEvent) => {
      return searchTypeList.some((type) => {
        return fullEvent.event.type === type;
      });
    });
  }, [fullEventsWIP1st, searchTypeList]);

  // 3rd, filtering term, the most expensive one
  const filteredFullEvents = useMemo(() => {
    // return prev list if no term search
    if (searchTerm === "") return fullEventsWIP2nd;

    // else return entries match term
    return fullEventsWIP2nd?.filter((fullEvent) => {
      return (
        isStrInStr(fullEvent.event.title, searchTerm, false) ||
        isStrInStrList(fullEvent.allTags, searchTerm, true)
      ); // in event title partially || in tags exactly
    });
  }, [fullEventsWIP2nd, searchTerm]);

  // event query & auto set initial event
  useEffect(() => {
    // trigger 1 (desktop): app can't distinguish between searching list change and click an entry (case 1 both arey query && current entry), thus isSearchingClicked flag was introduced
    // trigger 2 (mobile): mobile app can't distinguish between user input a query or user clicked back button (case 2 both are query && !current entry), thus isMobileBackClicked flag was introduced
    // case 1 (desktop & mobile): user click a new entry => current entry, update url
    // case 1.1 (desktop & mobile): if query and current entry exist and are equal, do nothing
    // case 2 (desktop & mobile): user directly input a url with a valid query => query && !current entry, set it to user's
    // case 3 (desktop): the query is invalid or no query => !query && !current entry, set it to the 1st entry then update url
    // case 3.1 (mobile): on mobile, remove query
    if (onMedia.onDesktop && isSearchingClicked) {
      // user changed searching settings (onDesktop && searching clicked => show 1st entry)
      if (filteredFullEvents?.length > 0) {
        setFullEvent(filteredFullEvents[0]);
        shallowUpdateURLQuery(
          Router.pathname,
          "eid",
          filteredFullEvents[0].event.id
        );
      } else {
        setFullEvent(null);
        shallowUpdateURLQuery(Router.pathname, null, null);
      }
      setIsSearchingClicked(false);
      return; // trigger 1
    }

    if (!onMedia.onDesktop && isMobileBackClicked) {
      // user clicked back button on mobile (onMobile && back button clicked) => show mobile list without url query
      shallowUpdateURLQuery(Router.pathname, null, null);
      setIsMobileBackClicked(false);
      return; // trigger 2
    }

    const queryEid = Router.query?.eid;
    const currentEid = fullEvent?.event?.id;

    if (currentEid && currentEid === queryEid) return; // case 1.1

    if (currentEid) {
      // user clicked a new entry on the list (currentID && currentID != queryID) => display query id
      // case 1.1 can be merged with this, it will do a redundant shallowUpdate
      shallowUpdateURLQuery(Router.pathname, "eid", fullEvent.event.id);
      return; // case 1
    }

    if (queryEid) {
      const foundFullEvent = filteredFullEvents?.find(
        (filteredFullEvent) => filteredFullEvent.event.id === queryEid
      );
      if (foundFullEvent) {
        // user directly input a url with valid query (no currentID && found queryID) => set this found entry
        setFullEvent(foundFullEvent);
        return; // case 2
      }
    }

    if (!onMedia.onDesktop && filteredFullEvents?.length > 0) {
      // user input url with no query or invalid query on mobile (no currentID && onMobile && back button not clicked && can't find query) => show mobile list without url query
      // entries length check to ensure filtered entry list has finished calculation
      shallowUpdateURLQuery(Router.pathname, null, null);
      return; // case 3.1
    }

    if (onMedia.onDesktop && filteredFullEvents?.length > 0) {
      // user input url with no query or invalid query on desktop (no currentID && onDekstop && can't find query) => set the 1st entry and update url query
      setFullEvent(filteredFullEvents[0]);
      shallowUpdateURLQuery(
        Router.pathname,
        "eid",
        filteredFullEvents[0].event.id
      );
      return; // case 3
    }
  }, [
    filteredFullEvents,
    fullEvent?.event?.id,
    isMobileBackClicked,
    isSearchingClicked,
    onMedia.onDesktop,
    setFullEvent,
    setIsMobileBackClicked,
    setIsSearchingClicked,
  ]);

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
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Tooltip
            title={!ediumUser?.uid ? "Sign in or Edit profile" : ""}
            style={{ width: "100%" }} // !important: make create button fullwidth
          >
            <span>
              <Button
                sx={{
                  height: "48px",
                  borderRadius: 8,
                }}
                color="secondary"
                disabled={!ediumUser?.uid}
                disableElevation
                fullWidth
                variant="contained"
                LinkComponent={NextLink}
                href="/events/create"
              >
                <Typography variant="button" sx={{ fontSize: "1.125rem" }}>
                  {"Create Event"}
                </Typography>
              </Button>
            </span>
          </Tooltip>
        </Box>
      )}
    </FixedHeightPaper>
  );
};

export default EventList;
