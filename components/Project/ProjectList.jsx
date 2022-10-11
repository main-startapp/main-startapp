import { useContext, useMemo, useEffect } from "react";
import NextLink from "next/link";
import { Box, Button, Tooltip } from "@mui/material";
import { GlobalContext, ProjectContext } from "../Context/ShareContexts";
import ProjectListItem from "./ProjectListItem";

// link/router https://stackoverflow.com/questions/65086108/next-js-link-vs-router-push-vs-a-tag
// description: a list of projects (project list items); a button to create new project (router.push)
// behavior: filters projects based on the search term and/or search category
const ProjectList = () => {
  // context
  const { projects, ediumUser, winHeight, onMedia } = useContext(GlobalContext);
  const { searchTerm, searchCategory, setProject } = useContext(ProjectContext);

  // local vars
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
    setProject(projects.length > 0 ? projects[0] : null);
  }, [setProject, projects]);

  return (
    <Box sx={{ backgroundColor: "#fafafa" }}>
      <Box
        sx={{
          height: onMedia.onDesktop
            ? `calc(${winHeight}px - 64px - 64px - 1.5px - 36px - 24px)`
            : `calc(${winHeight}px - 48px - 48px - 1.5px - 60px)`, // navbar; projectbar; border; button; y-margins
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
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: "12px",
          }}
        >
          <Tooltip title={ediumUser?.uid ? "" : "Edit your profile first"}>
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
                  disabled={!ediumUser?.uid}
                  disableElevation
                  sx={{
                    border: 1.5,
                    borderColor: "#dbdbdb",
                    borderRadius: "30px",
                    color: "text.primary",
                    backgroundColor: "#ffffff",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#f6f6f6",
                    },
                    textTransform: "none",
                  }}
                  variant="contained"
                >
                  {"Create Project"}
                </Button>
              </NextLink>
            </span>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default ProjectList;
