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
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
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
  setDoc,
} from "firebase/firestore";
import { useContext, useRef, useState } from "react";
import { db } from "../../firebase";
import { GlobalContext, ProjectContext } from "../Context/ShareContexts";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { useRouter } from "next/router";

const ProjectCreate = (props) => {
  // context
  const { currentStudent, oldProject, setOldProject } =
    useContext(GlobalContext);
  const currentUID = currentStudent?.uid;

  const { showAlert } = useContext(ProjectContext);

  // props from push query
  const isCreate = props.isCreateStr === "false" ? false : true; // null, undefined, "true" are all true isCreate

  // router
  const router = useRouter();

  // local vars
  // Project State Initialization.
  // https://stackoverflow.com/questions/68945060/react-make-usestate-initial-value-conditional

  const emptyProject = {
    title: "",
    category: "",
    completion_date: moment().toDate(),
    details: "",
    description: "",
    creator_uid: currentUID,
    isVisible: true,
    icon_url: "",
    application_form_url: "",
  };
  const [newProject, setNewProject] = useState(() =>
    isCreate ? emptyProject : oldProject
  );

  const [isClickable, setIsClickable] = useState(true); // button state to prevent click spam

  const emptyPositionField = {
    positionID: Math.random().toString(16).slice(2),
    positionTitle: "",
    positionResp: "",
    positionWeeklyHour: 1,
    positionCount: 1,
  };
  const [positionFields, setPositionFields] = useState(() =>
    isCreate ? [emptyPositionField] : oldProject.position_list
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
  const [isChecked, setIsChecked] = useState(false);

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
    let retID;
    await projectModRef.then((ret) => {
      retID = ret?.id;
    });

    // retID: create; !retID: update
    if (retID) {
      // add to my_projects in student data if create
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

      // create extension doc for team management if create
      const extDocRef = doc(db, "projects_ext", retID);
      const projectExtRef = {
        members: [currentUID],
        admins: [currentUID],
        last_timestamp: serverTimestamp(),
      };
      const projectExtModRef = setDoc(extDocRef, projectExtRef).catch((err) => {
        console.log("setDoc() error: ", err);
      });

      await curStudentModRef;
      await projectExtModRef;
    }

    // !todo: since updateDoc return Promise<void>, we need other method to check the results
    showAlert(
      "success",
      `"${newProject.title}" is updated successfully! Navigate to Projects page.`
    );

    setTimeout(() => {
      router.push(`/`); // can be customized
    }, 2000); // wait 2 seconds then go to `projects` page
  };

  const handleDiscard = async () => {
    setOldProject(null);
    setNewProject(emptyProject);
    setPositionFields([emptyPositionField]);

    showAlert("info", `Draft discarded! Navigate to Projects page.`);
    setTimeout(() => {
      router.push(`/`); // can be customized
    }, 2000); // wait 2 seconds then go to `projects` page
  };

  const handleDelete = async (id, e) => {
    const docRef = doc(db, "projects", id);
    const projectModRef = deleteDoc(docRef).catch((err) => {
      console.log("deleteDoc() error: ", err);
    });
    setOldProject(null);
    setNewProject(emptyProject);
    setPositionFields([emptyPositionField]);

    // delete project ref from my_projects in student doc
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

    // delete from project_ext coll
    const extDocRef = doc(db, "projects_ext", id);
    const projectExtModRef = deleteDoc(extDocRef).catch((err) => {
      console.log("deleteDoc() error: ", err);
    });

    await projectModRef;
    await curStudentModRef;
    await projectExtModRef;

    showAlert(
      "success",
      `"${newProject.title}" is deleted sucessfully! Navigate to Projects page.`
    );

    setTimeout(() => {
      router.push(`/`); // can be customized
    }, 2000); // wait 2 seconds then go to `projects` page
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
          {isCreate ? "Create New Project" : "Update Project"}
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
              label="Project Title"
              margin="none"
              inputProps={{
                maxLength: 50,
              }}
              // helperText="The name of your newProject (limit: 50)"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
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
                width: "20%",
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
                  value={newProject.icon_url}
                  onChange={(e) =>
                    setNewProject({ ...newProject, icon_url: e.target.value })
                  }
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose}>Confirm</Button>
              </DialogActions>
            </Dialog>
          </Box>
          {/* Category select & completion date*/}
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
                value={newProject.category}
                onChange={(e) =>
                  setNewProject({ ...newProject, category: e.target.value })
                }
              >
                <MenuItem value={"Startup"}>Startup</MenuItem>
                <MenuItem value={"Learning Project"}>Learning Project</MenuItem>
                <MenuItem value={"Charity Initiative"}>
                  Charity Initiative
                </MenuItem>
                <MenuItem value={"Fun Project"}>Fun Project</MenuItem>
              </Select>
              <FormHelperText
                id="pc-category-helper-text"
                sx={{ color: "lightgray", fontSize: "12px" }}
              >
                {"A general category of your project"}
              </FormHelperText>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DesktopDatePicker
                renderInput={(props) => (
                  <StyledTextField
                    sx={{ width: "25%" }}
                    helperText="Completion date"
                    {...props}
                  />
                )}
                // label="Completion Date"
                value={newProject.completion_date}
                onChange={(e) => {
                  handleDateTimeChange(e);
                }}
              />
            </LocalizationProvider>
          </Box>
          {/* Details */}
          <StyledTextField
            sx={{
              mt: 5,
            }}
            fullWidth
            label="Details"
            margin="none"
            // multiline
            // minRows={2}
            // maxRows={8}
            helperText="Keywords to shortly describe the new project seperated by commas (e.g. tags)"
            value={newProject.details}
            onChange={(e) =>
              setNewProject({ ...newProject, details: e.target.value })
            }
          />
          {/* Description */}
          <StyledTextField
            sx={{
              mt: 5,
              mb: 2.5,
            }}
            fullWidth
            label="Description"
            margin="none"
            multiline
            minRows={4}
            maxRows={8}
            // inputProps={{
            //   maxLength: 200,
            // }}
            helperText="A brief description of the new project (e.g. scope, mission, work format, timeline)"
            value={newProject.description}
            onChange={(e) =>
              setNewProject({ ...newProject, description: e.target.value })
            }
          />
          {/* firebase dynamic array: http://y2u.be/zgKH12s_95A */}
          {positionFields.map((positionField, index) => {
            return (
              <div key={index}>
                <Divider
                  sx={{
                    mt: 2.5,
                    borderBottomWidth: 1.5,
                    borderColor: "#dbdbdb",
                  }}
                />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={2.5}
                >
                  {/* Title */}
                  <StyledTextField
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
                  <StyledTextField
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
                  <StyledTextField
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
                    <IconButton
                      sx={{ ml: 2.5, backgroundColor: "#f0f0f0" }}
                      onClick={() => handleRemovePosField(index)}
                    >
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
                  <StyledTextField
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
                    <IconButton
                      sx={{ ml: 2.5, backgroundColor: "#f0f0f0" }}
                      onClick={() => handleAddPosField()}
                    >
                      <AddRoundedIcon />
                    </IconButton>
                  )}
                </Box>
              </div>
            );
          })}
          {/* application form */}
          <Container
            sx={{
              mt: 2.5,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
            disableGutters
          >
            <Checkbox
              sx={{ mr: 1.5, color: "#dbdbdb", padding: 0 }}
              value={isChecked}
              onChange={() => {
                if (isChecked) {
                  setNewProject({ ...newProject, application_form_url: "" });
                }
                setIsChecked(!isChecked);
              }}
            />
            <Typography sx={{ color: "rgba(0,0,0,0.6)" }}>
              {"I want to add my own application form"}
            </Typography>
          </Container>
          {isChecked && (
            <StyledTextField
              sx={{
                mt: 2.5,
              }}
              required
              fullWidth
              label="Application Form URL"
              type="url"
              margin="none"
              value={newProject.application_form_url}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  application_form_url: e.target.value,
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
                onClick={(e) => handleDelete(newProject.id, e)}
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

export default ProjectCreate;

// border is not working but borderWidth is
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
