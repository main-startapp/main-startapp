import { Grid } from "@mui/material";
import { useState } from "react";
import { TeamContext } from "../../components/Context/ShareContexts";
import TeamInfo from "../../components/Team/TeamInfo";
import TeamProjectList from "../../components/Team/TeamProjectList";

const TeamManagement = () => {
  // team states init
  const [project, setProject] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]);

  return (
    <TeamContext.Provider
      value={{ project, setProject, joinRequests, setJoinRequests }}
    >
      <Grid
        container
        spaceing={0}
        mt={1}
        direction="row"
        alignItems="start"
        justifyContent="center"
      >
        {/* left comp: list of projects */}
        <Grid item xs={4}>
          <TeamProjectList />
        </Grid>
        {/* right comp: selected project's info  */}
        <Grid item xs={8}>
          <TeamInfo />
        </Grid>
      </Grid>
    </TeamContext.Provider>
  );
};

export default TeamManagement;
