import { Avatar, Box, Button, Card, Tooltip, Typography } from "@mui/material";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useContext } from "react";
import { db } from "../../firebase";
import { GlobalContext, StudentContext } from "../Context/ShareContexts";
import { handleConnect } from "../Reusable/Resusable";

const StudentGridCard = (props) => {
  const student = props.student;

  // context
  const { chats, currentStudent, setPartner, setForceChatExpand } =
    useContext(GlobalContext);
  const { setStudent } = useContext(StudentContext);

  // local vars
  const currentUID = currentStudent?.uid;

  return (
    <Card
      variant="outlined"
      onClick={() => setStudent(student)}
      sx={{
        // mr: 3,
        // mt: 3,
        backgroundColor: "#fafafa",
        border: "1px solid black",
        borderRadius: 4,
        height: "100%",
        minWidth: "200px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          // justifyContent: "center",
        }}
      >
        <Avatar
          sx={{
            m: 3,
            width: "5em",
            height: "5em",
            border: "1px solid black",
          }}
          src={student.photo_url}
        />
        {/* <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "green",
          }}
        > */}
        <Typography sx={{ fontWeight: "bold", fontSize: "1em" }}>
          {student.name}
        </Typography>
        <Typography sx={{ fontSize: "0.9em" }}>
          {student.desired_position}
        </Typography>
        <Typography sx={{ fontSize: "0.9em" }}>
          {student.field_of_interest}
        </Typography>
        <Typography sx={{ fontSize: "0.9em" }}>
          {"Education year: "}
          {student.year_of_ed}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title={currentUID ? "" : "Please edit your profile first."}>
          <span>
            <Button
              disabled={!currentUID || currentUID === student.uid}
              disableElevation
              size="small"
              sx={{
                m: 3,
                borderRadius: 4,
                backgroundColor: "#3e95c2",
              }}
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                setStudent(student);
                handleConnect(
                  chats,
                  student,
                  currentStudent,
                  setPartner,
                  setForceChatExpand
                );
              }}
            >
              <Typography sx={{ fontSize: "0.9em" }}>
                &emsp; {"Connect"} &emsp;
              </Typography>
            </Button>
          </span>
        </Tooltip>
        {/* </CardContent> */}
      </Box>
    </Card>
  );
};

export default StudentGridCard;
