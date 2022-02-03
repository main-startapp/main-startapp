import { Button, TextField } from "@mui/material";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { ProjectContext } from "../pages/ProjectContext";

// !todo: the form should be move to its own page
const ProjectForm = () => {
  // context
  const { showAlert, project, setProject } = useContext(ProjectContext);
  // detect if the user click outside of input field
  const inputAreaRef = useRef();
  useEffect(() => {
    const checkIfClickOutside = (e) => {
      if (!inputAreaRef.current.contains(e.target)) {
        console.log(`Outside input area`);
        setProject({ title: "", detail: "", max_member: "" });
      } else {
        console.log(`Inside input area`);
      }
    };
    document.addEventListener("mousedown", checkIfClickOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickOutside);
    };
  }, [setProject]);
  // function when click Create or Update button
  const onSubmit = async () => {
    const projectRef = { ...project, created_time: serverTimestamp() };
    if (project?.hasOwnProperty("created_time")) {
      // to Update
      const docRef = doc(db, "projects", project.id);
      updateDoc(docRef, projectRef);
      showAlert(
        "info",
        `Project with id ${project.id} is updated successfully!` // info -> y
      );
    } else {
      // to Create
      const collectionRef = collection(db, "projects");
      const docRef = await addDoc(collectionRef, projectRef);
      showAlert(
        "success",
        `Project with id ${docRef.id} is added successfully!` // success -> green
      );
    }
    setProject({ title: "", detail: "", max_member: "" });
  };
  return (
    <div ref={inputAreaRef}>
      {/* <pre>{JSON.stringify(project, null, "\t")}</pre> */}
      <TextField
        sx={{ mt: 5 }}
        fullWidth
        label="title"
        margin="normal"
        value={project.title}
        onChange={(e) => setProject({ ...project, title: e.target.value })}
      />
      <TextField
        fullWidth
        label="detail"
        multiline
        maxRows={4}
        value={project.detail}
        onChange={(e) => setProject({ ...project, detail: e.target.value })}
      />
      <TextField
        fullWidth
        label="max team members"
        margin="normal"
        value={project.max_member}
        onChange={(e) => setProject({ ...project, max_member: e.target.value })}
      />
      <Button onClick={onSubmit} variant="contained" sx={{ mt: 3 }}>
        {project.hasOwnProperty("created_time")
          ? "Update this project"
          : "Create a new project"}
      </Button>
    </div>
  );
};

export default ProjectForm;
