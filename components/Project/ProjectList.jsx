import { useContext, useMemo, useEffect } from "react";
import NextLink from "next/link";
import { Box, Button, Paper, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { GlobalContext, ProjectContext } from "../Context/ShareContexts";
import ProjectListItem from "./ProjectListItem";
import ProjectListHeader from "./ProjectListHeader";
import { findItemFromList } from "../Reusable/Resusable";

// link/router https://stackoverflow.com/questions/65086108/next-js-link-vs-router-push-vs-a-tag
// description: a list of projects (project list items); a button to create new project (router.push)
// behavior: filters projects based on the search term and/or search category
const ProjectList = () => {
  // context
  const { projects, users, ediumUser, winHeight, onMedia } =
    useContext(GlobalContext);
  const { searchTerm, searchCategory, searchType, setProject, setCreatorUser } =
    useContext(ProjectContext);
  const theme = useTheme();

  // project list with filtering
  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        if (!project.is_visible) return false;
        if (searchTerm === "" && searchType.length === 0) return true;

        // !todo: is this optimized?
        // lazy evaluation to avoid unnecessary expensive includes() / some()
        const isInTitles =
          searchTerm !== "" &&
          (project.title.toLowerCase().includes(searchTerm.toLowerCase()) || // project title
            project.position_list.some(
              (position) =>
                position.title.toLowerCase().includes(searchTerm.toLowerCase()) // position title
            ));
        const isInType =
          searchType !== [] &&
          searchType.some(
            (typeName) =>
              typeName.toLowerCase() === project.category.toLowerCase()
          );

        if (isInTitles || isInType) return true;
      }),
    [projects, searchTerm, searchType]
  );

  // set initial project to be first in list to render out immediately; to simulate the click event, creator also needs to be set
  useEffect(() => {
    if (!onMedia.onDesktop) return;

    if (filteredProjects?.length > 0) {
      setProject(filteredProjects[0]);
      setCreatorUser(
        findItemFromList(users, "uid", filteredProjects[0]?.creator_uid)
      );
    } else {
      setProject(null);
      setCreatorUser(null);
    }
  }, [setProject, setCreatorUser, filteredProjects, onMedia.onDesktop, users]);

  return (
    <Paper
      elevation={onMedia.onDesktop ? 2 : 0}
      sx={{
        // mt: onMedia.onDesktop ? 4 : 2,
        // ml: onMedia.onDesktop ? 4 : 2,
        // mr: onMedia.onDesktop ? 2 : 0,
        backgroundColor: "background.paper",
        borderTop: onMedia.onDesktop ? 1 : 0,
        borderColor: "divider",
        borderRadius: onMedia.onDesktop
          ? "32px 32px 0px 0px"
          : "32px 0px 0px 0px",
        paddingTop: "32px",
      }}
    >
      {onMedia.onDesktop && <ProjectListHeader />}

      <Box
        id="projectlist-projectlistitem-box"
        sx={{
          height: onMedia.onDesktop
            ? `calc(${winHeight}px - 65px - ${theme.spacing(
                4
              )} - 1px - 32px - 112px - 29px - 96px)` // navbar; spacing; paper t-border; paper t-padding; header; button box
            : `calc(${winHeight}px - 64px - ${theme.spacing(
                2
              )} - 32px + 1px - 65px)`, // mobile bar; spacing margin; inner t-padding; last entry border; bottom navbar
          overflowY: "scroll",
        }}
      >
        {filteredProjects.map((project, index) => (
          <ProjectListItem
            key={project.id}
            project={project}
            index={index}
            last={filteredProjects.length - 1}
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
            style={{ width: "100%" }}
          >
            <span>
              <NextLink
                href={{
                  pathname: "/projects/create",
                  query: { isCreateStr: "true" },
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
    </Paper>
  );
};

export default ProjectList;
