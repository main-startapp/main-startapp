import {
  Avatar,
  Box,
  Button,
  IconButton,
  Link,
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
import ExportedImage from "next-image-export-optimizer";
import FaceRetouchingNaturalOutlinedIcon from "@mui/icons-material/FaceRetouchingNaturalOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

const StudentProfile = () => {
  // context
  const { chats, currentStudent, setForceChatExpand, setChatPartner } =
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
      backgroundColor="#ffffff"
      sx={{
        height: "calc(100vh - 64px - 64px - 1.5px)",
        overflow: "auto",
        borderLeft: 1.5,
        borderRight: 1.5,
        borderColor: "#dbdbdb",
      }}
    >
      {/* 1st box; center; avatar and student info */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {!!student && (
          <Avatar
            sx={{
              m: 6,
              width: "10em",
              height: "10em",
              border: 1,
              borderColor: "#dbdbdb",
              color: "#dbdbdb",
              backgroundColor: "#ffffff",
            }}
            src={student?.photo_url}
            referrerPolicy="no-referrer"
          />
        )}
        {/* name */}
        <Typography sx={{ mb: 1, fontWeight: "bold", fontSize: "2em" }}>
          {student?.name}
        </Typography>

        {/* position */}
        <Typography sx={{ fontSize: "1.25em" }}>
          {student?.desired_position}
        </Typography>

        {/* field of interest */}
        <Typography sx={{ fontSize: "1.25em" }}>
          {student?.field_of_interest}
        </Typography>

        {/* education year */}
        {student?.year_of_ed && (
          <Typography sx={{ fontSize: "1.25em" }}>
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
          <Typography sx={{ fontWeight: "bold", fontSize: "1.5em" }}>
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
          <Typography sx={{ fontWeight: "bold", fontSize: "1.5em", mt: 1 }}>
            {"Social media"}
          </Typography>
        )}
        <Box direction="row">
          {student?.social_media?.length > 0 &&
            student.social_media.map((link, index) => {
              if (link.toLowerCase().includes("linkedin")) {
                return (
                  <Link
                    key={index}
                    target="_blank"
                    href={link}
                    rel="noopener noreferrer"
                  >
                    <LinkedInIcon
                      sx={{ fontSize: "3em", mr: 1, color: "black" }}
                    />
                  </Link>
                );
              } else if (link.toLowerCase().includes("facebook")) {
                return (
                  <Link
                    key={index}
                    target="_blank"
                    href={link}
                    rel="noopener noreferrer"
                  >
                    <FacebookIcon
                      sx={{ fontSize: "3em", mr: 1, color: "black" }}
                    />
                  </Link>
                );
              } else if (link.toLowerCase().includes("instagram")) {
                return (
                  <Link
                    key={index}
                    target="_blank"
                    href={link}
                    rel="noopener noreferrer"
                  >
                    <InstagramIcon
                      sx={{ fontSize: "3em", mr: 1, color: "black" }}
                    />
                  </Link>
                );
              } else {
                return (
                  <Link
                    key={index}
                    target="_blank"
                    href={link}
                    rel="noopener noreferrer"
                  >
                    <LinkIcon sx={{ fontSize: "3em", mr: 1, color: "black" }} />
                  </Link>
                );
              }
            })}
        </Box>
        {/* past experience */}
        {student?.past_exp?.length > 0 && (
          <Typography sx={{ fontWeight: "bold", fontSize: "1.5em", mt: 1 }}>
            {"Past experience"}
          </Typography>
        )}
        {student?.past_exp?.length > 0 &&
          student.past_exp.map((exp, index) => (
            <Typography
              key={index}
              sx={{ ml: "1em", mt: "1em", fontSize: "1.1em" }}
            >
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
        {!!student && (
          <Tooltip title={currentUID ? "" : "Edit your profile first."}>
            <span>
              <Button
                disabled={
                  !currentUID || !student?.uid || currentUID === student?.uid
                }
                disableElevation
                size="large"
                sx={{
                  my: 2,
                  border: 1.5,
                  borderColor: "#dbdbdb",
                  borderRadius: "30px",
                  color: "#ffffff",
                  backgroundColor: "#3e95c2",
                  fontSize: "1.1em",
                  "&:hover": {
                    backgroundColor: "#f6f6f6",
                  },
                  paddingY: 0.5,
                  paddingX: 5,
                  textTransform: "none",
                }}
                variant="contained"
                onClick={(e) => {
                  e.stopPropagation();
                  handleConnect(
                    chats,
                    student,
                    currentStudent,
                    setChatPartner,
                    setForceChatExpand
                  );
                }}
              >
                {"Connect"}
              </Button>
            </span>
          </Tooltip>
        )}
      </Box>

      {!!!student && (
        <Box
          id="logo placeholder wrapper"
          sx={{
            height: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ExportedImage
            src="/images/EDIUMLogo.png"
            placeholder=""
            width={256}
            height={256}
            priority
          />
        </Box>
      )}
    </Box>
  );
};

export default StudentProfile;
