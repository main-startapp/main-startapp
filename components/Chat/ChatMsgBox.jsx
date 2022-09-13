import { Box } from "@mui/material";
import { useState } from "react";
import ChatMsg from "./ChatMsg";

const ChatMsgBox = () => {
  // control comp size
  const [isMaximized, setIsMaximized] = useState(false);
  return (
    <Box
      sx={{
        width: isMaximized ? "480px" : "320px",
        height: isMaximized ? "75vh" : "50vh",
        position: "fixed",
        right: "336px",
        bottom: -1,
        border: 1.5,
        borderColor: "#dbdbdb",
        borderRadius: "10px 10px 0 0",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        boxShadow: 3,
      }}
    >
      <ChatMsg isMaximized={isMaximized} setIsMaximized={setIsMaximized} />
    </Box>
  );
};

export default ChatMsgBox;
