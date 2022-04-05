import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import DoDisturbAltRoundedIcon from "@mui/icons-material/DoDisturbAltRounded";
import {
  collection,
  doc,
  addDoc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { useContext, useRef, useState } from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import { ProjectContext } from "../Context/ShareContexts";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterMoment from "@mui/lab/AdapterMoment";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import moment from "moment";
import { useAuth } from "../Context/AuthContext";

const ProjectCreate = (props) => {
  const router = useRouter();
  const { currentUser } = useAuth();

  // context
  const { showAlert } = useContext(ProjectContext);

  // get the props
  const isCreate = props.isCreateStr === "false" ? false : true; // null, undefined, "true" are all true isCreate

  let argProject;
  if (!isCreate) {
    try {
      argProject = JSON.parse(props.projectStr);
    } catch (e) {
      console.log("ERROR: ProjectCreate should get a stringified project!");
      isCreate = true; // nothing to update, force the isCreate to be true
    }
  }

  // Project State Initialization. !todo: it will be much easier if we can share the state between pages
  // instead of passing stringified project state.
  // https://stackoverflow.com/questions/68945060/react-make-usestate-initial-value-conditional
  const [project, setProject] = useState(() =>
    isCreate
      ? {
          title: "",
          category: "",
          completion_date: moment(),
          details: "",
          description: "",
          creator_email: currentUser.email,
          creator_uid: currentUser.uid,
          cur_member_count: 1,
        }
      : {
          ...argProject,
        }
  );

  // convert to timestamp obj if isUpdate and the format has not been converted yet
  if (
    !isCreate &&
    project.create_timestamp?.seconds &&
    project.completion_date?.seconds // the format must contain seconds, nanoseconds is optional (0)
  ) {
    const newCreateTimestamp = new Timestamp(
      project.create_timestamp.seconds,
      project.create_timestamp.nanoseconds
    );
    const newCompletionDate = new Timestamp(
      project.completion_date.seconds,
      project.completion_date.nanoseconds
    );
    setProject({
      ...project,
      create_timestamp: newCreateTimestamp.toDate(),
      completion_date: newCompletionDate.toDate(),
    });
  }

  // state to remove submit and update buttons
  const [doneFlag, setDoneFlag] = useState(false);

  const emptyPositionField = {
    positionTitle: "",
    positionResp: "",
    positionWeeklyHour: 1,
    positionCount: 1,
    positionRequestUID: [],
    positionAcceptUID: [], // < or = positionCount
  };
  const [positionFields, setPositionFields] = useState(() =>
    isCreate ? [emptyPositionField] : argProject.position_list
  );

  // helper functions
  const handleSubmit = async (e) => {
    if (formRef.current.reportValidity()) {
      e.stopPropagation();
      // calucalte the max members
      let maxMemberCount = project.cur_member_count;
      positionFields.forEach(
        (position) => (maxMemberCount += position.positionCount)
      );
      if (isCreate) {
        // create a new project
        const collectionRef = collection(db, "projects");
        const projectRef = {
          ...project,
          // update max num of members
          max_member_count: maxMemberCount,
          position_list: positionFields,
          create_timestamp: serverTimestamp(),
          last_timestamp: serverTimestamp(),
        };
        const docRef = await addDoc(collectionRef, projectRef).catch((err) => {
          console.log("addDoc() error: ", err);
        });
        showAlert(
          "success",
          `"${project.title}" is added successfully!` // success -> green
        );
      } else {
        // update an existing project
        const docRef = doc(db, "projects", argProject.id);
        const projectRef = {
          ...project,
          // update max num of members
          max_member_count: maxMemberCount,
          position_list: positionFields,
          last_timestamp: serverTimestamp(),
        };
        await updateDoc(docRef, projectRef).catch((err) => {
          console.log("updateDoc() error: ", err);
        });
        showAlert(
          "success",
          `"${project.title}" is updated successfully!` // success -> green
        );
      }
      setProject({
        // only the fields on the screen
        title: "",
        cur_member_count: "",
        category: "",
        completion_date: moment(0),
        details: "",
        description: "",
      });
      setPositionFields([emptyPositionField]);
      setDoneFlag(true);
    }
  };

  const handleGoBack = async (e) => {
    e.stopPropagation();
    router.push(`/`);
  };

  const handleDeleteProj = async (id, e) => {
    const docRef = doc(db, "projects", id);
    await deleteDoc(docRef).catch((err) => {
      console.log("deleteDoc() error: ", err);
    });
    showAlert("error", `"${project.title}" is deleted sucessfully!`); // error -> red
    setProject({
      title: "",
      cur_member_count: "",
      category: "",
      completion_date: moment(0),
      details: "",
      description: "",
    });
    setPositionFields([emptyPositionField]);
    setDoneFlag(true);
  };

  const handleChangePosInput = (index, e) => {
    let pFields = [...positionFields];
    let fieldValue =
      e.target.name === "positionWeeklyHour" ||
      e.target.name === "positionCount"
        ? Number(e.target.value)
        : e.target.value;
    pFields[index][e.target.name] = fieldValue;
    setPositionFields(pFields);
  };

  const handleAddPosField = () => {
    setPositionFields([...positionFields, emptyPositionField]);
  };

  const handleRemovePosField = (index) => {
    const pFields = [...positionFields];
    pFields.splice(index, 1);
    setPositionFields(pFields);
  };

  const handleDateTimeChange = (e) => {
    setProject({ ...project, completion_date: e?._d });
  };

  const formRef = useRef();

  // debugging console logs if there's any

  return (
    <Grid
      container
      spacing={0}
      direction="row"
      alignItems="center"
      justifyContent="center"
    >
      <Grid item xs={8}>
        <form ref={formRef}>
          {/* Title textfield & Current team size */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={5}
          >
            <TextField
              required
              sx={{ mr: 5, width: "75%" }}
              label="Project Title"
              margin="none"
              inputProps={{
                maxLength: 50,
              }}
              helperText="The name of your project (limit: 50)"
              value={project.title}
              onChange={(e) =>
                setProject({ ...project, title: e.target.value })
              }
            />
            <TextField
              required
              sx={{ width: "25%" }}
              margin="none"
              type="number"
              label="Current Team Size"
              inputProps={{
                min: 1,
              }}
              helperText="Including the creator"
              value={project.cur_member_count}
              onChange={(e) => {
                setProject({
                  ...project,
                  cur_member_count: Number(e.target.value),
                });
              }}
            />
          </Box>
          {/* Category select & completion date*/}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={5}
          >
            <FormControl required sx={{ mr: 5, width: "75%" }}>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                value={project.category}
                onChange={(e) =>
                  setProject({ ...project, category: e.target.value })
                }
              >
                <MenuItem value={"Startup"}>Startup</MenuItem>
                <MenuItem value={"PersonalProject"}>Personal Project</MenuItem>
                <MenuItem value={"Event"}>Event</MenuItem>
                <MenuItem value={"CharityInitiative"}>
                  Charity Initiative
                </MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ width: "25%" }}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DesktopDatePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="Completion Date"
                  value={project.completion_date}
                  onChange={(e) => {
                    handleDateTimeChange(e);
                  }}
                />
              </LocalizationProvider>
            </Box>
          </Box>
          {/* Details */}
          <TextField
            sx={{ mt: 5 }}
            fullWidth
            label="Details"
            margin="none"
            // multiline
            // minRows={2}
            // maxRows={8}
            helperText="Descriptive project details separated by commas (e.g., tags, keywords)"
            value={project.detail}
            onChange={(e) => setProject({ ...project, detail: e.target.value })}
          />
          {/* Description */}
          <TextField
            sx={{ mt: 5 }}
            fullWidth
            label="Description"
            margin="none"
            multiline
            minRows={4}
            maxRows={8}
            // inputProps={{
            //   maxLength: 200,
            // }}
            helperText="A brief description of the project (e.g., scope, mission, work format, self/team introduction)"
            value={project.description}
            onChange={(e) =>
              setProject({ ...project, description: e.target.value })
            }
          />
          {/* firebase dynamic array: http://y2u.be/zgKH12s_95A */}
          {positionFields.map((positionField, index) => {
            return (
              <div key={index}>
                <Divider sx={{ mt: 5 }} />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={5}
                >
                  {/* Title */}
                  <TextField
                    required
                    sx={{ mr: 2.5 }}
                    fullWidth
                    margin="none"
                    name="positionTitle" // has to be the same as key
                    label="Position Title"
                    value={positionField.positionTitle}
                    onChange={(e) => {
                      handleChangePosInput(index, e);
                    }}
                  />
                  {/* Weekly hour */}
                  <TextField
                    required
                    sx={{ mr: 2.5 }}
                    margin="none"
                    type="number"
                    name="positionWeeklyHour" // has to be the same as key
                    label="Weekly Hour"
                    value={positionField.positionWeeklyHour}
                    onChange={(e) => {
                      handleChangePosInput(index, e);
                    }}
                  />
                  {/* Number of people */}
                  <TextField
                    required
                    sx={{ mr: 2.5 }}
                    margin="none"
                    type="number"
                    name="positionCount" // has to be the same as key
                    label="NO. of People"
                    inputProps={{
                      min: 1,
                    }}
                    value={positionField.positionCount}
                    onChange={(e) => {
                      handleChangePosInput(index, e);
                    }}
                  />
                  {/* Add / Remove position button */}
                  {index == 0 && (
                    <IconButton disabled>
                      <DoDisturbAltRoundedIcon />
                    </IconButton>
                  )}
                  {index > 0 && (
                    <IconButton onClick={() => handleRemovePosField(index)}>
                      <RemoveRoundedIcon />
                    </IconButton>
                  )}
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={2.5}
                >
                  {/* Responsibilities */}
                  <TextField
                    sx={{ mr: 2.5 }}
                    fullWidth
                    multiline
                    minRows={2}
                    maxRows={8}
                    margin="none"
                    name="positionResp"
                    label="Responsibilities"
                    value={positionField.positionResp}
                    onChange={(e) => {
                      handleChangePosInput(index, e);
                    }}
                  />
                  <IconButton onClick={() => handleAddPosField()}>
                    <AddRoundedIcon />
                  </IconButton>
                </Box>
              </div>
            );
          })}
          {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {!isCreate && !doneFlag && (
              <Button
                sx={{ mt: 5 }}
                variant="contained"
                disableElevation
                style={{ background: "#3e95c2" }}
                onClick={(e) => handleDeleteProj(argProject.id, e)}
              >
                {"Delete"}
              </Button>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Button
              sx={{ mt: 5 }}
              variant="contained"
              disableElevation
              style={{ background: "#3e95c2" }}
              onClick={(e) => handleGoBack(e)}
            >
              {"Go Back"}
            </Button>
            {!doneFlag && (
              <Button
                sx={{ mt: 5, ml: 5 }}
                variant="contained"
                disableElevation
                style={{ background: "#3e95c2" }}
                onClick={(e) => handleSubmit(e)}
              >
                {isCreate ? "Submit" : "Update"}
              </Button>
            )}
          </Box>
        </form>
      </Grid>
    </Grid>
  );
};

export default ProjectCreate;
