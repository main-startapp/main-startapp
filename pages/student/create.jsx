import { Alert, Snackbar } from "@mui/material";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../components/Context/AuthContext";
import { StudentContext } from "../../components/Context/ShareContexts";
import StudentCreate from "../../components/Student/StudentCreate";
import { db } from "../../firebase";

const Create = () => {
  const { currentUser } = useAuth();

  const [currentStudent, setCurrentStudent] = useState(null);
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  // listen to the current user's student data for realtime update
  // similar alg in pages/students; pages/index
  useEffect(() => {
    const docID = currentUser?.uid || 0;
    const unsub = onSnapshot(doc(db, "students", docID), (doc) => {
      if (doc.exists()) {
        setCurrentStudent({ ...doc.data(), uid: docID });
      }
    });

    return () => {
      unsub;
    };
  }, [currentUser]);

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
    <StudentContext.Provider value={{ showAlert, currentStudent }}>
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
      <StudentCreate />
    </StudentContext.Provider>
  );
};

export default Create;
