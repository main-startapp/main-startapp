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
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  Link,
  Menu,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AddLinkIcon from "@mui/icons-material/AddLink";
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
import { useContext, useEffect, useRef, useState } from "react";
import { db } from "../../firebase";
import { GlobalContext, EventContext } from "../Context/ShareContexts";
import {
  LocalizationProvider,
  DesktopDateTimePicker,
  DesktopDatePicker,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { useRouter } from "next/router";
import { useAuth } from "../Context/AuthContext";
import {
  DefaultFormControl,
  DefaultTextField,
  findItemFromList,
  FixedHeightPaper,
  handleDeleteEntry,
} from "../Reusable/Resusable";
import { eventStrList, eventTags, timeSlots } from "../Reusable/MenuStringList";
import { useTheme } from "@mui/material/styles";

const EventCreate = (props) => {
  // context
  const { currentUser } = useAuth();
  const { events, eventsExt, ediumUser, ediumUserExt, winHeight, onMedia } =
    useContext(GlobalContext);
  const { showAlert } = useContext(EventContext);
  const router = useRouter();
  const formRef = useRef();
  const theme = useTheme();

  // click spam
  const [isClickable, setIsClickable] = useState(true); // button state to prevent click spam

  // can be wrapped up in useMemo if necessary, no premature optimization
  const oldEvent = props.eventID
    ? findItemFromList(events, "id", props.eventID)
    : null;

  // init new event
  const emptyEvent = {
    title: "",
    category: "",
    start_date: moment().toDate(),
    end_date: moment().toDate(),
    location: "",
    tags: [],
    description: "",
    creator_uid: ediumUser?.uid,
    is_deleted: false,
    is_visible: true,
    icon_url: "",
    banner_url: "",
    registration_form_url: "",
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

    let retID;
    await eventModRef.then((ret) => {
      retID = ret?.id;
    });

    // retID: create; !retID: update
    if (retID) {
      // add to my_event_ids in user ext data if create
      const ediumUserExtDocRef = doc(db, "users_ext", ediumUser?.uid);
      const ediumUserExtUpdateRef = {
        my_event_ids: ediumUserExt?.my_event_ids ? arrayUnion(retID) : [retID],
        last_timestamp: serverTimestamp(),
      };
      const ediumUserExtModRef = updateDoc(
        ediumUserExtDocRef,
        ediumUserExtUpdateRef
      ).catch((error) => {
        console.log(error?.message);
      });

      // create extension doc for team management if create
      const extDocRef = doc(db, "events_ext", retID);
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

    let retID;
    await eventModRef.then((ret) => {
      retID = ret?.id;
    });

    // retID: create; !retID: update
    if (retID) {
      // don't add event id to my_event_ids
      // do create extenion doc with extra field
      const extDocRef = doc(db, "events_ext", retID);

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

  const handleDelete = (docID) => {
    handleDeleteEntry(
      "events",
      "events_ext",
      "my_event_ids",
      docID,
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

  const handleDateTimeChange = (e, isStart) => {
    isStart
      ? setNewEvent({ ...newEvent, start_date: e.toDate() })
      : setNewEvent({ ...newEvent, end_date: e.toDate() });
  };

  const [testDate, setTestDate] = useState(null);
  const [testTimeSlot, setTestTimeSlot] = useState("");
  const [testTimePeriod, setTestTimePeriod] = useState("am");
  const [testDuration, setTestDuration] = useState(0);
  const [testDurationUnit, setTestDurationUnit] = useState("hours");
  const [testStartDate, setTestStartDate] = useState(null);
  const [testEndDate, setTestEndDate] = useState(null);
  function getTimeSlotString(timeSlot) {
    let hour = Math.floor(timeSlot);
    let min = Math.floor((timeSlot - hour) * 60);
    let hourStr = hour < 10 ? "0" + hour.toString() : hour.toString();
    let minStr = min < 10 ? "0" + min.toString() : min.toString();
    let periodStr = hour < 12 ? "am" : "pm";
    let ret = hourStr + ":" + minStr;
    return ret;
  }

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
          //overflowX: "hidden",
          overflowY: "scroll",
          //paddingTop: onMedia.onDesktop ? 2 : 2, // align with project list
          paddingBottom: onMedia.onDesktop ? 8 : 4, // enough space for messages
          paddingLeft: onMedia.onDesktop ? 4 : 2,
          paddingRight: onMedia.onDesktop
            ? `calc(${theme.spacing(4)} - 0.4rem)`
            : 2, // onDesktop: scrollbar
        }}
      >
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
        {ediumUser?.uid === "T5q6FqwJFcRTKxm11lu0zmaXl8x2" && (
          <Box sx={{ mb: 4, display: "flex" }}>
            <Typography sx={{ color: "adminOrange.main", fontWeight: "bold" }}>
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
          <Box display="flex" justifyContent="space-between" alignItems="start">
            <DefaultTextField
              required
              fullWidth
              label="Event Title"
              helperText="Name of your event"
              margin="none"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
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
              <AddLinkIcon sx={{ fontSize: "24px", fontWeight: "medium" }} />
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
                  autoFocus
                  margin="dense"
                  label="Icon URL"
                  type="url"
                  fullWidth
                  variant="standard"
                  value={newEvent.icon_url}
                  onChange={(e) => {
                    let url = e.target.value;
                    if (url.includes("https://imgur.com/")) {
                      url = url
                        .replace("https://imgur.com/", "https://i.imgur.com/")
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
          {/* Category select & start/end date */}
          <Box display="flex" justifyContent="space-between" sx={{ mt: 4 }}>
            <DefaultFormControl required fullWidth sx={{ width: "50%" }}>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                value={newEvent.category}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, category: e.target.value })
                }
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
                id="eventcreate-category-helper-text"
                sx={{ color: "lightgray", fontSize: "12px" }}
              >
                {"General category of your event"}
              </FormHelperText>
            </DefaultFormControl>

            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DesktopDateTimePicker
                renderInput={(props) => (
                  <DefaultTextField
                    sx={{ minWidth: "20%", ml: 4 }}
                    helperText="Start date and time"
                    {...props}
                  />
                )}
                value={newEvent.start_date}
                onChange={(e) => {
                  handleDateTimeChange(e, true);
                }}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DesktopDateTimePicker
                renderInput={(props) => (
                  <DefaultTextField
                    sx={{ minWidth: "20%", ml: 4 }}
                    helperText="End date and time"
                    {...props}
                  />
                )}
                value={newEvent.end_date}
                minDateTime={moment(newEvent.start_date)}
                onChange={(e) => {
                  handleDateTimeChange(e, false);
                }}
              />
            </LocalizationProvider>
          </Box>
          {/* WIP Time */}
          {/* <Box
            display="flex"
            justifyContent="space-between"
            sx={{ mt: 4, width: "60%" }}
          >
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DesktopDatePicker
                renderInput={(props) => (
                  <DefaultTextField
                    sx={{ width: "100%" }}
                    helperText="Start date and time"
                    {...props}
                  />
                )}
                value={testDate}
                onChange={(e) => {
                  setTestDate(e.toDate());
                  if (testTimeSlot)
                    setTestStartDate(e.add(testTimeSlot, "h").toDate());
                }}
              />
            </LocalizationProvider>

            <DefaultFormControl fullWidth sx={{ width: "50%", ml: 4 }}>
              <InputLabel>Time</InputLabel>
              <Select
                label=""
                IconComponent={null}
                value={testTimeSlot}
                onChange={(e) => {
                  setTestTimeSlot(e.target.value);
                  setTestStartDate(
                    moment(testDate).add(e.target.value, "h").toDate()
                  );
                }}
                endAdornment={
                  <IconButton
                    onClick={() => {
                      setTestTimePeriod(testTimePeriod === "am" ? "pm" : "am");
                    }}
                    sx={{
                      height: "40px",
                      width: "40px",
                      position: "absolute",
                      right: 0,
                    }}
                  >
                    <Typography sx={{ fontSize: "1rem", fontWeight: "medium" }}>
                      {testTimePeriod === "am" ? "am" : "pm"}
                    </Typography>
                  </IconButton>
                }
              >
                {timeSlots
                  ?.filter((timeSlot) => {
                    return testTimePeriod === "am"
                      ? timeSlot < 12
                      : timeSlot >= 12;
                  })
                  ?.map((timeSlot, index) => {
                    return (
                      <MenuItem key={index} value={timeSlot}>
                        {getTimeSlotString(timeSlot)}
                      </MenuItem>
                    );
                  })}
              </Select>
              <FormHelperText
                id="eventcreate-wip-time-helper-text"
                sx={{ color: "lightgray", fontSize: "12px" }}
              >
                {"Time"}
              </FormHelperText>
            </DefaultFormControl>

            <DefaultTextField
              fullWidth
              value={testDuration}
              onChange={(e) => {
                setTestDuration(e.target.value);
                setTestEndDate(
                  moment(testStartDate)
                    .add(e.target.value, testDurationUnit)
                    .toDate()
                );
              }}
              sx={{ width: "50%", ml: 4 }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => {
                      setTestDurationUnit(
                        testDurationUnit === "hours" ? "days" : "hours"
                      );
                    }}
                    sx={{
                      height: "40px",
                      width: "40px",
                      position: "absolute",
                      right: 0,
                    }}
                  >
                    <Typography sx={{ fontSize: "1rem", fontWeight: "medium" }}>
                      {testDurationUnit === "hours"
                        ? testDuration > 1
                          ? "hrs"
                          : "hr"
                        : testDuration > 1
                        ? "days"
                        : "day"}
                    </Typography>
                  </IconButton>
                ),
              }}
            />
          </Box>
          <Box display="flex" justifyContent="space-between" sx={{ mt: 4 }}>
            <Typography>{testStartDate?.toString()}</Typography>
            <Typography>{testEndDate?.toString()}</Typography>
          </Box> */}
          {/* Location */}
          {/* !todo: can use some services like google places or leaflet to autocomplete */}
          <DefaultTextField
            sx={{ mt: 4 }}
            fullWidth
            label="Location"
            margin="none"
            helperText="Full address with postal code / Access to virtual event"
            value={newEvent.location}
            onChange={(e) =>
              setNewEvent({ ...newEvent, location: e.target.value })
            }
          />
          {/* Details */}
          <Autocomplete
            sx={{ mt: 4 }}
            fullWidth
            freeSolo
            clearOnBlur
            multiple
            filterSelectedOptions
            options={eventTags}
            value={newEvent?.tags}
            onChange={(event, newValue) => {
              setNewEvent({ ...newEvent, tags: newValue });
            }}
            renderInput={(params) => (
              <DefaultTextField
                {...params}
                label="Details"
                helperText="Keywords to shortly describe the new event (e.g. tags)"
                required
                inputProps={{
                  ...params.inputProps,
                  required: newEvent?.tags?.length === 0,
                }}
              />
            )}
          />
          {/* Description */}
          <DefaultTextField
            sx={{ mt: 4 }}
            fullWidth
            required
            label="Description"
            margin="none"
            multiline
            minRows={4}
            maxRows={8}
            helperText="A brief description of the new event (e.g. goal, content, format, timeline)"
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
          />
          {/* Optional Banner */}
          <DefaultTextField
            sx={{
              mt: 4,
            }}
            fullWidth
            label="Banner URL"
            type="url"
            margin="none"
            helperText="Banner shown on the event page"
            value={newEvent.banner_url}
            onChange={(e) =>
              setNewEvent({
                ...newEvent,
                banner_url: e.target.value,
              })
            }
          />
          <DefaultTextField
            sx={{
              mt: 4,
            }}
            fullWidth
            label="Registration Form URL"
            type="url"
            margin="none"
            helperText="Users will be redirect to this URL when they click Attend"
            value={newEvent.registration_form_url}
            onChange={(e) =>
              setNewEvent({
                ...newEvent,
                registration_form_url: e.target.value,
              })
            }
          />

          {/* Buttons */}
          <Box sx={{ mt: 8, display: "flex", justifyContent: "space-between" }}>
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
      </Box>
    </FixedHeightPaper>
  );
};

export default EventCreate;
