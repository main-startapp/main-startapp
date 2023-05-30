// react
import { useContext, useMemo, useEffect } from "react";
// next
import NextLink from "next/link";
import Router from "next/router";
// mui
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// edium
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

// link/router https://stackoverflow.com/questions/65086108/next-js-link-vs-router-push-vs-a-tag
// description: a list of projects (project list items); a button to create new project (router.push)
// behavior: filters projects based on the search term and/or search category
const ProjectList = () => {
  // context
  const { ediumUser, onMedia } = useContext(GlobalContext);
  const {
    fullProject,
    setFullProject,
    fullProjects,
    isSearchingClicked,
    setIsSearchingClicked,
    isMobileBackClicked,
    setIsMobileBackClicked,
    searchTerm,
    searchCateList,
    searchTypeList,
  } = useContext(ProjectContext);
  const theme = useTheme();

  // project list with filtering
  // 1st, filtering visibility and category
  const fullProjectsWIP1st = useMemo(() => {
    return fullProjects?.filter((fullProject) => {
      // filter out invisible entry
      if (!fullProject.project.is_visible) return false;
      // return everything else if no category search
      if (searchCateList.length === 0) return true;
      // else return entries match category
      return searchCateList.some((cate) => {
        return fullProject.project.category === cate;
      });
    });
  }, [fullProjects, searchCateList]);

  // 2nd, filtering type
  const fullProjectsWIP2nd = useMemo(() => {
    // return prev list if no type search
    if (searchTypeList.length === 0) return fullProjectsWIP1st;

    // else return entries match type
    return fullProjectsWIP1st?.filter((fullProject) => {
      return searchTypeList.some((type) => {
        return fullProject.project.type === type;
      });
    });
  }, [fullProjectsWIP1st, searchTypeList]);

  // 3rd, filtering term, the most expensive one
  const filteredFullProjects = useMemo(() => {
    // return prev list if no term search
    if (searchTerm === "") return fullProjectsWIP2nd;

    // else return entries match term
    return fullProjectsWIP2nd?.filter((fullProject) => {
      return (
        isStrInStr(fullProject.project.title, searchTerm, false) ||
        isStrInObjList(
          fullProject.project.position_list,
          "title",
          searchTerm,
          false
        ) ||
        isStrInStrList(fullProject.allTags, searchTerm, true)
      ); // in project title partially || in position title partially || in tags exactly
    });
  }, [fullProjectsWIP2nd, searchTerm]);

  // project query & auto set initial project
  useEffect(() => {
    // trigger 1 (desktop): app can't distinguish between searching list change and click an entry (case 1 both arey query && current entry), thus isSearchingClicked flag was introduced
    // trigger 2 (mobile): mobile app can't distinguish between user input a query or user clicked back button (case 2 both are query && !current entry), thus isMobileBackClicked flag was introduced
    // case 1 (desktop & mobile): user click a new entry => current entry, update url
    // case 1.1 (desktop & mobile): if query and current entry exist and are equal, do nothing
    // case 2 (desktop & mobile): user directly input a url with a valid query => query && !current entry, set it to user's
    // case 3 (desktop): the query is invalid or no query => !query && !current entry, set it to the 1st entry then update url
    // case 3.1 (mobile): on mobile, remove query
    if (onMedia.onDesktop && isSearchingClicked) {
      // user changed searching settings (onDesktop && searching clicked => show 1st entry)
      if (filteredFullProjects?.length > 0) {
        setFullProject(filteredFullProjects[0]);
        shallowUpdateURLQuery(
          Router.pathname,
          "pid",
          filteredFullProjects[0].project.id
        );
      } else {
        setFullProject(null);
        shallowUpdateURLQuery(Router.pathname, null, null);
      }
      setIsSearchingClicked(false);
      return; // trigger 1
    }

    if (!onMedia.onDesktop && isMobileBackClicked) {
      // user clicked back button on mobile (onMobile && back button clicked) => show mobile list without url query
      shallowUpdateURLQuery(Router.pathname, null, null);
      setIsMobileBackClicked(false);
      return; // trigger 2
    }

    const queryPID = Router.query?.pid;
    const currentPID = fullProject?.project?.id;

    if (currentPID && currentPID === queryPID) return; // case 1.1

    if (currentPID) {
      // user clicked a new entry on the list (currentID && currentID != queryID) => display query id
      // case 1.1 can be merged with this, it will do a redundant shallowUpdate
      shallowUpdateURLQuery(Router.pathname, "pid", fullProject.project.id);
      return; // case 1
    }

    if (queryPID) {
      const foundFullProject = filteredFullProjects?.find(
        (filteredFullProject) => filteredFullProject.project.id === queryPID
      );
      if (foundFullProject) {
        // user directly input a url with valid query (no currentID && found queryID) => set this found entry
        setFullProject(foundFullProject);
        return; // case 2
      }
    }

    if (!onMedia.onDesktop && filteredFullProjects?.length > 0) {
      // user input url with no query or invalid query on mobile (no currentID && onMobile && back button not clicked && can't find query) => show mobile list without url query
      // entries length check to ensure filtered entry list has finished calculation
      shallowUpdateURLQuery(Router.pathname, null, null);
      return; // case 3.1
    }

    if (onMedia.onDesktop && filteredFullProjects?.length > 0) {
      // user input url with no query or invalid query on desktop (no currentID && onDekstop && can't find query) => set the 1st entry and update url query
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
    isMobileBackClicked,
    isSearchingClicked,
    onMedia.onDesktop,
    setFullProject,
    setIsMobileBackClicked,
    setIsSearchingClicked,
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
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Tooltip
            title={!ediumUser?.uid ? "Sign in or Edit profile" : ""}
            style={{ width: "100%" }} // !important: make create button fullwidth
          >
            <span>
              <Button
                sx={{
                  height: "48px",
                  borderRadius: 8,
                }}
                color="secondary"
                disabled={!ediumUser?.uid}
                disableElevation
                fullWidth
                variant="contained"
                LinkComponent={NextLink}
                href="/projects/create"
              >
                <Typography variant="button" sx={{ fontSize: "1.125rem" }}>
                  {"Create Project"}
                </Typography>
              </Button>
            </span>
          </Tooltip>
        </Box>
      )}
    </FixedHeightPaper>
  );
};

export default ProjectList;
