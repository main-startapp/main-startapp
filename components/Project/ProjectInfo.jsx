import { useContext } from "react";
import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { ProjectContext } from "../Context/ProjectContext";
import PositionListItem from "./PositionListItem";

const ProjectInfo = () => {
  // context
  const { project, currentUser } = useContext(ProjectContext);

  // is cur_user the creator? !todo: should this go into useEffect?
  const isCreator = currentUser?.uid === project.creator_uid ? true : false;

  // similar func createProject() in ProjectList.jsx
  const router = useRouter();
  const updateProject = (projectObj) => {
    router.push(
      {
        pathname: `/project/create`,
        query: {
          isCreateStr: "false",
          projectStr: JSON.stringify(projectObj || null),
        },
      },
      `/project/create` // "as" argument
    );
  };

  // debugging console logs
  // console.log(project.completion_date);

  return (
    <Box
      sx={{
        maxHeight: "calc(96vh - 128px)",
        overflow: "auto",
      }}
    >
      {project?.id && (
        <Grid container>
          {/* Top left info box */}
          <Grid item xs={8}>
            <Box mt={3} ml={3} mr={1.5}>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                {project.title}
              </Typography>
              <Divider sx={{ mt: 3 }} />
              <Typography sx={{ mt: 3, fontWeight: 600 }} color="text.primary">
                {"Team size: "}
              </Typography>
              <Typography color="text.secondary">
                {project.cur_member_count}
                {"/"}
                {project.max_member_count}
              </Typography>
              <Typography sx={{ mt: 3, fontWeight: 600 }} color="text.primary">
                {"Details: "}
              </Typography>
              <Typography color="text.secondary">{project.details}</Typography>
            </Box>
          </Grid>

          {/* Top right founder box */}
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
                {project.creator_email}
              </Typography>
              {!isCreator && (
                <Box m={3} sx={{ display: "flex", justifyContent: "center" }}>
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
                <Box m={3} sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    onClick={() => updateProject(project)}
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

          {/* Bottom description and position boxes */}
          <Grid item xs={12}>
            <Box mt={3} ml={3} mr={3}>
              <Typography sx={{ fontWeight: 600 }} color="text.primary">
                {"Description:"}
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
                  {project.description}
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
        </Grid>
      )}
    </Box>
  );
};

export default ProjectInfo;
