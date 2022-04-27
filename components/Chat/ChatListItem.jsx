import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { db } from "../../firebase";
import moment from "moment";
import { ChatContext } from "../Context/ShareContexts";

const ChatListItem = (props) => {
  const chat = props.chat;

  // context
  const { currentUser, setChat, setPartner } = useContext(ChatContext);

  // get the chat partner' info
  // !todo: support group chat
  const [chatPartner, setChatPartner] = useState(null);
  const chatPartnerUID = chat.chat_user_ids.filter((chat_user_id) => {
    return chat_user_id !== currentUser.uid;
  })[0]; // get the first ele of the returned array which will always contain 1 ele

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "students", chatPartnerUID), (doc) => {
      setChatPartner({ ...doc.data(), uid: chatPartnerUID });
    });

    return () => {
      unsub;
    };
  }, [chatPartnerUID]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: "64px",
        cursor: "pointer",
        borderBottom: "1px solid #ededed",
        "&:hover": {
          backgroundColor: "#f6f6f6",
        },
      }}
      onClick={() => {
        setChat(chat);
        setPartner(chatPartner);
      }}
    >
      <Avatar sx={{ m: 1.5 }} src={chatPartner?.photo_url} />
      <Box
        sx={{
          m: 1.5,
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {/* name & last timestamp */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography fontSize="14px">{chatPartner?.name}</Typography>
          <Typography fontSize="14px">
            {moment(chat?.last_timestamp?.toDate().getTime()).format("LT")}
          </Typography>
        </Box>
        {/* last msg */}
        <Box>
          <Typography
            fontSize="14px"
            sx={{
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
            }}
          >
            {chat?.last_text}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatListItem;
