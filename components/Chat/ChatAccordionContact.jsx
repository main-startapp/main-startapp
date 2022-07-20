import { doc, updateDoc } from "firebase/firestore";
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
  const { projects, setChat, setPartner, showMsg, setShowMsg, students } =
    useContext(GlobalContext);

  // local states and vars
  const [contact, setContact] = useState(null);
  const contactUID = chat.chat_user_ids.filter((chat_user_id) => {
    return chat_user_id !== currentUser.uid;
  })[0]; // get the first ele of the returned array which will always contain 1 ele
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

  const my_unread_key = currentUser.uid + "_unread"; // the key to get unread msg no.

  // find the last join request's project and position info
  // !todo: use a map to reduce searching
  const [lastJR, setLastJR] = useState(null);
  useEffect(() => {
    if (!(chat?.join_requests?.length > 0)) return;

    const tempLastJR = chat.join_requests[chat.join_requests.length - 1];
    const tempLastJRProject = projects.find(
      (project) => project.id === tempLastJR.project_id
    );

    if (!tempLastJRProject) return;

    const tempLastJRPosition = tempLastJRProject.position_list.find(
      (position) => position.positionID === tempLastJR.position_id
    );

    if (!tempLastJRPosition) return;

    setLastJR({
      projectTitle: tempLastJRProject.title,
      positionTitle: tempLastJRPosition.positionTitle,
    });

    return () => {
      tempLastJR;
      tempLastJRProject;
      tempLastJRPosition;
    };
  }, [chat, projects]);

  // helper func
  // https://stackoverflow.com/questions/43302584/why-doesnt-the-code-after-await-run-right-away-isnt-it-supposed-to-be-non-blo
  // https://stackoverflow.com/questions/66263271/firebase-update-returning-undefined-is-it-not-supposed-to-return-the-updated
  const handleUnread = async () => {
    if (chat[my_unread_key] > 0) {
      // update chat
      const chatDocRef = doc(db, "chats", chat.id);
      const chatRef = {
        ...chat,
        [my_unread_key]: 0,
      };
      delete chatRef.id;
      const chatModRef = updateDoc(chatDocRef, chatRef).catch((err) => {
        console.log("updateDoc() error: ", err); // .then() is useless as updateDoc() returns Promise<void>
      });
      await chatModRef;
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
        {!lastJR && (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography fontSize="14px">{contact?.desired_position}</Typography>
            <StyledBadge badgeContent={chat[my_unread_key]} color="primary" />
          </Box>
        )}
        {/* if join request: JR info */}
        {lastJR && (
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
                Join Request
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
              {lastJR.projectTitle} {lastJR.positionTitle}
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