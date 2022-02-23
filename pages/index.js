import {
  Alert,
  Avatar,
  Container,
  Grid,
  IconButton,
  Snackbar,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { useState } from "react";
import ProjectForm from "../components/ProjectForm";
import ProjectList from "../components/Project/ProjectList";
import { useAuth } from "./AuthContext";
import { ProjectContext } from "./ProjectContext";
import { auth } from "../firebase";
import ProjectPageBar from "../components/Header/ProjectPageBar";

export default function Home() {
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [project, setProject] = useState({
    title: "",
    description: "",
    detail: "",
    max_member: "",
  });
  const showAlert = (type, msg) => {
    setAlertType(type);
    setAlertMessage(msg);
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <ProjectContext.Provider value={{ showAlert, project, setProject }}>
      <ProjectPageBar />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={alertType}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      <ProjectList />

      {/* <Divider>End of Project Homepage</Divider>
      <Box
        sx={{
          maxWidth: "40%",
        }}
      >
        <ProjectForm />
      </Box> */}
    </ProjectContext.Provider>
  );
}
