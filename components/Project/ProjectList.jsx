import { collection, query, orderBy, onSnapshot } from "@firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../../firebase";
import Project from "../Project";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { ProjectContext } from "../../pages/ProjectContext";
import { useRouter } from "next/router";

// a list of Project component
const ProjectList = () => {
  const [projects, setProjects] = useState([]); // don't be confused with [project, setProject]

  useEffect(() => {
    const collectionRef = collection(db, "projects");
    const q = query(collectionRef, orderBy("last_timestamp", "desc"));

    // Get realtime updates with Cloud Firestore
    // https://firebase.google.com/docs/firestore/query-data/listen
    // !todo: simply the listener, especially the docs.map?
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

  const { project } = useContext(ProjectContext);

  // link/router https://stackoverflow.com/questions/65086108/next-js-link-vs-router-push-vs-a-tag
  const router = useRouter();
  const createProject = (e) => {
    e.stopPropagation();
    router.push(`/project/create`);
  };

  return (
    <Grid
      container
      spaceing={0}
      direction="row"
      mt={1}
      // alignItems="center"
      //  justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      {/* left comp: list of projects */}
      <Grid item xs={4}>
        <Box sx={{ minHeight: "80vh", maxHeight: "80vh", overflow: "auto" }}>
          {projects.map((project) => (
            <Project
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              detail={project.detail}
              create_timestamp={project.create_timestamp}
              last_timestamp={project.last_timestamp}
              current_member={project.current_member}
              max_member={project.max_member}
              creator_email={project.creator_email}
            />
          ))}
        </Box>
        <Box mt={3} sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            disableElevation
            style={{ background: "#6fa8dc" }}
            onClick={(e) => createProject(e)}
          >
            {"Create Project"}
          </Button>
        </Box>
      </Grid>
      {/* right comp: project details  */}
      <Grid item xs={8}>
        {/* Should be its own comp */}
        <Box style={{ minHeight: "80vh", maxHeight: "80vh", overflow: "auto" }}>
          <Grid container>
            {/* Info box */}
            <Grid item xs={8}>
              <Box mt={3} ml={3} mr={1.5}>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{ fontWeight: 600 }}
                >
                  {project.hasOwnProperty("title") && project.title.length != 0
                    ? project.title
                    : "Project Title"}
                </Typography>
                <Divider sx={{ mt: 3 }} />
                <Typography
                  sx={{ mt: 3, fontWeight: 600 }}
                  color="text.primary"
                >
                  {"Team size: "}
                </Typography>
                <Typography color="text.secondary">
                  {project.current_member}
                  {"/"}
                  {project.max_member}
                </Typography>
                <Typography
                  sx={{ mt: 3, fontWeight: 600 }}
                  color="text.primary"
                >
                  {"Description: "}
                </Typography>
                <Typography color="text.secondary">
                  {project.description}
                </Typography>
              </Box>
            </Grid>

            {/* Founder box */}
            <Grid item xs={4}>
              <Box mt={3} mr={3} ml={1.5}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <IconButton sx={{ width: "5em", height: "5em" }}>
                    <Avatar
                      sx={{
                        width: "5em",
                        height: "5em",
                        border: "1px solid black",
                      }}
                    />
                  </IconButton>
                </Box>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  {"Founder"}
                </Typography>
                <Typography
                  sx={{ mt: 3, display: "flex", justifyContent: "center" }}
                  color="text.secondary"
                >
                  {project.hasOwnProperty("creator_email") &&
                  project.creator_email.length != 0
                    ? project.creator_email
                    : "Founder Email"}
                </Typography>
                <Box m={3} sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    style={{ background: "#6fa8dc" }}
                    disableElevation
                  >
                    {"Join"}
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Box m={3}>
              <Typography sx={{ mt: 3 }} color="text.secondary">
                <pre style={{ fontFamily: "inherit", whiteSpace: "pre-wrap" }}>
                  {project.hasOwnProperty("detail") &&
                  project.detail.length != 0
                    ? project.detail
                    : "Project Details"}
                </pre>
              </Typography>
            </Box>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ProjectList;
