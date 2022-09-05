import { useContext, useEffect, useMemo, useRef, useState } from "react";
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
    setChatPartner,
    setForceChatExpand,
    onMedia,
  } = useContext(GlobalContext);
  const { project } = useContext(ProjectContext);

  // local vars
  const currentUID = currentStudent?.uid;

  // hook to find is the currentStudent the project creator
  const isCreator = useMemo(() => {
    return currentUID === project?.creator_uid ? true : false;
  }, [currentUID, project]);

  const creatorStudent = useMemo(() => {
    return students.find((student) => student.uid === project?.creator_uid);
  }, [students, project]);

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
        height: "calc(99.5vh - 128px)",
        overflow: "auto",
        backgroundColor: "#fafafa",
      }}
    >
      {!!project && (
        <Grid container>
          {/* Top left info box */}
          <Grid item xs={onMedia.onDesktop ? 9 : 12}>
            <Box mt={3} ml={3} mr={1.5}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {/* default unit is px */}
                <Avatar
                  sx={{ mr: 2, height: "72px", width: "72px" }}
                  src={project?.icon_url}
                >
                  <UploadFileIcon />
                </Avatar>
                <Typography sx={{ fontWeight: "bold", fontSize: "2.5em" }}>
                  {project?.title}
                </Typography>
              </Box>
              <Divider
                sx={{
                  mt: 3,
                  mb: 3,
                  borderBottomWidth: 1.5,
                  borderColor: "#dbdbdb",
                }}
              />
              <Typography sx={{ fontWeight: "bold" }} color="text.primary">
                {"Details: "}
              </Typography>
              <Typography color="text.secondary">{project?.details}</Typography>
              <Typography
                sx={{ mt: 3, fontWeight: "bold" }}
                color="text.primary"
              >
                {"Team size: "}
              </Typography>
              <Typography color="text.secondary">
                {/* {project?.cur_member_count}
                {"/"} */}
                {project?.max_member_count}
              </Typography>
            </Box>
          </Grid>

          {/* Top right founder box */}
          {onMedia.onDesktop && (
            <Grid item xs={3}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 3,
                  mr: 3,
                  ml: 1.5,
                }}
              >
                <IconButton>
                  <Avatar
                    sx={{
                      width: "5em",
                      height: "5em",
                      border: 1,
                      borderColor: "#dbdbdb",
                      color: "#dbdbdb",
                      backgroundColor: "#ffffff",
                    }}
                    src={creatorStudent?.photo_url}
                    referrerPolicy="no-referrer"
                  />
                </IconButton>

                <Typography
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "1.1em",
                    mt: 1,
                  }}
                >
                  {creatorStudent?.name || "Founder"}
                </Typography>

                {!isCreator && (
                  <Tooltip title={currentUID ? "" : "Edit your profile first."}>
                    <span>
                      <Button
                        disabled={!currentUID}
                        disableElevation
                        sx={{
                          mt: 1,
                          border: 1.5,
                          borderColor: "#dbdbdb",
                          borderRadius: "30px",
                          color: "text.primary",
                          backgroundColor: "#ffffff",
                          fontWeight: "bold",
                          fontSize: "0.8em",
                          "&:hover": {
                            backgroundColor: "#f6f6f6",
                          },
                          textTransform: "none",
                        }}
                        variant="contained"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConnect(
                            chats,
                            creatorStudent,
                            currentStudent,
                            setChatPartner,
                            setForceChatExpand
                          );
                        }}
                      >
                        {"Connect"}
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
                      sx={{
                        mt: 1,
                        border: 1.5,
                        borderColor: "#dbdbdb",
                        borderRadius: "30px",
                        color: "text.primary",
                        backgroundColor: "#ffffff",
                        fontWeight: "bold",
                        fontSize: "0.8em",
                        "&:hover": {
                          backgroundColor: "#f6f6f6",
                        },
                        textTransform: "none",
                      }}
                      disableElevation
                    >
                      {"Modify"}
                    </Button>
                  </NextLink>
                )}
              </Box>
            </Grid>
          )}

          {/* Bottom description and position boxes */}
          <Grid item xs={12}>
            <Box sx={{ mt: 3, mx: 3 }}>
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
            {project?.position_list?.length > 0 && (
              <Box
                sx={{
                  mt: 3,
                  ml: 3,
                  mr: 3,
                  mb: "64px",
                  border: 1.5,
                  borderColor: "#dbdbdb",
                  borderRadius: "10px",
                  backgroundColor: "#ffffff",
                }}
              >
                <Typography
                  sx={{ ml: 3, mt: 1.5, fontWeight: "bold" }}
                  color="text.primary"
                >
                  {"Positions:"}
                </Typography>
                {project?.position_list.map((position, index) => (
                  <PositionListItem
                    key={index}
                    posID={position.id}
                    posTitle={position.title}
                    posResp={position.responsibility}
                    posWeeklyHour={position.weekly_hour}
                    isCreator={isCreator}
                    creator={creatorStudent}
                  />
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      )}
      {!!!project && (
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
              src="/images/EDIUMLogo.png"
              placeholder=""
              width={256}
              height={256}
              priority
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ProjectInfo;
