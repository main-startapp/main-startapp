import { useContext, useMemo, useState } from "react";
import {
  Avatar,
  Box,
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
  findItemFromList,
  handleDeleteEntry,
  handleVisibility,
  MenuItemLink,
} from "../Reusable/Resusable";
import NextLink from "next/link";

const EventListItem = (props) => {
  const index = props.index;
  const event = props.event;
  const last = props.last;

  // context
  const { setOldEvent, users, ediumUser, onMedia } = useContext(GlobalContext);
  const { setEvent, setCreatorUser } = useContext(EventContext);

  // time related
  const startMoment = useMemo(() => {
    return moment(event?.start_date);
  }, [event?.start_date]);

  const endMoment = useMemo(() => {
    return moment(event?.end_date);
  }, [event?.end_date]);

  const isExpired = useMemo(() => {
    return moment({ hour: 23, minute: 59 }).isAfter(endMoment);
  }, [endMoment]);

  const isSameDay = useMemo(() => {
    return startMoment.format("L") === endMoment.format("L");
  }, [startMoment, endMoment]);

  const isSameTime = useMemo(() => {
    return startMoment.format("LLL") === endMoment.format("LLL");
  }, [startMoment, endMoment]);

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

  // creator's user data
  const creatorUser = useMemo(() => {
    return findItemFromList(users, "uid", event?.creator_uid);
  }, [users, event?.creator_uid]);

  // event + org tags
  const allTags = useMemo(() => {
    let retTags = [];
    if (event?.tags?.length > 0) {
      retTags = retTags.concat(event.tags);
    }
    if (
      creatorUser?.role === "org_admin" &&
      creatorUser?.org_tags?.length > 0
    ) {
      retTags = retTags.concat(creatorUser.org_tags);
    }

    return retTags;
  }, [creatorUser, event]);

  return (
    <ListItem
      onClick={() => {
        setEvent(event);
        setCreatorUser(creatorUser);
      }}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        borderBottom: 1,
        borderColor: "divider",
        backgroundColor: "background",
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
          {/* <ListItemText
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
          /> */}
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
        </Box>

        <Box sx={{ height: "96px", display: "flex", alignItems: "flex-start" }}>
          <IconButton
            id="eventlistitem-menu-button"
            aria-controls={open ? "eventlistitem-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={(e) => {
              handleMenuClick(e);
            }}
          >
            <MoreVertIcon />
          </IconButton>
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
                  setOldEvent(event);
                  handleMenuClose(e);
                }}
              >
                <NextLink
                  href={{
                    pathname: "/events/create",
                    query: { isCreateStr: "false" },
                  }}
                  as="/events/create"
                  passHref
                >
                  <MenuItemLink>Modify</MenuItemLink>
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
                  setEvent(null);
                  handleMenuClose(e);
                }}
              >
                Delete
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Box>
    </ListItem>
  );
};

export default EventListItem;
