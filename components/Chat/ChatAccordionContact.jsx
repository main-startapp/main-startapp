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
  const {
    projects,
    setChat,
    setChatPartner,
    showMsg,
    setShowMsg,
    users,
    onMedia,
  } = useContext(GlobalContext);

  // local states and vars
  const contact = useMemo(() => {
    const contactUID =
      chat.chat_user_ids[0] === currentUser?.uid
        ? chat.chat_user_ids[1]
        : chat.chat_user_ids[0];
    return users.find((user) => user.uid === contactUID);
  }, [chat.chat_user_ids, currentUser?.uid, users]);

  const my_unread_key = currentUser?.uid + "_unread"; // the key to get unread msg no.

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
    <ContactBox
      onClick={() => {
        setChat(chat);
        setChatPartner(contact);
        if (!showMsg && onMedia.onDesktop) {
          setShowMsg(true);
        }
        handleUnread(chat, setChat, currentUser);
      }}
      sx={{ minHeight: "80px" }}
    >
      <Avatar
        sx={{
          mx: "12px",
          // color: "#dbdbdb",
          // backgroundColor: "#ffffff",
          // border: 1,
          // borderColor: "#dbdbdb",
          height: "56px",
          width: "56px",
        }}
        src={contact?.photo_url}
        referrerPolicy="no-referrer"
      />
      <ChatInfo>
        {/* name & position */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography
            fontSize="1em"
            fontWeight="bold"
            sx={{
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
            }}
          >
            {contact?.name}
          </Typography>
        </Box>
        {lastJR ? (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                fontSize="0.8em"
                color="#3e95c2"
                sx={{
                  display: "-webkit-box",
                  overflow: "hidden",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 1,
                }}
              >
                Join Request
              </Typography>
            </Box>
            <Typography
              fontSize="0.8em"
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
        ) : (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography fontSize="0.8em">
              {contact?.desired_position}
            </Typography>
          </Box>
        )}
      </ChatInfo>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "104px",
          height: "56px",
          alignItems: "center",
          mr: "12px",
        }}
      >
        <Typography fontSize="0.8em">
          {moment(chat?.last_timestamp?.toDate().getTime()).format("MMM D")}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Badge
          sx={{
            mb: "12px",
            color: "#ffffff",
          }}
          badgeContent={chat[my_unread_key]}
          color={"SteelBlue"}
        />
      </Box>
    </ContactBox>
  );
};

export default ChatAccordionContact;

const ContactBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  height: "calc(56px + 2*12px)",
  cursor: "pointer",
  borderBottom: "1.5px solid #dbdbdb",
  "&:hover": {
    backgroundColor: "#f6f6f6",
  },
}));

const ChatInfo = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
}));
