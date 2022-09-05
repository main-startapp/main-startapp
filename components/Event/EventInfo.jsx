import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  Tooltip,
  Typography,
} from "@mui/material";
import { EventContext, GlobalContext } from "../Context/ShareContexts";
import ExportedImage from "next-image-export-optimizer";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import NextLink from "next/link";
import { handleConnect } from "../Reusable/Resusable";
import moment from "moment";

const EventInfo = () => {
  // context
  const {
    setOldEvent,
    chats,
    currentStudent,
    students,
    setChatPartner,
    setForceChatExpand,
    onMedia,
  } = useContext(GlobalContext);
  const { event } = useContext(EventContext);

  // local vars
  const currentUID = currentStudent?.uid;

  // hook to find is the currentStudent the event creator
  const isCreator = useMemo(() => {
    return currentUID === event?.creator_uid ? true : false;
  }, [currentUID, event]);

  // hook to get event creator student data
  const creatorStudent = useMemo(() => {
    return students.find((student) => student.uid === event?.creator_uid);
  }, [students, event]);

  // box ref to used by useEffect
  const boxRef = useRef();

  // useEffect to reset box scrollbar position
  useEffect(() => {
    boxRef.current.scrollTop = 0;
  }, [event]);

  return (
    <Box
      ref={boxRef}
      sx={{
        height: "calc(99.5vh - 128px)",
        overflow: "auto",
        backgroundColor: "#fafafa",
      }}
    >
      {!!event && (
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
                  sx={{
                    mr: 2,
                    height: "72px",
                    width: "72px",
                  }}
                  src={event?.icon_url}
                >
                  <UploadFileIcon />
                </Avatar>
                <Typography sx={{ fontWeight: "bold", fontSize: "2.5em" }}>
                  {event?.title}
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
              {/* details */}
              <Typography sx={{ fontWeight: "bold" }} color="text.primary">
                {"Details: "}
              </Typography>
              <Typography color="text.secondary">{event?.details}</Typography>
              {/* time */}
              <Typography
                sx={{ mt: 3, fontWeight: "bold" }}
                color="text.primary"
              >
                {"Time: "}
              </Typography>
              <Typography color="text.secondary">
                {moment(event?.starting_date).format("MMMM Do YYYY h:mm a")}
              </Typography>
              {/* location */}
              <Typography
                sx={{ mt: 3, fontWeight: "bold" }}
                color="text.primary"
              >
                {"Location: "}
              </Typography>
              <Typography color="text.secondary">{event?.location}</Typography>
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
                  {creatorStudent?.name || "Organizer"}
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
                      pathname: "/event/create",
                      query: { isCreateStr: "false" },
                    }}
                    as="/event/create"
                    passHref
                  >
                    <Button
                      onClick={() => setOldEvent(event)}
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

          {/* Bottom description and button */}
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
                  {event?.description}
                </pre>
                <br />
              </Typography>
              <Link
                target="_blank"
                href={event?.registration_form_url}
                rel="noopener noreferrer"
              >
                <Button
                  disableElevation
                  sx={{
                    mt: 3,
                    border: 1.5,
                    borderColor: "#dbdbdb",
                    borderRadius: "30px",
                    color: "white",
                    backgroundColor: "#3e95c2",
                    fontWeight: "bold",
                    fontSize: "0.8em",
                    textTransform: "none",
                    paddingX: 5,
                  }}
                  variant="contained"
                >
                  {"Attend"}
                </Button>
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box
                sx={{
                  paddingY: 3,
                  paddingX: 3,
                  maxWidth: "100%",
                }}
                component="img"
                src={event?.banner_url}
              />
            </Box>
          </Grid>
        </Grid>
      )}
      {!!!event && (
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

export default EventInfo;
