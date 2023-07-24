import { useContext, useState } from "react";
import NextLink from "next/link";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  ListItem,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { GlobalContext, ProjectContext } from "../Context/ShareContexts";
import {
  handleDeleteEntry,
  handleVisibility,
  isStrInStrList,
} from "../Reusable/Resusable";
import { convert } from "html-to-text";
import dayjs from "dayjs";

// the project list item component in the project list: has full project data but only shows some brief information
// prefer not doing any dynamic calculation in this leaf component
const ProjectListItem = ({ index, project, last }) => {
  // context
  const { ediumUser, onMedia } = useContext(GlobalContext);
  const { setCurProject, searchTerm, searchCateList, searchTypeList } =
    useContext(ProjectContext);

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
        setCurProject(project);
      }}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        borderBottom: index === last ? 0 : 1,
        borderColor: "divider",
        "&:hover": {
          backgroundColor: "gray100.main",
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
          paddingLeft: "10px",
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
          <Typography
            variant="h2"
            sx={{ fontSize: "1rem", fontWeight: "bold" }}
          >
            {project?.title}
          </Typography>
          {project?.tags?.length > 0 && (
            <Box sx={{ mt: 1, height: "1.75rem", overflow: "hidden" }}>
              {project.tags.map((tag, index) => (
                <Chip
                  key={index}
                  color={
                    isStrInStrList(searchCateList, tag, true) ||
                    isStrInStrList(searchTypeList, tag, true) ||
                    searchTerm === tag
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
                  query: { projectId: project?.id },
                }}
                as="/projects/create"
                passHref
                style={{
                  color: "inherit",
                }}
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
                setCurProject(null);
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
        sx={{ mt: 2, paddingX: "10px", width: "100%" }} // padding right to align with more icon
      >
        <Typography
          color="text.secondary"
          sx={{
            mb: 1,
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            fontSize: "0.875rem",
          }}
        >
          {project?.short_description
            ? project.short_description
            : convert(project?.description)}
        </Typography>
        {project?.position_list?.slice(0, 3)?.map((position, index) => (
          <Typography
            key={index}
            color="text.secondary"
            sx={{
              fontWeight: "medium",
              ml: "5%",
              fontSize: "0.875rem",
            }}
          >
            {position.title}
          </Typography>
        ))}
        {project?.position_list?.length > 3 && (
          <Typography
            color="text.secondary"
            sx={{ fontWeight: "medium", ml: "5%", fontSize: "0.875rem" }}
          >
            {"and more..."}
          </Typography>
        )}
        {onMedia.onDesktop && (
          <Typography
            color="text.secondary"
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              fontWeight: "light",
              fontSize: "0.875rem",
            }}
          >
            {dayjs(project.last_timestamp).format("MMM Do, YYYY")}
          </Typography>
        )}
      </Box>
    </ListItem>
  );
};

export default ProjectListItem;
