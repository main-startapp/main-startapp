import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Button } from "@mui/material";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { ProjectContext } from "../Context/ProjectContext";
import ProjectListItem from "./ProjectListItem";
// import { makeStyles } from "@mui/styles";

// the project list comp: consists of project list items; will filter based on the search term and/or search category
const ProjectList = () => {
  // context
  const { searchTerm, searchCategory } = useContext(ProjectContext);

  // project list state
  const [projects, setProjects] = useState([]); // don't be confused with [project, setProject]

  // https://stackoverflow.com/questions/59841800/react-useeffect-in-depth-use-of-useeffect
  // useEffect(() => {}, []) initializing comps state by data fetching once
  useEffect(() => {
    // db query
    const collectionRef = collection(db, "projects");
    const q = query(collectionRef, orderBy("last_timestamp", "desc"));

    // Get realtime updates with Cloud Firestore
    // https://firebase.google.com/docs/firestore/query-data/listen
    const unsub = onSnapshot(q, (querySnapshot) => {
      setProjects(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          last_timestamp: doc.data().last_timestamp?.toDate().getTime(),
        }))
      );
    });

    return unsub;
  }, []);

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
          maxHeight: "calc(96vh - 188px)", // navbar: 64px; projectbar: 64px; create project button: 36px; margin: 24px
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
            // Project State Props
            <ProjectListItem key={project.id} project={project} />
          ))}
      </Box>
      <Box mt={3} sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          disableElevation
          sx={{ background: "#3e95c2" }}
          onClick={() => createProject()}
        >
          {"Create Project"}
        </Button>
      </Box>
    </>
  );
};

export default ProjectList;
