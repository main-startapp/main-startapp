import {
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
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
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { db } from "../../firebase";
import { GlobalContext, EventContext } from "../Context/ShareContexts";
import {
  LocalizationProvider,
  DesktopDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { useRouter } from "next/router";
import { useAuth } from "../Context/AuthContext";
import {
  DefaultTextField,
  findItemFromList,
  handleDeleteEntry,
} from "../Reusable/Resusable";
import { eventStrList } from "../Reusable/MenuStringList";

const EventCreate = (props) => {
  // context
  const { currentUser } = useAuth();
  const {
    eventsExt,
    ediumUser,
    ediumUserExt,
    oldEvent,
    setOldEvent,
    winHeight,
    onMedia,
  } = useContext(GlobalContext);
  const { showAlert } = useContext(EventContext);

  // props from push query
  const isCreate = useMemo(() => {
    return props.isCreateStr === "false" ? false : true; // null, undefined, "true" are all true isCreate
  }, [props.isCreateStr]);

  // local vars
  const [isClickable, setIsClickable] = useState(true); // button state to prevent click spam
  const router = useRouter();
  const formRef = useRef();

  // Event State Initialization.
  const emptyEvent = {
    title: "",
    category: "",
    start_date: moment().toDate(),
    end_date: moment().toDate(),
    location: "",
    details: "",
    description: "",
    creator_uid: ediumUser?.uid,
    is_deleted: false,
    is_visible: true,
    icon_url: "",
    banner_url: "",
    registration_form_url: "",
  };
  const [newEvent, setNewEvent] = useState(() =>
    isCreate ? emptyEvent : oldEvent
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
  const [isChecked, setIsChecked] = useState(true);
  useEffect(() => {
    if (!isCreate) {
      // update, checked value depends on oldEvent
      // if creator is admin, check if updating transferable event
      if (
        currentUser?.uid === "T5q6FqwJFcRTKxm11lu0zmaXl8x2" &&
        !ediumUserExt?.my_event_ids?.includes(oldEvent?.id)
      ) {
        setIsCheckedTransferable(true);
      }
    }
  }, [isCreate, oldEvent, currentUser?.uid, ediumUserExt?.my_event_ids]);

  // helper functions
  const handleSubmit = async (e) => {
    if (!isClickable) return;
    if (!formRef.current.reportValidity()) return;

    // button is clickable & form is valid
    setIsClickable(false);
    let eventModRef; // ref to addDoc() or updateDoc()
    if (isCreate) {
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

    setOldEvent(null);

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
    if (isCreate) {
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

    setOldEvent(null);

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
    setOldEvent(null);
    setNewEvent(emptyEvent);

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
      ? setNewEvent({ ...newEvent, start_date: e?._d })
      : setNewEvent({ ...newEvent, end_date: e?._d });
  };

  return (
    <Grid
      container
      spacing={0}
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundColor: "#fafafa",
        height: onMedia.onDesktop
          ? `calc(${winHeight}px - 64px)`
          : `calc(${winHeight}px - 48px - 60px)`,
        overflow: "auto",
      }}
    >
      <Grid
        item
        xs={onMedia.onDesktop ? 8 : 10}
        sx={{
          backgroundColor: "#ffffff",
          borderLeft: 1.5,
          borderRight: 1.5,
          borderColor: "#dbdbdb",
          paddingX: 3,
          minHeight: "100%",
        }}
      >
        <Typography
          sx={{
            display: "flex",
            justifyContent: "center",
            fontSize: "2em",
            fontWeight: "bold",
            mt: 5,
            mb: 5,
          }}
        >
          {isCreate ? "Create New Event" : "Update Event"}
        </Typography>
        {ediumUser?.uid === "T5q6FqwJFcRTKxm11lu0zmaXl8x2" && (
          <Box sx={{ mb: 5, display: "flex" }}>
            <Checkbox
              sx={{ mr: 1.5, color: "#dbdbdb", padding: 0 }}
              checked={isCheckedTransferable}
              onChange={() => {
                setIsCheckedTransferable(!isCheckedTransferable);
              }}
            />
            <Typography sx={{ color: "#f4511e", fontWeight: "bold" }}>
              {"ADMIN This is a transferable event"}
            </Typography>
          </Box>
        )}
        <form ref={formRef}>
          {/* Title textfield & Upload logo button */}
          <Box display="flex" justifyContent="space-between" alignItems="start">
            <DefaultTextField
              required
              fullWidth
              sx={{
                mr: 5,
              }}
              label="Event Title"
              margin="none"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
            />
            <Button
              sx={{
                backgroundColor: "#f0f0f0",
                border: 1.5,
                borderRadius: 2,
                borderColor: "#dbdbdb",
                color: "rgba(0, 0, 0, 0.6)",

                height: "56px",
                textTransform: "none",
                minWidth: "20%",
                paddingLeft: "30px",
              }}
              // variant="contained"
              disableElevation
              onClick={handleDialogOpen}
            >
              <UploadFileIcon sx={{ position: "absolute", left: "5%" }} />
              <Typography>{"Logo Link"}</Typography>
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
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, icon_url: e.target.value })
                  }
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose}>Confirm</Button>
              </DialogActions>
            </Dialog>
          </Box>
          {/* Category select & start/end date */}
          <Box display="flex" justifyContent="space-between" mt={5}>
            <FormControl
              required
              fullWidth
              sx={{
                mr: 5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#f0f0f0",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: 1.5,
                  borderColor: "#dbdbdb",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: 1.5,
                  borderColor: "#dbdbdb",
                },
                ".MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    border: 1.5,
                    borderColor: "#3e95c2",
                  },
              }}
            >
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                value={newEvent.category}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, category: e.target.value })
                }
              >
                {eventStrList.map((eventStr, index) => {
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
                {"A general category of your event"}
              </FormHelperText>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DesktopDateTimePicker
                renderInput={(props) => (
                  <DefaultTextField
                    sx={{ minWidth: "20%", mr: 5 }}
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
                    sx={{ minWidth: "20%" }}
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
          {/* Location */}
          {/* !todo: can use some services like google places or leaflet to autocomplete */}
          <DefaultTextField
            sx={{
              mt: 5,
            }}
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
          <DefaultTextField
            sx={{
              mt: 5,
            }}
            fullWidth
            label="Details"
            margin="none"
            helperText="Keywords to shortly describe the new event seperated by commas (e.g. tags)"
            value={newEvent.details}
            onChange={(e) =>
              setNewEvent({ ...newEvent, details: e.target.value })
            }
          />
          {/* Description */}
          <DefaultTextField
            sx={{
              mt: 5,
            }}
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
              mt: 5,
              mb: 0,
            }}
            fullWidth
            label="Banner URL"
            type="url"
            margin="none"
            helperText="Optional banner shown on the event page"
            value={newEvent.banner_url}
            onChange={(e) =>
              setNewEvent({
                ...newEvent,
                banner_url: e.target.value,
              })
            }
          />
          {/* application form */}
          <Container
            sx={{
              mx: 0,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              height: 40,
            }}
            disableGutters
          >
            <Divider
              sx={{
                borderBottomWidth: 1.5,
                borderColor: "#dbdbdb",
                height: "10px",
                width: "101.5%",
                mb: 2.5,
              }}
            />
            {/* <Checkbox
              sx={{
                mr: 1.5,
                color: "#dbdbdb",
                padding: 0,
                "&.Mui-checked": {
                  color: "#3e95c2",
                },
              }}
              defaultChecked
              value={isChecked}
              onChange={() => {
                if (isChecked) {
                  setNewEvent({ ...newEvent, registration_form_url: "" });
                }
                setIsChecked(!isChecked);
              }}
            />
            <Typography sx={{ color: "rgba(0,0,0,0.6)" }}>
              {"I want to add a registration form"}
            </Typography> */}
          </Container>
          {isChecked && (
            <DefaultTextField
              sx={{
                mt: 0,
              }}
              required
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
          )}
          {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {!isCreate && (
              <Button
                sx={{
                  mt: 5,
                  mb: 5,
                  border: 1.5,
                  borderColor: "#dbdbdb",
                  borderRadius: 8,
                  backgroundColor: "#3e95c2",
                  textTransform: "none",
                  paddingX: 5,
                }}
                variant="contained"
                disableElevation
                disabled={!isClickable || !ediumUser?.uid}
                onClick={() => handleDelete(newEvent.id)}
              >
                {"Delete"}
              </Button>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Button
              sx={{
                mt: 5,
                ml: 2.5,
                mb: 5,
                border: 1.5,
                borderColor: "#dbdbdb",
                borderRadius: 8,
                backgroundColor: "#fafafa",
                color: "black",
                textTransform: "none",
                paddingX: 5,
              }}
              variant="contained"
              disableElevation
              disabled={!isClickable || !ediumUser?.uid}
              onClick={(e) => handleDiscard(e)}
            >
              {"Discard"}
            </Button>

            <Button
              sx={{
                mt: 5,
                ml: 2.5,
                mb: 5,
                border: 1.5,
                borderColor: "#dbdbdb",
                borderRadius: 8,
                backgroundColor: "#3e95c2",
                textTransform: "none",
                paddingX: 5,
              }}
              variant="contained"
              disableElevation
              disabled={!isClickable || !ediumUser?.uid}
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
            >
              {"Confirm"}
            </Button>
          </Box>
        </form>
      </Grid>
    </Grid>
  );
};

export default EventCreate;
