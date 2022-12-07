import { useContext, useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import moment from "moment";
import { GlobalContext, EventContext } from "../Context/ShareContexts";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  handleDeleteEntry,
  handleVisibility,
  isStrInStrList,
} from "../Reusable/Resusable";
import NextLink from "next/link";

// prefer not doing any dynamic calculation in this leaf component
const EventListItem = (props) => {
  const index = props.index;
  const fullEvent = props.fullEvent;
  const last = props.last;

  // context
  const { ediumUser, onMedia } = useContext(GlobalContext);
  const { setFullEvent, searchTypeList } = useContext(EventContext);

  // local vars
  const event = fullEvent.event;
  const eventCreator = fullEvent.creator_uid;
  const eventAllTags = fullEvent.allTags;

  // time related
  const startMoment = moment(event?.start_date);
  const endMoment = moment(event?.end_date);
  const isExpired = moment({ hour: 23, minute: 59 }).isAfter(endMoment);
  const isSameDay = startMoment.format("L") === endMoment.format("L");
  const isSameTime = startMoment.format("LLL") === endMoment.format("LLL");

  // menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <ListItem
      onClick={() => {
        setFullEvent(fullEvent);
      }}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        borderBottom: 1,
        borderColor: "divider",
        "&:hover": {
          backgroundColor: "hoverGray.main",
          cursor: "default",
        },
        overflow: "hidden",
        paddingY: 2,
        paddingX: 2,
        opacity: isExpired ? "50%" : "100%",
      }}
    >
      <Box
        id="eventlistitem-upper-box"
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* event icon uploaded by users*/}
        <Avatar
          sx={{
            mr: 2,
            height: "48px",
            width: "48px",
          }}
          src={event?.icon_url}
        >
          <UploadFileIcon />
        </Avatar>
        <Box sx={{ width: "100%" }}>
          <ListItemText
            primary={
              <Typography
                variant="h2"
                sx={{ fontSize: "1rem", fontWeight: "bold" }}
              >
                {event?.title}
              </Typography>
            }
          />
          {eventAllTags?.length > 0 && (
            <Box sx={{ mt: 1, height: "1.75rem", overflow: "hidden" }}>
              {eventAllTags?.map((tag, index) => (
                <Chip
                  key={index}
                  color={
                    isStrInStrList(searchTypeList, tag, true)
                      ? "primary"
                      : "lightPrimary"
                  }
                  label={tag}
                  sx={{
                    mr: 1,
                    mb: 1,
                    fontSize: "0.75rem",
                    fontWeight: "medium",
                    height: "1.5rem",
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
        {ediumUser?.uid === event?.creator_uid && (
          <IconButton
            id="eventlistitem-menu-button"
            aria-controls={open ? "eventlistitem-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={(e) => {
              handleMenuClick(e);
            }}
            sx={{ padding: 0 }}
          >
            <MoreVertIcon />
          </IconButton>
        )}
        <Menu
          id="eventlistitem-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={(e) => {
            handleMenuClose(e);
          }}
          MenuListProps={{
            "aria-labelledby": "eventlistitem-menu-button",
          }}
        >
          {ediumUser?.uid === event?.creator_uid && (
            <MenuItem
              onClick={(e) => {
                handleMenuClose(e);
              }}
            >
              <NextLink
                href={{
                  pathname: "/events/create",
                  query: { eventID: event?.id },
                }}
                as="/events/create"
                passHref
              >
                Modify
              </NextLink>
            </MenuItem>
          )}
          {ediumUser?.uid === event?.creator_uid && (
            <MenuItem
              onClick={(e) => {
                handleVisibility("events", event);
                handleMenuClose(e);
              }}
            >
              {event?.is_visible ? "Hide" : "Display"}
            </MenuItem>
          )}
          {ediumUser?.uid === event?.creator_uid && (
            <MenuItem
              onClick={(e) => {
                handleDeleteEntry(
                  "events",
                  "evets_ext",
                  "my_event_ids",
                  event?.id,
                  ediumUser?.uid
                );
                setFullEvent(null);
                handleMenuClose(e);
              }}
            >
              Delete
            </MenuItem>
          )}
        </Menu>
      </Box>
      <Box
        id="eventlistitem-lower-box"
        // padding right to align with more icon
        sx={{ mt: 2, paddingRight: "10px", width: "100%" }}
      >
        <ListItemText
          secondary={
            <Typography
              color="text.secondary"
              variant="body2"
              // sx={{
              //   display: "-webkit-box",
              //   overflow: "hidden",
              //   WebkitBoxOrient: "vertical",
              //   WebkitLineClamp: 1,
              // }}
            >
              {event.category}
              <br />
              {isSameDay
                ? startMoment.format("MMM Do h:mm a") +
                  (isSameTime ? "" : " - " + endMoment.format("h:mm a"))
                : startMoment.format("MMM Do h:mm a") +
                  " - " +
                  endMoment.format("MMM Do h:mm a")}
            </Typography>
          }
        />
        {onMedia.onDesktop && (
          <ListItemText
            secondary={
              <Typography
                color="text.secondary"
                variant="body2"
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  fontWeight: "light",
                }}
              >
                {moment(event.last_timestamp).format("MMM Do, YYYY")}
              </Typography>
            }
            sx={{ mt: 2 }}
          />
        )}
      </Box>
    </ListItem>
  );
};

export default EventListItem;
{
  /* <ListItemText
            primary={event.title}
            primaryTypographyProps={{ fontWeight: "bold" }}
            secondary={
              <>
                {event.category}
                <br />
                {isSameDay
                  ? startMoment.format("MMM Do h:mm a") +
                    (isSameTime ? "" : " - " + endMoment.format("h:mm a"))
                  : startMoment.format("MMM Do h:mm a") +
                    " - " +
                    endMoment.format("MMM Do h:mm a")}
              </>
            }
          /> */
}
