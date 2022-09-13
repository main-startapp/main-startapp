import { Box } from "@mui/material";
import { useContext } from "react";
import ChatAccordionContact from "../components/Chat/ChatAccordionContact";
import ChatMsg from "../components/Chat/ChatMsg";
import { GlobalContext } from "../components/Context/ShareContexts";
import Filler from "../components/Filler";
import ChatsPageBar from "../components/Header/ChatsPageBar";

const Chats = () => {
  const { chats, chat, chatPartner, onMedia } = useContext(GlobalContext);

  return !onMedia.onDesktop ? (
    <>
      <ChatsPageBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          height: "calc(100vh - 48px - 48px - 1.5px - 60px)",
        }}
      >
        {(chat && chatPartner) === null ? (
          chats.map((chat) => (
            <ChatAccordionContact key={chat.id} chat={chat} />
          ))
        ) : (
          <ChatMsg />
        )}
      </Box>
    </>
  ) : (
    <Filler />
  );
};

export default Chats;
