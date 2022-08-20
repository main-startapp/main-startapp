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
import { deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const TeamProjectListItem = (props) => {
  const project = props.project;
  const projectExt = props.projectExt;

  // context
  const { setProject, setProjectExt } = useContext(TeamContext);
  const { currentStudent } = useContext(GlobalContext);

  // menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // helper func
  const handleVisibility = async (id, e) => {
    const docRef = doc(db, "projects", id);
    const projectRef = {
      ...project,
      isVisible: !project.isVisible,
      last_timestamp: serverTimestamp(),
    };
    delete projectRef.id;
    const projectModRef = updateDoc(docRef, projectRef).catch((err) => {
      console.log("updateDoc() error: ", err);
    });
    await projectModRef;
  };

  const handleDeleteProj = async (id, e) => {
    const docRef = doc(db, "projects", id);
    const projectModRef = deleteDoc(docRef).catch((err) => {
      console.log("deleteDoc() error: ", err);
    });

    // delete project ref from my_projects in student doc
    const curStudentDocRef = doc(db, "students", currentStudent?.uid);
    const curStudentMyProjects = currentStudent.my_projects.filter(
      (my_proj) => my_proj !== id
    );
    const curStudentRef = {
      ...currentStudent,
      my_projects: curStudentMyProjects,
    };
    delete curStudentRef?.uid;
    const curStudentModRef = updateDoc(curStudentDocRef, curStudentRef).catch(
      (err) => {
        console.log("updateDoc() error: ", err);
      }
    );

    // delete from project_ext coll
    const extDocRef = doc(db, "projects_ext", id);
    const projectExtModRef = deleteDoc(extDocRef).catch((err) => {
      console.log("deleteDoc() error: ", err);
    });

    // wait
    await projectModRef;
    await curStudentModRef;
    await projectExtModRef;
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
          boxShadow: 0,
          "&:hover": {
            backgroundColor: "#f6f6f6",
            cursor: "default",
          },
          overflow: "hidden",
          opacity: project.isVisible ? "100%" : "50%",
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
                handleVisibility(project?.id);
                handleMenuClose();
              }}
            >
              {project.isVisible ? "Hide" : "Display"}
            </MenuItem>

            <MenuItem
              onClick={() => {
                setProject(null);
                setProjectExt(null);
                handleDeleteProj(project?.id);
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
              {project.description}
            </Typography>
          }
        />
        <ListItemText
          secondary={
            <>
              {"Hiring: "}
              {project.cur_member_count < project.max_member_count
                ? "Yes"
                : "No"}
              <br />
              {"Visible: "}
              {project.isVisible ? "Yes" : "No"}
            </>
          }
        />
      </ListItem>
    </Box>
  );
};

export default TeamProjectListItem;
