// react
import { useContext, useState } from "react";
// next
import NextLink from "next/link";
// mui
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  ListItem,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
// edium
import { GlobalContext, EventContext } from "../Context/ShareContexts";
import {
  handleDeleteEntry,
  handleVisibility,
  isStrInStrList,
} from "../Reusable/Resusable";
// misc libs
import dayjs from "dayjs";
import { FaClock, FaMapPin } from "react-icons/fa";

// prefer not doing any dynamic calculation in this leaf component
const EventListItem = ({ index, fullEvent, last }) => {
  // context
  const { ediumUser, onMedia } = useContext(GlobalContext);
  const { setFullEvent, searchTerm, searchCateList, searchTypeList } =
    useContext(EventContext);

  // local vars
  const event = fullEvent.event;
  const eventCreator = fullEvent.creator_uid;
  const eventAllTags = fullEvent.allTags;

  // time related
  const startMoment = dayjs(event?.start_date);
  const endMoment = dayjs(event?.end_date);
  const isExpired = dayjs().isAfter(endMoment);
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

  // reusable comps
  const UniversalAvatar = ({ lengthStr, variant }) => {
    return (
      <Avatar
        sx={{
          mr: 2,
          height: lengthStr,
          width: lengthStr,
        }}
        src={event?.icon_url}
        variant={variant}
      >
        <UploadFileIcon />
      </Avatar>
    );
  };

  const TitleItemText = ({ fontSize }) => {
    return (
      <Typography
        variant="h2"
        sx={{
          fontSize: fontSize || "1rem",
          fontWeight: "bold",
          display: "-webkit-box",
          overflow: "hidden",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 1,
        }}
      >
        {event?.title}
      </Typography>
    );
  };

  const TagsList = ({ fontSize, height }) => {
    return eventAllTags?.map((tag, index) => (
      <Chip
        key={index}
        label={tag}
        sx={{
          mr: 1,
          mb: 1,
          fontSize: fontSize || "0.75rem",
          fontWeight: "medium",
          height: height || "1.5rem",
        }}
        color={
          isStrInStrList(searchCateList, tag, true) ||
          isStrInStrList(searchTypeList, tag, true) ||
          searchTerm === tag
            ? "primary"
            : "lightPrimary"
        }
      />
    ));
  };

  const MoreIcon = () => {
    return (
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
    );
  };

  const MoreMenu = () => {
    return (
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
              style={{
                color: "inherit",
              }}
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
    );
  };

  const TimeItemText = ({ fontSize }) => {
    return (
      <Typography
        color="text.secondary"
        sx={{
          display: "-webkit-box",
          overflow: "hidden",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 1,
          fontSize: fontSize,
        }}
      >
        {isSameDay
          ? startMoment.format("MMM Do h:mm a") +
            (isSameTime ? "" : " - " + endMoment.format("h:mm a"))
          : startMoment.format("MMM Do h:mm a") +
            " - " +
            endMoment.format("MMM Do h:mm a")}
      </Typography>
    );
  };

  const LocationItemText = ({ fontSize }) => {
    return (
      <Typography
        color="text.secondary"
        sx={{
          display: "-webkit-box",
          overflow: "hidden",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 1,
          fontSize: fontSize,
        }}
      >
        {event?.location}
      </Typography>
    );
  };

  const TimestampItemText = ({ fontSize }) => {
    return (
      <Typography
        color="text.secondary"
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          fontWeight: "light",
          fontSize: fontSize,
        }}
      >
        {dayjs(event?.last_timestamp).format("MMM Do, YYYY")}
      </Typography>
    );
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
        borderBottom: index === last ? 0 : 1,
        borderColor: "divider",
        "&:hover": {
          backgroundColor: "gray100.main",
        },
        overflow: "hidden",
        paddingY: 2,
        paddingX: 2,
        opacity: isExpired ? "50%" : "100%",
      }}
    >
      {onMedia.onDesktop ? (
        <>
          <Box
            id="eventlistitem-upper-box"
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              paddingLeft: "10px",
            }}
          >
            {/* event icon uploaded by users*/}
            <UniversalAvatar lengthStr="48px" variant="circular" />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <TitleItemText />
              <Box sx={{ mt: 1, height: "1.5rem", overflow: "hidden" }}>
                <TagsList />
              </Box>
            </Box>
            {ediumUser?.uid === event?.creator_uid && (
              <>
                <MoreIcon />
                <MoreMenu />
              </>
            )}
          </Box>
          <Box
            id="eventlistitem-lower-box"
            sx={{ mt: 2, paddingX: "10px", width: "100%" }} // padding to align with more icon
          >
            <TimeItemText fontSize="0.875rem" />
            <LocationItemText fontSize="0.875rem" />
            <TimestampItemText fontSize="0.875rem" />
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <UniversalAvatar lengthStr="88px" variant="rounded" />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <TitleItemText />
              <Box sx={{ mt: "4px", height: "1.5rem", overflow: "hidden" }}>
                <TagsList />
              </Box>
              <Box
                sx={{
                  mt: "4px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {/* we need this box to fix the icon size */}
                <Box sx={{ mr: "4px", fontSize: "0.625rem" }}>
                  <FaClock size="0.625rem" />
                </Box>
                <TimeItemText fontSize="0.75rem" />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Box sx={{ mr: "4px", fontSize: "0.625rem" }}>
                  <FaMapPin size="0.625rem" />
                </Box>
                <LocationItemText fontSize="0.75rem" />
              </Box>
            </Box>
          </Box>
        </>
      )}
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
