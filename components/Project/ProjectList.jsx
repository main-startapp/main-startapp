import { useContext, useMemo, useEffect } from "react";
import NextLink from "next/link";
import { Box, Button, Paper, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { GlobalContext, ProjectContext } from "../Context/ShareContexts";
import ProjectListItem from "./ProjectListItem";
import ProjectListHeader from "./ProjectListHeader";
import {
  findItemFromList,
  FixedHeightPaper,
  isStrInObjList,
  isStrInStr,
  isStrInStrList,
  shallowUpdateURLQuery,
} from "../Reusable/Resusable";
import Router from "next/router";

// link/router https://stackoverflow.com/questions/65086108/next-js-link-vs-router-push-vs-a-tag
// description: a list of projects (project list items); a button to create new project (router.push)
// behavior: filters projects based on the search term and/or search category
const ProjectList = () => {
  // context
  const { projects, users, ediumUser, onMedia } = useContext(GlobalContext);
  const {
    fullProject,
    setFullProject,
    isMobileBackClicked,
    setIsMobileBackClicked,
    searchTerm,
    searchTypeList,
  } = useContext(ProjectContext);
  const theme = useTheme();

  // projects with extra info from other dataset (creator, merged tags)
  const fullProjects = useMemo(() => {
    return projects?.map((project) => {
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
      // category
      projectTags.push(project?.category?.toLowerCase()); // type
      return {
        project: project,
        creator: projectCreator,
        allTags: projectTags,
      };
    });
  }, [projects, users]);

  // project list with filtering
  const filteredFullProjects = useMemo(() => {
    return fullProjects?.filter((fullProject) => {
      if (!fullProject.project.is_visible) return false;

      if (searchTerm === "" && searchTypeList.length === 0) {
        return true; // no search
      } else if (searchTerm !== "" && searchTypeList.length === 0) {
        return (
          isStrInStr(fullProject.project.title, searchTerm, false) ||
          isStrInObjList(
            fullProject.project.position_list,
            "title",
            searchTerm,
            false
          )
        ); // only term: in project title || position title
      } else if (searchTerm === "" && searchTypeList.length > 0) {
        return searchTypeList.some((type) => {
          return isStrInStrList(fullProject.allTags, type, true);
        }); // only tags
      } else {
        return (
          searchTypeList.some((type) => {
            return isStrInStrList(fullProject.allTags, type, true);
          }) &&
          (isStrInStr(fullProject.project.title, searchTerm, false) ||
            isStrInObjList(
              fullProject.project.position_list,
              "title",
              searchTerm,
              false
            ))
        ); // term && tags
      }
    });
  }, [fullProjects, searchTerm, searchTypeList]);

  // project query & auto set initial project
  // project query & auto set initial project
  useEffect(() => {
    const queryPID = Router.query?.pid;
    const currentPID = fullProject?.project?.id;
    // case 1 (desktop & mobile): user click a new entry => current entry, update url
    // case 1.1 (desktop & mobile): if they exist and are equal, do nothing
    // case 2 (desktop & mobile): user directly input a url with a valid query => query && !current entry, set it to user's
    // case 2.1 (mobile): mobile app can't distinguish between user input a query or user clicked back button (since both are query && !current entry), thus isMobileBackClicked flag was introduced
    // case 3 (desktop): the query is invalid or no query => !query && !current entry, set it to the 1st entry then update url
    // case 3.1 (mobile): on mobile, remove query
    if (currentPID && currentPID === queryPID) return; // case 1.1

    if (currentPID) {
      // user clicked a new project on the list (currentPID && currentPID != queryPID) => display query pid
      // case 1.1 can be merged with this, it will do a redundant shallowUpdate
      shallowUpdateURLQuery(Router.pathname, "pid", fullProject.project.id);
      return; // case 1
    }

    if (!onMedia.onDesktop && isMobileBackClicked) {
      // user clicked back button on mobile (no currentPID && onMobile && back button clicked) => show mobile list without url query
      shallowUpdateURLQuery(Router.pathname, null, null);
      setIsMobileBackClicked(false);
      return; // case 2.1
    }

    if (queryPID) {
      const foundFullProject = filteredFullProjects.find(
        (filteredfullProject) => filteredfullProject.project.id === queryPID
      );
      if (foundFullProject) {
        // user directly input a url with valid query (no currentPID && found project with queryPID) => set this found project
        setFullProject(foundFullProject);
        return; // case 2
      }
    }

    if (!onMedia.onDesktop && filteredFullProjects.length > 0) {
      // user input url with no query or invalid query on mobile (no currentPID && onMobile && back button not clicked && can't find query) => show mobile list without url query
      // project length check to ensure filteredFullProject list has finished calculation
      shallowUpdateURLQuery(Router.pathname, null, null);
      return; // case 3.1
    }

    if (onMedia.onDesktop && filteredFullProjects.length > 0) {
      // user input url with no query or invalid query on desktop (no currentPID && onDekstop && can't find query) => set the 1st project and update url query
      setFullProject(filteredFullProjects[0]);
      shallowUpdateURLQuery(
        Router.pathname,
        "pid",
        filteredFullProjects[0].project.id
      );
      return; // case 3
    }
  }, [
    filteredFullProjects,
    fullProject?.project?.id,
    onMedia.onDesktop,
    setFullProject,
    isMobileBackClicked,
    setIsMobileBackClicked,
  ]);

  // https://stackoverflow.com/questions/45767405/the-difference-between-flex1-and-flex-grow1
  // https://stackoverflow.com/questions/43520932/make-flex-grow-expand-items-based-on-their-original-size
  return (
    <FixedHeightPaper
      elevation={onMedia.onDesktop ? 2 : 0}
      isdesktop={onMedia.onDesktop ? 1 : 0}
      mobileheight={160}
      sx={{
        paddingTop: onMedia.onDesktop ? "32px" : 0,
      }}
    >
      {onMedia.onDesktop && <ProjectListHeader />}

      <Box
        id="projectlist-items-box"
        sx={{
          flexGrow: 1,
          overflowY: "scroll",
        }}
      >
        {filteredFullProjects?.map((fullProject, index) => (
          <ProjectListItem
            key={fullProject?.project?.id}
            fullProject={fullProject}
            index={index}
            last={filteredFullProjects.length - 1}
          />
        ))}
      </Box>

      {onMedia.onDesktop && (
        <Box
          id="projectlist-button-box"
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingY: 3,
            paddingX: 2,
          }}
        >
          <Tooltip
            title={ediumUser?.uid ? "" : "Edit your profile first"}
            style={{ width: "100%" }} // !important: make create button fullwidth
          >
            <span>
              <NextLink
                href={{
                  pathname: "/projects/create",
                }}
                as="/projects/create"
                passHref
              >
                <Button
                  color="secondary"
                  disabled={!ediumUser?.uid}
                  disableElevation
                  fullWidth
                  variant="contained"
                  sx={{
                    height: "48px",
                    borderRadius: 8,
                  }}
                >
                  <Typography variant="button" sx={{ fontSize: "1.125rem" }}>
                    {"Create Project"}
                  </Typography>
                </Button>
              </NextLink>
            </span>
          </Tooltip>
        </Box>
      )}
    </FixedHeightPaper>
  );
};

export default ProjectList;
