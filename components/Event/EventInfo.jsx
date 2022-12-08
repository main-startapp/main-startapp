import { useContext, useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Fab,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { EventContext, GlobalContext } from "../Context/ShareContexts";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import moment from "moment";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { motion } from "framer-motion";
import { FixedHeightPaper } from "../Reusable/Resusable";

const EventInfo = () => {
  // context
  const { winHeight, onMedia } = useContext(GlobalContext);
  const { fullEvent, setFullEvent } = useContext(EventContext);
  const theme = useTheme();

  // local vars
  const event = fullEvent?.event;
  const eventCreator = fullEvent?.creator_uid;
  const eventAllTags = fullEvent?.allTags;

  const [tCode, setTCode] = useState("");
  useEffect(() => {
    setTCode("");
  }, [fullEvent]);

  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(false);
  }, [fullEvent]);

  // moment
  const startMoment = moment(event?.start_date);
  const endMoment = moment(event?.end_date);
  const isSameDay = startMoment.format("L") === endMoment.format("L");
  const isSameTime = startMoment.format("LLL") === endMoment.format("LLL");

  // useEffect to reset box scrollbar position
  // useEffect to reset box scrollbar position
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [fullEvent]); // every time project changes, this forces each accordion to collapse

  return (
    <FixedHeightPaper
      elevation={onMedia.onDesktop ? 2 : 0}
      isdesktop={onMedia.onDesktop ? 1 : 0}
      islist={0}
      sx={{
        paddingTop: onMedia.onDesktop ? "32px" : 0,
      }}
    >
      <Box
        id="eventinfo-box"
        sx={{
          flexGrow: 1,
          overflowY: "scroll",
          paddingTop: onMedia.onDesktop ? 2 : 2, // align with project list
          paddingBottom: onMedia.onDesktop ? 6 : 2, // enough space to not covered by messages
          paddingLeft: onMedia.onDesktop ? 4 : 2,
          paddingRight: onMedia.onDesktop
            ? `calc(${theme.spacing(4)} - 0.4rem)`
            : 2, // considering scrollbar
        }}
      >
        <motion.div
          key={event?.title}
          initial={{ opacity: 0, y: "1%" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
                fontSize: onMedia.onDesktop ? "1.875rem" : "1.25rem",
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
            fullWidth
            variant="contained"
            component={Link}
            target="_blank"
            href={event?.registration_form_url}
            rel="noreferrer"
            sx={{
              mt: 4,
              borderRadius: 8,
            }}
          >
            {"Attend"}
          </Button>

          {eventAllTags?.length > 0 && (
            <Box id="eventinfo-details-box">
              <Typography
                color="text.primary"
                variant="h3"
                sx={{ mt: 4, fontSize: "1.25rem", fontWeight: "bold" }}
              >
                {"Details: "}
              </Typography>
              {eventAllTags?.map((tag, index) => (
                <Chip
                  key={index}
                  color={"lightPrimary"}
                  label={tag}
                  sx={{
                    mr: 1,
                    mt: 1,
                    fontSize: "0.875rem",
                    fontWeight: "medium",
                  }}
                />
              ))}
            </Box>
          )}

          <Box
            sx={{
              mt: isLoaded ? 3 : 0,
              display: "flex",
              justifyContent: "center",
              visibility: isLoaded ? "visible" : "collapse",
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
        </motion.div>
      </Box>
      {!onMedia.onDesktop && fullEvent !== null && (
        <Fab
          color="primary"
          size="small"
          onClick={() => {
            setFullEvent(null);
          }}
          sx={{ position: "fixed", right: 16, bottom: 80 }}
        >
          <ArrowBackIosRoundedIcon />
        </Fab>
      )}
    </FixedHeightPaper>
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
                      }}
                      as="/events/create"
                      passHref
                    >
                      <Button

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
              src="/images/edium_text_1024.png"
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
