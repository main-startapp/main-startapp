import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { db } from "../../firebase";
import moment from "moment";
import { ChatContext } from "../Context/ShareContexts";
import { styled } from "@mui/material/styles";
import { useAuth } from "../Context/AuthContext";

const ChatAccordionContact = (props) => {
  const chat = props.chat;

  // context
  const { currentUser } = useAuth();
  const { setChat, setPartner, showMsg, setShowMsg } = useContext(ChatContext);

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
    <Container
      onClick={() => {
        setChat(chat);
        setPartner(chatPartner);
        if (!showMsg) {
          setShowMsg(true);
        }
      }}
    >
      <Avatar sx={{ m: "14px" }} src={chatPartner?.photo_url} />
      <ChatInfo>
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
            {moment(chat?.last_timestamp?.toDate().getTime()).format("MMM D")}
          </Typography>
        </Box>
        {/* position */}
        <Box>
          <Typography
            fontSize="14px"
            // sx={{
            //   display: "-webkit-box",
            //   overflow: "hidden",
            //   WebkitBoxOrient: "vertical",
            //   WebkitLineClamp: 1,
            // }}
          >
            {chatPartner?.desired_position}
          </Typography>
        </Box>
      </ChatInfo>
    </Container>
  );
};

export default ChatAccordionContact;

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  height: "80px",
  cursor: "pointer",
  borderBottom: "1px solid #ededed",
  "&:hover": {
    backgroundColor: "#f6f6f6",
  },
}));

const ChatInfo = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  marginRight: "14px",
}));
