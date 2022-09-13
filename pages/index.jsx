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
  const { setChat, setChatPartner, setShowChat, setShowMsg, onMedia } =
    useContext(GlobalContext);
  useEffect(() => {
    setShowChat(true);
    setShowMsg(false);
    setChat(null);
    setChatPartner(null);
  }, [setChat, setChatPartner, setShowChat, setShowMsg]);

  // project state init
  const [project, setProject] = useState(null); // thec selected project
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
      {/* Toolbar for searching keywords, category and filter */}
      <ProjectsPageBar />

      <Grid
        container
        spaceing={0}
        direction="row"
        alignItems="start"
        justifyContent="center"
      >
        {/* left part: project list */}
        {onMedia.onDesktop ? (
          <Grid item xs={4}>
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
          <Grid item xs={8}>
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
