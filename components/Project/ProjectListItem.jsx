import { useContext } from "react";
import { useRouter } from "next/router";
import {
  Box,
  IconButton,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import moment from "moment";
import { ProjectContext } from "../Context/ShareContexts";

// the project list item component in the project list: has full project data but only shows some brief information
const ProjectListItem = (props) => {
  const project = props.project;

  // context
  const { setProject } = useContext(ProjectContext);

  // router
  const router = useRouter();

  const seeProject = (id, e) => {
    e.stopPropagation();
    router.push(`/project/${id}`);
  };

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
          maxWidth: "100%",
          ":hover": {
            boxShadow: 2,
          },
        }}
        // style={{ backgroudColor: "#fafafa" }}
        // secondaryAction={
        //   <>
        //     {/* {isCreator && (
        //       <IconButton onClick={(e) => deleteProject(id, e)}>
        //         <DeleteIcon />
        //       </IconButton>
        //     )} */}
        //     <IconButton onClick={(e) => seeProject(project.id, e)}>
        //       <MoreVertIcon />
        //     </IconButton>
        //   </>
        // }
      >
        <ListItemText
          primary={project.title}
          primaryTypographyProps={{ fontWeight: 600 }} // 600 is the breakpoint of reg and semi-bold
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
        <ListItemText
          secondary={
            <Typography
              sx={{
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                // is there any better way to directly ref to ListItemText Secondary style?
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
            secondary={<span>&bull; {position.positionTitle}</span>}
          />
        ))}
        <ListItemText
          secondary={
            <>
              <br />
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
