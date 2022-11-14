import { useContext, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import {
  GlobalContext,
  ProjectContext,
} from "../components/Context/ShareContexts";
import ProjectsPageBar from "../components/Header/ProjectsPageBar";
import ProjectList from "../components/Project/ProjectList";
import ProjectInfo from "../components/Project/ProjectInfo";

// this page is also project homepage. Is this a good practice?
const Home = () => {
  // global context
  const {
    setChat,
    setChatPartner,
    setShowChat,
    setShowMsg,
    setOldProject,
    onMedia,
  } = useContext(GlobalContext);

  useEffect(() => {
    setShowChat(true);
    setShowMsg(false);
    setChat(null);
    setChatPartner(null);
    // project page related
    setOldProject(null);
  }, [setChat, setChatPartner, setShowChat, setShowMsg, setOldProject]);

  // project state init
  const [project, setProject] = useState(null); // the selected project
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  return (
    <ProjectContext.Provider
      value={{
        project,
        setProject,
        searchTerm,
        setSearchTerm,
        searchCategory,
        setSearchCategory,
      }}
    >
      <Grid
        container
        spaceing={0}
        direction="row"
        alignItems="start"
        justifyContent="center"
      >
        {/* left part: project list */}
        {onMedia.onDesktop ? (
          <Grid item xs={3.5}>
            <ProjectList />
          </Grid>
        ) : (
          project === null && (
            <Grid item xs={12}>
              <ProjectList />
            </Grid>
          )
        )}
        {/* right part: project info */}
        {onMedia.onDesktop ? (
          <Grid item xs={5.5}>
            <ProjectInfo />
          </Grid>
        ) : (
          project !== null && (
            <Grid item xs={12}>
              <ProjectInfo />
            </Grid>
          )
        )}
      </Grid>
    </ProjectContext.Provider>
  );
};

export default Home;
