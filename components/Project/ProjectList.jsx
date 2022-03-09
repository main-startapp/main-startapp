import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { db } from "../../firebase";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import ProjectListItem from "./ProjectListItem";
import { ProjectContext } from "../Context/ProjectContext";
import { useAuth } from "../Context/AuthContext";
import PositionListItem from "./PositionListItem";

// a list of Project component
const ProjectList = () => {
  // context
  const { project, searchTerm } = useContext(ProjectContext);
  const { currentUser } = useAuth();

  // projects state
  const [projects, setProjects] = useState([]); // don't be confused with [project, setProject]

  useEffect(() => {
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

  // is cur_user the creator?
  const isCreator = currentUser?.uid == project.creator_uid ? true : false;

  // link/router https://stackoverflow.com/questions/65086108/next-js-link-vs-router-push-vs-a-tag
  const router = useRouter();

  const createProject = (projObj) => {
    router.push(
      {
        pathname: `/project/create`,
        query: { projString: JSON.stringify(projObj || null) },
      },
      `/project/create` // "as" argument
    );
  };

  return (
    <Grid
      container
      spaceing={0}
      direction="row"
      mt={1}
      // alignItems="center"
      //  justifyContent="center"
      sx={{ minHeight: "100vh" }}
    >
      {/* left comp: list of projects */}
      <Grid item xs={4}>
        <Box sx={{ minHeight: "80vh", maxHeight: "80vh", overflow: "auto" }}>
          {projects
            .filter((project) => {
              // !todo: is this optimized?
              if (searchTerm == "") {
                return project;
              } else if (
                project.title
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                project.position_list.some((position) =>
                  position.positionName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                ) // position name
              ) {
                return project;
              }
            })
            .map((project) => (
              <ProjectListItem
                key={project.id}
                id={project.id}
                title={project.title}
                description={project.description}
                detail={project.detail}
                current_member={project.current_member}
                max_member={project.max_member}
                create_timestamp={project.create_timestamp}
                last_timestamp={project.last_timestamp}
                creator_email={project.creator_email}
                creator_uid={project.creator_uid}
                position_list={project.position_list}
              />
            ))}
        </Box>
        <Box mt={3} sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            disableElevation
            sx={{ background: "#6fa8dc" }}
            onClick={() => createProject(null)}
          >
            {"Create Project"}
          </Button>
        </Box>
      </Grid>
      {/* right comp: project info  */}
      <Grid item xs={8}>
        {/* Should be its own comp */}
        <Box sx={{ minHeight: "80vh", maxHeight: "80vh", overflow: "auto" }}>
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
                {!isCreator && (
                  <Box m={3} sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      variant="contained"
                      sx={{ background: "#6fa8dc" }}
                      disableElevation
                    >
                      {"Join"}
                    </Button>
                  </Box>
                )}
                {isCreator && (
                  <Box m={3} sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      onClick={() => createProject(project)}
                      variant="contained"
                      sx={{ background: "#6fa8dc" }}
                      disableElevation
                    >
                      {"Modify"}
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
          {/* project details */}
          <Grid item xs={12}>
            <Box m={3}>
              <Typography
                component="span"
                sx={{ mt: 3 }}
                color="text.secondary"
              >
                <pre style={{ fontFamily: "inherit", whiteSpace: "pre-wrap" }}>
                  {project.hasOwnProperty("detail") &&
                  project.detail.length != 0
                    ? project.detail
                    : "Project Details"}
                </pre>
              </Typography>
            </Box>
            {/* position details */}
            <Box>
              {project.position_list.map((position, index) => (
                <PositionListItem
                  key={index}
                  name={position.positionName}
                  resp={position.positionResp}
                  weeklyHour={position.positionWeeklyHour}
                  uid={position.positionUID}
                />
              ))}
            </Box>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ProjectList;
