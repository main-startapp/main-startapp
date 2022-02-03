import { IconButton, ListItem, ListItemText } from "@mui/material";
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
  last_timestamp,
  title,
  detail,
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
    <ListItem
      onClick={
        isCreator
          ? () => setProject({ id, last_timestamp, title, detail, max_member })
          : undefined
      }
      sx={{ mt: 3, boxShadow: 3 }}
      style={{ backgroudColor: "#fafafa" }}
      secondaryAction={
        <>
          {isCreator && (
            <IconButton onClick={(e) => deleteProject(id, e)}>
              <DeleteIcon />
            </IconButton>
          )}
          <IconButton onClick={(e) => seeProject(id, e)}>
            <MoreVertIcon />
          </IconButton>
        </>
      }
    >
      <ListItemText
        primary={title}
        secondary={moment(last_timestamp).format("MMMM do, yyyy")}
      />
    </ListItem>
  );
};

export default Project;
