import {
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { db } from "../../firebase";
import { GlobalContext } from "../Context/ShareContexts";
import { useAuth } from "../Context/AuthContext";
import ChatAccordionMsgItem from "./ChatAccordionMsgItem";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";
import CloseFullscreenRoundedIcon from "@mui/icons-material/CloseFullscreenRounded";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { findListItem } from "../Reusable/Resusable";

const ChatAccordionMsg = () => {
  // context
  const { currentUser } = useAuth();
  const {
    chat,
    chatPartner,
    setChat,
    setChatPartner,
    showMsg,
    setShowMsg,
    projects,
  } = useContext(GlobalContext);

  // listen to realtime messages subcollection in chats collection
  // !todo: either listen to the msg when necessary or using DBListener which one is better?
  const [message, setMessage] = useState({
    text: "",
    sent_by: currentUser.uid,
  });
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const chatID = chat?.id;
    if (!chatID) return;

    const collectionRef = collection(db, "chats", chatID, "messages");
    const q = query(collectionRef, orderBy("sent_at", "asc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      setMessages(querySnapshot.docs.map((doc) => ({ ...doc.data() })));
    });

    return () => {
      unsub;
    };
  }, [chat]);

  // local vars
  // avoid msg send spam
  const [isClickable, setIsClickable] = useState(true);
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

  // control comp size
  const [isMaximized, setIsMaximized] = useState(false);

  // dialog modal
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [declineMsg, setDeclineMsg] = useState("");
  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  // JRs !todo: opt to optimization
  // filter the JRs to find the chat patner's valid join requests (in case project was deleted)
  const joinRequests = useMemo(() => {
    if (!(chat?.join_requests?.length > 0)) return [];
    return chat.join_requests.filter((join_request) => {
      if (join_request.requester_uid !== chatPartner?.uid) return;
      const foundProject = findListItem(
        join_request.project_id,
        "id",
        projects
      );
      if (!foundProject) return;
      join_request.projectTitle = foundProject.title;
      join_request.positionTitle =
        foundProject.position_list.find(
          (pos) => pos.id === join_request.position_id
        )?.title || "";
      return join_request;
    });
  }, [chat?.join_requests, chatPartner?.uid, projects]);

  // helper func
  const handleSubmit = async (e) => {
    if (!isClickable) return;
    setIsClickable(false);

    // add message
    const messageRef = { ...message, sent_at: serverTimestamp() };
    setMessage({ text: "", sent_by: currentUser.uid }); // reset msg locally
    const msgCollectionRef = collection(db, "chats", chat.id, "messages");
    const msgModRef = addDoc(msgCollectionRef, messageRef).catch((err) => {
      console.log("addDoc() error: ", err);
    });
    // update chat
    const my_unread_key = currentUser.uid + "_unread";
    const partner_unread_key = chatPartner?.uid + "_unread";
    const chatDocRef = doc(db, "chats", chat.id);
    const chatUpdateRef = {
      [my_unread_key]: 0,
      [partner_unread_key]: chat[partner_unread_key] + 1,
      last_text: message.text,
      last_timestamp: serverTimestamp(),
    };
    setChat({ ...chat, ...chatUpdateRef }); // second entry will overwrite first entry for the same keys
    const chatModRef = updateDoc(chatDocRef, chatUpdateRef).catch((err) => {
      console.log("updateDoc() error: ", err);
    });

    await msgModRef;
    await chatModRef;
  };

  // handle JR accept
  const handleAccept = async (joinRequest) => {
    if (!isClickable) return;
    setIsClickable(false);

    // add student to project ext member
    const projectExtDocRef = doc(db, "projects_ext", joinRequest.project_id);
    const projectExtUpdateRef = {
      members: arrayUnion(joinRequest.requester_uid),
      last_timestamp: serverTimestamp(),
    };
    const projectExtModRef = updateDoc(
      projectExtDocRef,
      projectExtUpdateRef
    ).catch((err) => {
      console.log("updateDoc() error: ", err);
    });

    // update JR in project ext subcollection
    const projectExtJRDocRef = doc(
      db,
      "projects_ext",
      joinRequest.project_id,
      "join_requests",
      joinRequest.join_request_doc_id
    );
    const projectExtJRUpdateRef = {
      status: "accepted",
      last_timestamp: serverTimestamp(),
    };
    const projectExtJRModRef = updateDoc(
      projectExtJRDocRef,
      projectExtJRUpdateRef
    ).catch((err) => {
      console.log("updateDoc() error: ", err);
    });

    // send auto msg
    const msgStr =
      "You was accepted for " +
      joinRequest.positionTitle +
      " of " +
      joinRequest.projectTitle;
    const messageRef = {
      text: msgStr,
      sent_by: currentUser?.uid,
      sent_at: serverTimestamp(),
    };
    const msgCollectionRef = collection(db, "chats", chat.id, "messages");
    const msgModRef = addDoc(msgCollectionRef, messageRef).catch((err) => {
      console.log("addDoc() error: ", err);
    });
    // remove JR in chat
    const my_unread_key = currentUser?.uid + "_unread";
    const partner_unread_key = joinRequest.requester_uid + "_unread";
    const newJR = chat.join_requests.filter(
      (jr) => jr.join_request_doc_id !== joinRequest.join_request_doc_id
    );
    const chatDocRef = doc(db, "chats", chat.id);
    const chatUpdateRef = {
      [my_unread_key]: 0,
      [partner_unread_key]: chat[partner_unread_key] + 1,
      join_requests: newJR,
      last_text: msgStr,
      last_timestamp: serverTimestamp(),
    };
    setChat({ ...chat, ...chatUpdateRef });
    const chatModRef = updateDoc(chatDocRef, chatUpdateRef).catch((err) => {
      console.log("updateDoc() error: ", err);
    });

    // JR in student ext will not be changed

    // await
    await projectExtModRef;
    await projectExtJRModRef;
    await msgModRef;
    await chatModRef;
  };

  // handle decline
  const handleDecline = async (joinRequest) => {
    if (!isClickable) return;
    setIsClickable(false);

    // update JR in project ext subcollection
    const projectExtJRDocRef = doc(
      db,
      "projects_ext",
      joinRequest.project_id,
      "join_requests",
      joinRequest.join_request_doc_id
    );
    const projectExtJRUpdateRef = {
      status: "declined",
      last_timestamp: serverTimestamp(),
    };
    const projectExtJRModRef = updateDoc(
      projectExtJRDocRef,
      projectExtJRUpdateRef
    ).catch((err) => {
      console.log("updateDoc() error: ", err);
    });

    // send msg
    const msgStr = declineMsg
      ? declineMsg
      : "Sorry. Creator didn't leave a note.";
    const messageRef = {
      text: msgStr,
      sent_by: currentUser?.uid,
      sent_at: serverTimestamp(),
    };
    const msgCollectionRef = collection(db, "chats", chat.id, "messages");
    const msgModRef = addDoc(msgCollectionRef, messageRef).catch((err) => {
      console.log("addDoc() error: ", err);
    });
    // remove JR in chat
    const my_unread_key = currentUser?.uid + "_unread";
    const partner_unread_key = joinRequest.requester_uid + "_unread";
    const newJR = chat.join_requests.filter(
      (jr) => jr.join_request_doc_id !== joinRequest.join_request_doc_id
    );
    const chatDocRef = doc(db, "chats", chat.id);
    const chatUpdateRef = {
      [my_unread_key]: 0,
      [partner_unread_key]: chat[partner_unread_key] + 1,
      join_requests: newJR,
      last_text: msgStr,
      last_timestamp: serverTimestamp(),
    };
    setChat({ ...chat, ...chatUpdateRef });
    const chatModRef = updateDoc(chatDocRef, chatUpdateRef).catch((err) => {
      console.log("updateDoc() error: ", err);
    });

    // await
    await projectExtJRModRef;
    await msgModRef;
    await chatModRef;
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    setShowMsg(false);
    setChat(null);
    setChatPartner(null);
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
    <Box
      sx={{
        width: isMaximized ? "35vw" : "25vw",
        height: isMaximized ? "75vh" : "50vh",
        minWidth: "300px",
        maxHeight: "75vh",
        position: "fixed",
        right: "max(calc(50px + 15%), 350px)",
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
          <Avatar
            sx={{ m: "12px", color: "#dbdbdb", backgroundColor: "#ffffff" }}
            src={chatPartner?.photo_url}
            referrerPolicy="no-referrer"
          />
          <Typography sx={{ fontWeight: "bold" }}>
            {chatPartner?.name}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {!isMaximized && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleMaximize();
              }}
            >
              <OpenInFullRoundedIcon sx={{ fontSize: "1.2em" }} />
            </IconButton>
          )}
          {isMaximized && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleMaximize();
              }}
            >
              <CloseFullscreenRoundedIcon sx={{ fontSize: "1.2em" }} />
            </IconButton>
          )}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: "1.2em" }} />
          </IconButton>
        </Box>
        {/* join requests */}
        {joinRequests?.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              borderBottom: 1,
            }}
          >
            <Box
              sx={{
                mx: "12px",
                my: "6px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography sx={{ fontSize: "0.8em", color: "#3e95c2" }}>
                {"Join Request"}
              </Typography>
              <Typography sx={{ fontSize: "0.8em" }}>
                {joinRequests[0].projectTitle} {joinRequests[0].positionTitle}
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleAccept(joinRequests[0], "title", "title");
              }}
            >
              <CheckCircleIcon
                sx={{
                  fontSize: "1em",
                  color: "#a4ca87",
                }}
              />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleDialogOpen();
              }}
            >
              <CancelIcon
                sx={{
                  fontSize: "1em",
                  color: "#e56b6b",
                }}
              />
            </IconButton>
            <Dialog open={isDialogOpen} onClose={handleDialogClose}>
              <DialogTitle>Message</DialogTitle>
              <DialogContent sx={{ paddingBottom: 0 }}>
                <DialogContentText>
                  Leave a note to let them know this position was not a match.
                </DialogContentText>
                <TextField
                  autoFocus
                  multiline
                  minRows={5}
                  margin="dense"
                  id="declineMsg"
                  // label="Message"
                  value={declineMsg}
                  fullWidth
                  onChange={(e) => setDeclineMsg(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    handleDecline(joinRequests[0]);
                    handleDialogClose();
                  }}
                >
                  Send
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}
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
            if (index > 0 && messages[index - 1].sent_by === message.sent_by) {
              isSameAuthor = true;
            }
            return (
              <ChatAccordionMsgItem
                key={index}
                message={message}
                isSameAuthor={isSameAuthor}
                chatPartner={chatPartner}
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
            multiline
            maxRows={4}
            InputProps={{
              disableUnderline: true,
            }}
            value={message.text}
            onChange={(e) => setMessage({ ...message, text: e.target.value })}
            /* onKeyPress={(e) => {
                  if (e.key === "Enter" && message.text) {
                    handleSubmit(e);
                  }
                }} */
          />
          <Button
            variant="contained"
            disabled={!message.text}
            disableElevation
            sx={{ backgroundColor: "#3e95c2", mr: "15px" }}
            onClick={(e) => handleSubmit(e)}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatAccordionMsg;
