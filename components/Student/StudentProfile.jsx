import {
  Avatar,
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useRef } from "react";
import { StudentContext } from "../Context/ShareContexts";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import LocalPoliceRoundedIcon from "@mui/icons-material/LocalPoliceRounded";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkIcon from "@mui/icons-material/Link";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const StudentProfile = () => {
  // context
  const { student, currentStudent } = useContext(StudentContext);

  // local vars
  const currentUID = currentStudent?.uid;

  // helper func
  // same function in StudentGridCard; ProjectInfo
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

  // similar alg in components/Project/ProjectInfo
  // box ref to used by useEffect
  const boxRef = useRef();
  // useEffect to reset box scrollbar position
  useEffect(() => {
    boxRef.current.scrollTop = 0;
  }, [student]); // every time project changes, this forces each accordion to collapse

  return (
    <>
      <Box
        ref={boxRef}
        bgcolor="#fafafa"
        sx={{ height: "calc(99vh - 128px)", overflow: "auto" }}
      >
        {/* 1st box; center; avatar and student info */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              m: 6,
              width: "10em",
              height: "10em",
              border: "1px solid black",
            }}
          />
          {/* name */}
          {student?.name && (
            <Typography sx={{ fontWeight: "bold", fontSize: "1.2em" }}>
              {student.name}
            </Typography>
          )}
          {!student?.name && (
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.2em", color: "gray" }}
            >
              {"Name"}
            </Typography>
          )}
          {/* position */}
          {student?.desired_position && (
            <Typography sx={{ fontSize: "1em" }}>
              {student.desired_position}
            </Typography>
          )}
          {!student?.desired_position && (
            <Typography sx={{ fontSize: "1em", color: "gray" }}>
              {"Position"}
            </Typography>
          )}
          {/* education year */}
          {student?.year_of_ed && (
            <Typography sx={{ fontSize: "1em" }}>
              {"Education year: "}
              {student.year_of_ed}
            </Typography>
          )}
          {!student?.year_of_ed && (
            <Typography sx={{ fontSize: "1em", color: "gray" }}>
              {"Education year: "}
              {"0"}
            </Typography>
          )}
        </Box>
        {/* 2nd box; start; student details */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            m: 3,
          }}
        >
          {/* awards */}
          <Typography sx={{ fontWeight: "bold", fontSize: "1.2em" }}>
            {"Awards"}
          </Typography>
          <Box direction="row">
            <VerifiedRoundedIcon sx={{ fontSize: "3em", mr: 1 }} />
            <LocalPoliceRoundedIcon sx={{ fontSize: "3em", mr: 1 }} />
          </Box>
          {/* social media links */}
          {student?.social_media.length > 0 && (
            <Typography sx={{ fontWeight: "bold", fontSize: "1.2em", mt: 1 }}>
              {"Social media"}
            </Typography>
          )}
          <Box direction="row">
            {student?.social_media.length > 0 &&
              student.social_media.map((link, index) => {
                // todo!: too hacky, is there any library can do this properly?
                if (!link.toLowerCase().includes("https://")) {
                  link = "https://" + link;
                }

                if (link.toLowerCase().includes("linkedin")) {
                  return (
                    <a
                      key={index}
                      target="_blank"
                      href={link}
                      rel="noopener noreferrer"
                    >
                      <LinkedInIcon
                        sx={{ fontSize: "3em", mr: 1, color: "black" }}
                      />
                    </a>
                  );
                } else if (link.toLowerCase().includes("facebook")) {
                  return (
                    <a
                      key={index}
                      target="_blank"
                      href={link}
                      rel="noopener noreferrer"
                    >
                      <FacebookIcon
                        sx={{ fontSize: "3em", mr: 1, color: "black" }}
                      />
                    </a>
                  );
                } else if (link.toLowerCase().includes("instagram")) {
                  return (
                    <a
                      key={index}
                      target="_blank"
                      href={link}
                      rel="noopener noreferrer"
                    >
                      <InstagramIcon
                        sx={{ fontSize: "3em", mr: 1, color: "black" }}
                      />
                    </a>
                  );
                } else {
                  return (
                    <a
                      key={index}
                      target="_blank"
                      href={link}
                      rel="noopener noreferrer"
                    >
                      <LinkIcon
                        sx={{ fontSize: "3em", mr: 1, color: "black" }}
                      />
                    </a>
                  );
                }
              })}
          </Box>
          {/* past experience */}
          {student?.past_exp.length > 0 && (
            <Typography sx={{ fontWeight: "bold", fontSize: "1.2em", mt: 1 }}>
              {"Past experience"}
            </Typography>
          )}
          {student?.past_exp.length > 0 &&
            student.past_exp.map((exp, index) => (
              <Typography key={index} sx={{ ml: "1em", mb: "1em" }}>
                &bull; &nbsp; {exp}
              </Typography>
            ))}
        </Box>
        {/* 3rd box; center; buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            m: 3,
          }}
        >
          {/* disabled connect button */}
          {!currentUID && (
            <Tooltip title="Edit your profile first.">
              <span>
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
                    &emsp; {"Connect"} &emsp;
                  </Typography>
                </Button>
              </span>
            </Tooltip>
          )}
          {currentUID &&
            student?.uid &&
            !currentStudent.pending_connections.includes(student?.uid) &&
            !currentStudent.received_connections.includes(student?.uid) && (
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
            (currentStudent.pending_connections.includes(student?.uid) ||
              currentStudent.received_connections.includes(student?.uid)) && (
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
                  &ensp; {"Pending"} &ensp;
                </Typography>
              </Button>
            )}
        </Box>
      </Box>
    </>
  );
};

export default StudentProfile;
