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
import { useAuth } from "../Context/AuthContext";
import { ProjectContext } from "../Context/ProjectContext";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterMoment from "@mui/lab/AdapterMoment";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";

const ProjectCreate = (projProps) => {
  // context
  const router = useRouter();
  const { currentUser } = useAuth();
  const { showAlert } = useContext(ProjectContext);

  // get the projProps argument
  let inProject;
  try {
    inProject = JSON.parse(projProps.projString);
  } catch (e) {
    console.log("Project props parsing error.");
  }
  const isUpdate = inProject !== null && inProject !== undefined;

  console.log();

  // Project State Lazy Initialization
  // https://stackoverflow.com/questions/68945060/react-make-usestate-initial-value-conditional
  const [project, setProject] = useState(() =>
    isUpdate
      ? {
          title: inProject.title,
          category: inProject.category,
          completion_date: inProject.completion_date,
          description: inProject.description,
          detail: inProject.detail,
          create_timestamp: inProject.create_timestamp,
          creator_email: inProject.creator_email,
          creator_uid: inProject.creator_uid,
          cur_member_count: inProject.cur_member_count,
        }
      : {
          title: "",
          category: "",
          completion_date: "",
          description: "",
          detail: "",
          creator_email: currentUser.email,
          creator_uid: currentUser.uid,
          cur_member_count: 1,
        }
  );
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
    isUpdate ? inProject.position_list : [emptyPositionField]
  );

  const handleSubmit = async (e) => {
    if (formRef.current.reportValidity()) {
      e.stopPropagation();
      // calucalte the max members
      let maxMemberCount = 0;
      positionFields.forEach(
        (position) => (maxMemberCount += position.positionCount)
      );
      if (isUpdate) {
        const docRef = doc(db, "projects", inProject.id);
        const projectRef = {
          ...project,
          // update max num of members
          max_member_count: maxMemberCount,
          position_list: positionFields,
          // update timestamp
          create_timestamp: new Timestamp(
            project.create_timestamp.seconds,
            project.create_timestamp.nanoseconds
          ),
          last_timestamp: serverTimestamp(),
          // completion_date: new Timestamp(
          //   project.completion_date.seconds,
          //   project.completion_date.nanoseconds
          // ),
        };
        await updateDoc(docRef, projectRef);
        showAlert(
          "success",
          `"${project.title}" is updated successfully!` // success -> green
        );
      } else {
        const collectionRef = collection(db, "projects");
        const projectRef = {
          ...project,
          // update max num of members
          max_member_count: maxMemberCount,
          position_list: positionFields,
          // create timestamp
          create_timestamp: serverTimestamp(),
          last_timestamp: serverTimestamp(),
        };
        const docRef = await addDoc(collectionRef, projectRef);
        showAlert(
          "success",
          `"${project.title}" is added successfully!` // success -> green
        );
      }
      setProject({
        // only the fields on the screen
        title: "",
        category: "",
        completion_date: "",
        description: "",
        detail: "",
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
    await deleteDoc(docRef);
    showAlert("error", `"${project.title}" is deleted sucessfully!`); // error -> red
    setProject({
      title: "",
      category: "",
      completion_date: "",
      description: "",
      detail: "",
    });
    setPositionFields([emptyPositionField]);
    setDoneFlag(true);
  };

  const handleChangePosInput = (index, e) => {
    const pFields = [...positionFields];
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

  // console logs if there's any

  return (
    <Grid container spacing={0} justifyContent="center">
      <Grid item xs={6}>
        <form ref={formRef}>
          {/* Title textfield */}
          <TextField
            sx={{ mt: 5 }}
            fullWidth
            required
            label="Project Title"
            margin="none"
            inputProps={{
              maxLength: 50,
            }}
            helperText="The name of your project (limit: 50)"
            value={project.title}
            onChange={(e) => setProject({ ...project, title: e.target.value })}
          />
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={5}
          >
            {/* Category select */}
            <FormControl fullWidth sx={{ mr: 5 }}>
              <InputLabel>Category</InputLabel>
              <Select
                required
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
            {/* Completion date */}
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
          {/* Short description */}
          <TextField
            sx={{ mt: 5 }}
            fullWidth
            label="Description"
            margin="none"
            multiline
            minRows={2}
            maxRows={4}
            inputProps={{
              maxLength: 200,
            }}
            helperText="A brief description of your project (limit: 200)"
            value={project.description}
            onChange={(e) =>
              setProject({ ...project, description: e.target.value })
            }
          />
          {/* Full details */}
          <TextField
            sx={{ mt: 5 }}
            fullWidth
            label="Details"
            margin="none"
            multiline
            minRows={2}
            maxRows={8}
            helperText="Project details (e.g., scope, mission, general work fomat, self/team description)"
            value={project.detail}
            onChange={(e) => setProject({ ...project, detail: e.target.value })}
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
                    sx={{ mr: 2.5 }}
                    margin="none"
                    type="number"
                    name="positionCount" // has to be the same as key
                    label="NO. of People"
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
            {isUpdate && (
              <Button
                sx={{ mt: 5 }}
                variant="contained"
                disableElevation
                style={{ background: "#3e95c2" }}
                onClick={(e) => handleDeleteProj(inProject.id, e)}
              >
                {"Delete"}
              </Button>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Button
              sx={{ mt: 5, mr: 5 }}
              variant="contained"
              disableElevation
              style={{ background: "#3e95c2" }}
              onClick={(e) => handleGoBack(e)}
            >
              {"Go Back"}
            </Button>
            {!doneFlag && (
              <Button
                sx={{ mt: 5 }}
                variant="contained"
                disableElevation
                style={{ background: "#3e95c2" }}
                onClick={(e) => handleSubmit(e)}
              >
                {isUpdate ? "Update" : "Submit"}
              </Button>
            )}
          </Box>
        </form>
      </Grid>
    </Grid>
  );
};

export default ProjectCreate;
