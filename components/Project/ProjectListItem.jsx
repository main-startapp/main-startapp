import { useContext, useState, useMemo } from "react";
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
  findItemFromList,
  handleDeleteEntry,
  handleVisibility,
  MenuItemLink,
} from "../Reusable/Resusable";
import { convert } from "html-to-text";
import NextLink from "next/link";

// the project list item component in the project list: has full project data but only shows some brief information
const ProjectListItem = (props) => {
  const index = props.index;
  const project = props.project;
  const last = props.last;

  // context
  const { setOldProject, users, ediumUser, onMedia } =
    useContext(GlobalContext);
  const { setProject, setCreatorUser } = useContext(ProjectContext);

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

  // creator's user data
  const creatorUser = useMemo(() => {
    return findItemFromList(users, "uid", project?.creator_uid);
  }, [users, project?.creator_uid]);

  // project + org tags
  const allTags = useMemo(() => {
    let retTags = [];
    if (project?.tags?.length > 0) {
      retTags = retTags.concat(project.tags);
    }
    if (
      creatorUser?.role === "org_admin" &&
      creatorUser?.org_tags?.length > 0
    ) {
      retTags = retTags.concat(creatorUser.org_tags);
    }

    return retTags;
  }, [creatorUser, project]);

  return (
    <ListItem
      onClick={() => {
        setProject(project);
        setCreatorUser(creatorUser);
      }}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        borderBottom: 1,
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
        <Box sx={{ width: "100%" }}>
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
          {allTags?.length > 0 && (
            <Box sx={{ height: "1.5rem", overflow: "hidden" }}>
              {allTags.map((tag, index) => (
                <Chip
                  key={index}
                  color={"lightPrimary"}
                  label={tag}
                  size="small"
                  sx={{
                    mr: 1,
                    fontSize: "0.75rem",
                    fontWeight: "medium",
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
                setOldProject(project);
                handleMenuClose(e);
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
                setProject(null);
                setCreatorUser(null);
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
          sx={{ margin: 0, mb: 2 }}
        />
        {project.position_list.slice(0, 3).map((position, index) => (
          <ListItemText
            sx={{ margin: 0, ml: "5%" }}
            key={index}
            secondary={
              <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                {position.title}
              </Typography>
            }
          />
        ))}
        {project.position_list.length > 3 && (
          <ListItemText
            sx={{ margin: 0, ml: "5%" }}
            secondary={
              <Typography variant="body2" sx={{ fontWeight: "medium" }}>
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
                  mt: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                  fontWeight: "light",
                }}
              >
                {moment(project.last_timestamp).format("MMM Do, YYYY")}
              </Typography>
            }
          />
        )}
      </Box>
    </ListItem>
  );
};

export default ProjectListItem;
