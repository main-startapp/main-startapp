import {
  Box,
  Button,
  Divider,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useRef, useState } from "react";
import { auth } from "../../firebase";

const Signup = (props) => {
  const setIsSignup = props.setIsSignup;
  const isMobile = props.isMobile;

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
          } else if (value?.length < 6) {
            stateObj[name] = "Password must contains 6 or more characters";
          } else if (input.confirmPassword && value !== input.confirmPassword) {
            stateObj["confirmPassword"] =
              "Password and Confirm Password do not match";
          } else {
            stateObj["confirmPassword"] = input.confirmPassword
              ? ""
              : errorMsg.confirmPassword;
          }
          break;

        case "confirmPassword":
          if (!value) {
            stateObj[name] = "Please enter Confirm Password";
          } else if (value?.length < 6) {
            stateObj[name] = "Password must contains 6 or more characters";
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

  const formRef = useRef();

  return (
    <>
      <Divider
        sx={{
          mt: "2vh",
          width: isMobile ? "68vmin" : "38vmin",
          color: "lightgray",
          ":before": {
            top: 0,
          },
          ":after": {
            top: 0,
          },
        }}
      >
        {"Create an Account"}
      </Divider>
      <Box sx={{ mt: "2vh", width: isMobile ? "68vmin" : "38vmin" }}>
        <form ref={formRef}>
          <StyledTextField
            sx={{ paddingY: 0, fontSize: "0.9em" }}
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

          <StyledTextField
            sx={{ paddingY: 0, fontSize: "0.9em" }}
            fullWidth
            margin="none"
            label={
              isMobile
                ? "Password (>5 characters)"
                : "Password (6 or more characters)"
            }
            name="password"
            type="password"
            variant="outlined"
            value={input.password}
            onChange={(e) => handleInputChange(e)}
            onBlur={(e) => validateInput(e)}
            error={!!errorMsg.password}
            helperText={errorMsg.password || " "}
          />

          <StyledTextField
            sx={{ paddingY: 0, fontSize: "0.9em" }}
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
          mt: "1vh",
          width: isMobile ? "68vmin" : "38vmin",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          disableElevation
          sx={{
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
          onClick={(e) => handleConfirm(e)}
        >
          {"Confirm"}
        </Button>
      </Box>
      <Box sx={{ mt: "2vh", display: "flex" }}>
        <Typography sx={{ fontSize: "0.9em" }}>
          {"Already on Edium? "} &nbsp;
        </Typography>
        <Typography
          sx={{
            color: "#3e95c2",
            fontSize: "0.9em",
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

// !todo: directly use theme.palette.error
// https://v4.mui.com/customization/palette/
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
    fontSize: "12px",
  },
}));