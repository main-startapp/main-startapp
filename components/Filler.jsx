import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import ExportedImage from "next-image-export-optimizer";

const Filler = () => {
  return (
    <Container>
      <ExportedImage
        src="/images/EDIUM Logo.png"
        placeholder=""
        width={512}
        height={512}
        unoptimized={true}
      />
      <Typography variant="edium" sx={{ fontSize: "32px", padding: "32px" }}>
        Coming soon
      </Typography>
    </Container>
  );
};

export default Filler;

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  //   backgroundColor: "red",
  padding: "100px",
}));
