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
            padding: "5px",
            ml: "10px",
            mr: "10px",
            mb: "5px",
            mt: "5px",
            position: "relative",
          }}
        >
          <Typography sx={{ display: "inline", fontWeight: "bold" }}>
            {chatPartner?.name}
          </Typography>
          <Typography
            sx={{ display: "inline", color: "gray", fontSize: "0.9em" }}
          >
            {" · "}
            {moment(message?.sent_at?.toDate().getTime()).format("M/D LT")}
          </Typography>
        </Box>
      )}
      {!isSameAuthor && message.sent_by === currentUser.uid && (
        <Box
          sx={{
            padding: "5px",
            ml: "10px",
            mr: "10px",
            mb: "5px",
            mt: "5px",
            position: "relative",
          }}
        >
          <Typography sx={{ display: "inline", fontWeight: "bold" }}>
            Me
          </Typography>
          <Typography
            sx={{ display: "inline", color: "gray", fontSize: "0.9em" }}
          >
            {" · "}
            {moment(message?.sent_at?.toDate().getTime()).format("M/D LT")}
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          backgroundColor: "white",
          padding: "5px",
          ml: "15px",
          mr: "10px",
          mb: "2.5px",
          position: "relative",
          width: "fit-content",
          wordBreak: "break-all",
          whiteSpace: "pre-wrap",
        }}
      >
        {message.text}
      </Box>
    </>
  );
};

export default ChatAccordionMsgItem;
