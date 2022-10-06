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
import { getGooglePhotoURLwithRes, handleConnect } from "../Reusable/Resusable";
import ExportedImage from "next-image-export-optimizer";
import FaceRetouchingNaturalOutlinedIcon from "@mui/icons-material/FaceRetouchingNaturalOutlined";

const StudentProfile = () => {
  // context
  const {
    chats,
    ediumUser,
    setForceChatExpand,
    setChatPartner,
    winHeight,
    onMedia,
  } = useContext(GlobalContext);
  const { student } = useContext(StudentContext);

  // local vars
  const currentUID = ediumUser?.uid;

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
        height: onMedia.onDesktop
          ? `calc(${winHeight}px - 64px - 64px - 1.5px)`
          : `calc(${winHeight}px - 48px - 48px - 1.5px - 60px)`,
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
              m: onMedia.onDesktop ? 6 : 3,
              width: "200px",
              height: "200px",
              // color: "#dbdbdb",
              // backgroundColor: "#ffffff",
              // border: 1,
              // borderColor: "#dbdbdb",
            }}
            src={getGooglePhotoURLwithRes(student?.photo_url, "256")}
            referrerPolicy="no-referrer"
          />
        )}
        {/* name */}
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: onMedia.onDesktop ? "2em" : "1.5em",
          }}
        >
          {student?.name}
        </Typography>

        {/* position */}
        <Typography sx={{ fontSize: onMedia.onDesktop ? "1.1em" : "1em" }}>
          {student?.desired_position}
        </Typography>

        {/* field of interest */}
        <Typography sx={{ fontSize: onMedia.onDesktop ? "1.1em" : "1em" }}>
          {student?.field_of_interest}
        </Typography>

        {/* education year */}
        {student?.year_of_ed && (
          <Typography sx={{ fontSize: onMedia.onDesktop ? "1.1em" : "1em" }}>
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
          m: onMedia.onDesktop ? 3 : 1.5,
        }}
      >
        {/* awards */}
        {student?.awards?.length > 0 && (
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: onMedia.onDesktop ? "1.5em" : "1.25em",
            }}
          >
            {"Awards"}
          </Typography>
        )}
        <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
          {student?.awards?.length > 0 &&
            student.awards.some(
              (award) => award.toLowerCase() === "betauser"
            ) && (
              <Tooltip title="Beta User">
                <FaceRetouchingNaturalOutlinedIcon
                  sx={{ fontSize: onMedia.onDesktop ? "3em" : "2.5em", mr: 1 }}
                />
              </Tooltip>
            )}
        </Box>
        {/* social media links */}
        {student?.social_media?.length > 0 && (
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: onMedia.onDesktop ? "1.5em" : "1.25em",
              mt: 1,
            }}
          >
            {"Social media"}
          </Typography>
        )}
        <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
          {student?.social_media?.length > 0 &&
            student.social_media.map((link, index) => {
              if (link.toLowerCase().includes("linkedin")) {
                return (
                  <Link
                    key={index}
                    target="_blank"
                    href={link}
                    rel="noreferrer"
                  >
                    <LinkedInIcon
                      sx={{
                        fontSize: onMedia.onDesktop ? "3em" : "2.5em",
                        mr: 1,
                        color: "black",
                      }}
                    />
                  </Link>
                );
              } else if (link.toLowerCase().includes("facebook")) {
                return (
                  <Link
                    key={index}
                    target="_blank"
                    href={link}
                    rel="noreferrer"
                  >
                    <FacebookIcon
                      sx={{
                        fontSize: onMedia.onDesktop ? "3em" : "2.5em",
                        mr: 1,
                        color: "black",
                      }}
                    />
                  </Link>
                );
              } else if (link.toLowerCase().includes("instagram")) {
                return (
                  <Link
                    key={index}
                    target="_blank"
                    href={link}
                    rel="noreferrer"
                  >
                    <InstagramIcon
                      sx={{
                        fontSize: onMedia.onDesktop ? "3em" : "2.5em",
                        mr: 1,
                        color: "black",
                      }}
                    />
                  </Link>
                );
              } else {
                return (
                  <Link
                    key={index}
                    target="_blank"
                    href={link}
                    rel="noreferrer"
                  >
                    <LinkIcon
                      sx={{
                        fontSize: onMedia.onDesktop ? "3em" : "2.5em",
                        mr: 1,
                        color: "black",
                      }}
                    />
                  </Link>
                );
              }
            })}
        </Box>
        {/* past experience */}
        {/* {student?.past_exp?.length > 0 && (
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: onMedia.onDesktop ? "1.5em" : "1.25em",
              mt: 1,
            }}
          >
            {"Past experience"}
          </Typography>
        )}
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          {student?.past_exp?.length > 0 &&
            student.past_exp.map((exp, index) => (
              <Typography
                key={index}
                sx={{
                  mx: "1em",
                  mb: "1em",
                  fontSize: onMedia.onDesktop ? "1.1em" : "1em",
                  wordWrap: "break-word",
                }}
              >
                &bull; &nbsp; {exp}
              </Typography>
            ))}
        </Box> */}
      </Box>
      {/* 3rd box; center; buttons */}
      {!!student && onMedia.onDesktop && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            m: 3,
          }}
        >
          {/* connect button */}

          <Tooltip title={currentUID ? "" : "Edit your profile first"}>
            <span>
              <Button
                disabled={!currentUID || currentUID === student?.uid}
                disableElevation
                size="large"
                sx={{
                  my: 3,
                  border: 1.5,
                  borderColor: "#dbdbdb",
                  borderRadius: "30px",
                  color: "#ffffff",
                  backgroundColor: "#3e95c2",
                  fontSize: "1.1em",
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
        </Box>
      )}

      {!student && (
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
