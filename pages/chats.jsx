import { Box } from "@mui/material";
import { useEffect, useContext } from "react";
import ChatAccordionContact from "../components/Chat/ChatAccordionContact";
import ChatMsg from "../components/Chat/ChatMsg";
import { GlobalContext } from "../components/Context/ShareContexts";
import Filler from "../components/Filler";
import ChatsPageBar from "../components/Header/ChatsPageBar";
import { handleUnread } from "../components/Reusable/Resusable";

const Chats = () => {
  const {
    ediumUser,
    chats,
    chat,
    chatPartner,
    setChat,
    setShowChat,
    setShowMsg,
    forceChatExpand,
    setForceChatExpand,
    winHeight,
    onMedia,
  } = useContext(GlobalContext);
  // chats comp
  useEffect(() => {
    setShowChat(false);
    setShowMsg(false);
  });

  // connect or join request might create a new chat, this new chat must be found by this hook
  // this has similar functionality to the one in ChatAccordion; this one is for mobile chats
  useEffect(() => {
    if (!forceChatExpand) return;

    const foundChat = chats.find((chat) =>
      chat.chat_user_ids.some((uid) => uid === chatPartner?.uid)
    );
    if (!foundChat) return;

    setChat(foundChat);
    setForceChatExpand(false);
    handleUnread(foundChat, setChat, ediumUser, chatPartner); // simulate clicking the contact, won't do anything if my_unread is 0

    return () => {
      foundChat;
    };
  }, [
    forceChatExpand,
    setForceChatExpand,
    chats,
    chatPartner,
    setChat,
    setShowMsg,
    ediumUser,
  ]);

  return !onMedia.onDesktop ? (
    <>
      <ChatsPageBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          height: `calc(${winHeight}px - 48px - 48px - 1.5px - 60px)`,
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
