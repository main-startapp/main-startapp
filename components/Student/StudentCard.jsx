import { Avatar, Box, Button, Card, Tooltip, Typography } from "@mui/material";
import ExportedImage from "next-image-export-optimizer";
import { useContext } from "react";
import { GlobalContext, StudentContext } from "../Context/ShareContexts";
import { handleConnect } from "../Reusable/Resusable";

const StudentCard = (props) => {
  const student = props.student;

  // context
  const { chats, ediumUser, setChatPartner, setForceChatExpand } =
    useContext(GlobalContext);
  const { setStudent } = useContext(StudentContext);

  function ordinal_suffix_of(i) {
    let j = i % 10;
    if (j == 1) {
      return i + "st";
    }
    if (j == 2) {
      return i + "nd";
    }
    if (j == 3) {
      return i + "rd";
    }
    return i + "th";
  }

  // local vars
  return (
    <Card
      elevation={4}
      onClick={() => setStudent(student)}
      sx={{
        m: 2,
        borderTop: 1,
        borderColor: "divider",
        borderRadius: "16px 16px 16px 16px",
        height: "216px",
        width: "160px",
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          // justifyContent: "center",
        }}
      >
        <ExportedImage
          src="/images/u_logo.png"
          alt=""
          placeholder="empty"
          height={24}
          width={17}
          style={{ position: "absolute", left: 16, top: 16 }}
        />
        <Avatar
          sx={{
            mb: 1,
            width: "64px",
            height: "64px",
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
        <Typography
          variant="h2"
          sx={{ fontSize: "1rem", fontWeight: "regular" }}
        >
          {student?.name}
        </Typography>
        <Typography
          variant="h3"
          sx={{ fontSize: "0.625rem", fontWeight: "regular" }}
        >
          {student?.year_of_ed !== (null || undefined) &&
            ordinal_suffix_of(student.year_of_ed) + " year"}
          {student?.major !== (null || undefined) && " " + student.major}
        </Typography>
        <Typography
          variant="h3"
          sx={{ mt: 2, fontSize: "0.875rem", fontWeight: "bold" }}
        >
          {student?.desired_position}
        </Typography>

        <Tooltip title={ediumUser?.uid ? "" : "Please edit your profile first"}>
          <span>
            <Button
              color="primary"
              disabled={!ediumUser?.uid || ediumUser?.uid === student.uid}
              disableElevation
              size="small"
              variant="outlined"
              sx={{ mt: 2, border: 1, borderRadius: 8, paddingY: 0 }}
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
              {"+ Connect"}
            </Button>
          </span>
        </Tooltip>
        {/* </CardContent> */}
      </Box>
    </Card>
  );
};

export default StudentCard;
