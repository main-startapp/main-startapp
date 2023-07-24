import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AddLinkIcon from "@mui/icons-material/AddLink";
import { useTheme, styled } from "@mui/material/styles";
import { DateTimeField } from "@mui/x-date-pickers";
import {
  collection,
  doc,
  addDoc,
  serverTimestamp,
  updateDoc,
  setDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../Context/AuthContext";
import { GlobalContext, EventContext } from "../Context/ShareContexts";
import {
  DefaultFormControl,
  DefaultTextField,
  findItemFromList,
  FixedHeightPaper,
  handleDeleteEntry,
} from "../Reusable/Resusable";
import {
  categoryStrList,
  eventStrList,
  eventTags,
} from "../Reusable/MenuStringList";
import { EventInfoContent } from "./EventInfo";
import SlateEditor from "../SlateEditor";
import dayjs from "dayjs";

// comp
const EventCreate = (props) => {
  // context
  const { currentUser } = useAuth();
  const { events, eventsExt, ediumUser, ediumUserExt, winHeight, onMedia } =
    useContext(GlobalContext);
  const { showAlert } = useContext(EventContext);
  const router = useRouter();
  const formRef = useRef();
  const theme = useTheme();

  // edit / preview modes
  const [isEditMode, setIsEditMode] = useState(true);

  // click spam
  const [isClickable, setIsClickable] = useState(true); // button state to prevent click spam

  // time
  const [eventDuration, setEventDuration] = useState("");
  const [eventDurationUnit, setEventDurationUnit] = useState("hours");

  // focus
  const [focusState, setFocusState] = useState("title ");
  const focusRef = useRef();
  const updateFocus = (nextState) => {
    setFocusState(nextState);
    setTimeout(() => {
      focusRef?.current?.focus();
    }, 100);
  };

  // can be wrapped up in useMemo if necessary, no premature optimization
  const oldEvent = props.eventId
    ? findItemFromList(events, "id", props.eventId)
    : null;

  // init new event
  const emptyEvent = {
    title: "",
    icon_url: "",
    category: "",
    type: "",
    start_date: null,
    end_date: null,
    location: "",
    tags: [],
    slate_desc: [
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ],
    registration_form_url: "",
    banner_url: "",
  };
  const [newEvent, setNewEvent] = useState(() =>
    oldEvent ? oldEvent : emptyEvent
  );

  // upload-icon dialog modal
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  // check box
  const [isCheckedTransferable, setIsCheckedTransferable] = useState(false);
  useEffect(() => {
    if (!oldEvent) {
      // if admin, check transfer project by default
      if (currentUser?.uid === "T5q6FqwJFcRTKxm11lu0zmaXl8x2")
        setIsCheckedTransferable(true);
    } else {
      // update, checked value depends on oldEvent
      // if creator is admin, check if updating transferable event
      if (
        currentUser?.uid === "T5q6FqwJFcRTKxm11lu0zmaXl8x2" &&
        !ediumUserExt?.my_event_ids?.includes(oldEvent?.id)
      ) {
        setIsCheckedTransferable(true);
      }
    }
  }, [currentUser?.uid, ediumUserExt?.my_event_ids, oldEvent]);

  // helper functions
  const handleSubmit = async (e) => {
    if (!isClickable) return;
    if (!formRef.current.reportValidity()) return;

    // button is clickable & form is valid
    setIsClickable(false);
    let eventModRef; // ref to addDoc() or updateDoc()
    if (!oldEvent) {
      // create a new event
      const collectionRef = collection(db, "events");
      const eventRef = {
        ...newEvent,
        creator_uid: ediumUser?.uid,
        is_deleted: false,
        is_visible: true,
        create_timestamp: serverTimestamp(),
        last_timestamp: serverTimestamp(),
      };
      eventModRef = addDoc(collectionRef, eventRef).catch((error) => {
        console.log(error?.message);
      });
    } else {
      // update an existing event
      // since all the changes are in newEvent, can't just update partially
      const docRef = doc(db, "events", newEvent.id);
      const eventRef = {
        ...newEvent,
        last_timestamp: serverTimestamp(),
      };
      delete eventRef.id;
      eventModRef = updateDoc(docRef, eventRef).catch((error) => {
        console.log(error?.message);
      });
    }

    let retId;
    await eventModRef.then((ret) => {
      retId = ret?.id;
    });

    // retId: create; !retId: update
    if (retId) {
      // add to my_event_ids in user ext data if create
      const ediumUserExtDocRef = doc(db, "users_ext", ediumUser?.uid);
      const ediumUserExtUpdateRef = {
        my_event_ids: ediumUserExt?.my_event_ids ? arrayUnion(retId) : [retId],
        last_timestamp: serverTimestamp(),
      };
      const ediumUserExtModRef = updateDoc(
        ediumUserExtDocRef,
        ediumUserExtUpdateRef
      ).catch((error) => {
        console.log(error?.message);
      });

      // create extension doc for team management if create
      const extDocRef = doc(db, "events_ext", retId);
      const eventExtRef = {
        is_deleted: false,
        members: [ediumUser?.uid],
        admins: [ediumUser?.uid],
        last_timestamp: serverTimestamp(),
      };
      const eventExtModRef = setDoc(extDocRef, eventExtRef).catch((error) => {
        console.log(error?.message);
      });

      await ediumUserExtModRef;
      await eventExtModRef;
    }

    // !todo: since updateDoc return Promise<void>, we need other method to check the results
    showAlert(
      "success",
      `"${newEvent.title}" is updated successfully! Navigate to Events page.`
    );

    setTimeout(() => {
      router.push(`/events`); // can be customized
    }, 2000); // wait 2 seconds then go to `events` page
  };

  const handleSubmitTransferable = async (e) => {
    if (!isClickable) return;
    if (!formRef.current.reportValidity()) return;

    // button is clickable & form is valid
    setIsClickable(false);
    let eventModRef; // ref to addDoc() or updateDoc()
    if (!oldEvent) {
      // create a new event
      const collectionRef = collection(db, "events");
      const eventRef = {
        ...newEvent,
        creator_uid: ediumUser?.uid,
        is_deleted: false,
        is_visible: true,
        create_timestamp: serverTimestamp(),
        last_timestamp: serverTimestamp(),
      };
      eventModRef = addDoc(collectionRef, eventRef).catch((error) => {
        console.log(error?.message);
      });
    } else {
      // update an existing event
      // since all the changes are in newEvent, can't just update partially
      const docRef = doc(db, "events", newEvent.id);
      const eventRef = {
        ...newEvent,
        last_timestamp: serverTimestamp(),
      };
      delete eventRef.id;
      eventModRef = updateDoc(docRef, eventRef).catch((error) => {
        console.log(error?.message);
      });
    }

    let retId;
    await eventModRef.then((ret) => {
      retId = ret?.id;
    });

    // retId: create; !retId: update
    if (retId) {
      // don't add event id to my_event_ids
      // do create extenion doc with extra field
      const extDocRef = doc(db, "events_ext", retId);

      const eventExtRef = {
        is_deleted: false,
        members: [ediumUser?.uid],
        admins: [ediumUser?.uid],
        last_timestamp: serverTimestamp(),
        transfer_code: Math.random().toString(16).slice(2),
      };
      const eventExtModRef = setDoc(extDocRef, eventExtRef).catch((error) => {
        console.log(error?.message);
      });

      navigator.clipboard.writeText(eventExtRef.transfer_code);
      await eventExtModRef;
    } else {
      // update an event to transferable
      // remove ids from my event list
      const event_ids = ediumUserExt?.my_event_ids;
      if (event_ids.find((event_id) => event_id === oldEvent.id)) {
        const ediumUserExtDocRef = doc(db, "users_ext", ediumUser?.uid);
        const ediumUserExtUpdateRef = {
          my_event_ids: arrayRemove(oldEvent.id),
          last_timestamp: serverTimestamp(),
        };
        const ediumUserExtModRef = updateDoc(
          ediumUserExtDocRef,
          ediumUserExtUpdateRef
        ).catch((error) => {
          console.log(error?.message);
        });
        await ediumUserExtModRef;
      }
      // add transfer code
      const eventExt = findItemFromList(eventsExt, "id", oldEvent.id);
      if (!eventExt.transfer_code) {
        const extDocRef = doc(db, "events_ext", oldEvent.id);
        const eventExtRef = {
          last_timestamp: serverTimestamp(),
          transfer_code: Math.random().toString(16).slice(2),
        };
        const eventExtModRef = updateDoc(extDocRef, eventExtRef).catch(
          (error) => {
            console.log(error?.message);
          }
        );
        await eventExtModRef;
      }
    }

    // !todo: since updateDoc return Promise<void>, we need other method to check the results
    showAlert(
      "success",
      `"${newEvent.title}" is updated successfully! Navigate to Events page.`
    );

    setTimeout(() => {
      router.push(`/events`); // can be customized
    }, 2000); // wait 2 seconds then go to `events` page
  };

  const handleDiscard = () => {
    showAlert("info", `Draft discarded! Navigate to Events page.`);

    setTimeout(() => {
      router.push(`/events`); // can be customized
    }, 2000); // wait 2 seconds then go to `events` page
  };

  const handleDelete = (docId) => {
    handleDeleteEntry(
      "events",
      "events_ext",
      "my_event_ids",
      docId,
      ediumUser?.uid
    );

    showAlert(
      "success",
      `"${newEvent.title}" is deleted sucessfully! Navigate to Events page.`
    );

    setTimeout(() => {
      router.push(`/events`);
    }, 2000); // wait 2 seconds then go to `events` page
  };

  return (
    <FixedHeightPaper
      elevation={onMedia.onDesktop ? 2 : 0}
      isdesktop={onMedia.onDesktop ? 1 : 0}
      mobileheight={0}
      sx={{
        paddingTop: onMedia.onDesktop ? "32px" : 0,
      }}
    >
      <Box
        id="projectcreate-box"
        sx={{
          flexGrow: 1,
          position: "relative", // https://stackoverflow.com/questions/3970455/how-to-make-the-overflow-css-property-work-with-hidden-as-value
          overflowX: "hidden",
          overflowY: "scroll",
          //paddingTop: onMedia.onDesktop ? 2 : 2, // align with project list
          paddingBottom: onMedia.onDesktop ? 8 : 4, // enough space for messages
          paddingLeft: onMedia.onDesktop ? 4 : 2,
          paddingRight: onMedia.onDesktop
            ? `calc(${theme.spacing(4)} - 0.4rem)`
            : 2, // onDesktop: scrollbar
        }}
      >
        {/* Title */}
        <Typography
          sx={{
            display: "flex",
            justifyContent: "center",
            fontSize: "2rem",
            fontWeight: "bold",
            mt: 4,
            mb: 8,
          }}
        >
          {oldEvent ? "Update Event" : "Create New Event"}
        </Typography>

        {/* Modes: Edit / Preview */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              height: "40px",
              width: "240px",
              borderRadius: 8,
              backgroundColor: "gray300.main",
              display: "flex",
              justifyContent: isEditMode ? "start" : "end",
              // justifyContent: "space-between",
              alignItems: "center",
              ":hover": { cursor: "pointer" },
            }}
            onClick={() => {
              setIsEditMode(!isEditMode);
            }}
          >
            {!isEditMode && (
              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "50%",
                  color: "gray700.main",
                  fontWeight: "medium",
                }}
              >
                Edit
              </Typography>
            )}
            <Box
              sx={{
                height: "80%",
                width: "50%",
                mx: "2%",
                borderRadius: 8,
                backgroundColor: "secondary.main",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "medium",
                }}
              >
                {isEditMode ? "Edit" : "Preview"}
              </Typography>
            </Box>
            {isEditMode && (
              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "50%",
                  color: "gray700.main",
                  fontWeight: "medium",
                }}
              >
                Preview
              </Typography>
            )}
          </Box>
        </Box>
        {isEditMode ? (
          <>
            {/* Admin Option */}
            {ediumUser?.uid === "T5q6FqwJFcRTKxm11lu0zmaXl8x2" && (
              <Box sx={{ mt: 4, display: "flex", flexDirection: "row" }}>
                <Typography
                  sx={{ color: "adminOrange.main", fontWeight: "medium" }}
                >
                  {"This is a transferable event"}
                </Typography>
                <Checkbox
                  checked={isCheckedTransferable}
                  onChange={() => {
                    setIsCheckedTransferable(!isCheckedTransferable);
                  }}
                  sx={{ ml: 2, color: "gray500.main", padding: 0 }}
                />
              </Box>
            )}
            <form ref={formRef}>
              {/* Title textfield & Upload logo button */}
              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                }}
              >
                <DefaultTextField
                  fullWidth
                  margin="none"
                  required
                  label="Event Title"
                  helperText="Name of your event"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateFocus("datetime");
                    }
                  }}
                />
                <Button
                  sx={{
                    ml: 4,
                    color: newEvent.icon_url ? "text.primary" : "gray500.main",
                    backgroundColor: "gray100.main",
                    borderRadius: 2,
                    height: "56px",
                    textTransform: "none",
                    width: "50%",
                    maxWidth: "112px",
                    border: "none",
                    padding: "16.5px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                  // variant="contained"
                  disableElevation
                  onClick={handleDialogOpen}
                >
                  <Typography
                    sx={{
                      fontWeight: "medium",
                      fontSize: "16px",
                    }}
                  >
                    {"Logo"}
                  </Typography>
                  <AddLinkIcon
                    sx={{ fontSize: "24px", fontWeight: "medium" }}
                  />
                </Button>
                <Dialog
                  open={isDialogOpen}
                  onClose={handleDialogClose}
                  fullWidth
                  maxWidth="md"
                >
                  <DialogTitle>Upload Logo from URL</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      {"Please enter the URL of your icon here. "}
                      <Link
                        target="_blank"
                        href={"https://imgur.com/upload"}
                        rel="noreferrer"
                      >
                        Imgur
                      </Link>
                      {" is a good image hosting service to start with."}
                    </DialogContentText>
                    <TextField
                      fullWidth
                      margin="dense"
                      type="url"
                      variant="standard"
                      label="Icon URL"
                      value={newEvent.icon_url}
                      onChange={(e) => {
                        let url = e.target.value;
                        if (url.includes("https://imgur.com/")) {
                          url = url
                            .replace(
                              "https://imgur.com/",
                              "https://i.imgur.com/"
                            )
                            .concat(".png");
                        }
                        setNewEvent({
                          ...newEvent,
                          icon_url: url,
                        });
                      }}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleDialogClose}>Confirm</Button>
                  </DialogActions>
                </Dialog>
              </Box>

              {/* Category select & type select */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="start"
                sx={{ mt: 4 }}
              >
                <DefaultFormControl required fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                    value={newEvent.category}
                    onChange={(e) => {
                      setNewEvent({ ...newEvent, category: e.target.value });
                    }}
                  >
                    {categoryStrList?.map((cateStr, index) => {
                      return (
                        <MenuItem key={index} value={cateStr}>
                          {cateStr}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormHelperText
                    id="eventcreate-category-helper-text"
                    sx={{ color: "lightgray", fontSize: "12px" }}
                  >
                    {"General category of your event"}
                  </FormHelperText>
                </DefaultFormControl>

                <DefaultFormControl required fullWidth sx={{ ml: 4 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    label="Type"
                    value={newEvent.type}
                    onChange={(e) => {
                      setNewEvent({ ...newEvent, type: e.target.value });
                    }}
                  >
                    {eventStrList?.map((eventStr, index) => {
                      return (
                        <MenuItem key={index} value={eventStr}>
                          {eventStr}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormHelperText
                    id="eventcreate-type-helper-text"
                    sx={{ color: "lightgray", fontSize: "12px" }}
                  >
                    {"General type of your event"}
                  </FormHelperText>
                </DefaultFormControl>
              </Box>

              {/* Start date & duration */}
              <Box display="flex" justifyContent="space-between" sx={{ mt: 4 }}>
                {/* mui x 6.x */}

                <StyledDateTimeField
                  inputRef={focusState === "datetime" ? focusRef : null}
                  fullWidth
                  required
                  label="Start Date and Time"
                  helperText="Event start time"
                  value={
                    newEvent.start_date ? dayjs(newEvent.start_date) : null
                  }
                  onChange={(newValue) => {
                    setNewEvent({
                      ...newEvent,
                      start_date: newValue?.toDate(),
                      end_date: eventDuration
                        ? dayjs(newValue)
                            .add(eventDuration, eventDurationUnit)
                            ?.toDate()
                        : null,
                    });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateFocus("duration");
                    }
                  }}
                />
                <DefaultTextField
                  inputRef={focusState === "duration" ? focusRef : null}
                  sx={{ ml: 4 }}
                  //error={!Number(eventDuration)}
                  fullWidth
                  required
                  label="Duration"
                  helperText="Event duration"
                  value={eventDuration}
                  onChange={(e) => {
                    setEventDuration(e.target.value);
                    if (newEvent.start_date) {
                      setNewEvent({
                        ...newEvent,
                        end_date: dayjs(newEvent.start_date)
                          .add(e.target.value, eventDurationUnit)
                          ?.toDate(),
                      });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                      e.preventDefault();
                      setEventDurationUnit(
                        eventDurationUnit === "hours" ? "days" : "hours"
                      );
                      if (eventDuration && newEvent.start_date)
                        eventDurationUnit === "hours"
                          ? setNewEvent({
                              ...newEvent,
                              end_date: dayjs(newEvent.start_date)
                                .add(eventDuration, "days")
                                ?.toDate(),
                            })
                          : setNewEvent({
                              ...newEvent,
                              end_date: dayjs(newEvent.start_date)
                                .add(eventDuration, "hours")
                                ?.toDate(),
                            });
                    }
                    if (e.key === "Enter") {
                      updateFocus("regurl");
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={(e) => {
                          setEventDurationUnit(
                            eventDurationUnit === "hours" ? "days" : "hours"
                          );
                          if (eventDuration && newEvent.start_date)
                            eventDurationUnit === "hours"
                              ? setNewEvent({
                                  ...newEvent,
                                  end_date: dayjs(newEvent.start_date)
                                    .add(eventDuration, "days")
                                    ?.toDate(),
                                })
                              : setNewEvent({
                                  ...newEvent,
                                  end_date: dayjs(newEvent.start_date)
                                    .add(eventDuration, "hours")
                                    ?.toDate(),
                                });
                        }}
                        sx={{
                          height: "40px",
                          width: "40px",
                          position: "absolute",
                          right: 0,
                        }}
                      >
                        <Typography
                          sx={{ fontSize: "1rem", fontWeight: "medium" }}
                        >
                          {eventDurationUnit === "hours"
                            ? eventDuration > 1
                              ? "hrs"
                              : "hr"
                            : eventDuration > 1
                            ? "days"
                            : "day"}
                        </Typography>
                      </IconButton>
                    ),
                  }}
                />
              </Box>
              {/* Location */}
              {/* !todo: can use some services like google places or leaflet to autocomplete */}
              <DefaultTextField
                inputRef={focusState === "location" ? focusRef : null}
                sx={{ mt: 4 }}
                fullWidth
                margin="none"
                required
                label="Location"
                helperText="Full address / Access to virtual event"
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, location: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateFocus("details");
                  }
                }}
              />
              {/* Details */}
              <Autocomplete
                sx={{ mt: 4 }}
                clearOnBlur
                filterSelectedOptions
                freeSolo
                fullWidth
                multiple
                options={eventTags}
                value={newEvent?.tags}
                onChange={(event, newValue) => {
                  setNewEvent({ ...newEvent, tags: newValue });
                }}
                renderInput={(params) => (
                  <DefaultTextField
                    {...params}
                    inputRef={focusState === "details" ? focusRef : null}
                    required
                    label="Details"
                    helperText="Keywords to shortly describe the new event (e.g. tags)"
                    inputProps={{
                      ...params.inputProps,
                      required: newEvent?.tags?.length === 0,
                    }}
                  />
                )}
              />
              {/* Description */}
              <Box
                sx={{
                  mt: 4,
                  backgroundColor: "gray100.main",
                  borderRadius: 2,
                  paddingX: "14px",
                  paddingY: "16.5px",
                  "&:hover": {
                    cursor: "text",
                  },
                }}
              >
                <SlateEditor
                  valueObj={newEvent}
                  valueKey="slate_desc"
                  onChange={setNewEvent}
                  isReadOnly={false}
                />
              </Box>
              <FormHelperText
                sx={{
                  color: "lightgray",
                  fontSize: "12px",
                  mx: "14px",
                  mt: "3px",
                }}
              >
                A brief description of the new event (e.g. goal, content,
                format, timeline)
              </FormHelperText>
              {/* registration url */}
              <DefaultTextField
                inputRef={focusState === "regurl" ? focusRef : null}
                sx={{ mt: 4 }}
                fullWidth
                margin="none"
                type="url"
                label="Registration Form URL"
                helperText="Users will be redirect to this URL when they click Attend"
                value={newEvent.registration_form_url}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    registration_form_url: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateFocus("location");
                  }
                }}
              />
              {/* Social Media: IG, Youtube, Imgur */}
              <Box sx={{ mt: 4, display: "flex", flexDirection: "row" }}>
                <DefaultTextField
                  fullWidth
                  margin="none"
                  type="url"
                  label="Social Media URL"
                  helperText="Supports Instagram"
                  value={newEvent.banner_url}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      banner_url: e.target.value,
                    })
                  }
                />
              </Box>
              {/* Buttons */}
              <Box
                sx={{ mt: 8, display: "flex", justifyContent: "space-between" }}
              >
                {oldEvent && (
                  <Button
                    color="primary"
                    disabled={!isClickable || !ediumUser?.uid}
                    disableElevation
                    variant="contained"
                    onClick={() => handleDelete(newEvent.id)}
                    sx={{
                      width: "128px",
                      height: "32px",
                      borderRadius: 8,
                    }}
                  >
                    {"Delete"}
                  </Button>
                )}
                <Box sx={{ flexGrow: 1 }} />
                <Button
                  color="primary"
                  disabled={!isClickable || !ediumUser?.uid}
                  disableElevation
                  variant="outlined"
                  onClick={(e) => handleDiscard(e)}
                  sx={{
                    ml: onMedia.onDesktop ? 4 : 2,
                    width: "128px",
                    height: "32px",
                    borderRadius: 8,
                  }}
                >
                  {"Discard"}
                </Button>

                <Button
                  color="primary"
                  disabled={!isClickable || !ediumUser?.uid}
                  disableElevation
                  variant="contained"
                  onClick={(e) => {
                    if (
                      currentUser?.uid === "T5q6FqwJFcRTKxm11lu0zmaXl8x2" &&
                      isCheckedTransferable
                    ) {
                      handleSubmitTransferable(e);
                    } else {
                      handleSubmit(e);
                    }
                  }}
                  sx={{
                    ml: onMedia.onDesktop ? 4 : 2,
                    width: "128px",
                    height: "32px",
                    borderRadius: 8,
                  }}
                >
                  {"Confirm"}
                </Button>
              </Box>
            </form>
          </>
        ) : (
          <Box sx={{ mt: 4 }}>
            <EventInfoContent
              event={newEvent}
              eventCreator={null}
              eventAllTags={newEvent?.tags}
            />
          </Box>
        )}
      </Box>
    </FixedHeightPaper>
  );
};

export default EventCreate;

export const StyledDateTimeField = styled(DateTimeField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.gray100.main,
    "& fieldset": {
      border: "none",
    },
    "&:hover fieldset": {
      border: "none",
    },
    "&.Mui-focused fieldset": {
      border: "none",
    },
  },
  "& .MuiFormHelperText-root": {
    color: "lightgray",
    height: "1.5rem", // 24px
    fontSize: "0.75rem", // 12px
  },
  "& .MuiFormLabel-root": {
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.gray500.main,
    fontSize: "1rem",
    zIndex: 1,
  },
}));
