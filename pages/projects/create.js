import { Alert, Snackbar } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import {
  GlobalContext,
  ProjectContext,
} from "../../components/Context/ShareContexts";
import ProjectCreate from "../../components/Project/ProjectCreate";

const Create = () => {
  // context
  const { setChat, setChatPartner, setShowChat, setShowMsg } =
    useContext(GlobalContext);
  useEffect(() => {
    setShowChat(false);
    setShowMsg(false);
    setChat(null);
    setChatPartner(null);
  }, [setChat, setChatPartner, setShowChat, setShowMsg]);

  // local
  const { query } = useRouter();
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
      <ProjectCreate projectID={query?.projectID} />
    </ProjectContext.Provider>
  );
};

export default Create;
