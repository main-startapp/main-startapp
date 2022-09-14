import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
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
import {
  findItemFromList,
  getDocFromDB,
  handleConnect,
} from "../Reusable/Resusable";
import moment from "moment";
import { useAuth } from "../Context/AuthContext";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useRouter } from "next/router";

const EventInfo = () => {
  // context
  const { currentUser } = useAuth();
  const {
    setOldEvent,
    chats,
    ediumUser,
    ediumUserExt,
    users,
    setChatPartner,
    setForceChatExpand,
    winHeight,
    onMedia,
  } = useContext(GlobalContext);
  const { event } = useContext(EventContext);

  // local vars
  const currentUID = ediumUser?.uid;
  const router = useRouter();
  const [tCode, setTCode] = useState("");
  useEffect(() => {
    setTCode("");
  }, [event]);

  // moment
  const startMoment = useMemo(() => {
    return moment(event?.start_date);
  }, [event?.start_date]);

  const endMoment = useMemo(() => {
    return moment(event?.end_date);
  }, [event?.end_date]);

  const isSameDay = useMemo(() => {
    return startMoment.format("L") === endMoment.format("L");
  }, [startMoment, endMoment]);

  const isSameTime = useMemo(() => {
    return startMoment.format("LLL") === endMoment.format("LLL");
  }, [startMoment, endMoment]);

  // hook to find is the ediumUser the event creator
  const isCreator = useMemo(() => {
    return currentUID === event?.creator_uid ? true : false;
  }, [currentUID, event?.creator_uid]);

  // hook to get event creator data
  const creatorUser = useMemo(() => {
    return findItemFromList(users, "uid", event?.creator_uid);
  }, [users, event?.creator_uid]);

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
        height: onMedia.onDesktop
          ? `calc(${winHeight}px - 2*64px - 1.5px)`
          : `calc(${winHeight}px - 2*48px - 1.5px - 60px)`,
        overflow: "auto",
        backgroundColor: "#fafafa",
      }}
    >
      {!!event && (
        <Grid container>
          {/* Top left info box */}
          <Grid item xs={onMedia.onDesktop ? 9 : 12}>
            <Box
              sx={
                onMedia.onDesktop
                  ? { mt: 3, ml: 3, mr: 1.5 }
                  : { mt: 1.5, mx: 1.5 }
              }
            >
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
                    mr: onMedia.onDesktop ? 3 : 1.5,
                    height: "72px",
                    width: "72px",
                  }}
                  src={event?.icon_url}
                >
                  <UploadFileIcon />
                </Avatar>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: onMedia.onDesktop ? "2em" : "1em",
                  }}
                >
                  {event?.title}
                </Typography>
              </Box>
              <Divider
                sx={{
                  mt: onMedia.onDesktop ? 3 : 1.5,
                  mb: onMedia.onDesktop ? 3 : 1.5,
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
                sx={{ mt: onMedia.onDesktop ? 3 : 1.5, fontWeight: "bold" }}
                color="text.primary"
              >
                {"Time: "}
              </Typography>
              <Typography color="text.secondary">
                {isSameDay
                  ? startMoment.format("MMMM Do YYYY, h:mm a") +
                    (isSameTime ? "" : " - " + endMoment.format("h:mm a"))
                  : startMoment.format("MMMM Do YYYY, h:mm a") +
                    " - " +
                    endMoment.format("MMMM Do YYYY, h:mm a")}
              </Typography>
              {/* location */}
              <Typography
                sx={{ mt: onMedia.onDesktop ? 3 : 1.5, fontWeight: "bold" }}
                color="text.primary"
              >
                {"Location: "}
              </Typography>
              <Typography color="text.secondary">{event?.location}</Typography>
            </Box>
          </Grid>

          {/* Top right founder box */}
          {onMedia.onDesktop &&
            (event?.creator_uid !== "T5q6FqwJFcRTKxm11lu0zmaXl8x2" ||
              currentUID === "T5q6FqwJFcRTKxm11lu0zmaXl8x2") && (
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
                        width: "96px",
                        height: "96px",
                        // color: "#dbdbdb",
                        // backgroundColor: "#ffffff",
                        // border: 1,
                        // borderColor: "#dbdbdb",
                      }}
                      src={creatorUser?.photo_url}
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
                    {creatorUser?.name || "Organizer"}
                  </Typography>

                  {!isCreator && (
                    <Tooltip
                      title={currentUID ? "" : "Edit your profile first"}
                    >
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
                              creatorUser,
                              ediumUser,
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
                        pathname: "/events/create",
                        query: { isCreateStr: "false" },
                      }}
                      as="/events/create"
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
            <Box
              sx={onMedia.onDesktop ? { mt: 3, mx: 3 } : { mt: 1.5, mx: 1.5 }}
            >
              <Typography sx={{ fontWeight: "bold" }} color="text.primary">
                {"Description:"}
              </Typography>
              <Typography component="span" color="text.secondary">
                <pre
                  style={{
                    fontFamily: "inherit",
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    display: "inline",
                  }}
                >
                  {event?.description}
                </pre>
                <br />
              </Typography>
              <Button
                disableElevation
                sx={{
                  mt: onMedia.onDesktop ? 3 : 1.5,
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
                onClick={(e) => e.stopPropagation()}
                component={Link}
                target="_blank"
                href={event?.registration_form_url}
                rel="noreferrer"
              >
                {"Attend"}
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box
                sx={{
                  paddingY: onMedia.onDesktop ? 3 : 1.5,
                  paddingX: onMedia.onDesktop ? 3 : 1.5,
                  maxWidth: "100%",
                }}
                component="img"
                src={event?.banner_url}
              />
            </Box>
          </Grid>

          {onMedia.onDesktop &&
            event?.creator_uid === "T5q6FqwJFcRTKxm11lu0zmaXl8x2" &&
            currentUser?.uid === "T5q6FqwJFcRTKxm11lu0zmaXl8x2" &&
            !ediumUserExt.my_event_ids.includes(event?.id) && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 3,
                    mr: 3,
                    ml: 1.5,
                  }}
                >
                  <Button
                    variant="contained"
                    disableElevation
                    color="AdminOrange"
                    sx={{
                      borderRadius: "0px",
                      color: "white",
                      mb: 1.5,
                      width: "200px",
                      height: "64px",
                      textTransform: "none",
                      fontWeight: "bold",
                    }}
                    onClick={() => {
                      getDocFromDB("events_ext", event?.id).then((ret) => {
                        setTCode(ret?.transfer_code);
                        navigator.clipboard.writeText(
                          ret?.transfer_code || "null"
                        );
                      });
                    }}
                  >
                    {"ADMIN"}
                    <br />
                    {"Get Transfer Code"}
                  </Button>
                  <Box
                    sx={{
                      width: "200px",
                      height: "64px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      ":hover": {
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => {
                      if (!(tCode === "Copied")) {
                        navigator.clipboard.writeText(tCode);
                      }
                      setTCode("Copied");
                    }}
                  >
                    {tCode ? (
                      <>
                        <KeyboardArrowRightIcon sx={{ color: "#f4511e" }} />
                        <Typography
                          sx={{ fontWeight: "bold", color: "#f4511e" }}
                        >
                          {tCode}
                        </Typography>
                        <KeyboardArrowLeftIcon sx={{ color: "#f4511e" }} />
                      </>
                    ) : (
                      <br />
                    )}
                  </Box>
                  {!!tCode && (
                    <Button
                      variant="contained"
                      disableElevation
                      color="AdminOrange"
                      sx={{
                        borderRadius: "0px",
                        color: "white",
                        mt: 1.5,
                        width: "200px",
                        height: "64px",
                        textTransform: "none",
                        fontWeight: "bold",
                      }}
                      onClick={() => {
                        router.push(`/redemption`);
                      }}
                    >
                      {"To the Redemption"}
                    </Button>
                  )}
                </Box>
              </Grid>
            )}
        </Grid>
      )}
      {!event && (
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
