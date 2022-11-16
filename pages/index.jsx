import { useContext, useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import {
  GlobalContext,
  ProjectContext,
} from "../components/Context/ShareContexts";
import MobileProjectsBar from "../components/Header/MobileProjectsBar";
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
    winWidth,
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
      {!onMedia.onDesktop && <MobileProjectsBar />}

      {/* <Grid
        container
        spacing={0}
        direction="row"
        sx={{
          alignItems: "start",
          justifyContent: "center",
          backgroundColor: onMedia.onDesktop ? "background" : "hoverGray.main",
        }}
      >
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
      </Grid> */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {onMedia.onDesktop ? (
          <Box
            sx={{
              paddingTop: 4,
              paddingLeft: 4,
              paddingRight: 2,
              width: "38.46%",
              maxWidth: "560px",
            }}
          >
            <ProjectList />
          </Box>
        ) : (
          project === null && (
            <Box
              sx={{
                paddingTop: 2,
                paddingLeft: 2,
                width: "100%",
                backgroundColor: "hoverGray.main",
              }}
            >
              <ProjectList />
            </Box>
          )
        )}
        {onMedia.onDesktop ? (
          <Box
            sx={{
              paddingTop: 4,
              paddingLeft: 2,
              paddingRight: 4,
              width: "61.54%",
              maxWidth: "896px",
            }}
          >
            <ProjectInfo />
          </Box>
        ) : (
          project !== null && (
            <Box
              sx={{
                paddingTop: 2,
                paddingLeft: 2,
                paddingRight: 2,
                width: "100%",
                backgroundColor: "hoverGray.main",
              }}
            >
              <ProjectInfo />
            </Box>
          )
        )}
      </Box>
    </ProjectContext.Provider>
  );
};

export default Home;
