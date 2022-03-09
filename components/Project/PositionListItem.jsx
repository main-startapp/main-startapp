import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  ListItem,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const PositionListItem = ({ name, resp, weeklyHour, uid }) => {
  return (
    <Box m={3}>
      <Accordion
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
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Divider />
          <Box mt={3} display="flex" justifyContent="space-between">
            <Typography>
              {"Responsibility: "}
              {resp}
            </Typography>
            <Typography>
              {"Weekly Hours: "}
              {weeklyHour}
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default PositionListItem;
