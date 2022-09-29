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
import { handleDeleteEntry, handleVisibility } from "../Reusable/Resusable";
import { useAuth } from "../Context/AuthContext";
import { useEffect } from "react";

// the project list item component in the project list: has full project data but only shows some brief information
const ProjectListItem = (props) => {
  const index = props.index;
  const project = props.project;
  const last = props.last;

  // context
  const { ediumUser, onMedia, projects } = useContext(GlobalContext);
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

  // functions
  const editDescString = (text) => {
    if (text) return text.replace(/<img .*>/, "");
    else return "";
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
        >
          {/* project icon uploaded by users*/}
          <Avatar
            sx={{
              mr: 2,
              height: "48px",
              width: "48px",
            }}
            src={project?.icon_url}
          >
            <UploadFileIcon />
          </Avatar>
          <ListItemText
            primary={project.title}
            primaryTypographyProps={{ fontWeight: "bold" }}
            secondary={
              <>
                {project.max_member_count && "Team size: "}
                {project.max_member_count && project.max_member_count}
                <br />
              </>
            }
          />
          <IconButton
            id="PLI-menu-button"
            aria-controls={open ? "PLI-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={(e) => {
              if (ediumUser?.uid !== project?.creator_uid) return; // !todo: will be removed after there's at least one menu for regular user
              handleMenuClick(e);
            }}
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
            {ediumUser?.uid === project?.creator_uid && (
              <MenuItem
                onClick={() => {
                  handleVisibility("projects", project);
                  handleMenuClose();
                }}
              >
                {project?.is_visible ? "Hide" : "Display"}
              </MenuItem>
            )}
            {ediumUser?.uid === project?.creator_uid && (
              <MenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteEntry(
                    "projects",
                    "projects_ext",
                    "my_project_ids",
                    project?.id,
                    ediumUser?.uid
                  );
                  setProject(null);
                  handleMenuClose();
                }}
              >
                Delete
              </MenuItem>
            )}
          </Menu>
        </Box>
        <Box sx={{ width: "100%" }}>
          <ListItemText
            secondary={
              <Typography
                component="span" // this fixed eror saying div cannot appear as descendant of p
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
                <div
                  dangerouslySetInnerHTML={{
                    __html: editDescString(project.description),
                  }}
                />
              </Typography>
            }
          />
          {project.position_list.slice(0, 3).map((position, index) => (
            <ListItemText
              sx={{ ml: "5%" }}
              key={index}
              secondary={<span>&bull; &nbsp; {position.title}</span>}
            />
          ))}
          {project.position_list.length > 3 && (
            <ListItemText
              sx={{ ml: "5%" }}
              secondary={<span>&bull; &nbsp; {"and more..."}</span>}
            />
          )}
          {onMedia.onDesktop && (
            <ListItemText
              secondary={
                <>
                  {"Last Update: "}
                  {moment(project.last_timestamp).format("MMMM Do, YYYY")}
                </>
              }
            />
          )}
        </Box>
      </ListItem>
    </Box>
  );
};

export default ProjectListItem;
