import { Grid } from "@mui/material";
import ProjectList from "./ProjectList";
import ProjectInfo from "./ProjectInfo";

// the project panel component: project list on the left; selected project info on the right
const ProjectPanel = () => {
  return (
    <Grid
      container
      spaceing={0}
      direction="row"
      mt={1}
      // display="flex"
      // alignItems="center"
      //  justifyContent="center"
    >
      {/* left comp: list of projects */}
      <Grid item xs={4}>
        <ProjectList />
      </Grid>
      {/* right comp: project info  */}
      <Grid item xs={8}>
        <ProjectInfo />
      </Grid>
    </Grid>
  );
};

export default ProjectPanel;
