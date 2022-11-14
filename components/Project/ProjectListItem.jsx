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
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import moment from "moment";
import { GlobalContext, ProjectContext } from "../Context/ShareContexts";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  handleDeleteEntry,
  handleVisibility,
  MenuItemLink,
} from "../Reusable/Resusable";
import { Interweave } from "interweave";
import { convert } from "html-to-text";
import NextLink from "next/link";

// the project list item component in the project list: has full project data but only shows some brief information
const ProjectListItem = (props) => {
  const index = props.index;
  const project = props.project;
  const last = props.last;

  // context
  const { setOldProject, ediumUser, onMedia } = useContext(GlobalContext);
  const { setProject } = useContext(ProjectContext);
  const theme = useTheme();

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
    <ListItem
      onClick={() => setProject(project)}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        borderBottom: 1.5,
        borderColor: "divider",
        backgroundColor: "background",
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
        <Stack sx={{ width: "100%" }}>
          <ListItemText
            primary={
              <Typography
                variant="h2"
                sx={{ fontSize: "1rem", fontWeight: "bold" }}
              >
                {project?.title}
              </Typography>
            }
          />
          {project?.tags?.length > 0 && (
            <Box sx={{ height: "1.5rem", overflow: "hidden" }}>
              {project.tags.map((tag, index) => (
                <Chip
                  key={index}
                  color={"lightPrimary"}
                  label={tag}
                  size="small"
                  sx={{
                    mr: 1,
                    fontSize: "0.75rem",
                    //fontWeight: "bold",
                  }}
                />
              ))}
            </Box>
          )}
        </Stack>
        {ediumUser?.uid === project?.creator_uid && (
          <IconButton
            id="projectlistitem-menu-button"
            aria-controls={open ? "projectlistitem-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={(e) => {
              if (ediumUser?.uid !== project?.creator_uid) return; // !todo: will be removed after there's at least one menu for regular user
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
          onClose={handleMenuClose}
          MenuListProps={{
            "aria-labelledby": "projectlistitem-menu-button",
          }}
        >
          {ediumUser?.uid === project?.creator_uid && (
            <MenuItem
              onClick={() => {
                setOldProject(project);
                handleMenuClose();
              }}
            >
              <NextLink
                href={{
                  pathname: "/projects/create",
                  query: { isCreateStr: "false" },
                }}
                as="/projects/create"
                passHref
              >
                <MenuItemLink>Modify</MenuItemLink>
              </NextLink>
            </MenuItem>
          )}
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
          sx={{ margin: 0, mb: 2 }}
        />
        {project.position_list.slice(0, 3).map((position, index) => (
          <ListItemText
            sx={{ margin: 0, ml: "5%" }}
            key={index}
            secondary={
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {position.title}
              </Typography>
            }
          />
        ))}
        {project.position_list.length > 3 && (
          <ListItemText
            sx={{ margin: 0, ml: "5%" }}
            secondary={
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {"and more..."}
              </Typography>
            }
          />
        )}
        {onMedia.onDesktop && (
          <ListItemText
            secondary={
              <Typography
                color="text.secondary"
                variant="body2"
                sx={{
                  margion: 0,
                  mt: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {moment(project.last_timestamp).format("MMMM Do, YYYY")}
              </Typography>
            }
          />
        )}
      </Box>
    </ListItem>
  );
};

export default ProjectListItem;
