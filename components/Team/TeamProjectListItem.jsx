import {
  Avatar,
  IconButton,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Box } from "@mui/material";
import { useContext, useState } from "react";
import { GlobalContext, TeamContext } from "../Context/ShareContexts";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { handleDeleteEntry, handleVisibility } from "../Reusable/Resusable";

const TeamProjectListItem = (props) => {
  const project = props.project;
  const projectExt = props.projectExt;

  // context
  const { ediumUser } = useContext(GlobalContext);
  const { setProject, setProjectExt } = useContext(TeamContext);

  // menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // stop propagation
  // https://stackoverflow.com/questions/60436516/prevent-event-propagation-on-row-click-and-dialog-in-material-ui
  // trdl: put it in the direct parent
  return (
    <Box m={3}>
      <ListItem
        onClick={() => {
          setProject(project);
          setProjectExt(projectExt);
        }}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          border: 1,
          borderRadius: 4,
          borderColor: "text.secondary",
          "&:hover": {
            backgroundColor: "#f6f6f6",
            cursor: "default",
          },
          overflow: "hidden",
          opacity: project?.is_visible ? "100%" : "50%",
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
            primary={project?.title}
            primaryTypographyProps={{ fontWeight: "bold" }}
            secondary={
              <>
                {"Team size: "}
                {/* {project?.cur_member_count}
                {"/"} */}
                {project?.max_member_count}
                <br />
              </>
            }
          />
          <IconButton
            id="TPLI-menu-button"
            aria-controls={open ? "TPLI-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={(e) => {
              handleMenuClick(e);
            }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="TPLI-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "TPLI-menu-button",
            }}
          >
            <MenuItem
              onClick={() => {
                handleVisibility(project);
                handleMenuClose();
              }}
            >
              {project?.is_visible ? "Hide" : "Display"}
            </MenuItem>

            <MenuItem
              onClick={() => {
                setProject(null);
                setProjectExt(null);
                handleDeleteEntry(
                  "projects",
                  "projects_ext",
                  "my_project_ids",
                  project?.id,
                  ediumUser?.uid
                );
                handleMenuClose();
              }}
            >
              Delete
            </MenuItem>
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
              {project?.description}
            </Typography>
          }
        />
        <ListItemText
          secondary={
            <>
              {/* {"Hiring: "}
              {project?.cur_member_count < project?.max_member_count
                ? "Yes"
                : "No"}
              <br /> */}
              {"Visible: "}
              {project?.is_visible ? "Yes" : "No"}
            </>
          }
        />
      </ListItem>
    </Box>
  );
};

export default TeamProjectListItem;
