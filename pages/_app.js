// theme related
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Navbar from "../components/Header/Navbar";
import "../styles/globals.css";
// auth related
import { AuthProvider } from "./AuthContext";

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
  return (
    // uncomment the ThemeProvider to use the theme defined above
    // <ThemeProvider theme={fontTheme}>
    <AuthProvider>
      <CssBaseline />
      <Navbar />
      <Component {...pageProps} />
    </AuthProvider>
    // </ThemeProvider>
  );
}
export default MyApp;
