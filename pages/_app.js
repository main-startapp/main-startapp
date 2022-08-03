import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AuthProvider } from "../components/Context/AuthContext";
import Navbar from "../components/Header/Navbar";
import "../styles/globals.css";
import AdapterMoment from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import ChatAccordion from "../components/Chat/ChatAccordion";
import { useEffect, useState } from "react";
import { GlobalContext } from "../components/Context/ShareContexts";
import ChatAccordionMsg from "../components/Chat/ChatAccordionMsg";
import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

// makeStyles, useStyles, createStyles, withStyles, styled
// https://smartdevpreneur.com/material-ui-makestyles-usestyles-createstyles-and-withstyles-explained/
// https://smartdevpreneur.com/material-ui-styled-components/

// global font testing
const globalTheme = createTheme({
  typography: {
    edium: {
      fontFamily: ["Stick No Bills", "sans-serif"].join(","),
    },
  },

  palette: {
    SteelBlue: {
      main: "#3e95c2",
    },
  },
});

function MyApp({ Component, pageProps }) {
  // projects related
  const [projects, setProjects] = useState([]); // list of project
  const [oldProject, setOldProject] = useState(null); // the project that needs to be updated
  // students related
  const [students, setStudents] = useState([]); // all students data
  const [currentStudent, setCurrentStudent] = useState(null); // currentUser's student data. Can't be listened here. Requires login.
  // chats related
  const [chat, setChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [partner, setPartner] = useState(null);
  const [showMsg, setShowMsg] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [forceChatExpand, setForceChatExpand] = useState(false);

  // https://stackoverflow.com/questions/59841800/react-useeffect-in-depth-use-of-useeffect
  // listen to realtime projects collection
  useEffect(() => {
    // db query
    const collectionRef = collection(db, "projects");
    const q = query(collectionRef, orderBy("last_timestamp", "desc"));

    // https://firebase.google.com/docs/firestore/query-data/listen
    const unsub = onSnapshot(q, (querySnapshot) => {
      setProjects(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          last_timestamp: doc.data().last_timestamp?.toDate(),
        }))
      );
    });

    return unsub;
  }, []);

  // listen to realtime students collection
  useEffect(() => {
    // db query
    const collectionRef = collection(db, "students");
    const q = query(collectionRef, orderBy("name", "desc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      setStudents(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          uid: doc.id,
        }))
      );
    });

    return unsub;
  }, []);

  return (
    <ThemeProvider theme={globalTheme}>
      <AuthProvider>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <GlobalContext.Provider
            value={{
              projects,
              setProjects,
              oldProject,
              setOldProject,
              students,
              setStudents,
              currentStudent,
              setCurrentStudent,
              chats,
              setChats,
              chat,
              setChat,
              partner,
              setPartner,
              showMsg,
              setShowMsg,
              showChat,
              setShowChat,
              forceChatExpand,
              setForceChatExpand,
            }}
          >
            <CssBaseline />
            <Navbar />
            <Component {...pageProps} />
            {showMsg && <ChatAccordionMsg />}
            {showChat && <ChatAccordion />}
          </GlobalContext.Provider>
        </LocalizationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default MyApp;
