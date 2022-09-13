import { useContext, useMemo } from "react";
import NextLink from "next/link";
import { Box, Button, Tooltip } from "@mui/material";
import { GlobalContext, ProjectContext } from "../Context/ShareContexts";
import ProjectListItem from "./ProjectListItem";

// link/router https://stackoverflow.com/questions/65086108/next-js-link-vs-router-push-vs-a-tag
// description: a list of projects (project list items); a button to create new project (router.push)
// behavior: filters projects based on the search term and/or search category
const ProjectList = () => {
  // context
  const { projects, ediumUser, onMedia } = useContext(GlobalContext);
  const { searchTerm, searchCategory } = useContext(ProjectContext);

  // local vars
  const currentUID = ediumUser?.uid;

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        if (!project.is_visible) return;

        // !todo: is this optimized?
        const isInTitles =
          searchTerm !== "" && // lazy evaluation
          (project.title.toLowerCase().includes(searchTerm.toLowerCase()) || // project title
            project.position_list.some(
              (position) =>
                position.title.toLowerCase().includes(searchTerm.toLowerCase()) // position title
            ));

        const isInCategory =
          searchCategory !== "" && // lazy evaluation to avoid unnecessary expensive includes()
          project.category.toLowerCase().includes(searchCategory.toLowerCase());

        if (searchTerm === "" && searchCategory === "") {
          // no search
          return project;
        } else if (
          searchCategory === "" &&
          isInTitles // no Category, only search titles
        ) {
          return project;
        } else if (
          searchTerm === "" &&
          isInCategory // no Term, only search category
        ) {
          return project;
        } else if (
          isInTitles &&
          isInCategory // search both
        ) {
          return project;
        }
      }),
    [projects, searchTerm, searchCategory]
  );

  return (
    <Box sx={{ backgroundColor: "#fafafa" }}>
      <Box
        sx={{
          height: onMedia.onDesktop
            ? "calc(100vh - 64px - 64px - 1.5px - 36px - 24px)"
            : "calc(100vh - 48px - 48px - 1.5px - 60px)", // navbar; projectbar; border; button; y-margins
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
          <Tooltip title={currentUID ? "" : "Edit your profile first"}>
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
                  disabled={!currentUID}
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
