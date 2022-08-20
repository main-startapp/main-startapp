import { useContext } from "react";
import NextLink from "next/link";
import { Box, Button, Tooltip } from "@mui/material";
import { GlobalContext, ProjectContext } from "../Context/ShareContexts";
import ProjectListItem from "./ProjectListItem";

// link/router https://stackoverflow.com/questions/65086108/next-js-link-vs-router-push-vs-a-tag
// description: a list of projects (project list items); a button to create new project (router.push)
// behavior: filters projects based on the search term and/or search category
const ProjectList = () => {
  // context
  const { projects, currentStudent } = useContext(GlobalContext);
  const { searchTerm, searchCategory } = useContext(ProjectContext);

  // local vars
  const currentUID = currentStudent?.uid;

  return (
    <>
      <Box
        sx={{
          height: "calc(98vh - 188px)", // navbar: 64px; projectbar: 64px; margin: 24px; create button: 36px
          overflow: "auto",
        }}
      >
        {projects
          .filter((project) => {
            if (!project.isVisible) return;

            // !todo: is this optimized?
            const isInTitles =
              searchTerm !== "" && // lazy evaluation
              (project.title.toLowerCase().includes(searchTerm.toLowerCase()) || // project title
                project.position_list.some(
                  (position) =>
                    position.positionTitle
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) // position title
                ));

            const isInCategory =
              searchCategory !== "" && // lazy evaluation to avoid unnecessary expensive includes()
              project.category
                .toLowerCase()
                .includes(searchCategory.toLowerCase());

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
          })
          .map((project) => (
            <ProjectListItem key={project.id} project={project} />
          ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Tooltip title={currentUID ? "" : "Edit your profile first."}>
          <span>
            <NextLink
              href={{
                pathname: "/project/create",
                query: { isCreateStr: "true" },
              }}
              as="/project/create"
              passHref
            >
              <Button
                disabled={!currentUID}
                disableElevation
                sx={{ borderRadius: 4, backgroundColor: "#3e95c2" }}
                variant="contained"
              >
                {"Create Project"}
              </Button>
            </NextLink>
          </span>
        </Tooltip>
      </Box>
    </>
  );
};

export default ProjectList;
