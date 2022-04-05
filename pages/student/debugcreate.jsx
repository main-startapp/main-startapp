import { Alert, Snackbar } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../components/Context/AuthContext";
import { StudentContext } from "../../components/Context/ShareContexts";
import DebugStudentCreate from "../../components/Student/DebugStudentCreate";
import { db } from "../../firebase";

const DebugCreate = () => {
  const { currentUser } = useAuth();

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
    <StudentContext.Provider value={{ showAlert }}>
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
      <DebugStudentCreate />
    </StudentContext.Provider>
  );
};

export default DebugCreate;
