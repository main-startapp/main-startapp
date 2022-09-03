import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useContext, useEffect, useState } from "react";
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
    partner,
  } = useContext(GlobalContext);

  // local
  const [expandState, setExpandState] = useState("collapseIt");
  const [hasUnread, setHasUnread] = useState(false);

  // handle chat expansion called by handleConnect
  useEffect(() => {
    if (!forceChatExpand) return;

    const foundChat = chats.find((chat) =>
      chat.chat_user_ids.some((uid) => uid === partner.uid)
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
      handleUnread(foundChat, currentUser);
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
    partner,
    setChat,
    setShowMsg,
    currentUser,
  ]);

  // helper func
  const handleExpand = (e) => {
    expandState === "expandIt"
      ? setExpandState("collapseIt")
      : setExpandState("expandIt");
    setShowMsg(false);
    setChat(null);
  };

  // unread signal
  useEffect(() => {
    const my_unread_key = currentUser.uid + "_unread";

    if (chats.some((chat) => chat[my_unread_key] > 0)) {
      setHasUnread(true);
    } else {
      setHasUnread(false);
    }
  }, [chats, currentUser]);

  return (
    <Box sx={{ display: "flex", justifyContent: "right" }}>
      <Accordion
        square={true}
        expanded={expandState === "expandIt"}
        sx={{
          // minWidth: "100px",
          width: "15vw",
          minWidth: "300px",
          maxHeight: "75vh",
          position: "fixed",
          right: "20px",
          bottom: 0,
          //   backgroundColor: "pink",
          border: 1,
        }}
      >
        <StyledAccordionSummary
          sx={{ borderBottom: 1 }}
          expandIcon={<ExpandLessIcon />}
          onClick={(e) => handleExpand(e)}
        >
          <Typography>Messenger</Typography>
          {hasUnread && (
            <CircleIcon
              sx={{ color: "#3e95c2", fontSize: "15px", ml: "5px" }}
            />
          )}
        </StyledAccordionSummary>
        <AccordionDetails
          sx={{ overflow: "auto", maxHeight: "50vh", padding: 0 }}
        >
          <Wrapper>
            <ChatList>
              {chats.map((chat) => (
                <ChatAccordionContact key={chat.id} chat={chat} />
              ))}
            </ChatList>
          </Wrapper>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ChatAccordion;

const Wrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const ChatList = styled("div")(({ theme }) => ({
  maxHeight: "100%",
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
