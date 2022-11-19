import { useContext, useMemo, useEffect } from "react";
import NextLink from "next/link";
import {
  Box,
  Button,
  Paper,
  Slide,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { GlobalContext, ProjectContext } from "../Context/ShareContexts";
import ProjectListItem from "./ProjectListItem";
import ProjectListHeader from "./ProjectListHeader";

// link/router https://stackoverflow.com/questions/65086108/next-js-link-vs-router-push-vs-a-tag
// description: a list of projects (project list items); a button to create new project (router.push)
// behavior: filters projects based on the search term and/or search category
const ProjectList = () => {
  // context
  const { projects, ediumUser, winHeight, onMedia } = useContext(GlobalContext);
  const { searchTerm, searchCategory, setProject } = useContext(ProjectContext);
  const theme = useTheme();

  // project list with filtering
  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        if (!project.is_visible) return;
        if (searchTerm === "" && searchCategory === "") return project;

        // !todo: is this optimized?
        // lazy evaluation
        const isInTitles =
          searchTerm !== "" &&
          (project.title.toLowerCase().includes(searchTerm.toLowerCase()) || // project title
            project.position_list.some(
              (position) =>
                position.title.toLowerCase().includes(searchTerm.toLowerCase()) // position title
            ));
        const isInCategory =
          searchCategory !== "" && // lazy evaluation to avoid unnecessary expensive includes()
          project.category.toLowerCase().includes(searchCategory.toLowerCase());

        if (isInTitles || isInCategory) return project;
      }),
    [projects, searchTerm, searchCategory]
  );

  // set initial project to be first in list to render out immediately
  useEffect(() => {
    if (onMedia.onDesktop)
      setProject(filteredProjects.length > 0 ? filteredProjects[0] : null);
  }, [setProject, filteredProjects, onMedia.onDesktop]);

  return (
    <Slide direction="right" in={Boolean(filteredProjects)}>
      <Paper
        elevation={onMedia.onDesktop ? 2 : 0}
        sx={{
          // mt: onMedia.onDesktop ? 4 : 2,
          // ml: onMedia.onDesktop ? 4 : 2,
          // mr: onMedia.onDesktop ? 2 : 0,
          backgroundColor: "background",
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
                )} - 1px - 32px - 112px - 96px)` // navbar; spacing; paper t-border; paper t-padding; header; button box
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
    </Slide>
  );
};

export default ProjectList;
