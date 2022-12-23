import {
  Avatar,
  Box,
  Button,
  Chip,
  Fab,
  Link,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useRef } from "react";
import { GlobalContext, StudentContext } from "../Context/ShareContexts";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";
import ParkIcon from "@mui/icons-material/Park";
import LinkIcon from "@mui/icons-material/Link";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import {
  FixedHeightPaper,
  getGooglePhotoURLwithRes,
  handleConnect,
  ordinal_suffix_of,
} from "../Reusable/Resusable";
import ExportedImage from "next-image-export-optimizer";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const StudentProfile = () => {
  // context
  const {
    chats,
    ediumUser,
    setForceChatExpand,
    setChatPartner,
    winWidth,
    onMedia,
  } = useContext(GlobalContext);
  const { student, setStudent } = useContext(StudentContext);

  // local
  const router = useRouter();

  // useEffect to reset box scrollbar position
  const boxRef = useRef();
  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (boxRef?.current?.scrollTop) boxRef.current.scrollTop = 0;
  }, [student]); // every time project changes, this forces each accordion to collapse

  return (
    <FixedHeightPaper
      elevation={onMedia.onDesktop ? 2 : 0}
      isdesktop={onMedia.onDesktop ? 1 : 0}
      mobileheight={0}
      sx={{
        position: "relative",
      }}
    >
      <Tooltip
        title="Credit: https://www.freepik.com/author/skyandglass"
        followCursor
      >
        <Box
          id="studentprofile-banner-box"
          sx={{
            display: "flex",
            flexDirection: "row",
            minHeight: "216px",
            height: "216px",
            maxHeight: "216px",
            width: "100%",
            borderRadius: "32px 32px 0px 0px",
            overflow: "hidden",
          }}
        >
          <ExportedImage
            src="/images/student_profile_banner2.png"
            alt=""
            height={216}
            width={512}
            style={{ borderRadius: "32px 32px 0px 0px" }}
          />
          {!onMedia.onDesktop && (
            <ExportedImage
              src="/images/student_profile_banner2.png"
              alt=""
              height={216}
              width={512}
              style={{ borderRadius: "32px 32px 0px 0px" }}
            />
          )}
        </Box>
      </Tooltip>
      <Avatar
        sx={{
          ml: onMedia.onDesktop ? 6 : 2,
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
          minHeight: "80px",
          height: "80px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingRight: onMedia.onDesktop ? 4 : 2,
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
                if (!onMedia.onDesktop) router.push("/chats");
              }}
              sx={{
                borderRadius: 8,
                width: winWidth < 375 ? "96px" : "128px",
              }}
            >
              {"Connect"}
            </Button>
          </span>
        </Tooltip>
      </Box>
      {/* <motion.div
        key={student?.name}
        initial={{ opacity: 0, y: "1%" }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      > */}
      <Box
        id="studentprofile-info-box"
        ref={boxRef}
        sx={{
          flexGrow: 1,
          overflowY: "scroll",
          paddingX: onMedia.onDesktop ? 4 : 2,
          paddingBottom: onMedia.onDesktop ? 4 : 2,
        }}
      >
        {/* name + icon */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            mt: onMedia.onDesktop ? 4 : 2,
          }}
        >
          <Typography
            variant="h2"
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

        {/* education year + major*/}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            mt: 1,
          }}
        >
          <Typography variant="h3" sx={{ fontSize: "1rem" }}>
            {student?.year_of_ed !== (null || undefined) &&
              ordinal_suffix_of(student.year_of_ed) + " year"}
            {student?.major !== (null || undefined) && " " + student.major}
          </Typography>
        </Box>

        {/* desired position */}
        {/* <Typography
          variant="h3"
          sx={{ mt: 2, fontSize: "1.25rem", fontWeight: "medium" }}
        >
          {student?.desired_position}
        </Typography> */}
        <Typography sx={{ mt: 2, fontSize: "1rem", fontWeight: "light" }}>
          {student?.introduction}
        </Typography>

        {/* social media links */}
        {student?.social_media?.length > 0 && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "row",
              height: "48px",
            }}
          >
            {student.social_media.map((link, index) => {
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
                        height: "100%",
                        width: "100%",
                        color: "#0077b5",
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
                        height: "100%",
                        width: "100%",
                        color: "#4267B2",
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
                      sx={{ height: "100%", width: "100%", color: "#E1306C" }}
                    />
                  </Link>
                );
              } else if (link.toLowerCase().includes("github")) {
                return (
                  <Link
                    key={index}
                    target="_blank"
                    href={link}
                    rel="noreferrer"
                  >
                    <GitHubIcon
                      sx={{
                        height: "91.57%",
                        width: "91.57%",
                        color: "#333",
                      }}
                    />
                  </Link>
                );
              } else if (link.toLowerCase().includes("linktr")) {
                return (
                  <Link
                    key={index}
                    target="_blank"
                    href={link}
                    rel="noreferrer"
                  >
                    <ParkIcon
                      sx={{
                        height: "94.88%",
                        width: "94.88%",
                        color: "#41e760",
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
                      sx={{ height: "100%", width: "100%", color: "#EF5432" }}
                    />
                  </Link>
                );
              }
            })}
          </Box>
        )}

        {/* About section */}
        {/* positions */}
        {student?.desired_position && (
          <>
            <Typography
              variant="h3"
              sx={{ mt: 4, fontSize: "1.25rem", fontWeight: "medium" }}
            >
              Desired Positions
            </Typography>
            <Chip
              color="primary"
              label={student.desired_position}
              size="medium"
              sx={{
                mr: 1,
                mt: 1,
                fontSize: "0.875rem",
                fontWeight: "medium",
              }}
            />
          </>
        )}
        {student?.other_positions?.map((position, index) => {
          return (
            <Chip
              key={index}
              color="lightPrimary"
              label={position}
              size="medium"
              sx={{
                mr: 1,
                mt: 1,
                fontSize: "0.875rem",
                fontWeight: "medium",
              }}
            />
          );
        })}

        {/* interests */}
        {student?.field_of_interest && (
          <>
            <Typography
              variant="h3"
              sx={{ mt: 4, fontSize: "1.25rem", fontWeight: "medium" }}
            >
              Interests
            </Typography>
            <Chip
              color="lightPrimary"
              label={student.field_of_interest}
              size="medium"
              sx={{
                mr: 1,
                mt: 1,
                fontSize: "0.875rem",
                fontWeight: "medium",
              }}
            />
          </>
        )}
        {student?.interests?.map((interest, index) => {
          return (
            <Chip
              key={index}
              color="lightPrimary"
              label={interest}
              size="medium"
              sx={{
                mr: 1,
                mt: 1,
                fontSize: "0.875rem",
                fontWeight: "medium",
              }}
            />
          );
        })}
        {/* testing filler */}
        {/* <Typography>
          There are many variations of passages of Lorem Ipsum available, but
          the majority have suffered alteration in some form, by injected
          humour, or randomised words which dont look even slightly believable.
          If you are going to use a passage of Lorem Ipsum, you need to be sure
          there isnt anything embarrassing hidden in the middle of text. All the
          Lorem Ipsum generators on the Internet tend to repeat predefined
          chunks as necessary, making this the first true generator on the
          Internet. It uses a dictionary of over 200 Latin words, combined with
          a handful of model sentence structures, to generate Lorem Ipsum which
          looks reasonable. The generated Lorem Ipsum is therefore always free
          from repetition, injected humour, or non-characteristic words etc.
        </Typography> */}
      </Box>
      {/* </motion.div> */}
      {!onMedia.onDesktop && student !== null && (
        <Fab
          color="primary"
          size="small"
          onClick={() => {
            setStudent(null);
          }}
          sx={{ position: "fixed", right: 16, bottom: 80 }}
        >
          <ArrowBackIosRoundedIcon />
        </Fab>
      )}
    </FixedHeightPaper>
  );
};

export default StudentProfile;

{
  /* awards */
}
{
  /* {student?.awards?.length > 0 && (
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
          </Box> */
}

{
  /* past experience */
}
{
  /* {student?.past_exp?.length > 0 && (
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
        </Box> */
}
