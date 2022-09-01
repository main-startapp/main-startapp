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
  const { chats, currentStudent, setPartner, setForceChatExpand } =
    useContext(GlobalContext);
  const { project } = useContext(ProjectContext);

  // args
  const posID = props.posID;
  const title = props.title;
  const resp = props.resp;
  const weeklyHour = props.weeklyHour;
  const reqPositions = props.reqPositions; // a list of currentStudent's requesting positions
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
    // chat accordion related
    setPartner(creator);
    setForceChatExpand(true);
    //
    const foundChat = chats.find((chat) =>
      chat.chat_user_ids.some((uid) => uid === project.creator_uid)
    );
    const msgStr =
      currentStudent.name +
      " requested to join " +
      project.title +
      " as " +
      title;
    const messageRef = {
      text: msgStr,
      sent_by: currentUID,
      sent_at: serverTimestamp(),
    };
    const my_unread_key = currentUID + "_unread";
    const creator_unread_key = project?.creator_uid + "_unread";
    let chatModRef;
    if (foundChat) {
      // update
      const chatDocRef = doc(db, "chats", foundChat.id);
      let joinRequests = foundChat?.join_requests
        ? foundChat.join_requests
        : [];
      joinRequests.push({
        project_id: project?.id,
        position_id: posID,
        creator_uid: project?.creator_uid,
        requester_uid: currentUID,
        status: "requesting",
      });
      const chatRef = {
        ...foundChat,
        [creator_unread_key]: foundChat[creator_unread_key] + 1, // dont use ++foundChat[creator_unread_key]; dont directly mutate the state
        join_requests: joinRequests,
        last_text: msgStr,
        last_timestamp: serverTimestamp(),
      };
      delete chatRef.id;
      chatModRef = updateDoc(chatDocRef, chatRef).catch((err) => {
        console.log("updateDoc() error: ", err);
      });
    } else {
      // create
      const collectionRef = collection(db, "chats");
      const chatRef = {
        // new
        chat_user_ids: [currentStudent?.uid, project?.creator_uid],
        [my_unread_key]: 0,
        [creator_unread_key]: 1,
        join_requests: [
          {
            project_id: project?.id,
            position_id: posID,
            creator_uid: project?.creator_uid,
            requester_uid: currentUID,
            status: "requesting",
          },
        ],
        last_text: msgStr,
        last_timestamp: serverTimestamp(),
      };
      chatModRef = addDoc(collectionRef, chatRef).catch((err) => {
        console.log("addDoc() error: ", err);
      });
    }
    {
      /* awiat chat and add message */
    }
    let retID;
    await chatModRef.then((ret) => {
      retID = ret?.id;
    }); // only addDoc will return, updateDoc returns undefined
    let chatID;
    if (foundChat) {
      chatID = foundChat.id;
    } else {
      chatID = retID;
    }
    const msgCollectionRef = collection(db, "chats", chatID, "messages");
    const msgModRef = addDoc(msgCollectionRef, messageRef).catch((err) => {
      console.log("addDoc() error: ", err);
    });
    await msgModRef;
    /* 
    const curStudentDocRef = doc(db, "students", currentUID);
    const curStudentReqPos = currentStudent.requested_positions;
    curStudentReqPos.push({
      project_id: project.id,
      position_id: posID,
    });
    const curStudentRef = {
      ...currentStudent,
      requested_positions: curStudentReqPos,
    };
    delete curStudentRef?.uid;
    const curStudentModRef = updateDoc(curStudentDocRef, curStudentRef).catch(
      (err) => {
        console.log("updateDoc() error: ", err);
      }
    );
    await curStudentModRef; */
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
            {title}
          </Typography>
          {!isCreator && (
            <Tooltip title={currentUID ? "" : "Edit your profile first."}>
              <span>
                <Button
                  disabled={
                    !currentUID ||
                    reqPositions.some(
                      (pos) =>
                        pos.project_id === project.id &&
                        pos.position_id === posID
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
                  {resp}
                </pre>
              </Typography>
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={2}>
              <Typography>
                {"Weekly Hours: "}
                {weeklyHour}
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
