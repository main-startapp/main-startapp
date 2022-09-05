import { useContext, useEffect, useMemo, useState } from "react";
import { Avatar, Badge, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import moment from "moment";
import { GlobalContext } from "../Context/ShareContexts";
import { useAuth } from "../Context/AuthContext";
import { handleUnread } from "../Reusable/Resusable";

const ChatAccordionContact = (props) => {
  const chat = props.chat;

  // context
  const { currentUser } = useAuth();
  const { projects, setChat, setChatPartner, showMsg, setShowMsg, students } =
    useContext(GlobalContext);

  // local states and vars
  const contact = useMemo(() => {
    const contactUID =
      chat.chat_user_ids[0] === currentUser?.uid
        ? chat.chat_user_ids[1]
        : chat.chat_user_ids[0];
    return students.find((student) => student.uid === contactUID);
  }, [chat.chat_user_ids, currentUser?.uid, students]);

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
      (position) => position.id === tempLastJR.position_id
    );

    if (!tempLastJRPosition) return;

    setLastJR({
      projectTitle: tempLastJRProject.title,
      positionTitle: tempLastJRPosition.title,
    });

    return () => {
      tempLastJR;
      tempLastJRProject;
      tempLastJRPosition;
    };
  }, [chat, projects]);

  return (
    <Container
      onClick={() => {
        setChat(chat);
        setChatPartner(contact);
        if (!showMsg) {
          setShowMsg(true);
        }
        handleUnread(chat, setChat, currentUser);
      }}
    >
      <Avatar
        sx={{ m: "14px", color: "#dbdbdb", backgroundColor: "#ffffff" }}
        src={contact?.photo_url}
        referrerPolicy="no-referrer"
      />
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
