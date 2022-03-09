import {
  Box,
  IconButton,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import moment from "moment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { useContext } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../Context/AuthContext";
import { ProjectContext } from "../Context/ProjectContext";

// the Project component in the ProjectList
const ProjectListItem = ({
  id,
  title,
  description,
  detail,
  current_member,
  max_member,
  create_timestamp,
  last_timestamp,
  creator_email,
  creator_uid,
  position_list,
}) => {
  // global context
  const { setProject } = useContext(ProjectContext);
  const { currentUser } = useAuth();
  // is cur_user the creator?
  const isCreator = currentUser?.uid == creator_uid ? true : false;
  // router
  const router = useRouter();
  // function to Delete project
  // const deleteProject = async (id, e) => {
  //   e.stopPropagation();
  //   const docRef = doc(db, "projects", id);
  //   await deleteDoc(docRef);
  //   showAlert("error", `Project with id ${id} is deleted sucessfully!`); // error -> red
  // };
  // function for url routing
  const seeProject = (id, e) => {
    e.stopPropagation();
    router.push(`/project/${id}`);
  };

  return (
    <Box m={3}>
      <ListItem
        onClick={() =>
          setProject({
            id,
            create_timestamp,
            last_timestamp,
            title,
            description,
            detail,
            current_member,
            max_member,
            creator_email,
            creator_uid,
            position_list,
          })
        }
        sx={{
          border: 1,
          borderRadius: 4,
          borderColor: "text.secondary",
          boxShadow: 0,
          maxWidth: "100%",
          ":hover": {
            boxShadow: 2,
          },
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
          primary={<Typography sx={{ fontWeight: 600 }}>{title}</Typography>} // 600 is the breakpoint of reg and semi-bold
          secondary={
            <span>
              {"Team size: "}
              {current_member}
              {"/"}
              {max_member}
              <br />
              <br />
              {description}
              <ul>
                {position_list.map((position, index) => {
                  return <li key={index}>{position.positionName}</li>;
                })}
              </ul>
              {"Last Update: "}
              {moment(last_timestamp).format("MMMM Do, YYYY")}
            </span>
          }
        />
      </ListItem>
      {/* Maybe not a good idea as the project card doesn't seem clickable */}
      {/* <Divider /> */}
    </Box>
  );
};

export default ProjectListItem;
