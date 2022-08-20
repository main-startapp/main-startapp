import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AuthProvider } from "../components/Context/AuthContext";
import Navbar from "../components/Header/Navbar";
import "../styles/globals.css";
import AdapterMoment from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import ChatAccordion from "../components/Chat/ChatAccordion";
import { useState } from "react";
import { GlobalContext } from "../components/Context/ShareContexts";
import ChatAccordionMsg from "../components/Chat/ChatAccordionMsg";
import DBListener from "../components/DBListener";

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
  // projects ext related
  const [projectsExt, setProjectsExt] = useState([]); // list of project
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
              projectsExt,
              setProjectsExt,
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
            <DBListener />
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
