import { useContext, useMemo, useEffect } from "react";
import NextLink from "next/link";
import {
  Box,
  Button,
  Paper,
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
    if (onMedia.onDesktop) setProject(projects.length > 0 ? projects[0] : null);
  }, [setProject, projects, onMedia.onDesktop]);

  return (
    <Paper
      elevation={2}
      sx={{
        mt: 4,
        mr: 4,
        backgroundColor: "background",
        border: 1.5,
        borderColor: "divider",
        borderRadius: "30px 30px 0px 0px",
      }}
    >
      {onMedia.onDesktop && <ProjectListHeader />}

      <Box
        id="projectlist-projectlistitem-box"
        sx={{
          height: onMedia.onDesktop
            ? `calc(${winHeight}px - 64px - 1.5px - ${theme.spacing(
                4
              )} - 1.5px - 137px - 36px - 2*${theme.spacing(2)} - 1.5px)` // navbar; navbar b border; spacing; paper t border; header; button; 2*y-margins; paper b border
            : `calc(${winHeight}px - 48px - 48px - 1.5px - 60px)`,
          overflow: "auto",
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
            mt: 2,
            mb: 2,
            paddingX: 2,
          }}
        >
          {/* <Tooltip title={ediumUser?.uid ? "" : "Edit your profile first"}>
            <span></span>
          </Tooltip> */}
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
                height: "36px",
                borderRadius: "10px",
              }}
            >
              <Typography variant="button">{"Create Project"}</Typography>
            </Button>
          </NextLink>
        </Box>
      )}
    </Paper>
  );
};

export default ProjectList;
