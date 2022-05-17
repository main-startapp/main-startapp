import { Button, Grid } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

const Login = ({ type, color }) => {
  const loginWithGoogle = () => {
    signInWithPopup(auth, provider).catch((err) => {
      console.log("signInWithPopup() error: ", err);
    });
  };
  return (
    <Grid
      container
      spaceing={0}
      direction="row"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Button
        variant="contained"
        startIcon={<GoogleIcon />}
        onClick={loginWithGoogle}
      >
        Sign in with Google
      </Button>
    </Grid>
  );
};

export default Login;
