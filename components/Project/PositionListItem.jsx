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
import { useContext, useEffect, useState } from "react";
import { ProjectContext } from "../Context/ShareContexts";

// override the style Accordion Summary
const useStyles = makeStyles({
  customAccordionSummary: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

const PositionListItem = (props) => {
  // context
  const { project } = useContext(ProjectContext);

  // args
  const title = props.title;
  const resp = props.resp;
  const weeklyHour = props.weeklyHour;
  const isCreator = props.isCreator;

  // override Accordion style to use justifyConent
  const classes = useStyles();

  // useEffect to reset accordion expansion
  const [expandState, setExpandState] = useState("collapseIt");
  useEffect(() => {
    setExpandState("collpaseIt");
  }, [project]); // every time project changes, this sets each accordion to collapse

  const handleExpand = (e) => {
    expandState === "expandIt"
      ? setExpandState("collapseIt")
      : setExpandState("expandIt");
  };
  const handleJoinRequest = (e) => {
    e.stopPropagation();
  };

  return (
    <Box sx={{ m: 3 }}>
      <Accordion
        // TransitionProps={{ unmountOnExit: true }}
        expanded={expandState === "expandIt"}
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
          onClick={(e) => handleExpand(e)}
        >
          <Typography color="text.primary">{title}</Typography>
          {!isCreator && (
            <Button
              variant="contained"
              size="small"
              sx={{ mr: 3, borderRadius: 4, bgcolor: "#3e95c2" }}
              disableElevation
              onClick={(e) => handleJoinRequest(e)}
            >
              &emsp; {"Join Request"} &emsp;
            </Button>
          )}
        </AccordionSummary>
        <AccordionDetails>
          <Divider sx={{ mb: 3 }} />
          <Grid
            container
            spacing={0}
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={9}>
              <Typography color="text.primary">
                {"Responsibilities: "}
              </Typography>
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
