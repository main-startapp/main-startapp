import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../../firebase";
import { useAuth } from "../Context/AuthContext";
import { ChatContext } from "../Context/ShareContexts";
import ChatAccordionContact from "./ChatAccordionContact";

{
  /* */
}

const ChatAccordion = () => {
  // states
  const { currentUser } = useAuth();
  const {
    chats,
    setChats,
    chat,
    setChat,
    students,
    setStudents,
    partner,
    setPartner,
    showMsg,
    setShowMsg,
  } = useContext(ChatContext);

  // chats data
  useEffect(() => {
    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      where("chat_user_ids", "array-contains", currentUser.uid),
      orderBy("last_timestamp", "desc")
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      setChats(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });

    return () => {
      unsub;
    };
  }, [currentUser, setChats]);

  // students data
  useEffect(() => {
    // db query
    const collectionRef = collection(db, "students");
    const q = query(collectionRef, orderBy("name", "desc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      setStudents(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          uid: doc.id,
        }))
      );
    });

    return unsub;
  }, [setStudents]);

  return (
    <Box sx={{ display: "flex", justifyContent: "right" }}>
      <Accordion
        square={true}
        sx={{
          width: "25%",
          maxHeight: "50%",
          position: "fixed",
          right: "20px",
          bottom: 0,
          //   backgroundColor: "pink",
          border: 1,
          overflow: "auto",
        }}
      >
        <AccordionSummary sx={{ borderBottom: 1 }}>
          <Typography>Courier</Typography>
        </AccordionSummary>
        <AccordionDetails>
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
  height: "100%",
  width: "100%",
  overflow: "auto",
}));
