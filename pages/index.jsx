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
import { findItemFromList } from "../components/Reusable/Resusable";

// this page is also project homepage. Is this a good practice?
// RoT: Reduce redundant local calculations (i.e., find project creator from Users). Don't put any calculation in the comp in map()
// Perfer more centerized, easy-to-review/modify structure, especially for heavy calculation
const Home = () => {
  // context
  const {
    projects,
    setProjects,
    users,
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
  const [curProject, setCurProject] = useState(null); // the selected rpoject
  const [isSearchingClicked, setIsSearchingClicked] = useState(false); // initialize auto set entry flag for searching
  const [isMobileBackClicked, setIsMobileBackClicked] = useState(false); // initialize show list on mobile
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCateList, setSearchCateList] = useState([]);
  const [searchTypeList, setSearchTypeList] = useState([]);

  // build data for this page
  useEffect(() => {
    fetch("/api/v1/projects")
      .then((response) => response.json())
      .then((data) => setProjects(data.data));
  }, [setProjects]);

  console.log(projects);

  return (
    <ProjectContext.Provider
      value={{
        curProject,
        setCurProject,
        isSearchingClicked,
        setIsSearchingClicked,
        isMobileBackClicked,
        setIsMobileBackClicked,
        searchTerm,
        setSearchTerm,
        searchCateList,
        setSearchCateList,
        searchTypeList,
        setSearchTypeList,
      }}
    >
      {!onMedia.onDesktop && curProject === null && <MobileProjectsBar />}

      <Box
        id="projects-main-box"
        sx={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          ":hover": {
            cursor: "default",
          },
        }}
      >
        {onMedia.onDesktop ? (
          <>
            <Box
              id="projects-desktop-list-box"
              sx={{
                paddingTop: 4,
                paddingLeft: 8,
                paddingRight: 2,
                width: "38.88889%",
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
                paddingRight: 8,
                width: "61.11111%",
                maxWidth: "880px",
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
        ) : (
          <>
            <Box
              id="projects-mobile-list-box"
              sx={{
                display: curProject === null ? "block" : "none",
                // paddingTop: 2,
                // paddingLeft: 2,
                width: "100%",
                backgroundColor: "gray100.main",
              }}
            >
              <ProjectList />
            </Box>
            <Box
              id="projects-mobile-info-box"
              sx={{
                display: curProject === null ? "none" : "block",
                // paddingTop: 2,
                // paddingLeft: 2,
                width: "100%",
                backgroundColor: "gray100.main",
              }}
            >
              <ProjectInfo />
            </Box>
          </>
        )}
      </Box>
    </ProjectContext.Provider>
  );
};

export default Home;
