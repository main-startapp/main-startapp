import { useContext } from "react";
import { useRouter } from "next/router";
import { Box, Button, Tooltip } from "@mui/material";
import { ProjectContext } from "../Context/ShareContexts";
import ProjectListItem from "./ProjectListItem";
// import { makeStyles } from "@mui/styles";

// description: a list of projects (project list items); a button to create new project (router.push)
// behavior: filters projects based on the search term and/or search category
const ProjectList = () => {
  // context
  const { projects, searchTerm, searchCategory, currentStudent } =
    useContext(ProjectContext);

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
          maxHeight: "calc(99vh - 188px)", // navbar: 64px; projectbar: 64px; create project button: 36px; margin: 24px
          overflow: "auto",
        }}
      >
        {projects
          .filter((project) => {
            // !todo: is this optimized?
            const isInTitles =
              searchTerm != "" && // lazy evaluation
              (project.title.toLowerCase().includes(searchTerm.toLowerCase()) || // project title
                project.position_list.some(
                  (position) =>
                    position.positionTitle
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) // position title
                ));

            const isInCategory =
              searchCategory != "" && // lazy evaluation to avoid unnecessary expensive includes()
              project.category
                .toLowerCase()
                .includes(searchCategory.toLowerCase());

            if (searchTerm == "" && searchCategory == "") {
              // no search
              return project;
            } else if (
              searchCategory == "" &&
              isInTitles // no Category, only search titles
            ) {
              return project;
            } else if (
              searchTerm == "" &&
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
        {!currentUID && (
          <Tooltip title="Edit your profile first.">
            <span>
              <Button
                variant="contained"
                disabled
                sx={{ borderRadius: 4, bgcolor: "#3e95c2" }}
                disableElevation
              >
                {"Create Project"}
              </Button>
            </span>
          </Tooltip>
        )}
        {currentUID && (
          <Button
            variant="contained"
            sx={{ borderRadius: 4, bgcolor: "#3e95c2" }}
            disableElevation
            onClick={() => createProject()}
          >
            {"Create Project"}
          </Button>
        )}
      </Box>
    </>
  );
};

export default ProjectList;
