import {
  Avatar,
  Box,
  Button,
  IconButton,
  Link,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
  const theme = useTheme();

  // prefix help func
  // https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
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

  // useEffect to reset box scrollbar position
  const boxRef = useRef();
  useEffect(() => {
    if (boxRef?.current?.scrollTop) boxRef.current.scrollTop = 0;
  }, [student]); // every time project changes, this forces each accordion to collapse

  return (
    <Paper
      elevation={onMedia.onDesktop ? 2 : 0}
      sx={{
        position: "relative",
        // mt: onMedia.onDesktop ? 4 : 2,
        // ml: onMedia.onDesktop ? 4 : 2,
        // mr: onMedia.onDesktop ? 2 : 0,
        backgroundColor: "background.paper",
        borderTop: onMedia.onDesktop ? 1 : 0,
        borderColor: "divider",
        borderRadius: onMedia.onDesktop
          ? "32px 32px 0px 0px"
          : "32px 0px 0px 0px",
        //paddingTop: "32px",
      }}
    >
      <Tooltip
        title="Credit: https://www.freepik.com/author/skyandglass"
        followCursor
      >
        <Box id="studentprofile-banner-box" sx={{ height: "216px" }}>
          <ExportedImage
            src="/images/student_profile_banner2.png"
            alt=""
            height={216}
            width={512}
            style={{ borderRadius: "32px 32px 0px 0px" }}
          />
        </Box>
      </Tooltip>
      <Avatar
        sx={{
          ml: 6,
          width: "160px",
          height: "160px",
          position: "absolute",
          top: `calc(216px - 80px)`,
          left: 0,
        }}
        src={getGooglePhotoURLwithRes(student?.photo_url, "256")}
        referrerPolicy="no-referrer"
      />
      <Box
        id="studentprofile-connect-box"
        sx={{
          height: "80px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingRight: 4,
        }}
      >
        <Tooltip title={ediumUser?.uid ? "" : "Edit your profile first"}>
          <span>
            <Button
              color="secondary"
              disabled={!ediumUser?.uid || ediumUser?.uid === student?.uid}
              disableElevation
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
              sx={{
                borderRadius: 8,
                width: "128px",
              }}
            >
              {"Connect"}
            </Button>
          </span>
        </Tooltip>
      </Box>
      <Box
        id="studentprofile-info-box"
        ref={boxRef}
        sx={{
          height: onMedia.onDesktop
            ? `calc(${winHeight}px - 65px - ${theme.spacing(
                4
              )} - 1px - 216px - 80px - ${theme.spacing(2)})`
            : `calc(${winHeight}px - 48px - 48px - 1px - 60px)`,
          overflowY: "scroll",
          marginTop: 2,
          paddingX: 4,
        }}
      >
        {/* name + icon */}
        <Box
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <Typography
            sx={{
              mr: 2,
              fontWeight: "medium",
              fontSize: "1.875rem",
            }}
          >
            {student?.name}
          </Typography>
          <ExportedImage
            src="/images/u_logo.png"
            alt=""
            placeholder="empty"
            height={24}
            width={17}
          />
        </Box>
        {/* education year */}
        {student?.year_of_ed && (
          <Typography>
            {ordinal_suffix_of(student.year_of_ed) + " year"}
          </Typography>
        )}

        {/* position */}
        <Typography sx={{ fontSize: onMedia.onDesktop ? "1.1em" : "1em" }}>
          {student?.desired_position}
        </Typography>

        {/* field of interest */}
        <Typography sx={{ fontSize: onMedia.onDesktop ? "1.1em" : "1em" }}>
          {student?.field_of_interest}
        </Typography>

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
                    sx={{
                      fontSize: onMedia.onDesktop ? "3em" : "2.5em",
                      mr: 1,
                    }}
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
              student.social_media?.map((link, index) => {
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
            student.past_exp?.map((exp, index) => (
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
      </Box>
    </Paper>
  );
};

export default StudentProfile;
