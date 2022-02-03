import { IconButton, ListItem, ListItemText } from "@mui/material";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { ProjectContext } from "../pages/ProjectContext";
import { useContext } from "react";
import { useRouter } from "next/router";

// the Project component in the ProjectList
const Project = ({
  // !todo: creator's id, short description, updated_time
  id,
  created_time,
  title,
  detail,
  cur_member,
  max_member,
}) => {
  // global context
  const { showAlert, setProject } = useContext(ProjectContext);
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
      onClick={() =>
        setProject({ id, created_time, title, detail, max_member })
      }
      sx={{ mt: 3, boxShadow: 3 }}
      style={{ backgroudColor: "#fafafa" }}
      secondaryAction={
        <>
          {/* !todo: delete button depends on the user; for now only the creator can delete the entry */}
          <IconButton onClick={(e) => deleteProject(id, e)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={(e) => seeProject(id, e)}>
            <MoreVertIcon />
          </IconButton>
        </>
      }
    >
      <ListItemText
        primary={title}
        secondary={moment(created_time).format("MMMM do, yyyy")}
      />
    </ListItem>
  );
};

export default Project;
