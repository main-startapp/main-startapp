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
import ExportedImage from "next-image-export-optimizer";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import NextLink from "next/link";
import { handleConnect } from "../Reusable/Resusable";

const ProjectInfo = () => {
  // context
  const {
    setOldProject,
    chats,
    currentStudent,
    students,
    setPartner,
    setForceChatExpand,
  } = useContext(GlobalContext);
  const { project } = useContext(ProjectContext);

  // local vars
  const currentUID = currentStudent?.uid;

  // hook to find is the currentUser the project creator
  const [isCreator, setIsCreator] = useState(false);
  useEffect(() => {
    currentUID === project?.creator_uid
      ? setIsCreator(true)
      : setIsCreator(false);
  }, [currentUID, project]);

  // hook to get requesting positions
  const [reqPositions, setReqPositions] = useState([]);
  useEffect(() => {
    const positions = [];
    chats.forEach((chat) => {
      chat?.join_requests?.forEach((joinRequest) => {
        if (joinRequest.requester_uid === currentUID) {
          positions.push({
            project_id: joinRequest.project_id,
            position_id: joinRequest.position_id,
          });
        }
      });
    });
    setReqPositions(positions);
    return positions;
  }, [chats, currentUID]);

  // hook to find project creator student data
  const [creatorStudent, setCreatorStudent] = useState(null);
  useEffect(() => {
    const foundCreator = students.find(
      (student) => student.uid === project?.creator_uid
    );
    setCreatorStudent(foundCreator);
    return foundCreator;
  }, [students, project]);

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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {/* default unit is px */}
                <Avatar sx={{ mr: 2, height: 75, width: "75px" }}>
                  <UploadFileIcon />
                </Avatar>
                <Typography sx={{ fontWeight: "bold", fontSize: "2.5em" }}>
                  {project?.title}
                </Typography>
              </Box>
              <Divider sx={{ mt: 3, mb: 3 }} />
              <Typography sx={{ fontWeight: "bold" }} color="text.primary">
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
              <Box m={3} sx={{ display: "flex", justifyContent: "center" }}>
                {!isCreator && (
                  <Tooltip title={currentUID ? "" : "Edit your profile first."}>
                    <span>
                      <Button
                        disabled={!currentUID}
                        disableElevation
                        sx={{ borderRadius: 4, backgroundColor: "#3e95c2" }}
                        variant="contained"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConnect(
                            chats,
                            creatorStudent,
                            currentStudent,
                            setPartner,
                            setForceChatExpand
                          );
                        }}
                      >
                        &emsp; {"Connect"} &emsp;
                      </Button>
                    </span>
                  </Tooltip>
                )}
                {isCreator && (
                  <NextLink
                    href={{
                      pathname: "/project/create",
                      query: { isCreateStr: "false" },
                    }}
                    as="/project/create"
                    passHref
                  >
                    <Button
                      onClick={() => setOldProject(project)}
                      variant="contained"
                      sx={{ borderRadius: 4, backgroundColor: "#3e95c2" }}
                      disableElevation
                    >
                      &emsp; {"Modify"} &emsp;
                    </Button>
                  </NextLink>
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
                  posID={position.positionID}
                  title={position.positionTitle}
                  resp={position.positionResp}
                  weeklyHour={position.positionWeeklyHour}
                  reqPositions={reqPositions}
                  isCreator={isCreator}
                  creator={creatorStudent}
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
