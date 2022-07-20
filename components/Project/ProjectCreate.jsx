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
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import UploadFileIcon from "@mui/icons-material/UploadFile";
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
import { db } from "../../firebase";
import { GlobalContext, ProjectContext } from "../Context/ShareContexts";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterMoment from "@mui/lab/AdapterMoment";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import moment from "moment";

const ProjectCreate = (props) => {
  // context
  const { currentStudent, oldProject, setOldProject } =
    useContext(GlobalContext);
  const currentUID = currentStudent?.uid;

  const { showAlert } = useContext(ProjectContext);

  // props from push query
  const isCreate = props.isCreateStr === "false" ? false : true; // null, undefined, "true" are all true isCreate

  // Project State Initialization.
  // https://stackoverflow.com/questions/68945060/react-make-usestate-initial-value-conditional
  const [newProject, setNewProject] = useState(() =>
    isCreate
      ? {
          title: "",
          category: "",
          completion_date: moment().toDate(),
          details: "",
          description: "",
          creator_uid: currentUID,
          isVisible: true,
        }
      : { ...oldProject, completion_date: oldProject.completion_date.toDate() }
  );

  // local vars
  const [doneFlag, setDoneFlag] = useState(false); // state to remove submit and update buttons
  const [isClickable, setIsClickable] = useState(true); // button state to prevent click spam

  /* useEffect(() => {
    if (isClickable) return;

    // isClickable was false, set back to true after 5s delay
    const timeout5s = setTimeout(() => {
      setIsClickable(true);
    }, 5000);

    return () => {
      clearTimeout(timeout5s);
    };
  }, [isClickable]); // reset button in 5s after click */

  const emptyPositionField = {
    positionID: Math.random().toString(16).slice(2),
    positionTitle: "",
    positionResp: "",
    positionWeeklyHour: 1,
    positionCount: 1,
    positionAcceptUID: [], // < or = positionCount
  };
  const [positionFields, setPositionFields] = useState(() =>
    isCreate ? [emptyPositionField] : oldProject.position_list
  );

  // helper functions
  const handleSubmit = async (e) => {
    if (!isClickable) return;
    if (!formRef.current.reportValidity()) return;

    // button is clickable & form is valid
    setIsClickable(false);
    // calucalte the max members
    let maxMemberCount = 1; // creator
    positionFields.forEach(
      (position) => (maxMemberCount += position.positionCount)
    );
    let projectModRef; // ref to addDoc() or updateDoc()
    if (isCreate) {
      // create a new newProject
      const collectionRef = collection(db, "projects");
      const projectRef = {
        ...newProject,
        // update max num of members
        max_member_count: maxMemberCount,
        position_list: positionFields,
        create_timestamp: serverTimestamp(),
        last_timestamp: serverTimestamp(),
      };
      projectModRef = addDoc(collectionRef, projectRef).catch((err) => {
        console.log("addDoc() error: ", err);
      });
    } else {
      // update an existing newProject
      const docRef = doc(db, "projects", newProject.id);
      const projectRef = {
        ...newProject,
        // update max num of members
        max_member_count: maxMemberCount,
        position_list: positionFields,
        last_timestamp: serverTimestamp(),
      };
      delete projectRef.id;
      projectModRef = updateDoc(docRef, projectRef).catch((err) => {
        console.log("updateDoc() error: ", err);
      });
    }
    setOldProject(null);
    setNewProject({
      // only the fields on the screen
      title: "",
      category: "",
      completion_date: moment().toDate(),
      details: "",
      description: "",
    });
    setPositionFields([emptyPositionField]);
    setDoneFlag(true);
    let retID;
    await projectModRef.then((ret) => {
      retID = ret?.id;
    });
    // !todo: since addDoc and updateDoc return Promise<void>, we need other method to check the results
    showAlert(
      "success",
      `"${newProject.title}" is updated successfully!` // success -> green
    );

    // add to my_projects if create
    if (!retID) return; // retID: create; !retID: update
    const curStudentDocRef = doc(db, "students", currentUID);
    const curStudentMyProjects = currentStudent?.my_projects
      ? currentStudent.my_projects
      : [];
    curStudentMyProjects.push(retID);
    const curStudentRef = {
      ...currentStudent,
      my_projects: curStudentMyProjects,
    };
    delete curStudentRef?.uid;
    const curStudentModRef = updateDoc(curStudentDocRef, curStudentRef).catch(
      (err) => {
        console.log("updateDoc() error: ", err);
      }
    );
    await curStudentModRef;
  };

  // const handleGoBack = async (e) => {
  //   e.stopPropagation();
  //   router.push(`/`);
  // };

  const handleDeleteProj = async (id, e) => {
    const docRef = doc(db, "projects", id);
    const projectModRef = deleteDoc(docRef).catch((err) => {
      console.log("deleteDoc() error: ", err);
    });
    setOldProject(null);
    setNewProject({
      title: "",
      category: "",
      completion_date: moment().toDate(),
      details: "",
      description: "",
    });
    setPositionFields([emptyPositionField]);
    setDoneFlag(true);
    await projectModRef;
    showAlert("error", `"${newProject.title}" is deleted sucessfully!`); // error -> red

    // delete from my_projects
    const curStudentDocRef = doc(db, "students", currentUID);
    const curStudentMyProjects = currentStudent.my_projects.filter(
      (my_proj) => my_proj !== id
    );
    const curStudentRef = {
      ...currentStudent,
      my_projects: curStudentMyProjects,
    };
    delete curStudentRef?.uid;
    const curStudentModRef = updateDoc(curStudentDocRef, curStudentRef).catch(
      (err) => {
        console.log("updateDoc() error: ", err);
      }
    );
    await curStudentModRef;
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
    setNewProject({ ...newProject, completion_date: e?._d });
  };

  const formRef = useRef();

  // debugging console logs if there's any
  // console.log(positionFields);

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
          {/* Title textfield & Upload logo button */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="start"
            mt={5}
          >
            <TextField
              required
              fullWidth
              sx={{ mr: 5 }}
              label="Project Title"
              margin="none"
              inputProps={{
                maxLength: 50,
              }}
              helperText="The name of your newProject (limit: 50)"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
            />
            <Button
              sx={{ border: 1, color: "#3e95c2", height: "56px" }}
              // variant="contained"
              disableElevation
              // onClick={(e) => handleUpload(e)}
            >
              <UploadFileIcon />
              {"Upload Logo"}
            </Button>
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
                value={newProject.category}
                onChange={(e) =>
                  setNewProject({ ...newProject, category: e.target.value })
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
                  value={newProject.completion_date}
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
            helperText="Descriptive newProject details separated by commas (e.g., tags, keywords)"
            value={newProject.details}
            onChange={(e) =>
              setNewProject({ ...newProject, details: e.target.value })
            }
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
            helperText="A brief description of the newProject (e.g., scope, mission, work format, self/team introduction)"
            value={newProject.description}
            onChange={(e) =>
              setNewProject({ ...newProject, description: e.target.value })
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
                    inputProps={{
                      min: 1,
                    }}
                    value={positionField.positionWeeklyHour}
                    onChange={(e) => {
                      e.target.value > 1
                        ? e.target.value
                        : (e.target.value = 1);
                      handleChangePosInput(index, e);
                    }}
                  />
                  {/* Number of people */}
                  <TextField
                    required
                    margin="none"
                    type="number"
                    name="positionCount" // has to be the same as key
                    label="NO. of People"
                    inputProps={{
                      min: 1,
                    }}
                    value={positionField.positionCount}
                    onChange={(e) => {
                      e.target.value > 1
                        ? e.target.value
                        : (e.target.value = 1);
                      handleChangePosInput(index, e);
                    }}
                  />
                  {/* Add / Remove position button */}

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
                  {index === positionFields.length - 1 && (
                    <IconButton onClick={() => handleAddPosField()}>
                      <AddRoundedIcon />
                    </IconButton>
                  )}
                </Box>
              </div>
            );
          })}
          {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {!isCreate && !doneFlag && (
              <Button
                sx={{ mt: 5, mb: 5, backgroundColor: "#3e95c2" }}
                variant="contained"
                disableElevation
                onClick={(e) => handleDeleteProj(newProject.id, e)}
              >
                {"Delete"}
              </Button>
            )}
            <Box sx={{ flexGrow: 1 }} />
            {/* <Button
              sx={{ mt: 5, mb: 5, backgroundColor: "#3e95c2" }}
              variant="contained"
              disableElevation
              onClick={(e) => handleGoBack(e)}
            >
              {"Go Back"}
            </Button> */}
            {!doneFlag && (
              <Button
                sx={{ mt: 5, ml: 2.5, mb: 5, backgroundColor: "#3e95c2" }}
                variant="contained"
                disableElevation
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
