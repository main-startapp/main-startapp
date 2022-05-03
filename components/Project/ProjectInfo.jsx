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
import { ProjectContext } from "../Context/ShareContexts";
import PositionListItem from "./PositionListItem";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const ProjectInfo = () => {
  // context
  const { project, currentStudent } = useContext(ProjectContext);

  // local vars
  const currentUID = currentStudent?.uid;
  // is cur_user the creator?
  // !todo: should this go into useEffect?
  const isCreator = currentStudent?.uid === project?.creator_uid ? true : false;

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
  // !todo: this function is bloated, might need an external lib to hold these func
  // !todo: user should not change/update other user's data
  const handleConnect = async (e) => {
    e.stopPropagation();
    const senderDocRef = doc(db, "students", currentUID);
    const receiverDocRef = doc(db, "students", project?.creator_uid);
    // get the receiver's student doc
    const receiverDocSnap = await getDoc(receiverDocRef);
    if (receiverDocSnap.exists()) {
      const student = receiverDocSnap.data();
      const senderPendingConnections = currentStudent.pending_connections;
      const receiverReceivedConnections = student.received_connections;
      // don't need to check uniqueness as the Connect button will be disabled
      senderPendingConnections.push(project?.creator_uid);
      receiverReceivedConnections.push(currentUID);
      const senderStudentRef = {
        ...currentStudent,
        pending_connections: senderPendingConnections,
      };
      const receiverStudentRef = {
        ...student,
        received_connections: receiverReceivedConnections,
      };
      delete senderStudentRef?.uid;
      delete receiverStudentRef?.uid;
      await updateDoc(senderDocRef, senderStudentRef).catch((err) => {
        console.log("updateDoc() error: ", err);
      });
      await updateDoc(receiverDocRef, receiverStudentRef).catch((err) => {
        console.log("updateDoc() error: ", err);
      });
    } else {
      console.log("No such document!");
    }
    // don't need to setState, since the student and currentStudent in pages/students is real-time updated
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
        height: "calc(99vh - 128px)",
        overflow: "auto",
      }}
    >
      {project?.id && (
        <Grid container>
          {/* Top left info box */}
          <Grid item xs={8}>
            <Box mt={3} ml={3} mr={1.5}>
              <Typography sx={{ fontWeight: "bold", fontSize: "2.5em" }}>
                {project.title}
              </Typography>
              <Divider sx={{ mt: 3 }} />
              <Typography
                sx={{ mt: 3, fontWeight: "bold" }}
                color="text.primary"
              >
                {"Team size: "}
              </Typography>
              <Typography color="text.secondary">
                {project.cur_member_count}
                {"/"}
                {project.max_member_count}
              </Typography>
              <Typography
                sx={{ mt: 3, fontWeight: "bold" }}
                color="text.primary"
              >
                {"Details: "}
              </Typography>
              <Typography color="text.secondary">{project.details}</Typography>
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
                {"Founder"}
              </Typography>
              <Typography
                sx={{ display: "flex", justifyContent: "center" }}
                color="text.secondary"
              >
                {project.creator_email}
              </Typography>
              <Box m={3} sx={{ display: "flex", justifyContent: "center" }}>
                {/* disabled Connect button */}
                {!isCreator && !currentUID && (
                  <Tooltip title="Edit your profile first.">
                    <span>
                      <Button
                        disabled
                        disableElevation
                        sx={{ borderRadius: 4, bgcolor: "#3e95c2" }}
                        variant="contained"
                      >
                        &emsp; {"Connect"} &emsp;
                      </Button>
                    </span>
                  </Tooltip>
                )}
                {!isCreator &&
                  currentUID &&
                  !currentStudent.pending_connections.includes(
                    project?.creator_uid
                  ) && (
                    <Button
                      variant="contained"
                      sx={{ borderRadius: 4, bgcolor: "#3e95c2" }}
                      disableElevation
                      onClick={(e) => handleConnect(e)}
                    >
                      &emsp; {"Connect"} &emsp;
                    </Button>
                  )}
                {!isCreator &&
                  currentUID &&
                  currentStudent.pending_connections.includes(
                    project?.creator_uid
                  ) && (
                    <Button
                      disabled
                      disableElevation
                      sx={{ borderRadius: 4, bgcolor: "#3e95c2" }}
                      variant="contained"
                    >
                      &emsp; {"Pending"} &emsp;
                    </Button>
                  )}
                {isCreator && (
                  <Button
                    onClick={() => updateProject(project)}
                    variant="contained"
                    sx={{ borderRadius: 4, bgcolor: "#3e95c2" }}
                    disableElevation
                  >
                    {"Modify"}
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
                  {project.description}
                </pre>
              </Typography>
            </Box>
            {/* position details */}
            <Box
              sx={{
                mt: 6,
                ml: 3,
                mr: 3,
                border: 1,
                borderRadius: 4,
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  bgcolor: "#3e95c2",
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                }}
                color="text.primary"
              >
                &emsp; {"Positions:"}
              </Typography>
              {project.position_list.map((position, index) => (
                <PositionListItem
                  key={index}
                  index={index}
                  title={position.positionTitle}
                  resp={position.positionResp}
                  weeklyHour={position.positionWeeklyHour}
                  isCreator={isCreator}
                  // uid={position.positionUID}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ProjectInfo;
