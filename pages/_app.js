import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AuthProvider } from "../components/Context/AuthContext";
import Navbar from "../components/Header/Navbar";
import "../styles/globals.css";
import { makeStyles } from "@mui/styles";
import AdapterMoment from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import ChatAccordion from "../components/Chat/ChatAccordion";
import { useState } from "react";
import { ChatContext } from "../components/Context/ShareContexts";
import ChatAccordionMsg from "../components/Chat/ChatAccordionMsg";

// global font testing
const fontTheme = createTheme({
  typography: {
    fontFamily: [
      // "-apple-system",
      // "BlinkMacSystemFont",
      // '"Segoe UI"',
      // "Roboto",
      // '"Helvetica Neue"',
      // "Arial",
      // '"Apple Color Emoji"',
      // '"Segoe UI Emoji"',
      // '"Segoe UI Symbol"',
      "Nunito",
      "sans-serif",
    ].join(","),
    fontSize: 16,
  },
});

function MyApp({ Component, pageProps }) {
  const [chats, setChats] = useState([]);
  const [chat, setChat] = useState(null);
  const [students, setStudents] = useState([]);
  const [partner, setPartner] = useState(null);
  const [showMsg, setShowMsg] = useState(false);
  return (
    // uncomment the ThemeProvider to use the theme defined above
    // <ThemeProvider theme={fontTheme}>
    <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <ChatContext.Provider
          value={{
            chats,
            setChats,
            chat,
            setChat,
            students,
            setStudents,
            partner,
            setPartner,
            showMsg,
            setShowMsg,
          }}
        >
          <CssBaseline />
          <Navbar />
          <Component {...pageProps} />
          <ChatAccordionMsg />
          <ChatAccordion />
        </ChatContext.Provider>
      </LocalizationProvider>
    </AuthProvider>
    // </ThemeProvider>
  );
}
export default MyApp;
