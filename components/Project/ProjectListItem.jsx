import { useContext } from "react";
import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import moment from "moment";
import { ProjectContext } from "../Context/ShareContexts";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// the project list item component in the project list: has full project data but only shows some brief information
const ProjectListItem = (props) => {
  const project = props.project;

  // context
  const { setProject } = useContext(ProjectContext);

  // router
  const router = useRouter();

  /* const seeProject = (id, e) => {
    e.stopPropagation();
    router.push(`/project/${id}`);
  }; */

  return (
    <Box m={3}>
      <ListItem
        onClick={() => setProject(project)}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          border: 1,
          borderRadius: 4,
          borderColor: "text.secondary",
          boxShadow: 0,
          "&:hover": {
            backgroundColor: "#f6f6f6",
            cursor: "default",
          },
          // height: "180px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* project icon uploaded by users*/}
          <Avatar sx={{ mr: 2 }}>
            <UploadFileIcon />
          </Avatar>
          <ListItemText
            primary={project.title}
            primaryTypographyProps={{ fontWeight: "bold" }}
            secondary={
              <>
                {"Team size: "}
                {project.cur_member_count}
                {"/"}
                {project.max_member_count}
                <br />
              </>
            }
          />
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </Box>
        <ListItemText
          secondary={
            <Typography
              sx={{
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                // is there a better way to directly ref to ListItemText Secondary style?
                fontSize: "0.875rem",
                lineHeight: 1.43,
                letterSpacing: "0.01071em",
                color: "rgba(0, 0, 0, 0.6)",
              }}
            >
              {project.description}
            </Typography>
          }
        />
        {project.position_list.map((position, index) => (
          <ListItemText
            sx={{ ml: "5%" }}
            key={index}
            secondary={<span>&bull; &nbsp; {position.positionTitle}</span>}
          />
        ))}
        <ListItemText
          secondary={
            <>
              {"Last Update: "}
              {moment(project.last_timestamp).format("MMMM Do, YYYY")}
            </>
          }
        />
      </ListItem>
    </Box>
  );
};

export default ProjectListItem;
