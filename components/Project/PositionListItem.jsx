import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { makeStyles } from "@mui/styles";

// override the style Accordion Summary
const useStyles = makeStyles({
  customAccordionSummary: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

const PositionListItem = ({ name, resp, weeklyHour }) => {
  // override Accordion style to use justifyConent
  const classes = useStyles();

  const handleJoinRequest = (e) => {
    e.stopPropagation();
  };

  return (
    <Box sx={{ m: 3 }}>
      <Accordion
        square // why? only with this prop the corner is rounded!
        sx={{
          border: 1,
          borderRadius: 4,
          borderColor: "text.secondary",
          boxShadow: 0,
          maxWidth: "100%",
          ":hover": {
            boxShadow: 2,
          },
        }}
      >
        <AccordionSummary
          classes={{ content: classes.customAccordionSummary }}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography color="text.primary">{name}</Typography>
          <Button
            variant="contained"
            size="small"
            sx={{ mr: 3, borderRadius: 4, background: "#3e95c2" }}
            disableElevation
            onClick={(e) => handleJoinRequest(e)}
          >
            &emsp; {"Join Request"} &emsp;
          </Button>
        </AccordionSummary>
        <AccordionDetails>
          <Divider sx={{ mb: 3 }} />
          <Grid
            container
            spacing={0}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Grid item xs={9}>
              <Typography color="text.primary">{"Responsibility: "}</Typography>
              <Typography component="span" color="text.secondary">
                <pre
                  style={{
                    fontFamily: "inherit",
                    whiteSpace: "pre-wrap",
                    display: "inline",
                  }}
                >
                  {resp}
                </pre>
              </Typography>
            </Grid>
            <Grid item xs={1} />

            <Grid item xs={2}>
              <Typography>
                {"Weekly Hours: "}
                {weeklyHour}
              </Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default PositionListItem;
