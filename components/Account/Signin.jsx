import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { styled, useTheme } from "@mui/material/styles";
import ExportedImage from "next-image-export-optimizer";
import { useState } from "react";
import { auth, googleProvider } from "../../firebase";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";
import FacebookIcon from "@mui/icons-material/Facebook";
import Signup from "./Signup";
import { motion } from "framer-motion";

// sign in, sign up, log in
// https://ux.stackexchange.com/questions/1080/using-sign-in-vs-using-log-in

const Signin = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [input, setInput] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");

  // independent media query
  const onDesktop = useMediaQuery("(min-width:1024px)");
  const theme = useTheme();

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
        let msg = "";
        switch (error.code) {
          case "auth/user-not-found":
            msg = "User not found";
            break;

          case "auth/invalid-email":
            msg = "Email is invalid";
            break;

          case "auth/wrong-password":
            msg = "Wrong password";
            break;

          default:
            msg = "Check email or password";
            break;
        }
        setErrorMsg(msg);
      }
    );
  };

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider).catch((error) => {
      console.log(error?.message);
    });
  };

  const signinComp = (
    <>
      <SignButton
        variant="contained"
        disableElevation
        startIcon={<GoogleIcon />}
        onClick={signInWithGoogle}
        sx={{
          mt: 6,
          width: "256px",
          fontSize: "0.875rem",
          background:
            "linear-gradient(45deg, #4285f4 0%, #4285f4 25%, #ea4335 25%, #ea4335 50%, #fbbc05 50%, #fbbc05 75%, #34a853 75%, #34a853 100%)",
          color: "#fff",
          ":hover": {
            background:
              "linear-gradient(45deg, #4285f4, #ea4335, #fbbc05, #34a853)",
          },
          //transition: "background", // to sync background ans text color transition
        }}
      >
        Sign in with Google
      </SignButton>

      <Box sx={{ mt: 3 }}>
        <Divider
          sx={{
            width: "256px",
            color: "gray300.main",
          }}
        >
          {"or Sign in with Email"}
        </Divider>
      </Box>

      <Box sx={{ mt: 3, width: "256px" }}>
        <SignTextField
          //sx={{ paddingY: 0, fontSize: "1rem" }}
          fullWidth
          margin="none"
          label="Email"
          name="email"
          type="email"
          variant="outlined"
          value={input.email}
          onChange={(e) => setInput({ ...input, email: e.target.value })}
          error={!!errorMsg}
        />
        <SignTextField
          sx={{ mt: 1.5 }}
          fullWidth
          margin="none"
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          value={input.password}
          onChange={(e) => setInput({ ...input, password: e.target.value })}
          error={!!errorMsg}
          helperText={errorMsg || " "}
        />
      </Box>

      <Box
        sx={{
          width: "256px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          color="primary"
          disableElevation
          variant="contained"
          onClick={handleSignIn}
          sx={{
            width: "112px",
            height: "24px",
            borderRadius: 8,
            fontSize: "0.75rem",
          }}
        >
          {"Sign in"}
        </Button>
      </Box>
      <Box sx={{ mt: 6, mb: 3, display: "flex", justifyContent: "center" }}>
        <Typography sx={{ fontSize: "0.875rem" }}>
          {"Not registered yet? "} &nbsp;
        </Typography>
        <Typography
          color="secondary"
          sx={{
            fontSize: "0.875rem",
            fontWeight: "bold",
            ":hover": {
              cursor: "pointer",
            },
          }}
          onClick={() => setIsSignup(true)}
        >
          {"Join now"}
        </Typography>
      </Box>
    </>
  );

  return (
    <Box
      id="singin-main-box"
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
      <Paper
        elevation={2}
        sx={{
          mt: onDesktop ? 4 : 0,
          minHeight: onDesktop
            ? `calc(100dvh - 1px - ${theme.spacing(4)})`
            : "100dvh", // window height - border - margin top
          width: onDesktop ? "572px" : "100%", // each side is in golden ratio
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderTop: onDesktop ? `1px solid ${theme.palette.divider}` : 0,
          borderRadius: onDesktop ? "32px 32px 0px 0px" : "0px 0px 0px 0px",
        }}
      >
        <motion.div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          key={isSignup}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ExportedImage
            style={{ marginTop: "24px" }}
            alt=""
            src="/images/edium_v4_512.png"
            width={256}
            height={256}
            unoptimized={true}
          />

          <Typography
            sx={{
              mt: 2,
              fontSize: "1.75rem",
              fontWeight: "bold",
            }}
          >
            Welcome to EDIUM!
          </Typography>

          {isSignup ? (
            <Signup setIsSignup={setIsSignup} onDesktop={onDesktop} />
          ) : (
            signinComp
          )}
        </motion.div>
      </Paper>
    </Box>
  );
};

export default Signin;

const SignButton = styled(Button)(({ theme }) => ({
  border: "none",
  borderRadius: theme.shape.borderRadius * 2,
  textTransform: "none",
  height: "40px",
}));

// similar to DefaultTextField but thinner
export const SignTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 2),
    fontSize: "0.875rem",
    height: "24px", // 40 overall == sign in button
  },

  "& .MuiFormLabel-root": {
    top: "-6px",
    fontSize: "0.875rem",
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.gray500.main,
  },
  "& .MuiInputLabel-shrink": { top: "1px" }, // to counter root adjustment
  "& .MuiFormLabel-root.Mui-focused": { top: "1px" }, // to counter root adjustment

  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.gray100.main,
    borderRadius: theme.shape.borderRadius * 2,

    "& fieldset": {
      border: "none",
    },
    "&:hover fieldset": {
      border: "none",
    },
    "&.Mui-focused fieldset": {
      border: "none",
    },
  },

  "& .MuiFormHelperText-root": {
    color: "error",
    height: "1.5rem", // 24px
    fontSize: "0.75rem", // 12px
  },
}));
