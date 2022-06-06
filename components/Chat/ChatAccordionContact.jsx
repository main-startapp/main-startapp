import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { Avatar, Badge, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { db } from "../../firebase";
import moment from "moment";
import { GlobalContext } from "../Context/ShareContexts";
import { useAuth } from "../Context/AuthContext";

const ChatAccordionContact = (props) => {
  const chat = props.chat;

  // context
  const { currentUser } = useAuth();
  const { setChat, setPartner, showMsg, setShowMsg, students } =
    useContext(GlobalContext);

  // local states and vars
  const [contact, setContact] = useState(null);
  const contactUID = chat.chat_user_ids.filter((chat_user_id) => {
    return chat_user_id !== currentUser.uid;
  })[0]; // get the first ele of the returned array which will always contain 1 ele

  const my_unread_key = currentUser.uid + "_unread"; // the key to get unread msg no.

  // required: students data should be complete (not partial)
  useEffect(() => {
    const found = students.find((student) => student.uid === contactUID);

    if (found) {
      setContact({ ...found });
    }

    return () => {
      found;
    };
  }, [contactUID, students]);

  // helper func
  const handleUnread = async () => {
    if (chat[my_unread_key] > 0) {
      // update chat
      const chatDocRef = doc(db, "chats", chat.id);
      const chatRef = {
        ...chat,
        [my_unread_key]: 0,
      };
      delete chatRef.id;
      const chatUpdateDocRef = await updateDoc(chatDocRef, chatRef).catch(
        (err) => {
          console.log("updateDoc() error: ", err);
        }
      );
    }
  };

  return (
    <Container
      onClick={() => {
        setChat(chat);
        setPartner(contact);
        if (!showMsg) {
          setShowMsg(true);
        }
        handleUnread();
      }}
    >
      <Avatar sx={{ m: "14px" }} src={contact?.photo_url} />
      <ChatInfo>
        {/* name & last timestamp */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography fontSize="14px">{contact?.name}</Typography>
          <Typography fontSize="14px">
            {moment(chat?.last_timestamp?.toDate().getTime()).format("MMM D")}
          </Typography>
        </Box>
        {/* if NOT join request: position */}
        {!chat?.join_request_project && (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography fontSize="14px">{contact?.desired_position}</Typography>
            <StyledBadge badgeContent={chat[my_unread_key]} color="primary" />
          </Box>
        )}
        {/* if join request: JR info */}
        {chat?.join_request_project && (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                fontSize="14px"
                color="#3e95c2"
                // sx={{
                //   display: "-webkit-box",
                //   overflow: "hidden",
                //   WebkitBoxOrient: "vertical",
                //   WebkitLineClamp: 1,
                // }}
              >
                {"Join Request"}
              </Typography>
              <StyledBadge badgeContent={chat[my_unread_key]} color="primary" />
            </Box>
            <Typography
              fontSize="14px"
              sx={{
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1,
              }}
            >
              {chat?.join_request_project} {chat?.join_request_position}
            </Typography>
          </Box>
        )}
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

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 13,
    top: 13,
  },
}));
