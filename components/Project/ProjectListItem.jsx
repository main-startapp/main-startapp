import { useContext, useState } from "react";
import {
  Avatar,
  Box,
  Chip,
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
import {
  handleDeleteEntry,
  handleVisibility,
  isStrInStrList,
} from "../Reusable/Resusable";
import { convert } from "html-to-text";
import NextLink from "next/link";

// the project list item component in the project list: has full project data but only shows some brief information
// prefer not doing any dynamic calculation in this leaf component
const ProjectListItem = (props) => {
  const index = props.index;
  const fullProject = props.fullProject;
  const last = props.last;

  // context
  const { ediumUser, onMedia } = useContext(GlobalContext);
  const { setFullProject, searchTypeList } = useContext(ProjectContext);

  // local vars
  const project = fullProject.project;
  const projectCreator = fullProject.creator_uid;
  const projectAllTags = fullProject.allTags;

  // menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <ListItem
      onClick={() => {
        setFullProject(fullProject);
      }}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        borderBottom: 1,
        borderColor: "divider",
        "&:hover": {
          backgroundColor: "hoverGray.main",
          cursor: "default",
        },
        overflow: "hidden",
        paddingY: 2,
        paddingX: 2,
      }}
    >
      <Box
        id="projectlistitem-upper-box"
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
        <Box sx={{ width: "100%" }}>
          <ListItemText
            disableTypography
            primary={
              <Typography
                variant="h2"
                sx={{ fontSize: "1rem", fontWeight: "bold" }}
              >
                {project?.title}
              </Typography>
            }
          />
          {projectAllTags?.length > 0 && (
            <Box sx={{ mt: 1, height: "1.75rem", overflow: "hidden" }}>
              {projectAllTags?.map((tag, index) => (
                <Chip
                  key={index}
                  color={
                    isStrInStrList(searchTypeList, tag, true)
                      ? "primary"
                      : "lightPrimary"
                  }
                  label={tag}
                  sx={{
                    mr: 1,
                    mb: 1,
                    fontSize: "0.75rem",
                    fontWeight: "medium",
                    height: "1.5rem",
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
        {ediumUser?.uid === project?.creator_uid && (
          <IconButton
            id="projectlistitem-menu-button"
            aria-controls={open ? "projectlistitem-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={(e) => {
              handleMenuClick(e);
            }}
            sx={{ padding: 0 }}
          >
            <MoreVertIcon />
          </IconButton>
        )}
        <Menu
          id="projectlistitem-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={(e) => {
            handleMenuClose(e);
          }}
          MenuListProps={{
            "aria-labelledby": "projectlistitem-menu-button",
          }}
        >
          {ediumUser?.uid === project?.creator_uid && (
            <MenuItem
              onClick={(e) => {
                handleMenuClose(e);
              }}
            >
              <NextLink
                href={{
                  pathname: "/projects/create",
                  query: { projectID: project?.id },
                }}
                as="/projects/create"
                passHref
              >
                Modify
              </NextLink>
            </MenuItem>
          )}
          {ediumUser?.uid === project?.creator_uid && (
            <MenuItem
              onClick={(e) => {
                handleVisibility("projects", project);
                handleMenuClose(e);
              }}
            >
              {project?.is_visible ? "Hide" : "Display"}
            </MenuItem>
          )}
          {ediumUser?.uid === project?.creator_uid && (
            <MenuItem
              onClick={(e) => {
                handleDeleteEntry(
                  "projects",
                  "projects_ext",
                  "my_project_ids",
                  project?.id,
                  ediumUser?.uid
                );
                setFullProject(null);
                handleMenuClose(e);
              }}
            >
              Delete
            </MenuItem>
          )}
        </Menu>
      </Box>
      <Box
        id="projectlistitem-lower-box"
        // padding right to align with more icon
        sx={{ mt: 2, paddingRight: "10px", width: "100%" }}
      >
        <ListItemText
          secondary={
            <Typography
              color="text.secondary"
              variant="body2"
              sx={{
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1,
              }}
            >
              {convert(project?.description)}
            </Typography>
          }
          sx={{ mb: 2 }}
        />
        {project.position_list.slice(0, 3)?.map((position, index) => (
          <ListItemText
            key={index}
            secondary={
              <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                {position.title}
              </Typography>
            }
            sx={{ margin: 0, ml: "5%" }}
          />
        ))}
        {project.position_list.length > 3 && (
          <ListItemText
            secondary={
              <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                {"and more..."}
              </Typography>
            }
            sx={{ margin: 0, ml: "5%" }}
          />
        )}
        {onMedia.onDesktop && (
          <ListItemText
            secondary={
              <Typography
                color="text.secondary"
                variant="body2"
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  fontWeight: "light",
                }}
              >
                {moment(project.last_timestamp).format("MMM Do, YYYY")}
              </Typography>
            }
            sx={{ mt: 2 }}
          />
        )}
      </Box>
    </ListItem>
  );
};

export default ProjectListItem;
