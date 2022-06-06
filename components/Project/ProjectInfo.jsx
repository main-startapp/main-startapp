import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { GlobalContext, ProjectContext } from "../Context/ShareContexts";
import PositionListItem from "./PositionListItem";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import ExportedImage from "next-image-export-optimizer";

const ProjectInfo = () => {
  // context
  const {
    chats,
    currentStudent,
    students,
    setChat,
    setPartner,
    setShowMsg,
    setForceChatExpand,
    openDirectMsg,
    setOpenDirectMsg,
  } = useContext(GlobalContext);
  const { project } = useContext(ProjectContext);

  // local vars
  const currentUID = currentStudent?.uid;
  // is cur_user the creator?
  // !todo: should this go into useEffect?
  const isCreator = currentUID === project?.creator_uid;

  // hook to find project creator student data
  const [creatorStudent, setCreatorStudent] = useState(null);
  useEffect(() => {
    const foundCreator = students.find(
      (student) => student.uid === project?.creator_uid
    );
    setCreatorStudent(foundCreator);
    return foundCreator;
  }, [students, project]);

  // hook to show msg if the chat is newly created by "connect" or "join request"
  useEffect(() => {
    if (!openDirectMsg) return;

    const foundChat = chats.find((chat) =>
      chat.chat_user_ids.some((uid) => uid === creatorStudent?.uid)
    );
    if (foundChat) {
      setForceChatExpand(true);
      setTimeout(() => {
        setChat(foundChat);
        setPartner(creatorStudent);
        setShowMsg(true);
      }, 200); // delayed effect to look smooth
      setOpenDirectMsg(false);
    }
    return foundChat;
  }, [
    chats,
    creatorStudent,
    openDirectMsg,
    setChat,
    setForceChatExpand,
    setOpenDirectMsg,
    setPartner,
    setShowMsg,
  ]); // trigger mainly by chats update and showDirectMsg. will return if don't need to show direct msg.

  // helper func
  function getCreatorName(students, creatorUID) {
    const foundStudent = students.find((student) => student.uid === creatorUID);
    return foundStudent?.name;
  }

  function getCreatorPhotoURL(students, creatorUID) {
    const foundStudent = students.find((student) => student.uid === creatorUID);
    return foundStudent?.photo_url;
  }

  // similar func createProject() in ProjectList.jsx
  const router = useRouter();
  const updateProject = (projectObj) => {
    router.push(
      {
        pathname: `/project/create`,
        query: {
          isCreateStr: "false",
          projectStr: JSON.stringify(projectObj),
        },
      },
      `/project/create` // "as" argument
    );
  };

  // helper func
  // similar function in StudentGridCard; StudentProfile
  // !todo: handleConnect; function is bloated, might need an external lib to hold these func
  // !todo: user should not change/update other user's data
  const handleConnect = async (e) => {
    e.stopPropagation();
    setOpenDirectMsg(true); // trigger the useEffect to show the msg
    {
      /* update student data: add project creator uid to connections array */
    }
    /* const senderDocRef = doc(db, "students", currentUID);
    const senderPendingConnections = currentStudent.pending_connections;
    senderPendingConnections.push(project?.creator_uid);
    const senderStudentRef = {
      ...currentStudent,
      pending_connections: senderPendingConnections,
    };
    delete senderStudentRef?.uid;
    await updateDoc(senderDocRef, senderStudentRef).catch((err) => {
      console.log("updateDoc() error: ", err);
    }); */
    {
      /* create or update chat */
    }
    const foundChat = chats.find((chat) =>
      chat.chat_user_ids.some((uid) => uid === project?.creator_uid)
    );
    if (foundChat) {
      return;
    }
    // not found chat -> create
    const msgStr = currentStudent.name + " requested to connect";
    const messageRef = {
      text: msgStr,
      sent_by: currentUID,
      sent_at: serverTimestamp(),
    };
    // add chat doc
    const collectionRef = collection(db, "chats");
    const my_unread_key = currentUID + "_unread";
    const creator_unread_key = project?.creator_uid + "_unread";
    const chatRef = {
      chat_user_ids: [currentStudent?.uid, project?.creator_uid],
      last_text: msgStr,
      last_timestamp: serverTimestamp(),
      [my_unread_key]: 0,
      [creator_unread_key]: 1,
    };
    const chatAddDocRef = await addDoc(collectionRef, chatRef).catch((err) => {
      console.log("addDoc() error: ", err);
    });
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
  };

  // similar alg in components/Student/StudentProfile
  // box ref to used by useEffect
  const boxRef = useRef();
  // useEffect to reset box scrollbar position
  useEffect(() => {
    boxRef.current.scrollTop = 0;
  }, [project]); // every time project changes, this forces each accordion to collapse

  return (
    <Box
      ref={boxRef}
      sx={{
        height: "calc(98vh - 128px)",
        overflow: "auto",
      }}
    >
      {project?.id && (
        <Grid container>
          {/* Top left info box */}
          <Grid item xs={8}>
            <Box mt={3} ml={3} mr={1.5}>
              <Typography sx={{ fontWeight: "bold", fontSize: "2.5em" }}>
                {project?.title}
              </Typography>
              <Divider sx={{ mt: 3 }} />
              <Typography
                sx={{ mt: 3, fontWeight: "bold" }}
                color="text.primary"
              >
                {"Team size: "}
              </Typography>
              <Typography color="text.secondary">
                {project?.cur_member_count}
                {"/"}
                {project?.max_member_count}
              </Typography>
              <Typography
                sx={{ mt: 3, fontWeight: "bold" }}
                color="text.primary"
              >
                {"Details: "}
              </Typography>
              <Typography color="text.secondary">{project?.details}</Typography>
            </Box>
          </Grid>

          {/* Top right founder box */}
          <Grid item xs={4}>
            <Box mt={3} mr={3} ml={1.5}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <IconButton>
                  <Avatar
                    sx={{
                      width: "5em",
                      height: "5em",
                      border: "1px solid black",
                    }}
                    src={getCreatorPhotoURL(students, project?.creator_uid)}
                  />
                </IconButton>
              </Box>
              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "1.5em",
                  mt: 3,
                }}
              >
                {getCreatorName(students, project?.creator_uid) || "Founder"}
              </Typography>
              <Typography
                sx={{ display: "flex", justifyContent: "center" }}
                color="text.secondary"
              >
                {project?.creator_email}
              </Typography>
              <Box m={3} sx={{ display: "flex", justifyContent: "center" }}>
                {!isCreator && (
                  <Tooltip title={currentUID ? "" : "Edit your profile first."}>
                    <span>
                      <Button
                        disabled={!currentUID}
                        disableElevation
                        sx={{ borderRadius: 4, bgcolor: "#3e95c2" }}
                        variant="contained"
                        onClick={(e) => handleConnect(e)}
                      >
                        &emsp; {"Connect"} &emsp;
                      </Button>
                    </span>
                  </Tooltip>
                )}
                {isCreator && (
                  <Button
                    onClick={() => updateProject(project)}
                    variant="contained"
                    sx={{ borderRadius: 4, bgcolor: "#3e95c2" }}
                    disableElevation
                  >
                    &emsp; {"Modify"} &emsp;
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Bottom description and position boxes */}
          <Grid item xs={12}>
            <Box mt={3} ml={3} mr={3}>
              <Typography sx={{ fontWeight: "bold" }} color="text.primary">
                {"Description:"}
              </Typography>
              <Typography
                component="span"
                sx={{ mt: 3 }}
                color="text.secondary"
              >
                <pre
                  style={{
                    fontFamily: "inherit",
                    whiteSpace: "pre-wrap",
                    display: "inline",
                  }}
                >
                  {project?.description}
                </pre>
              </Typography>
            </Box>
            {/* position details */}
            <Box
              sx={{
                mt: 6,
                ml: 3,
                mr: 3,
                mb: "64px",
                border: 1,
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: "#3e95c2",
                  // borderTopLeftRadius: 15,
                  // borderTopRightRadius: 15,
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                }}
                color="text.primary"
              >
                &emsp; {"Positions:"}
              </Typography>
              {project?.position_list.map((position, index) => (
                <PositionListItem
                  key={index}
                  index={index}
                  title={position.positionTitle}
                  resp={position.positionResp}
                  weeklyHour={position.positionWeeklyHour}
                  isCreator={isCreator}
                  creator={creatorStudent}
                  // uid={position.positionUID}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      )}
      {!project?.id && (
        <Box
          id="logo placeholder container"
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            id="logo placeholder wrapper"
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <ExportedImage
              src="/images/EDIUM Logo.png"
              placeholder=""
              width={256}
              height={256}
              unoptimized={true}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ProjectInfo;
