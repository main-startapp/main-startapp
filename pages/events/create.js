import { Alert, Box, Snackbar } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import {
  GlobalContext,
  EventContext,
} from "../../components/Context/ShareContexts";
import EventCreate from "../../components/Event/EventCreate";

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
    <EventContext.Provider value={{ showAlert }}>
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
      <Box
        id="events-create-main-box"
        sx={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          ":hover": {
            cursor: "default",
          },
        }}
      >
        <Box
          id="events-create-box"
          sx={{
            paddingTop: 4,
            width: "100%",
            maxWidth: "1024px",
          }}
        >
          <EventCreate eventID={query?.eventID} />
        </Box>
      </Box>
    </EventContext.Provider>
  );
};

export default Create;
