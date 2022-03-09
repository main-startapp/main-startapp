import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
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
} from "firebase/firestore";
import { useContext, useRef, useState } from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import { useAuth } from "../Context/AuthContext";
import { ProjectContext } from "../Context/ProjectContext";

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

  // states
  // project state lazy initialization
  // https://stackoverflow.com/questions/68945060/react-make-usestate-initial-value-conditional
  const [project, setProject] = useState(() =>
    isUpdate
      ? {
          title: inProject.title,
          description: inProject.description,
          detail: inProject.detail,
          max_member: inProject.max_member,
          creator_email: inProject.creator_email,
          creator_uid: inProject.creator_uid,
          current_member: inProject.current_member,
          create_timestamp: inProject.create_timestamp,
        }
      : {
          title: "",
          description: "",
          detail: "",
          max_member: "",
          creator_email: currentUser.email,
          creator_uid: currentUser.uid,
          current_member: 1,
        }
  );
  const [doneFlag, setDoneFlag] = useState(false);
  const emptyPositionField = {
    positionName: "",
    positionResp: "",
    positionWeeklyHour: "",
    positionUID: "", // !todo: maybe a list?
  };

  const [positionFields, setPositionFields] = useState(() =>
    isUpdate ? inProject.position_list : [emptyPositionField]
  );

  const onSubmit = async (e) => {
    if (formRef.current.reportValidity()) {
      e.stopPropagation();
      if (isUpdate) {
        const docRef = doc(db, "projects", inProject.id);
        const projectRef = {
          ...project,
          position_list: positionFields,
          last_timestamp: serverTimestamp(),
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
          position_list: positionFields,
          create_timestamp: serverTimestamp(),
          last_timestamp: serverTimestamp(),
        };
        const docRef = await addDoc(collectionRef, projectRef);
        showAlert(
          "success",
          `"${project.title}" is added successfully!` // success -> green
        );
      }
      setProject({ title: "", description: "", detail: "", max_member: "" });
      setPositionFields([emptyPositionField]);
      setDoneFlag(true);
    }
  };

  const handleGoBack = async (e) => {
    e.stopPropagation();
    router.push(`/`);
  };

  const handleDeleteProj = async (id, e) => {
    e.stopPropagation();
    const docRef = doc(db, "projects", id);
    await deleteDoc(docRef);
    showAlert("error", `"${project.title}" is deleted sucessfully!`); // error -> red
    setProject({ title: "", description: "", detail: "", max_member: "" });
    setPositionFields([emptyPositionField]);
    setDoneFlag(true);
  };

  const handleChangePosInput = (index, e) => {
    const pFields = [...positionFields];
    pFields[index][e.target.name] = e.target.value;
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

  const formRef = useRef();

  return (
    <Grid container spacing={0} justifyContent="center">
      <Grid item xs={6}>
        <form ref={formRef}>
          <TextField
            sx={{ mt: 5 }}
            fullWidth
            required
            label="Title"
            margin="none"
            inputProps={{
              maxLength: 50,
            }}
            helperText="Project title is required (char limit: 50)"
            value={project.title}
            onChange={(e) => setProject({ ...project, title: e.target.value })}
          />
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
            helperText="Short description (char limit: 200)"
            value={project.description}
            onChange={(e) =>
              setProject({ ...project, description: e.target.value })
            }
          />
          <TextField
            sx={{ mt: 5 }}
            fullWidth
            label="Detail"
            margin="none"
            multiline
            minRows={2}
            maxRows={8}
            helperText="Project details (e.g., scope, potential member requirement, contact info)"
            value={project.detail}
            onChange={(e) => setProject({ ...project, detail: e.target.value })}
          />
          <TextField
            sx={{ mt: 5 }}
            fullWidth
            required
            label="Max Team Members"
            margin="none"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            helperText="Positive integer"
            value={project.max_member}
            onChange={(e) =>
              e.target.value < 1
                ? setProject({ ...project, max_member: 1 })
                : setProject({ ...project, max_member: e.target.value })
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
                  <TextField
                    sx={{ mr: 2.5 }}
                    fullWidth
                    margin="none"
                    name="positionName"
                    label="Position Name"
                    value={positionField.positionName}
                    onChange={(e) => {
                      handleChangePosInput(index, e);
                    }}
                  />
                  <TextField
                    sx={{ mr: 2.5 }}
                    fullWidth
                    margin="none"
                    type="number"
                    name="positionWeeklyHour"
                    label="Weekly Hour"
                    value={positionField.positionWeeklyHour}
                    onChange={(e) => {
                      handleChangePosInput(index, e);
                    }}
                  />
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
                style={{ background: "#6fa8dc" }}
                onClick={(e) => handleDeleteProj(inProject.id, e)}
              >
                {"Delete"}
              </Button>
            )}
            <Box sx={{ flexGrow: 1 }} />
            {!doneFlag && (
              <Button
                sx={{ mt: 5 }}
                variant="contained"
                disableElevation
                style={{ background: "#6fa8dc" }}
                onClick={(e) => onSubmit(e)}
              >
                {isUpdate ? "Update" : "Submit"}
              </Button>
            )}
            {doneFlag && (
              <Button
                sx={{ mt: 5 }}
                variant="contained"
                disableElevation
                style={{ background: "#6fa8dc" }}
                onClick={(e) => handleGoBack(e)}
              >
                {"Go Back"}
              </Button>
            )}
          </Box>
        </form>
      </Grid>
    </Grid>
  );
};

export default ProjectCreate;
