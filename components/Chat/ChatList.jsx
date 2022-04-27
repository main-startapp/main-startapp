import { doc, getDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../../firebase";
import { ChatContext } from "../Context/ShareContexts";
import ChatListItem from "./ChatListItem";

const ChatList = () => {
  // context
  const { chats } = useContext(ChatContext);

  return (
    <>
      {chats.map((chat) => (
        <ChatListItem key={chat.id} chat={chat} />
      ))}
    </>
  );
};

export default ChatList;
