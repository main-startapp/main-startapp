import "../styles/globals.css";
import "../styles/quill.snow.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { useState, useMemo } from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import useMediaQuery from "@mui/material/useMediaQuery";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { AuthProvider } from "../components/Context/AuthContext";
import { GlobalContext } from "../components/Context/ShareContexts";
import Navbar from "../components/Header/Navbar";
import ChatAccordion from "../components/Chat/ChatAccordion";
import ChatMsgPaper from "../components/Chat/ChatMsgPaper";
import DBListener from "../components/DBListener";
import MobileBottomNav from "../components/Header/MobileBottomNav";
import useWindowDimensions from "../components/Reusable/WindowDimensions";

// makeStyles, useStyles, createStyles, withStyles, styled
// https://smartdevpreneur.com/material-ui-makestyles-usestyles-createstyles-and-withstyles-explained/
// https://smartdevpreneur.com/material-ui-styled-components/

const getDesignTokens = (mode, onMedia) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // palette values for light mode
          primary: { main: "#193773" },
          secondary: { main: "#6ff9d1" },
          text: {
            primary: "rgba(0, 0, 0, 1)",
            secondary: "rgba(0, 0, 0, 87)",
          },

          lightPrimary: {
            main: "#e5eeff",
            contrastText: "rgba(0, 0, 0, 0.87)",
          },
          selectedWhite: {
            main: "#fff",
            contrastText: "rgba(0, 0, 0, 1)",
          },
          unselectedIcon: { main: grey[600] },
          searchGary: { main: grey[300], contrastText: "rgba(0, 0, 0, 0.87)" },
          hoverGray: { main: grey[100] },

          adminOrange: { main: "#f4511e", contrastText: "#fff" },
          beginnerGreen: { main: "#59B113", contrastText: "#fff" },
        }
      : {
          // palette values for dark mode
          primary: { main: "#193773" },
          secondary: { main: "#6ff9d1" },

          lightPrimary: {
            main: "#E5EEFF",
            contrastText: "rgba(0, 0, 0, 0.87)",
          },
          selectedWhite: {
            main: "#fff",
            contrastText: "rgba(0, 0, 0, 1)",
          },
          unselectedIcon: { main: grey[600] },
          searchGary: { main: grey[600], contrastText: "#fff" },
          hoverGray: { main: grey[800] },

          adminOrange: { main: "#f4511e", contrastText: "#fff" },
          beginnerGreen: { main: "#59B113", contrastText: "#fff" },
        }),
  },

  typography: {
    button: {
      fontWeight: 500,
      textTransform: "none",
    },
  },

  components: {
    MuiButtonBase: {
      defaultProps: {
        // The props to apply
        disableRipple: true, // No more ripple, on the whole application!
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },

    MuiListItemText: {
      styleOverrides: {
        root: {
          margin: 0,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: mode === "light" ? "#000" : "#fff",
          },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: mode === "light" ? "#000" : "#fff",
        },
      },
    },

    MuiCssBaseline: {
      styleOverrides: onMedia.onDesktop && {
        body: {
          "*::-webkit-scrollbar": {
            width: "0.4rem",
          },
          "*::-webkit-scrollbar-track": {
            background: "transparent",
          },
          ...(mode === "light"
            ? {
                "*::-webkit-scrollbar-thumb": {
                  background: grey[300],
                },
                "*::-webkit-scrollbar-thumb:hover": {
                  background: grey[400],
                },
              }
            : {
                "*::-webkit-scrollbar-thumb": {
                  background: grey[600],
                },
                "*::-webkit-scrollbar-thumb:hover": {
                  background: grey[500],
                },
              }),
        },
      },
    },
  },
});

function MyApp({ Component, pageProps }) {
  // projects related
  const [projects, setProjects] = useState([]); // list of projects from DB
  // projects ext related
  const [projectsExt, setProjectsExt] = useState([]); // list of project exts that currentUser involves from DB
  // events related
  const [events, setEvents] = useState([]); // list of events from DB
  // events ext related
  const [eventsExt, setEventsExt] = useState([]); // list of event exts from DB
  // users related
  const [users, setUsers] = useState([]); // list of users from DB
  const [ediumUser, setEdiumUser] = useState(null); // currentUser's user data from DB
  const [ediumUserExt, setEdiumUserExt] = useState(null); // currentUser's user ext data from DB
  // chats related
  const [chats, setChats] = useState([]); // list of chats that currentUSer involves from DB
  const [chat, setChat] = useState(null);
  const [chatPartner, setChatPartner] = useState(null);
  const [showMsg, setShowMsg] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [forceChatExpand, setForceChatExpand] = useState(false);
  // media query
  const { winWidth, winHeight } = useWindowDimensions();
  const onMedia = { onDesktop: false, onTablet: false, onMobile: false };
  onMedia.onDesktop = useMediaQuery("(min-width:1024px)");
  onMedia.onTablet = useMediaQuery("(min-width:768px) and (max-width:1023px)");
  onMedia.onMobile = useMediaQuery("(max-width:767px)");
  // animation related
  const [isAnimated, setIsAnimated] = useState({
    projects: false,
    events: false,
    students: false,
  });
  // theme
  const [mode, setMode] = useState("light");
  const colorMode = useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );
  const theme = createTheme(getDesignTokens(mode, onMedia));

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <GlobalContext.Provider
            value={{
              projects,
              setProjects,
              projectsExt,
              setProjectsExt,
              events,
              setEvents,
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
              winWidth,
              winHeight,
              onMedia,
              isAnimated,
              setIsAnimated,
            }}
          >
            <CssBaseline enableColorScheme />
            <DBListener />
            {onMedia.onDesktop && <Navbar />}
            <Component {...pageProps} />
            {onMedia.onDesktop && ediumUser?.uid && showMsg && <ChatMsgPaper />}
            {onMedia.onDesktop && ediumUser?.uid && showChat && (
              <ChatAccordion />
            )}
            {!onMedia.onDesktop && <MobileBottomNav />}
          </GlobalContext.Provider>
        </LocalizationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default MyApp;
