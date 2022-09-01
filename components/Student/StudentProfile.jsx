import {
  Avatar,
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { GlobalContext, StudentContext } from "../Context/ShareContexts";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkIcon from "@mui/icons-material/Link";
import { handleConnect } from "../Reusable/Resusable";
import FaceRetouchingNaturalOutlinedIcon from "@mui/icons-material/FaceRetouchingNaturalOutlined";

const StudentProfile = () => {
  // context
  const { chats, currentStudent, setForceChatExpand, setPartner, setShowMsg } =
    useContext(GlobalContext);
  const { student } = useContext(StudentContext);

  // local vars
  const currentUID = currentStudent?.uid;

  // similar alg in components/Project/ProjectInfo
  // box ref to used by useEffect
  const boxRef = useRef();
  // useEffect to reset box scrollbar position
  useEffect(() => {
    boxRef.current.scrollTop = 0;
  }, [student]); // every time project changes, this forces each accordion to collapse

  return (
    <Box
      ref={boxRef}
      backgroundColor="#fafafa"
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
        {student?.uid && (
          <Avatar
            sx={{
              m: 6,
              width: "10em",
              height: "10em",
              border: "1px solid black",
            }}
            src={student?.photo_url}
            referrerPolicy="no-referrer"
          />
        )}
        {/* name */}
        <Typography sx={{ fontWeight: "bold", fontSize: "1.2em" }}>
          {student?.name}
        </Typography>

        {/* position */}
        <Typography sx={{ fontSize: "1em" }}>
          {student?.desired_position}
        </Typography>

        {/* field of interest */}
        <Typography sx={{ fontSize: "1em" }}>
          {student?.field_of_interest}
        </Typography>

        {/* education year */}
        {student?.year_of_ed && (
          <Typography sx={{ fontSize: "1em" }}>
            {"Education year: "}
            {student.year_of_ed}
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
        {student?.awards?.length > 0 && (
          <Typography sx={{ fontWeight: "bold", fontSize: "1.2em" }}>
            {"Awards"}
          </Typography>
        )}
        <Box direction="row">
          {student?.awards?.length > 0 &&
            student.awards.some(
              (award) => award.toLowerCase() === "betauser"
            ) && (
              <Tooltip title="Beta User">
                <FaceRetouchingNaturalOutlinedIcon
                  sx={{ fontSize: "3em", mr: 1 }}
                />
              </Tooltip>
            )}
        </Box>
        {/* social media links */}
        {student?.social_media?.length > 0 && (
          <Typography sx={{ fontWeight: "bold", fontSize: "1.2em", mt: 1 }}>
            {"Social media"}
          </Typography>
        )}
        <Box direction="row">
          {student?.social_media?.length > 0 &&
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
                    <LinkIcon sx={{ fontSize: "3em", mr: 1, color: "black" }} />
                  </a>
                );
              }
            })}
        </Box>
        {/* past experience */}
        {student?.past_exp?.length > 0 && (
          <Typography sx={{ fontWeight: "bold", fontSize: "1.2em", mt: 1 }}>
            {"Past experience"}
          </Typography>
        )}
        {student?.past_exp?.length > 0 &&
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
        {/* connect button */}
        {student?.uid && (
          <Tooltip title={currentUID ? "" : "Edit your profile first."}>
            <span>
              <Button
                disabled={
                  !currentUID || !student?.uid || currentUID === student?.uid
                }
                disableElevation
                size="large"
                sx={{
                  m: 3,
                  borderRadius: 4,
                  backgroundColor: "#3e95c2",
                }}
                variant="contained"
                onClick={(e) => {
                  e.stopPropagation();
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
        )}
      </Box>
    </Box>
  );
};

export default StudentProfile;
