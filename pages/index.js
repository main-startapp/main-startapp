import { useContext, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import {
  GlobalContext,
  ProjectContext,
} from "../components/Context/ShareContexts";
import ProjectPageBar from "../components/Header/ProjectPageBar";
import ProjectList from "../components/Project/ProjectList";
import ProjectInfo from "../components/Project/ProjectInfo";

// this page is also project homepage. Is this a good practice?
export default function Home() {
  // global context
  const { setChat, setShowChat, setShowMsg } = useContext(GlobalContext);
  useEffect(() => {
    setShowChat(true);
    setShowMsg(false);
    setChat(null);
  }, [setChat, setShowChat, setShowMsg]);

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
      <ProjectPageBar />
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
          <ProjectList />
        </Grid>
        {/* right comp: selected project's info  */}
        <Grid item xs={8}>
          <ProjectInfo />
        </Grid>
      </Grid>
    </ProjectContext.Provider>
  );
}
