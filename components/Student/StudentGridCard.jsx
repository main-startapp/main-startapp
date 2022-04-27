import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Tooltip,
  Typography,
} from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { useContext } from "react";
import { db } from "../../firebase";
import { StudentContext } from "../Context/ShareContexts";

const StudentGridCard = (props) => {
  const student = props.student;

  // context
  const { setStudent, currentStudent } = useContext(StudentContext);

  // local vars
  const currentUID = currentStudent?.uid;

  // helper func
  // same function in StudentProfile; ProjectInfo
  const handleConnect = async (e) => {
    e.stopPropagation();
    const senderDocRef = doc(db, "students", currentUID);
    const receiverDocRef = doc(db, "students", student?.uid);
    const senderPendingConnections = currentStudent.pending_connections;
    const receiverReceivedConnections = student.received_connections;
    // don't need to check uniqueness as the Connect button will be disabled
    senderPendingConnections.push(student?.uid);
    receiverReceivedConnections.push(currentUID);
    const senderStudentRef = {
      ...currentStudent,
      pending_connections: senderPendingConnections,
    };
    const receiverStudentRef = {
      ...student,
      received_connections: receiverReceivedConnections,
    };
    // uid is not a key in the student document
    // !todo: maybe we should add uid to the doc?
    delete senderStudentRef?.uid;
    delete receiverStudentRef?.uid;
    await updateDoc(senderDocRef, senderStudentRef).catch((err) => {
      console.log("updateDoc() error: ", err);
    });
    await updateDoc(receiverDocRef, receiverStudentRef).catch((err) => {
      console.log("updateDoc() error: ", err);
    });
    // don't need to setState, since the student and currentStudent in pages/students is real-time updated
  };

  return (
    <Card
      variant="outlined"
      onClick={() => setStudent(student)}
      sx={{
        mr: 3,
        mt: 3,
        bgcolor: "#fafafa",
        border: "1px solid black",
        borderRadius: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
        />
        {/* <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "green",
          }}
        > */}
        <Typography sx={{ fontWeight: "bold", fontSize: "1em" }}>
          {student.name}
        </Typography>
        <Typography sx={{ fontSize: "0.9em" }}>
          {student.desired_position}
        </Typography>
        <Typography sx={{ fontSize: "0.9em" }}>
          {"Education year: "}
          {student.year_of_ed}
        </Typography>
        {!currentUID && (
          <Tooltip title="Edit your profile first.">
            <span>
              <Button
                disabled
                disableElevation
                size="small"
                sx={{
                  m: 3,
                  borderRadius: 4,
                  bgcolor: "#3e95c2",
                }}
                variant="contained"
              >
                <Typography sx={{ fontSize: "0.9em" }}>
                  &emsp; {"Connect"} &emsp;
                </Typography>
              </Button>
            </span>
          </Tooltip>
        )}
        {currentUID &&
          student?.uid &&
          !currentStudent.pending_connections.includes(student.uid) && (
            <Button
              variant="contained"
              size="large"
              sx={{
                m: 3,
                borderRadius: 4,
                bgcolor: "#3e95c2",
              }}
              disableElevation
              onClick={(e) => handleConnect(e)}
            >
              <Typography sx={{ fontSize: "0.9em" }}>
                &emsp; {"Connect"} &emsp;
              </Typography>
            </Button>
          )}
        {currentUID &&
          student?.uid &&
          currentStudent.pending_connections.includes(student.uid) && (
            <Button
              disabled
              disableElevation
              size="large"
              sx={{
                m: 3,
                borderRadius: 4,
                bgcolor: "#3e95c2",
              }}
              variant="contained"
            >
              <Typography sx={{ fontSize: "0.9em" }}>
                &emsp; {"Pending"} &emsp;
              </Typography>
            </Button>
          )}
        {/* </CardContent> */}
      </Box>
    </Card>
  );
};

export default StudentGridCard;
