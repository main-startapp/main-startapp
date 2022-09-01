import { useContext, useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import moment from "moment";
import { GlobalContext, ProjectContext } from "../Context/ShareContexts";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { handleDeleteProject, handleVisibility } from "../Reusable/Resusable";
import { useAuth } from "../Context/AuthContext";

// the project list item component in the project list: has full project data but only shows some brief information
const ProjectListItem = (props) => {
  const index = props.index;
  const project = props.project;
  const last = props.last;

  // context
  const { currentUser } = useAuth();
  const { currentStudent, onMedia } = useContext(GlobalContext);
  const { setProject } = useContext(ProjectContext);

  // menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        mx: onMedia.onDesktop ? 3 : 1.5,
        mt: onMedia.onDesktop ? (index === 0 ? 3 : 1.5) : 1.5,
        mb: index === last ? (onMedia.onDesktop ? 3 : 1.5) : 0,
      }}
    >
      <ListItem
        onClick={() => setProject(project)}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          border: 1.5,
          borderRadius: "30px",
          borderColor: "#dbdbdb",
          boxShadow: 0,
          backgroundColor: "#ffffff",
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
          onClick={(e) => {
            e.stopPropagation();
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
          <IconButton
            id="PLI-menu-button"
            aria-controls={open ? "PLI-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            // onClick={(e) => {
            //   handleMenuClick(e);
            // }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="PLI-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "PLI-menu-button",
            }}
          >
            {currentUser?.uid === 1 && (
              <MenuItem
                onClick={() => {
                  handleVisibility(project);
                  handleMenuClose();
                }}
              >
                {project?.isVisible ? "Hide" : "Display"}
              </MenuItem>
            )}

            {currentUser?.uid === 1 && (
              <MenuItem
                onClick={() => {
                  setProject(null);
                  handleDeleteProject(project?.id, currentStudent);
                  handleMenuClose();
                }}
              >
                Delete
              </MenuItem>
            )}
          </Menu>
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
