import { Button, TextField } from "@mui/material";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../pages/AuthContext";
import { ProjectContext } from "../pages/ProjectContext";

// !todo: the form should be move to its own page
const ProjectForm = () => {
  // context
  const { showAlert, project, setProject } = useContext(ProjectContext);
  // current user
  const { currentUser } = useAuth();
  // detect if the user click outside of input field
  const inputAreaRef = useRef();
  // useEffect(() => {
  //   const checkIfClickOutside = (e) => {
  //     if (!inputAreaRef.current.contains(e.target)) {
  //       console.log(`Outside input area`);
  //       setProject({ title: "", description: "", detail: "", max_member: "" });
  //     } else {
  //       console.log(`Inside input area`);
  //     }
  //   };
  //   document.addEventListener("mousedown", checkIfClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", checkIfClickOutside);
  //   };
  // }, [setProject]);
  // function when click Create or Update button
  const onSubmit = async () => {
    if (project?.hasOwnProperty("last_timestamp")) {
      // to Update
      const docRef = doc(db, "projects", project.id);
      const projectRef = {
        ...project,
        last_timestamp: serverTimestamp(),
      };
      updateDoc(docRef, projectRef);
      showAlert(
        "info",
        `Project with id ${project.id} is updated successfully!` // info -> y
      );
    } else {
      // to Create
      const collectionRef = collection(db, "projects");
      const projectRef = {
        ...project,
        create_timestamp: serverTimestamp(),
        last_timestamp: serverTimestamp(),
        creator_email: currentUser.email,
        current_member: 1,
      };
      const docRef = await addDoc(collectionRef, projectRef);
      showAlert(
        "success",
        `Project with id ${docRef.id} is added successfully!` // success -> green
      );
    }
    setProject({ title: "", description: "", detail: "", max_member: "" });
  };
  // func to clear the input fields
  const onClear = () => {
    setProject({ title: "", description: "", detail: "", max_member: "" });
  }
  // func to delte proj
  const onDelete = async (id, e) => {
    e.stopPropagation();
    const docRef = doc(db, "projects", id);
    await deleteDoc(docRef);
    showAlert("error", `Project with id ${id} is deleted sucessfully!`); // error -> red
  };

  // helper func

  return (
    <div ref={inputAreaRef}>
      {/* <pre>{JSON.stringify(project, null, "\t")}</pre> */}
      <TextField
        // sx={{ mt: 5 }}
        fullWidth
        label="title"
        margin="normal"
        inputProps={{
          maxLength: 50,
        }}
        value={project.title}
        onChange={(e) => setProject({ ...project, title: e.target.value })}
      />
      <TextField
        fullWidth
        label="description"
        margin="normal"
        multiline
        rows={2}
        inputProps={{
          maxLength: 200,
        }}
        value={project.description}
        onChange={(e) => setProject({ ...project, description: e.target.value })}
      />
      <TextField
        fullWidth
        label="detail"
        margin="normal"
        multiline
        rows={4}
        value={project.detail}
        onChange={(e) => setProject({ ...project, detail: e.target.value })}
      />
      <TextField
        fullWidth
        label="max team members"
        margin="normal"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        value={project.max_member}
        onChange={(e) => e.target.value < 1
          ? setProject({ ...project, max_member: 1 })
          : setProject({ ...project, max_member: e.target.value })}
      />
      <Button onClick={onSubmit} variant="contained">
        {project.hasOwnProperty("last_timestamp")
          ? "Update this project"
          : "Create a new project"}
      </Button>
      <Button onClick={onClear} variant="contained" sx={{ ml: 3 }}>
        {"Clear Selected"}
      </Button>
      <Button onClick={(e) => onDelete(project.id, e)} variant="contained" sx={{ ml: 3 }}>
        {"Delete Project"}
      </Button>
    </div>
  );
};

export default ProjectForm;
