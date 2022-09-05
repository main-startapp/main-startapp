import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useContext, useEffect, useState } from "react";
import { GlobalContext, ProjectContext } from "../Context/ShareContexts";
import { db } from "../../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

const PositionListItem = (props) => {
  // context
  const {
    chats,
    currentStudent,
    currentStudentExt,
    setCurrentStudentExt,
    setChatPartner,
    setForceChatExpand,
  } = useContext(GlobalContext);
  const { project } = useContext(ProjectContext);

  // args
  const posID = props.posID;
  const posTitle = props.posTitle;
  const posResp = props.posResp;
  const posWeeklyHour = props.posWeeklyHour;
  const isCreator = props.isCreator; // whether currentStudent is the creator
  const creator = props.creator;

  // local vars
  const currentUID = currentStudent?.uid;

  // useEffect to reset accordion expansion
  const [expandState, setExpandState] = useState("collapseIt");
  useEffect(() => {
    setExpandState("collpaseIt");
  }, [project]); // every time project changes, this sets each accordion to collapse

  const handleExpand = (e) => {
    expandState === "expandIt"
      ? setExpandState("collapseIt")
      : setExpandState("expandIt");
  };

  // !todo: handleJoinRequest; function is bloated, might need an external lib to hold these func
  const handleJoinRequest = async () => {
    // mod ref
    let jrModRef;
    let curStudentExtModRef;
    let chatModRef;

    // add it to project ext join requests subcollection
    const jrCollectionRef = collection(
      db,
      "projects_ext",
      project.id,
      "join_requests"
    );
    const jrDocRef = {
      position_id: posID,
      requester_uid: currentUID,
      status: "requesting",
      last_timestamp: serverTimestamp(),
    };
    jrModRef = addDoc(jrCollectionRef, jrDocRef).catch((err) => {
      console.log("addDoc() error: ", err);
    });
    let jrRetID;
    await jrModRef.then((ret) => {
      jrRetID = ret?.id;
    });

    // add it to my student ext
    const curStudentExtDocRef = doc(db, "students_ext", currentUID);
    const curStudentExtJoinRequests = currentStudentExt.join_requests;
    curStudentExtJoinRequests.push({
      project_id: project.id,
      position_id: posID,
      join_request_doc_id: jrRetID || -1,
    });
    const curStudentExtUpdateRef = {
      join_requests: curStudentExtJoinRequests,
      last_timestamp: serverTimestamp(),
    };
    curStudentExtModRef = updateDoc(
      curStudentExtDocRef,
      curStudentExtUpdateRef
    ).catch((err) => {
      console.log("updateDoc() error: ", err);
    });

    // add it to chat or create a chat
    const msgStr =
      currentStudent.name +
      " requested to join " +
      project.title +
      " as " +
      posTitle;
    const messageRef = {
      text: msgStr,
      sent_by: currentUID,
      sent_at: serverTimestamp(),
    };
    const my_unread_key = currentUID + "_unread";
    const creator_unread_key = project?.creator_uid + "_unread";
    const foundChat = chats.find((chat) =>
      chat.chat_user_ids.some((uid) => uid === project.creator_uid)
    );
    const chatJR = {
      project_id: project.id,
      position_id: posID,
      requester_uid: currentUID,
      join_request_doc_id: jrRetID || -1,
    };
    if (foundChat) {
      // update
      const chatDocRef = doc(db, "chats", foundChat.id);
      let newChatJoinRequests = foundChat?.join_requests
        ? foundChat.join_requests
        : [];
      newChatJoinRequests.push(chatJR);
      const chatUpdateRef = {
        [creator_unread_key]: foundChat[creator_unread_key] + 1, // dont use ++foundChat[creator_unread_key]; dont directly mutate the state
        join_requests: newChatJoinRequests,
        last_text: msgStr,
        last_timestamp: serverTimestamp(),
      };
      // don't need to setChat, as this will be done by hook in ChatAccordion
      chatModRef = updateDoc(chatDocRef, chatUpdateRef).catch((err) => {
        console.log("updateDoc() error: ", err);
      });
    } else {
      // create
      const collectionRef = collection(db, "chats");
      const chatRef = {
        // new
        chat_user_ids: [currentUID, project.creator_uid],
        [my_unread_key]: 0,
        [creator_unread_key]: 1,
        join_requests: [chatJR],
        last_text: msgStr,
        last_timestamp: serverTimestamp(),
      };
      chatModRef = addDoc(collectionRef, chatRef).catch((err) => {
        console.log("addDoc() error: ", err);
      });
    }

    // await chat and add message
    let chatRetID;
    await chatModRef.then((ret) => {
      chatRetID = ret?.id;
    }); // only addDoc will return, updateDoc returns undefined
    const chatID = !!foundChat ? foundChat.id : chatRetID || -1;
    const msgCollectionRef = collection(db, "chats", chatID, "messages");
    const msgModRef = addDoc(msgCollectionRef, messageRef).catch((err) => {
      console.log("addDoc() error: ", err);
    });

    // await the rest
    await curStudentExtModRef;
    await msgModRef;

    // open chat accordion
    setChatPartner(creator);
    setForceChatExpand(true);
  };

  return (
    <Box sx={{ m: 3 }}>
      <Accordion
        square={true}
        expanded={expandState === "expandIt"}
        sx={{
          border: 1.5,
          borderRadius: "10px",
          borderColor: "#dbdbdb",
          boxShadow: 0,
          maxWidth: "100%",
          "&:hover": {
            backgroundColor: "#f6f6f6",
          },
        }}
      >
        <StyledAccordionSummary
          expandIcon={<ExpandMoreIcon />}
          onClick={(e) => handleExpand(e)}
        >
          <Typography
            color="text.primary"
            sx={{ display: "flex", alignItems: "center" }}
          >
            {posTitle}
          </Typography>
          {!isCreator && (
            <Tooltip title={currentUID ? "" : "Edit your profile first."}>
              <span>
                <Button
                  disabled={
                    !currentUID ||
                    currentStudentExt?.join_requests?.some(
                      (jr) =>
                        jr.project_id === project.id && jr.position_id === posID
                    )
                  }
                  disableElevation
                  size="small"
                  sx={{
                    mr: 3,
                    border: 1.5,
                    borderColor: "#dbdbdb",
                    borderRadius: "30px",
                    backgroundColor: "#3e95c2",
                    textTransform: "none",
                    paddingX: 3,
                  }}
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinRequest();
                  }}
                >
                  {"Join Request"}
                </Button>
              </span>
            </Tooltip>
          )}
        </StyledAccordionSummary>
        <AccordionDetails>
          <Divider
            sx={{ mb: 3, borderBottomWidth: 1.5, borderColor: "#dbdbdb" }}
          />
          <Grid
            container
            spacing={0}
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={9}>
              <Typography color="text.primary">
                {"Responsibilities: "}
              </Typography>
              <Typography component="span" color="text.secondary">
                <pre
                  style={{
                    fontFamily: "inherit",
                    whiteSpace: "pre-wrap",
                    display: "inline",
                  }}
                >
                  {posResp}
                </pre>
              </Typography>
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={2}>
              <Typography>
                {"Weekly Hours: "}
                {posWeeklyHour}
              </Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default PositionListItem;

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  "& .MuiAccordionSummary-content": {
    justifyContent: "space-between",
  },
}));
