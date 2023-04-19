// react
import { useContext, useEffect, useRef } from "react";
// mui
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Fab,
  Link,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
// edium
import { EventContext, GlobalContext } from "../Context/ShareContexts";
import { FixedHeightPaper } from "../Reusable/Resusable";
// misc libs
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { InstagramEmbed } from "react-social-media-embed";
import SlateEditor from "../SlateEditor";

export const EventInfoContent = ({ event, eventCreator, eventAllTags }) => {
  // context
  const { onMedia } = useContext(GlobalContext);
  // const { fullEvent } = useContext(EventContext);

  // local vars
  // const event = fullEvent?.event;
  // const eventCreator = fullEvent?.creator;
  // const eventAllTags = fullEvent?.allTags;

  // transfer code
  // const [tCode, setTCode] = useState("");
  // useEffect(() => {
  //   setTCode("");
  // }, [fullEvent]);

  // time
  const startMoment = dayjs(event?.start_date);
  const endMoment = dayjs(event?.end_date);
  const isSameDay = startMoment.format("L") === endMoment.format("L");
  const isSameTime = startMoment.format("LLL") === endMoment.format("LLL");

  return (
    <>
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
      {event?.description && !event?.slate_desc && (
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
              content={event.description}
              matchers={[new UrlMatcher("url")]}
            />
          </pre>
        </Typography>
      )}
      {event?.slate_desc && (
        <SlateEditor
          valueObj={event}
          valueKey="slate_desc"
          onChange={null}
          isReadOnly={true}
        />
      )}
      <Button
        sx={{
          mt: 4,
          borderRadius: 8,
        }}
        disabled={!event?.registration_form_url}
        disableElevation
        fullWidth
        variant="contained"
        LinkComponent={Link}
        target="_blank"
        href={event?.registration_form_url}
        rel="noreferrer"
      >
        {event?.registration_form_url ? "Attend" : "Registration Not Required"}
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
              color="lightPrimary"
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
      {/* <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Suspense>
            <EventImageComponent />
          </Suspense>
        </Box>
      </ErrorBoundary> */}
      {event?.banner_url && event.banner_url.includes("instagram") && (
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center",
            // height: `calc()`,
          }}
        >
          <InstagramBlock url={event.banner_url} />
        </Box>
      )}
    </>
  );
};

const EventInfo = () => {
  // context
  const { onMedia } = useContext(GlobalContext);
  const { fullEvent, setFullEvent, setIsMobileBackClicked } =
    useContext(EventContext);
  const theme = useTheme();

  // useEffect to reset box scrollbar position
  const boxRef = useRef();
  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (boxRef?.current?.scrollTop) boxRef.current.scrollTop = 0;
  }, [fullEvent]); // every time project changes, this forces each accordion to collapse

  return (
    <FixedHeightPaper
      elevation={onMedia.onDesktop ? 2 : 0}
      isdesktop={onMedia.onDesktop ? 1 : 0}
      mobileheight={0}
      sx={{
        paddingTop: onMedia.onDesktop ? "32px" : 0,
      }}
    >
      {fullEvent !== null && (
        <Box
          id="eventinfo-box"
          ref={boxRef}
          sx={{
            flexGrow: 1,
            overflowY: "scroll",
            paddingTop: onMedia.onDesktop ? 2 : 2, // align with project list
            paddingBottom: onMedia.onDesktop ? 6 : 4, // enough space to not covered by messages; overall padding top = 2*8+32 = 48 = 6*8 = padding bottom
            paddingLeft: onMedia.onDesktop ? 4 : 2,
            paddingRight: onMedia.onDesktop
              ? `calc(${theme.spacing(4)} - 0.4rem)`
              : 2, // considering scrollbar
          }}
        >
          <motion.div
            key={fullEvent?.event?.id}
            initial={{ opacity: 0, y: "1%" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <EventInfoContent
              event={fullEvent?.event}
              eventCreator={fullEvent?.creator}
              eventAllTags={fullEvent?.allTags}
            />
          </motion.div>
        </Box>
      )}

      {/* Mobile back button */}
      {!onMedia.onDesktop && fullEvent !== null && (
        <Fab
          color="primary"
          size="small"
          onClick={() => {
            setFullEvent(null);
            setIsMobileBackClicked(true);
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

// This embed comp has our own footer imitating IG's.
// Longer rectangle post will be cropped and covered by our footer.
// Ironically, the footer color now matches their button color. And their original color is a bit off.
export const InstagramBlock = ({ url }) => {
  return (
    <Box
      sx={{
        borderRadius: "3px",
        boxShadow: 2,
      }}
    >
      <Box
        sx={{
          height: `calc(54px + 480px)`, // header + post
          position: "relative",
          overflow: "hidden",
        }}
      >
        <InstagramEmbed url={url} width={480} />
      </Box>
      <Link
        sx={{
          height: "44px",
          display: "flex",
          alignItems: "center",
          marginX: "12px",
          fontSize: "14px",
          color: "#0095f6",
        }}
        target="_blank"
        href={url}
        rel="noreferrer"
        underline="none"
      >
        View more on Instagram
      </Link>
    </Box>
  );
};

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
              src="/images/edium_v4_512.png"
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
