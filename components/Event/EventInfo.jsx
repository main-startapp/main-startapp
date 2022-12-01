import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { EventContext, GlobalContext } from "../Context/ShareContexts";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import moment from "moment";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { motion } from "framer-motion";

const EventInfo = () => {
  // context
  const { ediumUser, winHeight, onMedia } = useContext(GlobalContext);
  const { event, creatorUser } = useContext(EventContext);
  const theme = useTheme();

  // local vars
  const [tCode, setTCode] = useState("");
  useEffect(() => {
    setTCode("");
  }, [event]);

  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(false);
  }, [event]);

  // moment
  const startMoment = moment(event?.start_date);
  const endMoment = moment(event?.end_date);
  const isSameDay = startMoment.format("L") === endMoment.format("L");
  const isSameTime = startMoment.format("LLL") === endMoment.format("LLL");

  // useEffect to reset box scrollbar position
  const boxRef = useRef();
  useEffect(() => {
    if (boxRef?.current?.scrollTop) boxRef.current.scrollTop = 0;
  }, [event]);

  return (
    <Paper
      elevation={2}
      sx={{
        // mt: onMedia.onDesktop ? 4 : 2,
        // ml: onMedia.onDesktop ? 2 : 2,
        // mr: onMedia.onDesktop ? 4 : 0,
        backgroundColor: "background.paper",
        borderTop: onMedia.onDesktop ? 1 : 0,
        borderColor: "divider",
        borderRadius: "32px 32px 0px 0px",
        paddingTop: "32px",
        minHeight: "100%",
      }}
    >
      <motion.div
        key={event?.title}
        initial={{ opacity: 0, y: "1%" }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          id="eventinfo-box"
          ref={boxRef}
          sx={{
            height: onMedia.onDesktop
              ? `calc(${winHeight}px - 65px - ${theme.spacing(4)} - 1px - 32px)` // navbar; spacing; paper t-border; paper t-padding
              : `calc(${winHeight}px - 64px - ${theme.spacing(
                  2
                )} - 32px - 65px)`, // mobile bar; spacing; paper t-padding; bottom navbar
            overflowY: "scroll",
            paddingTop: 2, // align with project list
            paddingBottom: 6, // enough space to not covered by messages
            paddingLeft: 4,
            paddingRight: `calc(${theme.spacing(4)} - 0.4rem)`, // considering scrollbar
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            id="eventinfo-header-box"
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{
                mr: onMedia.onDesktop ? 4 : 2,
                height: "96px",
                width: "96px",
              }}
              src={event?.icon_url}
            >
              <UploadFileIcon />
            </Avatar>
            <Typography
              color="text.primary"
              variant="h2"
              sx={{
                fontSize: onMedia.onDesktop ? "32px" : "16px",
                fontWeight: "bold",
              }}
            >
              {event?.title}
            </Typography>
          </Box>
          <Divider
            sx={{
              mt: 2,
              borderBottomWidth: 1,
              borderColor: "divider",
            }}
          />
          <Typography
            color="text.primary"
            variant="h3"
            sx={{ mt: 4, mb: 1, fontSize: "1.25rem", fontWeight: "bold" }}
          >
            {"Time & Location: "}
          </Typography>
          <Typography color="text.secondary" variant="body1">
            {isSameDay
              ? startMoment.format("MMMM Do YYYY, h:mm a") +
                (isSameTime ? "" : " - " + endMoment.format("h:mm a"))
              : startMoment.format("MMMM Do YYYY, h:mm a") +
                " - " +
                endMoment.format("MMMM Do YYYY, h:mm a")}
          </Typography>
          <Typography color="text.secondary" variant="body1">
            {event?.location}
          </Typography>

          <Typography
            color="text.primary"
            variant="h3"
            sx={{ mt: 4, mb: 1, fontSize: "1.25rem", fontWeight: "bold" }}
          >
            {"Description:"}
          </Typography>
          <Typography color="text.secondary" component="span" variant="body1">
            <pre
              style={{
                fontFamily: "inherit",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                display: "inline",
              }}
            >
              <Interweave
                content={event?.description}
                matchers={[new UrlMatcher("url")]}
              />
            </pre>
          </Typography>

          <Button
            disableElevation
            sx={{
              mt: 4,
              borderRadius: 8,
            }}
            variant="contained"
            component={Link}
            target="_blank"
            href={event?.registration_form_url}
            rel="noreferrer"
          >
            {"Attend"}
          </Button>

          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "center",
              visibility: isLoaded ? "visible" : "hidden",
            }}
          >
            <Box
              component="img"
              onLoad={() => {
                setIsLoaded(true);
              }}
              src={event?.banner_url}
              sx={{ maxWidth: "100%" }}
            />
          </Box>
        </Box>
      </motion.div>
    </Paper>
  );
};

export default EventInfo;

{
  /* <Box
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

              <Typography sx={{ fontWeight: "bold" }} color="text.primary">
                {"Details: "}
              </Typography>
              <Typography color="text.secondary">{event?.details}</Typography>

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

              <Typography
                sx={{ mt: onMedia.onDesktop ? 3 : 1.5, fontWeight: "bold" }}
                color="text.primary"
              >
                {"Location: "}
              </Typography>
              <Typography color="text.secondary">{event?.location}</Typography>
            </Box>
          </Grid>


          {onMedia.onDesktop &&
            (event?.creator_uid !== "T5q6FqwJFcRTKxm11lu0zmaXl8x2" ||
              ediumUser?.uid === "T5q6FqwJFcRTKxm11lu0zmaXl8x2") && (
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
                      title={ediumUser?.uid ? "" : "Edit your profile first"}
                    >
                      <span>
                        <Button
                          disabled={!ediumUser?.uid}
                          disableElevation
                          sx={{
                            mt: 1,
                            border: 1.5,
                            borderColor: "#dbdbdb",
                            borderRadius: 8,
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
                          borderRadius: 8,
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
                  borderRadius: 8,
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
            !ediumUserExt?.my_event_ids?.includes(event?.id) && (
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
                    color="adminOrange"
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
                      color="adminOrange"
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
          id="eventinfo-logo-placeholder-box"
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            id="eventinfo-logo-placeholder-wrapper-box"
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <ExportedImage
              src="/images/EDIUMLogo.png"
              alt=""
              width={256}
              height={256}
              priority
            />
          </Box>
        </Box>
      )}
    </Box> */
}
