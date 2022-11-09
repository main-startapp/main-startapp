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
import { GlobalContext } from "../Context/ShareContexts";
import ChatAccordionContact from "./ChatAccordionContact";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CircleIcon from "@mui/icons-material/Circle";
import { handleUnread } from "../Reusable/Resusable";

const ChatAccordion = () => {
  // context
  const {
    ediumUser,
    chats,
    setChat,
    setShowMsg,
    forceChatExpand,
    setForceChatExpand,
    chatPartner,
    setChatPartner,
    onMedia,
  } = useContext(GlobalContext);

  // local
  const [expandState, setExpandState] = useState("collapseIt");

  // handle chat expansion called by handleConnect/handleJoinRequest
  // connect or join request might create a new chat, this new chat will be found by this hook
  useEffect(() => {
    if (!forceChatExpand) return;

    const foundChat = chats.find((chat) =>
      chat.chat_user_ids.some((uid) => uid === chatPartner?.uid)
    );

    if (!foundChat) return;

    setChat(foundChat);
    setForceChatExpand(false);

    let timeout = 250;
    if (expandState !== "expandIt") {
      setExpandState("expandIt");
      timeout = 500; // wait more time
    }
    handleUnread(foundChat, setChat, ediumUser, chatPartner); // simulate clicking the contact, won't do anything if my_unread is 0
    setTimeout(() => {
      setShowMsg(true);
    }, timeout); // delayed msg window

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
    ediumUser,
  ]);

  // unread signal
  const hasUnread = useMemo(() => {
    const my_unread_key = ediumUser?.uid + "_unread";
    return chats.some((chat) => chat[my_unread_key] > 0) ? true : false;
  }, [ediumUser?.uid, chats]);

  // helper func
  const handleExpand = (e) => {
    expandState === "expandIt"
      ? setExpandState("collapseIt")
      : setExpandState("expandIt");
    setShowMsg(false);
    setChat(null);
    setChatPartner(null);
  };

  return onMedia.onDesktop ? (
    // box is essential for wrapping the accrodion to get rid of ugly top line
    <Box>
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
                color="secondary"
                sx={{
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
  ) : null;
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
