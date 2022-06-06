import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
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
import { GlobalContext } from "../Context/ShareContexts";
import { useAuth } from "../Context/AuthContext";
import ChatAccordionMsgItem from "./ChatAccordionMsgItem";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import IconButton from "@mui/material/IconButton";

const ChatAccordionMsg = () => {
  // context
  const { currentUser } = useAuth();
  const { chat, partner, setChat, showMsg, setShowMsg } =
    useContext(GlobalContext);

  // listen to realtime messages subcollection in chats collection
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

  // local vars
  const [isClickable, setIsClickable] = useState(true); // avoid msg send spam
  useEffect(() => {
    if (isClickable) return;

    // isClickable was false, set back to true after 1s delay
    const timeout1s = setTimeout(() => {
      setIsClickable(true);
    }, 1000);

    return () => {
      clearTimeout(timeout1s);
    };
  }, [isClickable]); // reset send button in 1s

  // helper func
  // https://stackoverflow.com/questions/43302584/why-doesnt-the-code-after-await-run-right-away-isnt-it-supposed-to-be-non-blo
  const handleSubmit = async (e) => {
    if (!isClickable) return;
    setIsClickable(false);

    // add message
    const messageRef = { ...message, sent_at: serverTimestamp() };
    setMessage({ text: "", sent_by: currentUser.uid }); // reset msg locally
    const msgCollectionRef = collection(db, "chats", chat.id, "messages");
    const msgAddDocRef = addDoc(msgCollectionRef, messageRef).catch((err) => {
      console.log("addDoc() error: ", err);
    });
    // update chat
    const my_unread_key = currentUser.uid + "_unread";
    const partner_unread_key = partner?.uid + "_unread";
    const chatDocRef = doc(db, "chats", chat.id);
    const chatRef = {
      ...chat,
      last_text: message.text,
      last_timestamp: serverTimestamp(),
      [my_unread_key]: 0,
      [partner_unread_key]: chat[partner_unread_key] + 1,
    };
    setChat({ ...chatRef }); // update chat locally before id removal to match db
    delete chatRef.id;
    const chatUpdateDocRef = updateDoc(chatDocRef, chatRef).catch((err) => {
      console.log("updateDoc() error: ", err);
    });

    const msgRet = await msgAddDocRef;
    const chatRet = await chatUpdateDocRef;
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setShowMsg(false);
    setChat(null);
  };

  // box ref to used by useEffect
  const scrollRef = useRef();
  // useEffect to reset box scrollbar position
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [messages, showMsg]);

  /* close msg box when click outside
  might be removed
  const closeOpenMsg = (e) => {
    if (msgRef.current && showMsg && !msgRef.current.contains(e.target)) {
      setShowMsg(false);
    }
  };
  document.addEventListener("mousedown", closeOpenMsg);
  const msgRef = useRef(null); */

  return (
    <>
      <Box
        // ref={msgRef}
        sx={{
          display: "flex",
          justifyContent: "right",
        }}
      >
        <Box
          sx={{
            width: "25vw",
            height: "50vh",
            maxHeight: "75vh",
            position: "fixed",
            right: "calc(50px + 25%)",
            bottom: 0,
            border: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "white",
              width: "100%",
              height: "100%",
            }}
          >
            {/* header */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                borderBottom: 1,
              }}
            >
              <Avatar sx={{ m: "12px" }} src={partner?.photo_url} />
              <Typography>{partner?.name}</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton sx={{ m: "12px" }} onClick={(e) => handleClose(e)}>
                <CloseRoundedIcon />
              </IconButton>
            </Box>
            {/* messages */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                overflow: "auto",
                flexGrow: 1,
              }}
            >
              {messages.map((message, index) => {
                let isSameAuthor = false;
                if (
                  index > 0 &&
                  messages[index - 1].sent_by === message.sent_by
                ) {
                  isSameAuthor = true;
                }
                return (
                  <ChatAccordionMsgItem
                    key={index}
                    message={message}
                    isSameAuthor={isSameAuthor}
                  />
                );
              })}
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
                onChange={(e) =>
                  setMessage({ ...message, text: e.target.value })
                }
                onKeyPress={(e) => {
                  if (e.key === "Enter" && message.text) {
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
        </Box>
      </Box>
    </>
  );
};

export default ChatAccordionMsg;
