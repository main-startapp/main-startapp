import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { ChatContext } from "../Context/ShareContexts";

const ChatMessageItem = (props) => {
  const message = props.message;

  // context
  const { currentUser, partner } = useContext(ChatContext);

  return (
    <>
      {message?.sent_by === currentUser.uid && (
        <Box
          sx={{
            backgroundColor: "lightblue",
            padding: "15px",
            ml: "10px",
            mr: "10px",
            mb: "10px",
            position: "relative",
            width: "fit-content",
          }}
        >
          {"Me: "}
          {message.text}
        </Box>
      )}
      {message?.sent_by === partner?.uid && (
        <Box
          sx={{
            backgroundColor: "lightgreen",
            padding: "15px",
            ml: "10px",
            mr: "10px",
            mb: "10px",
            position: "relative",
            width: "fit-content",
          }}
        >
          {partner?.name}
          {": "}
          {message.text}
        </Box>
      )}
    </>
  );
};

export default ChatMessageItem;
