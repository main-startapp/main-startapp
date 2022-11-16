import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Paper,
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

  // accordion expansion
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
    <Accordion
      expanded={expandState === "expandIt"}
      square
      elevation={3}
      sx={{
        width: "320px",
        position: "fixed",
        right: 0,
        bottom: -1,
        borderTop: 1,
        borderRadius: "8px 8px 0px 0px",
        borderColor: "divider",
        "&.MuiAccordion-root::before": {
          opacity: 0,
        },
      }}
      disableGutters
    >
      <StyledAccordionSummary
        sx={{
          height: "48px",
          borderBottom: 1,
          borderColor: "divider",
          paddingX: 4,
        }}
        expandIcon={<ExpandLessIcon />}
        onClick={(e) => handleExpand(e)}
      >
        <Typography
          sx={{
            fontSize: "1.25rem",
            fontWeight: "bold",
          }}
        >
          {"Messages"}
        </Typography>
        {hasUnread && (
          <CircleIcon
            color="secondary"
            sx={{
              fontSize: "1rem",
              position: "absolute",
              left: `calc(126px + 8px)`,
            }}
          />
        )}
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
    justifyContent: "flex-start",
    alignItems: "center",
  },

  "& .MuiAccordionSummary-expandIconWrapper": {
    position: "absolute",
    right: "32px",
  },
}));
