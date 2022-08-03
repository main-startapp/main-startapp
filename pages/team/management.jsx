import { Grid } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import {
  GlobalContext,
  TeamContext,
} from "../../components/Context/ShareContexts";
import TeamInfo from "../../components/Team/TeamInfo";
import TeamProjectList from "../../components/Team/TeamProjectList";

const TeamManagement = () => {
  // chat context
  const { setChat, setShowChat, setShowMsg } = useContext(GlobalContext);
  useEffect(() => {
    setShowChat(true);
    setShowMsg(false);
    setChat(null);
  }, [setChat, setShowChat, setShowMsg]);

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
        <Grid item xs={3}>
          <TeamProjectList />
        </Grid>
        {/* right comp: selected project's info  */}
        <Grid item xs={9}>
          <TeamInfo />
        </Grid>
      </Grid>
    </TeamContext.Provider>
  );
};

export default TeamManagement;
