import { Alert, Snackbar } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
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

  // fetch current user's student data if there's any
  useEffect(() => {
    async function fetchDoc(argDocRef) {
      const docSnap = await getDoc(argDocRef).catch((err) => {
        console.log("getDoc() error: ", err);
      });
      if (docSnap.exists()) {
        // return docSnap.data();
        setCurrentStudent({ ...docSnap.data(), uid: uid });
      } else {
        console.log("No such document for this student!");
      }
    }

    const uid = currentUser?.uid;
    const docRef = doc(db, "students", uid);
    fetchDoc(docRef);

    return docRef;
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
