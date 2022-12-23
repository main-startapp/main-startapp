import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { GlobalContext } from "../Context/ShareContexts";
import moment from "moment";

const ChatMsgItem = (props) => {
  const message = props.message;
  const isSameAuthor = props.isSameAuthor;
  const chatPartner = props.chatPartner;
  const isLastMsg = props.isLastMsg;

  // context
  const { ediumUser } = useContext(GlobalContext);

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
            sx={{ display: "inline", fontWeight: "medium", fontSize: "1rem" }}
          >
            {chatPartner?.name}
          </Typography>
          <Typography
            sx={{ display: "inline", color: "lightgray", fontSize: "0.875em" }}
          >
            {" · "}
            {moment(message?.sent_at?.toDate().getTime()).format("M/D LT")}
          </Typography>
        </Box>
      )}
      {!isSameAuthor && message.sent_by === ediumUser?.uid && (
        <Box
          sx={{
            mx: "12px",
            mt: "18px",
            position: "relative",
          }}
        >
          <Typography
            sx={{ display: "inline", fontWeight: "medium", fontSize: "1rem" }}
          >
            Me
          </Typography>
          <Typography
            sx={{ display: "inline", color: "lightgray", fontSize: "0.875rem" }}
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
          mb: isLastMsg ? "18px" : 0,
        }}
      >
        <Typography sx={{ fontSize: "0.875rem", mx: "18px" }}>
          {message.text}
        </Typography>
      </Box>
    </>
  );
};

export default ChatMsgItem;
