import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  AppBar,
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
// import { makeStyles } from "@mui/styles";

const ProjectList = () => {
  // context
  const { project, searchTerm, searchCategory } = useContext(ProjectContext);
  const { currentUser } = useAuth();

  // projects state
  const [projects, setProjects] = useState([]); // don't be confused with [project, setProject]

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

  // is cur_user the creator? !todo: should this go into useEffect?
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
      // display="flex"
      // alignItems="center"
      //  justifyContent="center"
    >
      {/* left comp: list of projects */}
      <Grid item xs={4}>
        <Box
          sx={{
            maxHeight: "calc(96vh - 188px)", // navbar: 64px; projectbar: 64px; button: 36px; margin: 24px
            overflow: "auto",
          }}
        >
          {projects
            .filter((project) => {
              // !todo: is this optimized?
              const isInTitles =
                searchTerm != "" && // lazy evaluation
                (project.title
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) || // project title
                  project.position_list.some(
                    (position) =>
                      position.positionTitle
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) // position title
                  ));

              const isInCategory =
                searchCategory != "" && // lazy evaluation
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
              <ProjectListItem
                key={project.id}
                id={project.id}
                title={project.title}
                category={project.category}
                completion_date={project.completion_date}
                description={project.description}
                detail={project.detail}
                cur_member_count={project.cur_member_count}
                max_member_count={project.max_member_count}
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
            sx={{ background: "#3e95c2" }}
            onClick={() => createProject(null)}
          >
            {"Create Project"}
          </Button>
        </Box>
      </Grid>
      {/* right comp: project info  */}
      <Grid item xs={8}>
        {/* Should be its own comp */}
        {project?.id && (
          <Box
            sx={{
              maxHeight: "calc(96vh - 128px)",
              overflow: "auto",
            }}
          >
            <Grid container>
              {/* Info box */}
              <Grid item xs={8}>
                <Box mt={3} ml={3} mr={1.5}>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{ fontWeight: 600 }}
                  >
                    {project.hasOwnProperty("title") &&
                    project.title.length != 0
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
                    {project.cur_member_count}
                    {"/"}
                    {project.max_member_count}
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
                    <Box
                      m={3}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <Button
                        variant="contained"
                        sx={{ background: "#3e95c2" }}
                        disableElevation
                      >
                        {"Connect"}
                      </Button>
                    </Box>
                  )}
                  {isCreator && (
                    <Box
                      m={3}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <Button
                        onClick={() => createProject(project)}
                        variant="contained"
                        sx={{ background: "#3e95c2" }}
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
              <Box mt={3} ml={3} mr={3}>
                <Typography sx={{ fontWeight: 600 }} color="text.primary">
                  {"Details:"}
                </Typography>
                <Typography
                  component="span"
                  sx={{ mt: 3 }}
                  color="text.secondary"
                >
                  <pre
                    style={{
                      fontFamily: "inherit",
                      whiteSpace: "pre-wrap",
                      display: "inline",
                    }}
                  >
                    {project.hasOwnProperty("detail") &&
                    project.detail.length != 0
                      ? project.detail
                      : "Project Details"}
                  </pre>
                </Typography>
              </Box>
              {/* position details */}
              <Box
                sx={{
                  mt: 6,
                  ml: 3,
                  mr: 3,
                  border: 1,
                  borderRadius: 4,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: "white",
                    background: "#3e95c2",
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                  }}
                  color="text.primary"
                >
                  &emsp; {"Positions:"}
                </Typography>
                {project.position_list.map((position, index) => (
                  <PositionListItem
                    key={index}
                    name={position.positionTitle}
                    resp={position.positionResp}
                    weeklyHour={position.positionWeeklyHour}
                    uid={position.positionUID}
                  />
                ))}
              </Box>
            </Grid>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default ProjectList;
