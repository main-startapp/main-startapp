import { Paper, Slide } from "@mui/material";
import { useContext, useState } from "react";
import ChatMsg from "./ChatMsg";
import { motion } from "framer-motion";
import { GlobalContext } from "../Context/ShareContexts";

const ChatMsgPaper = () => {
  const { chat } = useContext(GlobalContext);
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
        bottom: 0,
        borderTop: 1,
        borderColor: "divider",
        borderRadius: "8px 8px 0 0",
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
      }}
    >
      <ChatMsg isMaximized={isMaximized} setIsMaximized={setIsMaximized} />
    </Paper>
  );
};

export default ChatMsgPaper;
