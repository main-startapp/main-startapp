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
  const isMobile = useMediaQuery("(max-width:767px)");
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
          background: "#fff",
          color: "#000",
          ":hover": {
            background:
              "linear-gradient(-120deg, #4285f4, #34a853, #fbbc05, #ea4335)",
            color: "#fff",
          },
        }}
      >
        Sign in with Google
      </SignButton>

      <Box sx={{ mt: 3 }}>
        <Divider
          sx={{
            width: "256px",
            color: "#d3d3d3",
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
          color="primary.light"
          sx={{
            fontSize: "0.875rem",
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
        overflow: "hidden",
        ":hover": {
          cursor: "default",
        },
      }}
    >
      <Paper
        sx={{
          minHeight: "100dvh",
          width: isMobile ? "100%" : "572px", // each side is in golden ratio
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "0px 0px 0px 0px",
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
            src="/images/edium_v4_256.png"
            width={256}
            height={256}
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
            <Signup setIsSignup={setIsSignup} isMobile={isMobile} />
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
  border: `1px solid #d3d3d3`,
  borderRadius: theme.shape.borderRadius * 2,
  textTransform: "none",
}));

export const SignTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": { padding: theme.spacing(1, 2) },

  "& .MuiFormLabel-root": {
    top: "-0.4rem",
    fontSize: "0.875rem",
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.placholderGray.main,
  },
  "& .MuiInputLabel-shrink": { top: "0" }, // to counter root adjustment
  "& .MuiFormLabel-root.Mui-focused": { top: "0" }, // to counter root adjustment

  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    borderRadius: theme.shape.borderRadius,
    "& fieldset": {
      border: `1px solid #d3d3d3`,
    },
    "&:hover fieldset": {
      border: `1px solid #d3d3d3`,
    },
    "&.Mui-focused fieldset": {
      border: `1px solid #d3d3d3`,
    },
  },

  "& .MuiFormHelperText-root": {
    color: "error",
    height: "24px",
    fontSize: "12px",
  },
}));
