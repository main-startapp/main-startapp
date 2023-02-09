import { Box, Button, Divider, Typography } from "@mui/material";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useRef, useState } from "react";
import { auth } from "../../firebase";
import { SignTextField } from "./Signin";

const Signup = (props) => {
  // props
  const setIsSignup = props.setIsSignup;
  const onDesktop = props.onDesktop;

  // context / ref
  const formRef = useRef();

  // https://www.cluemediator.com/password-and-confirm-password-validation-in-react
  const [input, setInput] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMsg, setErrorMsg] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateInput(e);
  };

  const validateInput = (e) => {
    let { name, value } = e.target;
    setErrorMsg((prev) => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "email":
          if (!value) {
            stateObj[name] = "Please enter Email";
          }
          break;

        case "password":
          if (!value) {
            stateObj[name] = "Please enter Password";
          } else if (value.length < 8) {
            stateObj[name] = "Password must be at least 8 characters";
          } else if (!/^\S*$/.test(value)) {
            stateObj[name] = "Password must not contain whitespaces";
          } else if (!/^(?=.*[A-Z]).*$/.test(value)) {
            stateObj[name] =
              "Password must contain at least 1 uppercase letter";
          } else if (!/^(?=.*[a-z]).*$/.test(value)) {
            stateObj[name] =
              "Password must contain at least 1 lowercase letter";
          } else if (!/^(?=.*[0-9]).*$/.test(value)) {
            stateObj[name] = "Password must contain at least 1 digit";
          } else if (
            !/^(?=.*[~`!@#$%^&*()--+={}[\]|\\:;"'<>,.?/_₹]).*$/.test(value)
          ) {
            stateObj[name] = "Password must contain at least 1 special symbol";
          } else if (
            !input.confirmPassword ||
            (input.confirmPassword && value !== input.confirmPassword)
          ) {
            stateObj["confirmPassword"] =
              "Password and Confirm Password do not match";
          }
          break;

        case "confirmPassword":
          if (!value) {
            stateObj[name] = "Please enter Confirm Password";
          } else if (input.password && value !== input.password) {
            stateObj[name] = "Password and Confirm Password do not match";
          }
          break;

        default:
          break;
      }

      return stateObj;
    });
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!formRef.current.reportValidity()) return;

    const hasError = Object.values(errorMsg).some((error) => error.length > 0);
    if (hasError) return;
    // !todo: add another layer of validation here?

    createUserWithEmailAndPassword(auth, input.email, input.password)
      // .then(async (userCredential) => {
      //   const user = userCredential.user;
      //   await sendEmailVerification(user);
      // })
      .catch((error) => {
        let msg = "";
        switch (error.code) {
          case "auth/email-already-in-use":
            msg = "Email is already in use";
            break;

          default:
            msg =
              "Contact us at contact@edium.ca with the following code: " +
              error?.msg;
            break;
        }
        setErrorMsg({ email: msg, password: "", confirmPassword: "" });
      });
  };

  return (
    <>
      <Box sx={{ mt: 6 }}>
        <Divider
          sx={{
            width: onDesktop ? "414px" : "256px",
            color: "gray300.main",
          }}
        >
          {"Create an Account"}
        </Divider>
      </Box>

      <Box sx={{ mt: 3, width: onDesktop ? "414px" : "256px" }}>
        <form ref={formRef}>
          <SignTextField
            fullWidth
            margin="none"
            label="Email"
            name="email"
            type="email"
            variant="outlined"
            value={input.email}
            onChange={(e) => handleInputChange(e)}
            onBlur={(e) => validateInput(e)}
            error={!!errorMsg.email}
            helperText={errorMsg.email || " "}
          />

          <SignTextField
            fullWidth
            margin="none"
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            value={input.password}
            onChange={(e) => handleInputChange(e)}
            onBlur={(e) => validateInput(e)}
            error={!!errorMsg.password}
            helperText={errorMsg.password || " "}
          />

          <SignTextField
            fullWidth
            margin="none"
            label="Password Confirmation"
            name="confirmPassword"
            type="password"
            variant="outlined"
            value={input.confirmPassword}
            onChange={(e) => handleInputChange(e)}
            onBlur={(e) => validateInput(e)}
            error={!!errorMsg.confirmPassword}
            helperText={errorMsg.confirmPassword || " "}
          />
        </form>
      </Box>
      <Box
        sx={{
          width: onDesktop ? "414px" : "256px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          color="primary"
          disableElevation
          variant="contained"
          onClick={(e) => handleConfirm(e)}
          sx={{
            width: "112px",
            height: "24px",
            borderRadius: 8,
            fontSize: "0.75rem",
          }}
        >
          {"Confirm"}
        </Button>
      </Box>
      <Box sx={{ mt: 6, mb: 3, display: "flex", justifyContent: "center" }}>
        <Typography sx={{ fontSize: "0.875rem" }}>
          {"Already on Edium? "} &nbsp;
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
          onClick={() => setIsSignup(false)}
        >
          {"Sign in"}
        </Typography>
      </Box>
    </>
  );
};

export default Signup;
