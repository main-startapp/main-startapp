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
import { makeStyles } from "@mui/styles";

// Project State Initialization
const ProjectListItem = ({
  id,
  title,
  category,
  completion_date,
  description,
  detail,
  cur_member_count,
  max_member_count,
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
          // Project State Set
          setProject({
            id,
            title,
            create_timestamp,
            last_timestamp,
            category,
            completion_date,
            description,
            detail,
            cur_member_count,
            max_member_count,
            creator_email,
            creator_uid,
            position_list,
          })
        }
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
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
            <>
              {"Team size: "}
              {cur_member_count}
              {"/"}
              {max_member_count}
              <br />
              <br />
              {description}
            </>
          }
        />
        {position_list.map((position, index) => (
          <ListItemText
            sx={{ ml: "5%" }}
            key={index}
            secondary={<span>&bull; {position.positionTitle}</span>}
          />
        ))}
        <ListItemText
          secondary={
            <>
              <br />
              {"Last Update: "}
              {moment(last_timestamp).format("MMMM Do, YYYY")}
            </>
          }
        />
      </ListItem>
      {/* Maybe not a good idea as the project card doesn't seem clickable */}
      {/* <Divider /> */}
    </Box>
  );
};

export default ProjectListItem;
