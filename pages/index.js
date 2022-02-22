import {
  Alert,
  Avatar,
  Container,
  Grid,
  IconButton,
  Snackbar,
  Typography,
  Box,
  CssBaseline,
} from "@mui/material";
import { useState } from "react";
import ProjectForm from "../components/ProjectForm";
import ProjectList from "../components/ProjectList/ProjectList";
import { useAuth } from "./AuthContext";
import { ProjectContext } from "./ProjectContext";
import { auth } from "../firebase";
import Header from "../components/Header/Header";
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
      <CssBaseline />
      <Header />
      <ProjectPageBar />
      <Grid container spaceing={0} justifyContent="center" alignItems="center">
        {/* alert and notification */}
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
        {/* project Creation & Update */}
        <Grid item xs={12}>
          <ProjectList />
        </Grid>
        <Grid item xs={6}>
          <ProjectForm />
        </Grid>
      </Grid>
    </ProjectContext.Provider>
  );
}
