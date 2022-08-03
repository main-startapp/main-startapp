import {
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../../firebase";
import { GlobalContext } from "../Context/ShareContexts";
import { handleConnect, handleSendMsg } from "../Reusable/Resusable";

const TeamJoinRequestListItem = (props) => {
  // props
  const request = props.request; // chat_id, project_id, position_id, creator_uid, requester_uid, status
  const projectID = request.project_id;
  const positionID = request.position_id;
  const requesterUID = request.requester_uid;
  const chatID = request.chat_id;
  const status = request.status;

  // context
  const { students, chats, currentStudent, setPartner, setForceChatExpand } =
    useContext(GlobalContext);

  // local vars
  const currentUID = currentStudent?.uid;

  // dialog modal
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [declineMsg, setDeclineMsg] = useState("");
  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  const handleReply = async (newStatus) => {
    // 1. find chat and send msg
    const foundChat = chats.find((chat) => chat.id === chatID);
    if (!foundChat) return;
    const msgStr = declineMsg
      ? declineMsg
      : "Sorry. Creator didn't leave a note.";
    const messageRef = {
      text: msgStr,
      sent_by: currentUID,
      sent_at: serverTimestamp(),
    };
    const receiver_unread_key = requesterUID + "_unread";
    const chatDocRef = doc(db, "chats", chatID);
    let newJoinRequests = foundChat.join_requests;
    const foundIndex = newJoinRequests.findIndex(
      (req) =>
        req.project_id === projectID &&
        req.position_id === positionID &&
        req.requester_uid === requesterUID
    );
    console.log(foundIndex);
    newJoinRequests[foundIndex] = {
      ...newJoinRequests[foundIndex],
      status: newStatus,
    };
    const chatRef = {
      ...foundChat,
      [receiver_unread_key]: foundChat[receiver_unread_key] + 1,
      join_requests: newJoinRequests,
      last_text: msgStr,
      last_timestamp: serverTimestamp(),
    };
    delete chatRef.id;
    const chatModRef = updateDoc(chatDocRef, chatRef).catch((err) => {
      console.log("updateDoc() error: ", err);
    });
    const msgCollectionRef = collection(db, "chats", chatID, "messages");
    const msgModRef = addDoc(msgCollectionRef, messageRef).catch((err) => {
      console.log("addDoc() error: ", err);
    });
    await chatModRef;
    await msgModRef;
  };

  // requester's student data
  const [requestingStudent, setRequestingStudent] = useState(null);
  useEffect(() => {
    const found = students.find((student) => student.uid === requesterUID);
    if (!found) return; // is this even possible?

    setRequestingStudent(found);
    return found;
  }, [requesterUID, students]);

  return (
    <Card
      variant="outlined"
      sx={{
        m: 3,
        backgroundColor: "#fafafa",
        border: "1px solid black",
        borderRadius: 4,
        height: "100%",
        minWidth: "175px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          // justifyContent: "center",
        }}
      >
        <Avatar
          sx={{
            m: 1.5,
            width: "5em",
            height: "5em",
            border: "1px solid black",
          }}
          src={requestingStudent?.photo_url}
        />

        <Typography sx={{ fontWeight: "bold", fontSize: "1em" }}>
          {requestingStudent?.name}
        </Typography>
        <Typography sx={{ fontSize: "0.9em" }}>
          {requestingStudent?.desired_position}
        </Typography>
        <Typography sx={{ fontSize: "0.9em" }}>
          {"Skill level: "}
          {requestingStudent?.skill_level}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          disabled={status === "declined"}
          disableElevation
          size="small"
          sx={{
            ml: 3,
            mr: 3,
            mt: 1.5,
            mb: 1,
            borderRadius: 4,
            backgroundColor: "#3e95c2",
            width: 90,
          }}
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            handleDialogOpen();
          }}
        >
          <Typography sx={{ fontSize: "0.9em" }}>
            {status === "declined" ? "Declined" : "Decline"}
          </Typography>
        </Button>
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
                handleReply("declined");
                handleDialogClose();
              }}
            >
              Send
            </Button>
          </DialogActions>
        </Dialog>

        <Button
          disableElevation
          size="small"
          sx={{
            ml: 3,
            mr: 3,
            mb: 1.5,
            borderRadius: 4,
            backgroundColor: "#3e95c2",
            width: 90,
          }}
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            handleConnect(
              chats,
              requestingStudent,
              currentStudent,
              setPartner,
              setForceChatExpand
            );
          }}
        >
          <Typography sx={{ fontSize: "0.9em" }}>Message</Typography>
        </Button>
      </Box>
    </Card>
  );
};

export default TeamJoinRequestListItem;
