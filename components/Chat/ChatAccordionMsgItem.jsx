import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { useAuth } from "../Context/AuthContext";
import { GlobalContext } from "../Context/ShareContexts";
import moment from "moment";

const ChatAccordionMsgItem = (props) => {
  const message = props.message;
  const isSameAuthor = props.isSameAuthor;
  const chatPartner = props.chatPartner;

  // context
  const { currentUser } = useAuth();

  return (
    <>
      {!isSameAuthor && message.sent_by === chatPartner?.uid && (
        <Box
          sx={{
            mx: "12px",
            mt: "18px",
            position: "relative",
          }}
        >
          <Typography
            sx={{ display: "inline", fontWeight: "bold", fontSize: "1em" }}
          >
            {chatPartner?.name}
          </Typography>
          <Typography
            sx={{ display: "inline", color: "lightgray", fontSize: "0.9em" }}
          >
            {" · "}
            {moment(message?.sent_at?.toDate().getTime()).format("M/D LT")}
          </Typography>
        </Box>
      )}
      {!isSameAuthor && message.sent_by === currentUser?.uid && (
        <Box
          sx={{
            mx: "12px",
            mt: "18px",
            position: "relative",
          }}
        >
          <Typography sx={{ display: "inline", fontWeight: "bold" }}>
            Me
          </Typography>
          <Typography
            sx={{ display: "inline", color: "lightgray", fontSize: "0.9em" }}
          >
            {" · "}
            {moment(message?.sent_at?.toDate().getTime()).format("M/D LT")}
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          position: "relative",
          width: "fit-content",
          wordWrap: "break-word",
          whiteSpace: "pre-wrap",
        }}
      >
        <Typography sx={{ fontSize: "0.9em", mx: "18px" }}>
          {message.text}
        </Typography>
      </Box>
    </>
  );
};

export default ChatAccordionMsgItem;
