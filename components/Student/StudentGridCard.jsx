import { Avatar, Box, Button, Card, Tooltip, Typography } from "@mui/material";
import { useContext } from "react";
import { GlobalContext, StudentContext } from "../Context/ShareContexts";
import { handleConnect } from "../Reusable/Resusable";

const StudentGridCard = (props) => {
  const student = props.student;

  // context
  const { chats, ediumUser, setChatPartner, setForceChatExpand } =
    useContext(GlobalContext);
  const { setStudent } = useContext(StudentContext);

  // local vars
  return (
    <Card
      variant="outlined"
      onClick={() => setStudent(student)}
      sx={{
        backgroundColor: "#ffffff",
        border: 1.5,
        borderRadius: 8,
        borderColor: "#dbdbdb",
        height: "100%",
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
            m: 2,
            width: "96px",
            height: "96px",
            // color: "#dbdbdb",
            // backgroundColor: "#ffffff",
            // border: 1,
            // borderColor: "#dbdbdb",
          }}
          src={student?.photo_url}
          referrerPolicy="no-referrer"
        />
        {/* <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "green",
          }}
        > */}
        <Typography sx={{ fontWeight: "bold", fontSize: "1.1em" }}>
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

        <Tooltip title={ediumUser?.uid ? "" : "Please edit your profile first"}>
          <span>
            <Button
              disabled={!ediumUser?.uid || ediumUser?.uid === student.uid}
              disableElevation
              size="small"
              sx={{
                my: 2,
                border: 1.5,
                borderColor: "#dbdbdb",
                borderRadius: 8,
                color: "#ffffff",
                backgroundColor: "#3e95c2",
                fontSize: "0.8em",
                paddingY: 0.1,
                paddingX: 3,
                textTransform: "none",
              }}
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                setStudent(student);
                handleConnect(
                  chats,
                  student,
                  ediumUser,
                  setChatPartner,
                  setForceChatExpand
                );
              }}
            >
              {"Connect"}
            </Button>
          </span>
        </Tooltip>
        {/* </CardContent> */}
      </Box>
    </Card>
  );
};

export default StudentGridCard;
