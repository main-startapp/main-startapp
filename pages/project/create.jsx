import { Alert, Snackbar } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { ProjectContext } from "../../components/Context/ProjectContext";
import ProjectCreate from "../../components/Project/ProjectCreate";

const Create = () => {
  const { query } = useRouter();
  // console.log(JSON.parse(query.projString));
  // alert
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

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
    <ProjectContext.Provider value={{ showAlert }}>
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
      <ProjectCreate projString={query.projString} />
    </ProjectContext.Provider>
  );
};

export default Create;
