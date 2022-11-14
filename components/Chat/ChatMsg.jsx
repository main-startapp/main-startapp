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
import ChatMsgItem from "./ChatMsgItem";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";
import CloseFullscreenRoundedIcon from "@mui/icons-material/CloseFullscreenRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { findItemFromList } from "../Reusable/Resusable";

const ChatMsg = (props) => {
  // context
  const {
    ediumUser,
    chat,
    chatPartner,
    setChat,
    setChatPartner,
    showMsg,
    setShowMsg,
    projects,
  } = useContext(GlobalContext);
  const isMaximized = props.isMaximized;
  const setIsMaximized = props.setIsMaximized;

  // listen to realtime messages subcollection in chats collection
  // !todo: either listen to the msg when necessary or using DBListener which one is better?
  const [message, setMessage] = useState({
    text: "",
    sent_by: ediumUser?.uid,
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

  // textfield focused flag
  const [focused, setFocused] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

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
      const foundProject = findItemFromList(
        projects,
        "id",
        join_request.project_id
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
    setMessage({ text: "", sent_by: ediumUser?.uid }); // reset msg locally
    const msgCollectionRef = collection(db, "chats", chat.id, "messages");
    const msgModRef = addDoc(msgCollectionRef, messageRef).catch((error) => {
      console.log(error?.message);
    });
    // update chat
    const my_unread_key = ediumUser?.uid + "_unread";
    const partner_unread_key = chatPartner?.uid + "_unread";
    const chatDocRef = doc(db, "chats", chat.id);
    let chatUpdateRef = {
      [my_unread_key]: 0,
      [partner_unread_key]: chat[partner_unread_key] + 1,
      has_unread: true,
      last_text: message.text,
      last_timestamp: serverTimestamp(),
    };
    setChat({ ...chat, ...chatUpdateRef }); // second entry will overwrite first entry for the same keys
    const chatModRef = updateDoc(chatDocRef, chatUpdateRef).catch((error) => {
      console.log(error?.message);
    });

    await msgModRef;
    await chatModRef;
  };

  // handle JR accept
  const handleAccept = async (joinRequest) => {
    if (!isClickable) return;
    setIsClickable(false);

    // add user to project ext member
    const projectExtDocRef = doc(db, "projects_ext", joinRequest.project_id);
    const projectExtUpdateRef = {
      members: arrayUnion(joinRequest.requester_uid),
      last_timestamp: serverTimestamp(),
    };
    const projectExtModRef = updateDoc(
      projectExtDocRef,
      projectExtUpdateRef
    ).catch((error) => {
      console.log(error?.message);
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
    ).catch((error) => {
      console.log(error?.message);
    });

    // send auto msg
    const msgStr =
      "You was accepted for " +
      joinRequest.positionTitle +
      " of " +
      joinRequest.projectTitle;
    const messageRef = {
      text: msgStr,
      sent_by: ediumUser?.uid,
      sent_at: serverTimestamp(),
    };
    const msgCollectionRef = collection(db, "chats", chat.id, "messages");
    const msgModRef = addDoc(msgCollectionRef, messageRef).catch((error) => {
      console.log(error?.message);
    });
    // remove JR in chat
    const my_unread_key = ediumUser?.uid + "_unread";
    const partner_unread_key = joinRequest.requester_uid + "_unread";
    const newJR = chat.join_requests.filter(
      (jr) => jr.join_request_doc_id !== joinRequest.join_request_doc_id
    );
    const chatDocRef = doc(db, "chats", chat.id);
    const chatUpdateRef = {
      [my_unread_key]: 0,
      [partner_unread_key]: chat[partner_unread_key] + 1,
      has_unread: true,
      join_requests: newJR,
      last_text: msgStr,
      last_timestamp: serverTimestamp(),
    };
    setChat({ ...chat, ...chatUpdateRef });
    const chatModRef = updateDoc(chatDocRef, chatUpdateRef).catch((error) => {
      console.log(error?.message);
    });

    // JR in user ext will not be changed

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
    ).catch((error) => {
      console.log(error?.message);
    });

    // send msg
    const msgStr = declineMsg
      ? declineMsg
      : "Sorry. Creator didn't leave a note";
    const messageRef = {
      text: msgStr,
      sent_by: ediumUser?.uid,
      sent_at: serverTimestamp(),
    };
    const msgCollectionRef = collection(db, "chats", chat.id, "messages");
    const msgModRef = addDoc(msgCollectionRef, messageRef).catch((error) => {
      console.log(error?.message);
    });
    // remove JR in chat
    const my_unread_key = ediumUser?.uid + "_unread";
    const partner_unread_key = joinRequest.requester_uid + "_unread";
    const newJR = chat.join_requests.filter(
      (jr) => jr.join_request_doc_id !== joinRequest.join_request_doc_id
    );
    const chatDocRef = doc(db, "chats", chat.id);
    const chatUpdateRef = {
      [my_unread_key]: 0,
      [partner_unread_key]: chat[partner_unread_key] + 1,
      has_unread: true,
      join_requests: newJR,
      last_text: msgStr,
      last_timestamp: serverTimestamp(),
    };
    setChat({ ...chat, ...chatUpdateRef });
    const chatModRef = updateDoc(chatDocRef, chatUpdateRef).catch((error) => {
      console.log(error?.message);
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

  // reusable comp
  const headerBox = (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderBottom: joinRequests?.length > 0 ? 1.5 : 2.5,
        borderColor: "#dbdbdb",
        zIndex: 1,
      }}
    >
      <Avatar
        sx={{
          m: "12px",
          // color: "#dbdbdb",
          // backgroundColor: "#ffffff",
          // border: 1,
          // borderColor: "#dbdbdb",
          height: "48px",
          width: "48px",
        }}
        src={chatPartner?.photo_url}
        referrerPolicy="no-referrer"
      />
      <Typography sx={{ fontWeight: "bold", fontSize: "1em" }}>
        {chatPartner?.name}
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      {setIsMaximized !== undefined && (
        <>
          {isMaximized ? (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleMaximize();
              }}
            >
              <CloseFullscreenRoundedIcon sx={{ fontSize: "0.9em" }} />
            </IconButton>
          ) : (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleMaximize();
              }}
            >
              <OpenInFullRoundedIcon sx={{ fontSize: "0.9em" }} />
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
        </>
      )}
    </Box>
  );

  const joinRequestBox = joinRequests?.length > 0 && (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderBottom: 2.5,
        borderColor: "#dbdbdb",
        backgroundColor: "#fafafa",
        paddingRight: "3px",
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
          Join Request
        </Typography>
        <Typography
          sx={{
            fontSize: "0.8em",
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
          }}
        >
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
            fontSize: "0.9em",
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
            fontSize: "0.9em",
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
            id="chatmsg-decline-msg-textfield"
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
  );

  const messageBox = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        flexGrow: 1,
        borderColor: "#dbdbdb",
      }}
    >
      {messages.map((message, index) => {
        const isSameAuthor =
          index > 0 && messages[index - 1].sent_by === message.sent_by;
        const isLastMsg = messages.length - 1 === index;
        return (
          <ChatMsgItem
            key={index}
            message={message}
            isSameAuthor={isSameAuthor}
            chatPartner={chatPartner}
            isLastMsg={isLastMsg}
          />
        );
      })}
      <div ref={scrollRef} />
    </Box>
  );

  const inputBox = (
    <Box
      sx={{
        position: "sticky",
        bottom: 0,
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          borderTop: 2.5,
          borderColor: focused ? "secondary.main" : "divider",
        }}
      >
        <TextField
          sx={{
            flex: 1,
            my: "6px",
            mx: "12px",
            "& .MuiInputBase-root": {
              padding: 0,
              fontSize: "0.9em",
            },
          }}
          variant="standard"
          placeholder="Write a message..."
          multiline
          rows={4}
          InputProps={{
            disableUnderline: true,
          }}
          value={message.text}
          onChange={(e) => setMessage({ ...message, text: e.target.value })}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (message.text) {
                handleSubmit(e);
              }
            }
          }}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          borderTop: 1.5,
          borderColor: "#dbdbdb",
          paddingY: "6px",
          paddingX: "12px",
        }}
      >
        <Button
          variant="contained"
          disabled={!message.text || !isClickable}
          disableElevation
          sx={{
            backgroundColor: "#3e95c2",
            border: 1.5,
            borderColor: "#dbdbdb",
            borderRadius: 8,
            paddingX: 0,
            paddingY: 0,
            textTransform: "none",
            fontSize: "0.7em",
            position: "relative",
          }}
          onClick={(e) => handleSubmit(e)}
        >
          Send
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* header */}
      {headerBox}
      {/* join requests */}
      {joinRequestBox}
      {/* messages */}
      {messageBox}
      {/* input */}
      {inputBox}
    </>
  );
};

export default ChatMsg;
