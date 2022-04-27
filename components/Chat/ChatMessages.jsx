import { Box, Button, TextField, Typography } from "@mui/material";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { db } from "../../firebase";
import { ChatContext } from "../Context/ShareContexts";
import ChatMessageItem from "./ChatMessageItem";

const ChatMessages = () => {
  // context
  const { currentUser, chat } = useContext(ChatContext);

  // get the messages
  const [message, setMessage] = useState({
    text: "",
    sent_by: currentUser.uid,
  });
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    let unsub;
    if (chat?.id) {
      const collectionRef = collection(db, "chats", chat.id, "messages");
      const q = query(collectionRef, orderBy("sent_at", "asc"));

      unsub = onSnapshot(q, (querySnapshot) => {
        setMessages(querySnapshot.docs.map((doc) => ({ ...doc.data() })));
      });
    }
    return () => {
      unsub;
    };
  }, [chat]);

  // helper func
  const handleSubmit = async (e) => {
    let messageRef = { ...message, sent_at: serverTimestamp() };
    const msgCollectionRef = collection(db, "chats", chat.id, "messages");
    const msgAddDocRef = await addDoc(msgCollectionRef, messageRef).catch(
      (err) => {
        console.log("addDoc() error: ", err);
      }
    );
    const chatDocRef = doc(db, "chats", chat.id);
    const chatRef = {
      ...chat,
      last_text: message.text,
      last_timestamp: serverTimestamp(),
    };
    delete chatRef.id;
    const chatUpdateDocRef = await updateDoc(chatDocRef, chatRef).catch(
      (err) => {
        console.log("updateDoc() error: ", err);
      }
    );
    setMessage({ text: "", sent_by: currentUser.uid });
  };

  // box ref to used by useEffect
  const scrollRef = useRef();
  // useEffect to reset box scrollbar position
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [messages]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f6f6f6",
        width: "80%",
        height: "100%",
      }}
    >
      {/* messages */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          overflow: "scroll",
          flexGrow: 1,
        }}
      >
        {messages.map((message, index) => (
          <ChatMessageItem key={index} message={message} />
        ))}
        <div ref={scrollRef} />
      </Box>
      {/* input */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          position: "sticky",
          bottom: 0,
          backgroundColor: "#f0f0f0",
          zIndex: 100,
          width: "100%",
        }}
      >
        <TextField
          sx={{
            flex: 1,
            outline: 0,
            border: "none",
            borderRadius: 4,
            padding: "5px",
            ml: "15px",
            mr: "15px",
            backgroundColor: "white",
          }}
          variant="standard"
          InputProps={{
            disableUnderline: true,
          }}
          value={message.text}
          onChange={(e) => setMessage({ ...message, text: e.target.value })}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSubmit(e);
            }
          }}
        />
        <Button
          variant="contained"
          disabled={!message.text}
          disableElevation
          sx={{ bgcolor: "#3e95c2", mr: "15px" }}
          onClick={(e) => handleSubmit(e)}
        >
          {"Send"}
        </Button>
      </Box>
    </Box>
  );
};

export default ChatMessages;
