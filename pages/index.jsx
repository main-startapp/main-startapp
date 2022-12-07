import { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import {
  GlobalContext,
  ProjectContext,
} from "../components/Context/ShareContexts";
import MobileProjectsBar from "../components/Header/MobileProjectsBar";
import ProjectList from "../components/Project/ProjectList";
import ProjectInfo from "../components/Project/ProjectInfo";
import { motion } from "framer-motion";

// this page is also project homepage. Is this a good practice?
// RoT: Reduce redundant local calculations (i.e., find project creator from Users). Don't put any calculation in the comp in map()
// Perfer more centerized, easy-to-review/modify structure, especially for heavy calculation
const Home = () => {
  // context
  const {
    setChat,
    setChatPartner,
    setShowChat,
    setShowMsg,
    onMedia,
    isAnimated,
    setIsAnimated,
  } = useContext(GlobalContext);

  // page setup
  useEffect(() => {
    setShowChat(true);
    setShowMsg(false);
    setChat(null);
    setChatPartner(null);
  }, [setChat, setChatPartner, setShowChat, setShowMsg]);

  // turn off introduction animation after initialization
  useEffect(() => {
    setIsAnimated({ ...isAnimated, projects: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // project state init
  const [fullProject, setFullProject] = useState(null); // the selected project with extra data (creator, tags)
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchTypeList, setSearchTypeList] = useState([]);

  return (
    <ProjectContext.Provider
      value={{
        fullProject,
        setFullProject,
        searchTerm,
        setSearchTerm,
        searchCategory,
        setSearchCategory,
        searchTypeList,
        setSearchTypeList,
      }}
    >
      {!onMedia.onDesktop && <MobileProjectsBar />}

      <Box
        id="projects-main-box"
        sx={{
          display: "flex",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {onMedia.onDesktop ? (
          <>
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
              <motion.div
                initial={isAnimated.projects ? false : { x: -200, opacity: 0 }}
                animate={isAnimated.projects ? false : { x: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <ProjectList />
              </motion.div>
            </Box>
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
              <motion.div
                initial={isAnimated.projects ? false : { y: 200, opacity: 0 }}
                animate={isAnimated.projects ? false : { y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <ProjectInfo />
              </motion.div>
            </Box>
          </>
        ) : fullProject === null ? (
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
        ) : (
          <Box
            id="projects-mobile-info-box"
            sx={{
              paddingTop: 2,
              paddingLeft: 2,
              width: "100%",
              backgroundColor: "hoverGray.main",
            }}
          >
            <ProjectInfo />
          </Box>
        )}
      </Box>
    </ProjectContext.Provider>
  );
};

export default Home;
