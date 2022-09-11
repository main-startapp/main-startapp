import { Button, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { auth, googleProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import { styled } from "@mui/material/styles";
import ExportedImage from "next-image-export-optimizer";

// sign in, sign up, log in
// https://ux.stackexchange.com/questions/1080/using-sign-in-vs-using-log-in

const BetaLogin = ({ type, color }) => {
  const loginWithGoogle = () => {
    signInWithPopup(auth, googleProvider).catch((err) => {
      console.log("signInWithPopup() error: ", err);
    });
  };

  return (
    <Container>
      <ExportedImage
        src="/images/EDIUMLogo.png"
        placeholder=""
        width="512px"
        height="512px"
        priority
      />
      <Typography
        sx={{
          fontSize: "5vmin",
          fontWeight: "bold",
          lineHeight: 1,
          mt: "5vmin",
          mb: "2.5vmin",
        }}
      >
        Welcome to Beta Launch!
      </Typography>
      <Typography
        sx={{ fontSize: "2.5vmin", color: "LightSlateGray", lineHeight: 1 }}
      >
        If you made it here, you are truly special.
      </Typography>
      <Typography
        sx={{ fontSize: "2.5vmin", color: "LightSlateGray", lineHeight: 1 }}
      >
        Thank you for your contribution.
      </Typography>
      <Button
        sx={{ color: "white", mt: "5vmin", backgroundColor: "#3e95c2" }}
        variant="contained"
        startIcon={<GoogleIcon />}
        onClick={loginWithGoogle}
        disableElevation
      >
        Sign in with Google
      </Button>
    </Container>
  );
};

export default BetaLogin;

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  // backgroundColor: "red",
  width: "100vw",
  height: "100vh",
}));
