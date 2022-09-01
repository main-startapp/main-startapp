import { useContext, useState } from "react";
import { useRouter } from "next/router";
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
import { useAuth } from "../Context/AuthContext";

const EventListItem = (props) => {
  const index = props.index;
  const event = props.event;
  const last = props.last;

  // context
  const { currentUser } = useAuth();
  const { currentStudent, onMedia } = useContext(GlobalContext);
  const { setEvent } = useContext(EventContext);

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
          borderRadius: "30px",
          borderColor: "#dbdbdb",
          boxShadow: 0,
          backgroundColor: "#ffffff",
          "&:hover": {
            backgroundColor: "#f6f6f6",
            cursor: "default",
          },
          // height: "180px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {/* event icon uploaded by users*/}
          <Avatar sx={{ mr: 2 }}>
            <UploadFileIcon />
          </Avatar>
          <ListItemText
            primary={event.title}
            primaryTypographyProps={{ fontWeight: "bold" }}
            secondary={event.category}
          />
        </Box>
        <ListItemText
          secondary={
            <Typography
              sx={{
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                // is there a better way to directly ref to ListItemText Secondary style?
                fontSize: "0.875rem",
                lineHeight: 1.43,
                letterSpacing: "0.01071em",
                color: "rgba(0, 0, 0, 0.6)",
              }}
            >
              {event.description}
            </Typography>
          }
        />
      </ListItem>
    </Box>
  );
};

export default EventListItem;
