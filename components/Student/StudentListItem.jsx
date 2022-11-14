import { useContext, useState } from "react";
import { Avatar, Box, IconButton, ListItem, ListItemText } from "@mui/material";
import { GlobalContext, StudentContext } from "../Context/ShareContexts";
import ForumIcon from "@mui/icons-material/Forum";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter } from "next/router";
import { handleConnect } from "../Reusable/Resusable";

const StudentListItem = (props) => {
  const index = props.index;
  const student = props.student;
  const last = props.last;

  // context
  const { chats, ediumUser, setChatPartner, setForceChatExpand } =
    useContext(GlobalContext);
  const { setStudent } = useContext(StudentContext);

  // local
  const router = useRouter();

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
    <Box
      sx={{
        mx: 1.5,
        mt: 1.5,
        mb: index === last ? 1.5 : 0,
      }}
    >
      <ListItem
        onClick={() => setStudent(student)}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          border: 1.5,
          borderRadius: 8,
          borderColor: "#dbdbdb",
          backgroundColor: "#ffffff",
          "&:hover": {
            backgroundColor: "#f6f6f6",
            cursor: "default",
          },
          // height: "180px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
          }}
          // onClick={(e) => {
          //   e.stopPropagation();
          // }}
        >
          <Avatar
            sx={{
              my: 1,
              ml: 1,
              mr: 3,
              height: "80px",
              width: "80px",
            }}
            src={student?.photo_url}
          />
          <ListItemText
            primary={student?.name}
            primaryTypographyProps={{ fontWeight: "bold", fontSize: "1em" }}
            secondary={
              <>
                {student?.desired_position}
                <br />
                {student?.field_of_interest}
                <br />
                {"Education year: "}
                {student?.year_of_ed}
              </>
            }
            secondaryTypographyProps={{ fontSize: "0.8em" }}
          />
          {student?.uid !== ediumUser?.uid && (
            <IconButton
              sx={{ mr: 1, backgroundColor: "lightgray" }}
              onClick={(e) => {
                e.stopPropagation();
                handleConnect(
                  chats,
                  student,
                  ediumUser,
                  setChatPartner,
                  setForceChatExpand
                );
                router.push("/chats");
              }}
            >
              <ForumIcon sx={{ color: "white" }} />
            </IconButton>
          )}
        </Box>
      </ListItem>
    </Box>
  );
};

export default StudentListItem;
