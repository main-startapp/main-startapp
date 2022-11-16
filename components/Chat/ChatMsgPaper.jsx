import { Box, Paper } from "@mui/material";
import { useState } from "react";
import ChatMsg from "./ChatMsg";

const ChatMsgPaper = () => {
  // control comp size
  const [isMaximized, setIsMaximized] = useState(false);
  return (
    <Paper
      elevation={3}
      sx={{
        width: isMaximized ? "480px" : "320px",
        height: isMaximized ? "75vh" : "50vh",
        position: "fixed",
        right: "336px",
        bottom: -1,
        borderTop: 1,
        borderColor: "divider",
        borderRadius: "8px 8px 0 0",
        backgroundColor: "background",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ChatMsg isMaximized={isMaximized} setIsMaximized={setIsMaximized} />
    </Paper>
  );
};

export default ChatMsgPaper;
