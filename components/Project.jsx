import { Box, Divider, IconButton, ListItem, ListItemText } from "@mui/material";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { ProjectContext } from "../pages/ProjectContext";
import { useContext } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../pages/AuthContext";

// the Project component in the ProjectList
const Project = ({
  // !todo: creator's id, short description, updated_time
  id,
  create_timestamp,
  last_timestamp,
  title,
  description,
  detail,
  current_member,
  max_member,
  creator_email,
}) => {
  // global context
  const { showAlert, setProject } = useContext(ProjectContext);
  const { currentUser } = useAuth();
  // is cur_user the creator?
  const isCreator = currentUser?.email == creator_email ? true : false;
  // router
  const router = useRouter();
  // function to Delete project
  const deleteProject = async (id, e) => {
    e.stopPropagation();
    const docRef = doc(db, "projects", id);
    await deleteDoc(docRef);
    showAlert("error", `Project with id ${id} is deleted sucessfully!`); // error -> red
  };
  // function for url routing
  const seeProject = (id, e) => {
    e.stopPropagation();
    router.push(`/project/${id}`);
  };
  return (
    <Box m={3}>
      <ListItem
        onClick={() => setProject({ id, create_timestamp, last_timestamp, title, description, detail, current_member, max_member, creator_email })}
        sx={{
          boxShadow: 1,
          maxWidth: "100%",
        }}
        // style={{ backgroudColor: "#fafafa" }}
        secondaryAction={
          <>
            {/* {isCreator && (
              <IconButton onClick={(e) => deleteProject(id, e)}>
                <DeleteIcon />
              </IconButton>
            )} */}
            <IconButton onClick={(e) => seeProject(id, e)}>
              <MoreVertIcon />
            </IconButton>
          </>
        }
      >
        <ListItemText
          primary={title}
          secondary={
            <div>
              <div>{'Team size: '}{current_member}{'/'}{max_member}</div>
              <div>{'Description: '}{description}</div>
              <div>{'Last Update: '}{moment(last_timestamp).format("MMMM do, yyyy")}</div>
            </div>
          }
        />
      </ListItem>
      {/* Maybe not a good idea as the project card doesn't seem clickable */}
      {/* <Divider /> */}
    </Box>
  );
};

export default Project;
