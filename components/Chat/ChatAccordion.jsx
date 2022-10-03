import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { GlobalContext } from "../Context/ShareContexts";
import ChatAccordionContact from "./ChatAccordionContact";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CircleIcon from "@mui/icons-material/Circle";
import { handleUnread } from "../Reusable/Resusable";

const ChatAccordion = () => {
  // context
  const { currentUser } = useAuth();
  const {
    chats,
    setChat,
    setShowMsg,
    forceChatExpand,
    setForceChatExpand,
    chatPartner,
    setChatPartner,
  } = useContext(GlobalContext);

  // local
  const [expandState, setExpandState] = useState("collapseIt");

  // handle chat expansion called by handleConnect/handleJoinRequest
  // connect or join request might create a new chat, this new chat must be found by this hook
  useEffect(() => {
    if (!forceChatExpand) return;

    const foundChat = chats.find((chat) =>
      chat.chat_user_ids.some((uid) => uid === chatPartner?.uid)
    );

    if (!foundChat) return;
    setChat(foundChat);

    var timeout = 200;
    if (expandState !== "expandIt") {
      setExpandState("expandIt");
      timeout = 500; // wait more time
    }

    setTimeout(() => {
      setShowMsg(true);
    }, timeout); // delayed msg window

    setTimeout(() => {
      handleUnread(foundChat, setChat, currentUser);
    }, 1000); // delayed reset unread

    setForceChatExpand(false);

    return () => {
      foundChat;
    };
  }, [
    forceChatExpand,
    expandState,
    setForceChatExpand,
    chats,
    chatPartner,
    setChat,
    setShowMsg,
    currentUser,
  ]);

  // unread signal
  const hasUnread = useMemo(() => {
    const my_unread_key = currentUser?.uid + "_unread";
    return chats.some((chat) => chat[my_unread_key] > 0) ? true : false;
  }, [currentUser?.uid, chats]);

  // helper func
  const handleExpand = (e) => {
    expandState === "expandIt"
      ? setExpandState("collapseIt")
      : setExpandState("expandIt");
    setShowMsg(false);
    setChat(null);
    setChatPartner(null);
  };

  return (
    // box is essential for wrapping the accrodion to get rid of ugly top line
    <Box
    // sx={{
    //   position: "relative",
    //   zIndex: "1500",
    // }}
    >
      <Accordion
        expanded={expandState === "expandIt"}
        square
        sx={{
          width: "320px",
          position: "fixed",
          right: 0,
          bottom: -1,
          border: 1.5,
          borderRadius: "10px 10px 0px 0px",
          borderColor: "#dbdbdb",
        }}
        disableGutters
        elevation={3}
      >
        <StyledAccordionSummary
          sx={{
            borderBottom: 1.5,
            borderColor: "#dbdbdb",
          }}
          expandIcon={<ExpandLessIcon />}
          onClick={(e) => handleExpand(e)}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              sx={{
                fontSize: "1em",
                fontWeight: "bold",
              }}
            >
              Messenger
            </Typography>
            {hasUnread && (
              <CircleIcon
                sx={{
                  color: "#3e95c2",
                  fontSize: "0.8em",
                  position: "absolute",
                  right: "30%",
                }}
              />
            )}
          </Box>
        </StyledAccordionSummary>
        <AccordionDetails
          sx={{ overflow: "auto", maxHeight: "75vh", padding: 0 }}
        >
          <ChatList>
            {chats.map((chat) => (
              <ChatAccordionContact key={chat.id} chat={chat} />
            ))}
          </ChatList>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ChatAccordion;

const ChatList = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  "& .MuiAccordionSummary-content": {
    justifyContent: "center",
  },

  "& .MuiAccordionSummary-expandIconWrapper": {
    position: "absolute",
    left: "5%",
  },
}));
