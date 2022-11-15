import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Divider,
  Link,
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
import { findItemFromList } from "../Reusable/Resusable";

const PositionListItem = (props) => {
  // args
  const index = props.index;
  const posID = props.posID;
  const posTitle = props.posTitle;
  const posResp = props.posResp;
  const posWeeklyHour = props.posWeeklyHour;
  const posLevel = props.posLevel;
  const isCreator = props.isCreator; // whether ediumUser is the creator
  const creator = props.creator; // creator's user data
  const appFormURL = props.appFormURL;

  // context
  const {
    chats,
    users,
    ediumUser,
    ediumUserExt,
    setChatPartner,
    setForceChatExpand,
    onMedia,
  } = useContext(GlobalContext);
  const { project } = useContext(ProjectContext);

  // local vars
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
    let ediumUserExtModRef;
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
      requester_uid: ediumUser?.uid,
      status: "requesting",
      last_timestamp: serverTimestamp(),
    };
    jrModRef = addDoc(jrCollectionRef, jrDocRef).catch((error) => {
      console.log(error?.message);
    });
    let jrRetID;
    await jrModRef.then((ret) => {
      jrRetID = ret?.id;
    });

    // add it to my user ext
    const ediumUserExtDocRef = doc(db, "users_ext", ediumUser?.uid);
    const ediumUserExtJoinRequests = ediumUserExt.join_requests;
    ediumUserExtJoinRequests.push({
      project_id: project.id,
      position_id: posID,
      join_request_doc_id: jrRetID || -1,
    });
    const ediumUserExtUpdateRef = {
      join_requests: ediumUserExtJoinRequests,
      last_timestamp: serverTimestamp(),
    };
    ediumUserExtModRef = updateDoc(
      ediumUserExtDocRef,
      ediumUserExtUpdateRef
    ).catch((error) => {
      console.log(error?.message);
    });

    // add it to chat or create a chat
    const msgStr =
      ediumUser.name +
      " requested to join " +
      project.title +
      " for " +
      posTitle +
      " position";
    const messageRef = {
      text: msgStr,
      sent_by: ediumUser?.uid,
      sent_at: serverTimestamp(),
    };
    const my_unread_key = ediumUser?.uid + "_unread";
    const creator_unread_key = project?.creator_uid + "_unread";
    const foundChat = chats.find((chat) =>
      chat.chat_user_ids.some((uid) => uid === project.creator_uid)
    );
    const chatJR = {
      project_id: project.id,
      position_id: posID,
      requester_uid: ediumUser?.uid,
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
        has_unread: true,
        join_requests: newChatJoinRequests,
        last_text: msgStr,
        last_timestamp: serverTimestamp(),
      };
      // don't need to setChat, as this will be done by hook in ChatAccordion
      chatModRef = updateDoc(chatDocRef, chatUpdateRef).catch((error) => {
        console.log(error?.message);
      });
    } else {
      // create
      const collectionRef = collection(db, "chats");
      const my_name_key = ediumUser?.uid + "_name";
      const creator_name_key = project?.creator_uid + "_name";
      const creatorUser = findItemFromList(users, "uid", project?.creator_uid);
      const chatRef = {
        // new
        chat_user_ids: [ediumUser?.uid, project.creator_uid],
        [my_name_key]: ediumUser?.name,
        [creator_name_key]: creatorUser?.name,
        [my_unread_key]: 0,
        [creator_unread_key]: 1,
        has_unread: true,
        join_requests: [chatJR],
        last_text: msgStr,
        last_timestamp: serverTimestamp(),
      };
      chatModRef = addDoc(collectionRef, chatRef).catch((error) => {
        console.log(error?.message);
      });
    }

    // await chat and add message
    let chatRetID;
    await chatModRef.then((ret) => {
      chatRetID = ret?.id;
    }); // only addDoc will return, updateDoc returns undefined
    const chatID = foundChat ? foundChat.id : chatRetID || -1;
    const msgCollectionRef = collection(db, "chats", chatID, "messages");
    const msgModRef = addDoc(msgCollectionRef, messageRef).catch((error) => {
      console.log(error?.message);
    });

    // await the rest
    await ediumUserExtModRef;
    await msgModRef;

    // open chat accordion
    setChatPartner(creator);
    setForceChatExpand(true);
  };

  // components
  const appFormButton = (
    <Button
      disabled={!ediumUser?.uid}
      disableElevation
      variant="contained"
      component={Link}
      target="_blank"
      href={appFormURL}
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
      size="small"
      sx={{
        borderRadius: 8,
        backgroundColor: "primary",
        paddingX: 2,
        paddingY: 0,
        fontSize: "0.75rem",
      }}
    >
      {"Apply"}
    </Button>
  );

  const joinRequestButton = (
    <Button
      disabled={
        !ediumUser?.uid ||
        ediumUserExt?.join_requests?.some(
          (jr) => jr.project_id === project.id && jr.position_id === posID
        )
      }
      disableElevation
      variant="contained"
      onClick={(e) => {
        e.stopPropagation();
        handleJoinRequest();
      }}
      size="small"
      sx={{
        borderRadius: 8,
        backgroundColor: "primary",
        paddingX: 2,
        paddingY: 0,
        fontSize: "0.75rem",
      }}
    >
      {"Apply"}
    </Button>
  );

  return (
    <Box
      id="positionlistitem-box"
      sx={onMedia.onDesktop ? { my: 2 } : { my: 1 }}
    >
      <Accordion
        square
        elevation={2}
        expanded={expandState === "expandIt"}
        sx={{
          boxShadow: "none",
          borderRadius: 2,
          // "&:hover": {
          //   backgroundColor: "hoverGray.main",
          //   cursor: "default",
          // },
        }}
      >
        <StyledAccordionSummary
          id={"accordion-" + index + "-header"}
          aria-controls={"accordion-" + index + "-content"}
          expandIcon={<ExpandMoreIcon />}
          onClick={(e) => handleExpand(e)}
          sx={{ borderRadius: 2, boxShadow: 2 }}
        >
          <Box
            sx={{
              mr: 2,
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              color="text.primary"
              sx={{ fontSize: "1rem", fontWeight: "medium" }}
            >
              {posTitle}
            </Typography>
            {posLevel !== "" && (
              <Chip
                color={posLevel === "Beginner" ? "beginnerGreen" : "error"}
                label={posLevel}
                size="small"
                sx={{
                  ml: 1,
                  height: "16px",
                  borderRadius: 1.5,
                  fontSize: "0.625rem",
                }}
              />
            )}
            <Box sx={{ flexGrow: 1 }} />
            {onMedia.onDesktop && !isCreator && (
              <Tooltip title={ediumUser?.uid ? "" : "Edit your profile first"}>
                <span>{appFormURL ? appFormButton : joinRequestButton}</span>
              </Tooltip>
            )}
          </Box>
        </StyledAccordionSummary>
        <AccordionDetails sx={{ padding: 4 }}>
          {/* <Divider
            sx={{ mb: 1.5, borderBottomWidth: 1.5, borderColor: "#dbdbdb" }}
          /> */}

          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              color="text.primary"
              sx={{ fontSize: "1em", fontWeight: "medium" }}
            >
              {"Role Description: "}
            </Typography>
            <Typography component="span" color="text.secondary" sx={{ mt: 1 }}>
              <pre
                style={{
                  fontFamily: "inherit",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  display: "inline",
                }}
              >
                {posResp}
              </pre>
            </Typography>
            {!onMedia.onDesktop && !isCreator && (
              <Box sx={{ mt: 1.5, display: "flex", justifyContent: "end" }}>
                <Tooltip
                  title={ediumUser?.uid ? "" : "Edit your profile first"}
                >
                  <span>{appFormURL ? appFormButton : joinRequestButton}</span>
                </Tooltip>
              </Box>
            )}
          </Box>
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
