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
  const [creatorUser, setCreatorUser] = useState(null); // the user info of project's creator
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  return (
    <ProjectContext.Provider
      value={{
        project,
        setProject,
        creatorUser,
        setCreatorUser,
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
      <Box
        id="projects-main-box"
        sx={{ display: "flex", justifyContent: "center", overflow: "hidden" }}
      >
        {onMedia.onDesktop ? (
          <Box
            id="projects-desktop-list-box"
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
              id="projects-mobile-list-box"
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
            id="projects-desktop-info-box"
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
              id="projects-mobile-info-box"
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
