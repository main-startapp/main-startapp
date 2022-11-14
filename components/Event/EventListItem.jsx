import { useContext, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import moment from "moment";
import { GlobalContext, EventContext } from "../Context/ShareContexts";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAuth } from "../Context/AuthContext";
import { handleDeleteEntry } from "../Reusable/Resusable";

const EventListItem = (props) => {
  const index = props.index;
  const event = props.event;
  const last = props.last;

  // context
  const { ediumUser, onMedia } = useContext(GlobalContext);
  const { setEvent } = useContext(EventContext);

  // local
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
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        mx: onMedia.onDesktop ? 3 : 1.5,
        mt: onMedia.onDesktop ? (index === 0 ? 3 : 1.5) : 1.5,
        mb: index === last ? (onMedia.onDesktop ? 3 : 1.5) : 0,
      }}
    >
      <ListItem
        onClick={() => setEvent(event)}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          border: 1.5,
          borderRadius: 8,
          borderColor: "#dbdbdb",
          backgroundColor: "#ffffff",
          "&:hover": {
            backgroundColor: "#f6f6f6",
            cursor: "default",
          },
          // height: "180px",
          overflow: "hidden",
          opacity: isExpired ? "50%" : "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
          }}
          // onClick={(e) => {
          //   e.stopPropagation();
          // }}
        >
          {/* event icon uploaded by users*/}
          <Avatar
            sx={{
              my: 1,
              ml: 1,
              mr: 3,
              height: "80px",
              width: "80px",
            }}
            src={event?.icon_url}
          >
            <UploadFileIcon />
          </Avatar>
          <ListItemText
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
          />
          <Box
            sx={{ height: "96px", display: "flex", alignItems: "flex-start" }}
          >
            <IconButton
              id="eventlistitem-menu-button"
              aria-controls={open ? "eventlistitem-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={(e) => {
                if (ediumUser?.uid !== event?.creator_uid) return; // !todo: will be removed after there's at least one menu for regular user
                handleMenuClick(e);
              }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="eventlistitem-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              MenuListProps={{
                "aria-labelledby": "eventlistitem-menu-button",
              }}
            >
              {ediumUser?.uid === event?.creator_uid && (
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                  }}
                >
                  {event?.is_visible ? "Hide" : "Display"}
                </MenuItem>
              )}
              {ediumUser?.uid === event?.creator_uid && (
                <MenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteEntry(
                      "events",
                      "evets_ext",
                      "my_event_ids",
                      event?.id,
                      ediumUser?.uid
                    );
                    setEvent(null);
                    handleMenuClose();
                  }}
                >
                  Delete
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Box>
      </ListItem>
    </Box>
  );
};

export default EventListItem;
