import {
  Alert,
  Avatar,
  Container,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import ProjectForm from "../components/ProjectForm";
import ProjectList from "../components/ProjectList";
import { useAuth } from "./AuthContext";
import { ProjectContext } from "./ProjectContext";
import { auth } from "../firebase";

export default function Home() {
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [project, setProject] = useState({
    title: "",
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
      <Container maxWidth="sm">
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
        {/* user info: !todo: can be built as a component */}
        <Box sx={{ mt: 5, display: "flex", justifyContent: "space-between" }}>
          <IconButton onClick={() => auth.signOut()}>
            <Avatar src={currentUser.photoURL} />
          </IconButton>

          <Typography variant="h5">
            {"Hello "}
            {currentUser.displayName}
          </Typography>
        </Box>
        {/* project Creation & Update */}
        <ProjectForm />
        {/* project list */}
        <ProjectList />
      </Container>
    </ProjectContext.Provider>
  );
}
