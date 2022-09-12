import "../styles/globals.css";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AuthProvider } from "../components/Context/AuthContext";
import Navbar from "../components/Header/Navbar";
import ChatAccordion from "../components/Chat/ChatAccordion";
import { GlobalContext } from "../components/Context/ShareContexts";
import ChatAccordionMsg from "../components/Chat/ChatAccordionMsg";
import DBListener from "../components/DBListener";
import BottomNav from "../components/Header/BottomNav";

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
    AdminOrange: {
      main: "#f4511e",
    },
  },
});

function MyApp({ Component, pageProps }) {
  // projects related
  const [projects, setProjects] = useState([]); // list of project
  const [oldProject, setOldProject] = useState(null); // the project that needs to be updated
  // projects ext related
  const [projectsExt, setProjectsExt] = useState([]); // list of project exts that currentUser involves in
  // events related
  const [events, setEvents] = useState([]); // list of event
  const [oldEvent, setOldEvent] = useState(null); // the event that needs to be updated
  // events ext related
  const [eventsExt, setEventsExt] = useState([]); // list of ext of event
  // users related
  const [users, setUsers] = useState([]); // all users data
  const [ediumUser, setEdiumUser] = useState(null); // currentUser's data
  const [ediumUserExt, setEdiumUserExt] = useState(null); // currentUser's ext data
  // chats related
  const [chat, setChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [chatPartner, setChatPartner] = useState(null);
  const [showMsg, setShowMsg] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [forceChatExpand, setForceChatExpand] = useState(false);

  // media query
  const onMedia = { onDesktop: false, onTablet: false, onMobile: false };
  onMedia.onDesktop = useMediaQuery("(min-width:1024px)");
  onMedia.onTablet = useMediaQuery("(min-width:768px) and (max-width:1023px)");
  onMedia.onMobile = useMediaQuery("(max-width:767px)");

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
              events,
              setEvents,
              oldEvent,
              setOldEvent,
              eventsExt,
              setEventsExt,
              users,
              setUsers,
              ediumUser,
              setEdiumUser,
              ediumUserExt,
              setEdiumUserExt,
              chats,
              setChats,
              chat,
              setChat,
              chatPartner,
              setChatPartner,
              showMsg,
              setShowMsg,
              showChat,
              setShowChat,
              forceChatExpand,
              setForceChatExpand,
              onMedia,
            }}
          >
            <CssBaseline />
            <DBListener />
            <Navbar />
            <Component {...pageProps} />
            {onMedia.onDesktop && showMsg && <ChatAccordionMsg />}
            {onMedia.onDesktop && showChat && <ChatAccordion />}
            {!onMedia.onDesktop && <BottomNav />}
          </GlobalContext.Provider>
        </LocalizationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default MyApp;
