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
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  collection,
  doc,
  addDoc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { useContext, useRef, useState } from "react";
import { db } from "../../firebase";
import { GlobalContext, EventContext } from "../Context/ShareContexts";
import {
  LocalizationProvider,
  DesktopDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import moment from "moment";
import { useRouter } from "next/router";

const EventCreate = (props) => {
  // context
  const { currentStudent, oldEvent, setOldEvent } = useContext(GlobalContext);
  const currentUID = currentStudent?.uid;

  const { showAlert } = useContext(EventContext);

  // props from push query
  const isCreate = props.isCreateStr === "false" ? false : true; // null, undefined, "true" are all true isCreate

  // router
  const router = useRouter();

  // local vars
  // Event State Initialization.
  const emptyEvent = {
    title: "",
    category: "",
    starting_date: moment().toDate(),
    location: "",
    details: "",
    description: "",
    creator_uid: currentUID,
    isVisible: true,
    icon_url: "",
    banner_url: "",
    registration_form_url: "",
  };
  const [newEvent, setNewEvent] = useState(() =>
    isCreate ? emptyEvent : oldEvent
  );

  const [isClickable, setIsClickable] = useState(true); // button state to prevent click spam

  // upload-icon dialog modal
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  // check box
  const [isChecked, setIsChecked] = useState(true);

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
      eventModRef = addDoc(collectionRef, eventRef).catch((err) => {
        console.log("addDoc() error: ", err);
      });
    } else {
      // update an existing event
      const docRef = doc(db, "events", newEvent.id);
      const eventRef = {
        ...newEvent,
        last_timestamp: serverTimestamp(),
      };
      delete eventRef.id;
      eventModRef = updateDoc(docRef, eventRef).catch((err) => {
        console.log("updateDoc() error: ", err);
      });
    }
    setOldEvent(null);
    let retID;
    await eventModRef.then((ret) => {
      retID = ret?.id;
    });

    // retID: create; !retID: update
    if (retID) {
      // create extension doc for team management if create
      const extDocRef = doc(db, "events_ext", retID);
      const eventExtRef = {
        members: [currentUID],
        admins: [currentUID],
        last_timestamp: serverTimestamp(),
      };
      const eventExtModRef = setDoc(extDocRef, eventExtRef).catch((err) => {
        console.log("setDoc() error: ", err);
      });

      await eventExtModRef;
    }

    // !todo: since updateDoc return Promise<void>, we need other method to check the results
    showAlert(
      "success",
      `"${newEvent.title}" is updated successfully! Navigate to Events page.`
    );

    setTimeout(() => {
      router.push(`/events`); // can be customized
    }, 2000); // wait 2 seconds then go to `projects` page
  };

  const handleDiscard = async () => {
    setOldEvent(null);
    setNewEvent(emptyEvent);

    showAlert("info", `Draft discarded! Navigate to Events page.`);
    setTimeout(() => {
      router.push(`/events`); // can be customized
    }, 2000); // wait 2 seconds then go to `projects` page
  };

  const handleDelete = async (id, e) => {
    const docRef = doc(db, "events", id);
    const eventModRef = deleteDoc(docRef).catch((err) => {
      console.log("deleteDoc() error: ", err);
    });
    setOldEvent(null);
    setNewEvent(emptyEvent);

    // delete from project_ext coll
    const extDocRef = doc(db, "events_ext", id);
    const eventExtModRef = deleteDoc(extDocRef).catch((err) => {
      console.log("deleteDoc() error: ", err);
    });

    await eventModRef;
    await eventExtModRef;

    showAlert(
      "success",
      `"${newEvent.title}" is deleted sucessfully! Navigate to Events page.`
    );

    setTimeout(() => {
      router.push(`/events`);
    }, 2000); // wait 2 seconds then go to `projects` page
  };

  const handleDateTimeChange = (e) => {
    setNewEvent({ ...newEvent, starting_date: e?._d });
  };

  const formRef = useRef();

  return (
    <Grid
      container
      spacing={0}
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ backgroundColor: "#fafafa" }}
    >
      <Grid
        item
        xs={8}
        sx={{
          backgroundColor: "#ffffff",
          borderLeft: 1.5,
          borderRight: 1.5,
          borderColor: "#dbdbdb",
          paddingX: 3,
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Typography
          sx={{
            display: "flex",
            justifyContent: "center",
            fontSize: "2em",
            fontWeight: "bold",
            mt: 6,
            mb: 6,
          }}
        >
          {isCreate ? "Create New Event" : "Update Event"}
        </Typography>
        <form ref={formRef}>
          {/* Title textfield & Upload logo button */}
          <Box display="flex" justifyContent="space-between" alignItems="start">
            <StyledTextField
              required
              fullWidth
              sx={{
                mr: 5,
              }}
              label="Event Title"
              margin="none"
              inputProps={{
                maxLength: 50,
              }}
              // helperText="The name of your newEvent (limit: 50)"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
            />
            <Button
              sx={{
                backgroundColor: "#f0f0f0",
                border: 1.5,
                borderRadius: "10px",
                borderColor: "#dbdbdb",
                color: "rgba(0, 0, 0, 0.6)",

                height: "56px",
                textTransform: "none",
                width: "30%",
                paddingLeft: "30px",
              }}
              // variant="contained"
              disableElevation
              onClick={handleDialogOpen}
            >
              <UploadFileIcon sx={{ position: "absolute", left: "5%" }} />
              <Typography>{"Upload Logo"}</Typography>
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
                  {
                    "Please enter the URL of your icon here. Imgur is a good image hosting service to start with."
                  }
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
          {/* Category select & starting date*/}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={5}
          >
            <FormControl
              required
              fullWidth
              sx={{
                mr: 5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
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
                <MenuItem value={"Community Event"}>Community Event</MenuItem>
                <MenuItem value={"Concert"}>Concert</MenuItem>
                <MenuItem value={"Conference"}>Conference</MenuItem>
                <MenuItem value={"Expo"}>Expo</MenuItem>
                <MenuItem value={"Festival"}>Festival</MenuItem>
                <MenuItem value={"Performance"}>Performance</MenuItem>
                <MenuItem value={"Sports"}>Sports</MenuItem>
              </Select>
              <FormHelperText
                id="ec-category-helper-text"
                sx={{ color: "lightgray", fontSize: "12px" }}
              >
                {"A general category of your event"}
              </FormHelperText>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DesktopDateTimePicker
                renderInput={(props) => (
                  <StyledTextField
                    sx={{ width: "60%" }}
                    helperText="Starting date and time"
                    {...props}
                  />
                )}
                // label="Starting Date"
                value={newEvent.starting_date}
                onChange={(e) => {
                  handleDateTimeChange(e);
                }}
              />
            </LocalizationProvider>
          </Box>
          {/* Location */}
          {/* !todo: can use some services like google places or leaflet to autocomplete */}
          <StyledTextField
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
          <StyledTextField
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
          <StyledTextField
            sx={{
              mt: 5,
            }}
            fullWidth
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
          <StyledTextField
            sx={{
              mt: 5,
              mb: 2.5,
            }}
            required
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
          <Divider sx={{ borderBottomWidth: 1.5, borderColor: "#dbdbdb" }} />

          {/* application form */}
          <Container
            sx={{
              mt: 2.5,
              mx: 0,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
            disableGutters
          >
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
            <StyledTextField
              sx={{
                mt: 2.5,
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
                  borderRadius: "30px",
                  backgroundColor: "#3e95c2",
                  textTransform: "none",
                  paddingX: 5,
                }}
                variant="contained"
                disableElevation
                onClick={(e) => handleDelete(newEvent.id, e)}
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
                borderRadius: "30px",
                backgroundColor: "#fafafa",
                color: "black",
                textTransform: "none",
                paddingX: 5,
              }}
              variant="contained"
              disableElevation
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
                borderRadius: "30px",
                backgroundColor: "#3e95c2",
                textTransform: "none",
                paddingX: 5,
              }}
              variant="contained"
              disableElevation
              disabled={!isClickable}
              onClick={(e) => handleSubmit(e)}
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

// !todo: notchedOuline not working
const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#f0f0f0",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderWidth: 1.5,
    borderColor: "#dbdbdb",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderWidth: 1.5,
    borderColor: "#dbdbdb !important",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderWidth: 1.5,
    borderColor: "#3e95c2 !important",
  },
  "& .MuiFormHelperText-root": {
    color: "lightgray",
    fontSize: "12px",
  },
}));
