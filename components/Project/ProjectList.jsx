import { useContext } from "react";
import { useRouter } from "next/router";
import { Box, Button, Tooltip } from "@mui/material";
import { GlobalContext, ProjectContext } from "../Context/ShareContexts";
import ProjectListItem from "./ProjectListItem";

// description: a list of projects (project list items); a button to create new project (router.push)
// behavior: filters projects based on the search term and/or search category
const ProjectList = () => {
  // context
  const { currentStudent } = useContext(GlobalContext);
  const { projects, searchTerm, searchCategory } = useContext(ProjectContext);

  // local vars
  const currentUID = currentStudent?.uid;

  // link/router https://stackoverflow.com/questions/65086108/next-js-link-vs-router-push-vs-a-tag
  const router = useRouter();

  // similar func updateProject() in ProjectInfo.jsx
  const createProject = () => {
    router.push(
      {
        pathname: `/project/create`,
        query: { isCreateStr: "true", projectStr: "null" },
      },
      `/project/create` // "as" argument
    );
  };

  return (
    <>
      <Box
        sx={{
          height: "calc(98vh - 188px)", // navbar: 64px; projectbar: 64px; create project button: 36px; margin: 24px
          overflow: "auto",
        }}
      >
        {projects
          .filter((project) => {
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

      <Box mt={3} sx={{ display: "flex", justifyContent: "center" }}>
        <Tooltip title={currentUID ? "" : "Edit your profile first."}>
          <span>
            <Button
              disabled={!currentUID}
              disableElevation
              sx={{ borderRadius: 4, bgcolor: "#3e95c2" }}
              variant="contained"
              onClick={() => createProject()}
            >
              {"Create Project"}
            </Button>
          </span>
        </Tooltip>
      </Box>
    </>
  );
};

export default ProjectList;
