import {
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { styled } from "@mui/material/styles";
import ExportedImage from "next-image-export-optimizer";
import { useState } from "react";
import { auth, googleProvider } from "../../firebase";
import useWindowDimensions from "../Reusable/WindowDimensions";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";
import FacebookIcon from "@mui/icons-material/Facebook";
import Signup from "./Signup";

import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";

// sign in, sign up, log in
// https://ux.stackexchange.com/questions/1080/using-sign-in-vs-using-log-in

const Signin = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [input, setInput] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState({ email: "", password: "" });

  // independent media query
  const isMobile = useMediaQuery("(max-width:767px)");
  const { winWidth, winHeight } = useWindowDimensions();

  // Configure FirebaseUI.
  // const uiConfig = {
  //   // Popup signin flow rather than redirect flow.
  //   signInFlow: "popup",
  //   // We will display Google and Email as auth providers.
  //   signInOptions: [
  //     {
  //       provider: EmailAuthProvider.PROVIDER_ID, //  Firebase v9
  //       requireDisplayName: false,
  //     },
  //     {
  //       provider: GoogleAuthProvider.PROVIDER_ID, //  Firebase v9
  //       customParameters: {
  //         // Forces account selection even when one account is available.
  //         prompt: "select_account",
  //       },
  //     },
  //   ],
  // };

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, input.email, input.password).catch(
      (error) => {
        let emailMsg = "";
        let passwordMsg = "";
        switch (error.code) {
          case "auth/user-not-found":
            emailMsg = "User not found";
            passwordMsg = "";
            break;

          case "auth/invalid-email":
            emailMsg = "Email is invalid";
            passwordMsg = "";
            break;

          case "auth/wrong-password":
            emailMsg = "";
            passwordMsg = "Wrong password";
            break;

          default:
            emailMsg = "Double check your Email";
            passwordMsg = "Double check your Password";
            break;
        }
        setErrorMsg({ email: emailMsg, password: passwordMsg });
      }
    );
  };

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider).catch((error) => {
      console.log(error?.message);
    });
  };

  const signinComp = (
    <Box>
      {/* <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} /> */}
      <StyledButton
        sx={{
          mt: "2vh",
          width: isMobile ? "68vmin" : "38vmin",
          fontSize: "0.9em",
          border: 1.5,
          borderColor: "#dbdbdb",
          ":hover": { backgroundColor: "#3e95c2", color: "white" },
        }}
        variant="contained"
        disableElevation
        startIcon={<GoogleIcon />}
        onClick={signInWithGoogle}
      >
        Sign in with Google
      </StyledButton>

      {/* <StyledButton
          sx={{
            mt: "1vh",
            width: isMobile ? "68vmin" : "38vmin",
            border: 1.5,
            borderColor: "#dbdbdb",
          }}
          variant="contained"
          disableElevation
          startIcon={<AppleIcon />}
          //onClick={}
        >
          Sign in with Apple
        </StyledButton>

        <StyledButton
          sx={{
            mt: "1vh",
            width: isMobile ? "68vmin" : "38vmin",
            border: 1.5,
            borderColor: "#dbdbdb",
          }}
          variant="contained"
          disableElevation
          startIcon={<FacebookIcon />}
          //onClick={}
        >
          Sign in with Facebook
        </StyledButton> */}

      <Divider
        sx={{
          mt: "2vh",
          width: isMobile ? "68vmin" : "38vmin",
          color: "lightgray",
        }}
      >
        {"or Sign in with Email"}
      </Divider>
      <Box sx={{ mt: "2vh", width: isMobile ? "68vmin" : "38vmin" }}>
        <StyledTextField
          sx={{ paddingY: 0, fontSize: "0.9em" }}
          fullWidth
          margin="none"
          label="Email"
          name="email"
          type="email"
          variant="outlined"
          value={input.email}
          onChange={(e) => setInput({ ...input, email: e.target.value })}
          error={!!errorMsg.email}
          helperText={errorMsg.email || " "}
        />
        <StyledTextField
          sx={{ paddingY: 0, fontSize: "0.9em" }}
          fullWidth
          margin="none"
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          value={input.password}
          onChange={(e) => setInput({ ...input, password: e.target.value })}
          error={!!errorMsg.password}
          helperText={errorMsg.password || " "}
        />
      </Box>
      <Box
        sx={{
          width: isMobile ? "68vmin" : "38vmin",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          disableElevation
          sx={{
            mt: "1vh",
            border: 1.5,
            borderColor: "#dbdbdb",
            borderRadius: "30px",
            color: "white",
            backgroundColor: "#3e95c2",
            fontSize: "0.8em",
            textTransform: "none",
            paddingX: 5,
            paddingY: 0.1,
          }}
          variant="contained"
          onClick={handleSignIn}
        >
          {"Sign in"}
        </Button>
      </Box>
      <Box sx={{ mt: "2vh", display: "flex", justifyContent: "center" }}>
        <Typography sx={{ fontSize: "0.9em" }}>
          {"Not registered yet? "} &nbsp;
        </Typography>
        <Typography
          sx={{
            color: "#3e95c2",
            fontSize: "0.9em",
            ":hover": {
              cursor: "pointer",
            },
          }}
          onClick={() => setIsSignup(true)}
        >
          {"Join now"}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Grid
      container
      spacing={0}
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundColor: "#fafafa",
      }}
    >
      <Grid
        item
        xs={isMobile ? 10 : 6}
        sx={{
          backgroundColor: "#ffffff",
          borderLeft: 1.5,
          borderRight: 1.5,
          borderColor: "#dbdbdb",
          paddingX: 3,
          height: `${winHeight}px`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            height: isMobile ? "60vmin" : "40vmin",
            width: isMobile ? "60vmin" : "40vmin",
          }}
        >
          <ExportedImage
            src="/images/EDIUMLogo.png"
            placeholder=""
            layout="fill"
            priority
          />
        </Box>

        <Typography
          sx={{
            mt: "1vh",
            fontSize: isMobile ? "1.5em" : "2.5em",
            fontWeight: "bold",
          }}
        >
          Welcome to EDIUM!
        </Typography>

        {isSignup ? (
          <Signup setIsSignup={setIsSignup} isMobile={isMobile} />
        ) : (
          signinComp
        )}
      </Grid>
    </Grid>
  );
};

export default Signin;

const StyledButton = styled(Button)(({ theme }) => ({
  color: "black",
  backgroundColor: "white",
  borderRadius: "30px",
  textTransform: "none",
  display: "flex",
  justifyContent: "center",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": { padding: theme.spacing(1, 2) },

  "& .MuiFormLabel-root": { top: "-0.4em", fontSize: "0.9em" },
  "& .MuiInputLabel-shrink": { top: "0" }, // to counter root adjustment
  "& .MuiFormLabel-root.Mui-focused": { top: "0" }, // to counter root adjustment

  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "white",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderWidth: 1.5,
    borderColor: "#dbdbdb",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderWidth: 1.5,
    borderColor: "#dbdbdb !important",
  },
  "&:hover .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
    borderWidth: 1.5,
    borderColor: "#d32f2f !important",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderWidth: 1.5,
    borderColor: "#3e95c2 !important",
  },
  "& .MuiOutlinedInput-root.Mui-focused.Mui-error .MuiOutlinedInput-notchedOutline":
    {
      borderWidth: 1.5,
      borderColor: "#d32f2f !important",
    },
  "& .MuiFormHelperText-root": {
    color: "lightgray",
    fontSize: "12px",
  },
}));
