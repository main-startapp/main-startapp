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
  const [fullProject, setFullProject] = useState(null); // the selected project with extra data (creator, tags)
  const [fullProjects, setFullProjects] = useState([]); // the projects list with extra data
  const [isSearchingClicked, setIsSearchingClicked] = useState(false); // initialize auto set entry flag for searching
  const [isMobileBackClicked, setIsMobileBackClicked] = useState(false); // initialize show list on mobile
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchTypeList, setSearchTypeList] = useState([]);

  // build data for this page
  // projects with extra info from other dataset (creator, merged tags)
  useEffect(() => {
    setFullProjects(
      projects?.map((project) => {
        // creator
        const projectCreator = findItemFromList(
          users,
          "uid",
          project?.creator_uid
        );
        // allTags
        let projectTags = [];
        if (project?.tags?.length > 0) {
          projectTags = projectTags.concat(project.tags); // project tags
        }
        if (
          projectCreator?.role === "org_admin" &&
          projectCreator?.org_tags?.length > 0
        ) {
          projectTags = projectTags.concat(projectCreator.org_tags); // org tags
        }
        // type
        projectTags.push(project?.type?.toLowerCase());
        return {
          project: project,
          creator: projectCreator,
          allTags: projectTags,
        };
      })
    );
  }, [projects, users]);

  return (
    <ProjectContext.Provider
      value={{
        fullProject,
        setFullProject,
        fullProjects,
        setFullProjects,
        isSearchingClicked,
        setIsSearchingClicked,
        isMobileBackClicked,
        setIsMobileBackClicked,
        searchTerm,
        setSearchTerm,
        searchCategory,
        setSearchCategory,
        searchTypeList,
        setSearchTypeList,
      }}
    >
      {!onMedia.onDesktop && fullProject === null && <MobileProjectsBar />}

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
                display: fullProject === null ? "block" : "none",
                paddingTop: 2,
                paddingLeft: 2,
                width: "100%",
                backgroundColor: "gray100.main",
              }}
            >
              <ProjectList />
            </Box>
            <Box
              id="projects-mobile-info-box"
              sx={{
                display: fullProject === null ? "none" : "block",
                paddingTop: 2,
                paddingLeft: 2,
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
