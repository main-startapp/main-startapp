import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Grid,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
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
  const { chats, currentStudent, setChat, setOpenDirectMsg } =
    useContext(GlobalContext);
  const { project } = useContext(ProjectContext);

  // args
  const index = props.index;
  const title = props.title;
  const resp = props.resp;
  const weeklyHour = props.weeklyHour;
  const isCreator = props.isCreator;
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

  // similar function in StudentProfile; ProjectInfo; StudentGridCard
  // !todo: handleJoinRequest; function is bloated, might need an external lib to hold these func
  const handleJoinRequest = async (e) => {
    e.stopPropagation();
    {
      /* update currentStudent: requested positions*/
    }
    const currentStudentDocRef = doc(db, "students", currentUID);
    const currentStudenReqPos = currentStudent.requested_posititons;
    currentStudenReqPos.push({
      project_id: project.id,
      position_index: index,
      position_title: title,
    });
    const currentStudentRef = {
      ...currentStudent,
      requested_posititons: currentStudenReqPos,
    };
    delete currentStudentRef?.uid;
    await updateDoc(currentStudentDocRef, currentStudentRef).catch((err) => {
      console.log("updateDoc() error: ", err);
    });
    {
      /* create or update chat */
    }
    setOpenDirectMsg(true); // trigger the useEffect to show the msg
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
    if (foundChat) {
      // update
      // add message
      const msgCollectionRef = collection(
        db,
        "chats",
        foundChat.id,
        "messages"
      );
      const msgAddDocRef = await addDoc(msgCollectionRef, messageRef).catch(
        (err) => {
          console.log("addDoc() error: ", err);
        }
      );
      // update chat
      const chatDocRef = doc(db, "chats", foundChat.id);
      const chatRef = {
        ...foundChat,
        join_request_project: project?.title,
        join_request_position: title,
        last_text: msgStr,
        last_timestamp: serverTimestamp(),
        [creator_unread_key]: foundChat[creator_unread_key] + 1, // dont use ++foundChat[creator_unread_key]; dont directly mutate the state
      };
      delete chatRef.id;
      const chatUpdateDocRef = await updateDoc(chatDocRef, chatRef).catch(
        (err) => {
          console.log("updateDoc() error: ", err);
        }
      );
      // set state
      setChat({
        ...foundChat,
        [creator_unread_key]: foundChat[creator_unread_key] + 1,
      });
    } else {
      // create
      // add chat doc
      const collectionRef = collection(db, "chats");
      const chatRef = {
        chat_user_ids: [currentStudent?.uid, project?.creator_uid],
        join_request_project: project?.title,
        join_request_position: title,
        last_text: msgStr,
        last_timestamp: serverTimestamp(),
        [my_unread_key]: 0,
        [creator_unread_key]: 1,
      };
      const chatAddDocRef = await addDoc(collectionRef, chatRef).catch(
        (err) => {
          console.log("addDoc() error: ", err);
        }
      );
      // add message
      const msgCollectionRef = collection(
        db,
        "chats",
        chatAddDocRef.id,
        "messages"
      );
      const msgAddDocRef = await addDoc(msgCollectionRef, messageRef).catch(
        (err) => {
          console.log("addDoc() error: ", err);
        }
      );
    }
  };

  return (
    <Box sx={{ m: 3 }}>
      <Accordion
        square={true}
        expanded={expandState === "expandIt"}
        sx={{
          border: 1,
          borderRadius: 4,
          borderColor: "text.secondary",
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
          <Typography color="text.primary">{title}</Typography>
          {!isCreator && (
            <Tooltip title={currentUID ? "" : "Edit your profile first."}>
              <span>
                <Button
                  disabled={
                    !currentUID ||
                    currentStudent.requested_posititons.some(
                      (pos) =>
                        pos.project_id === project.id &&
                        pos.position_index === index &&
                        pos.position_title === title
                    )
                  }
                  disableElevation
                  size="small"
                  sx={{ mr: 3, borderRadius: 4, bgcolor: "#3e95c2" }}
                  variant="contained"
                  onClick={(e) => handleJoinRequest(e)}
                >
                  &emsp; {"Join Request"} &emsp;
                </Button>
              </span>
            </Tooltip>
          )}
        </StyledAccordionSummary>
        <AccordionDetails>
          <Divider sx={{ mb: 3 }} />
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
