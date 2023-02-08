import { Grid } from "@mui/material";
import ReactLoading from "react-loading";

const Loading = ({ type, color }) => {
  return (
    <Grid
      container
      spacing={0}
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100dvh" }}
    >
      <ReactLoading type={type} color={color} height={"10%"} width={"10%"} />
    </Grid>
  );
};

export default Loading;
