import { useContext, useEffect, useRef, useState } from "react";
import { Avatar, Box, Chip, Divider, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { GlobalContext, ProjectContext } from "../Context/ShareContexts";
import PositionListItem from "./PositionListItem";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { motion } from "framer-motion";

const ProjectInfo = () => {
  // context
  const { winHeight, onMedia } = useContext(GlobalContext);
  const { fullProject } = useContext(ProjectContext);
  const theme = useTheme();

  // local vars
  const project = fullProject?.project;
  const projectCreator = fullProject?.creator_uid;
  const projectAllTags = fullProject?.allTags;

  const [tCode, setTCode] = useState("");
  useEffect(() => {
    setTCode("");
  }, [fullProject]);

  // useEffect to reset box scrollbar position
  const boxRef = useRef();
  useEffect(() => {
    if (boxRef?.current?.scrollTop) boxRef.current.scrollTop = 0;
  }, [fullProject]); // every time project changes, this forces each accordion to collapse

  return (
    <Paper
      elevation={2}
      sx={{
        // mt: onMedia.onDesktop ? 4 : 2,
        // ml: onMedia.onDesktop ? 2 : 2,
        // mr: onMedia.onDesktop ? 4 : 0,
        backgroundColor: "background.paper",
        borderTop: onMedia.onDesktop ? 1 : 0,
        borderColor: "divider",
        borderRadius: "32px 32px 0px 0px",
        paddingTop: "32px",
        minHeight: "100%",
      }}
    >
      <motion.div
        key={project?.title}
        initial={{ opacity: 0, y: "1%" }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          id="projectinfo-box"
          ref={boxRef}
          sx={{
            height: onMedia.onDesktop
              ? `calc(${winHeight}px - 65px - ${theme.spacing(4)} - 1px - 32px)` // navbar; spacing; paper t-border; paper t-padding
              : `calc(${winHeight}px - 64px - ${theme.spacing(
                  2
                )} - 32px - 65px)`, // mobile bar; spacing; paper t-padding; bottom navbar
            overflowY: "scroll",
            paddingTop: 2, // align with project list
            paddingBottom: 6, // enough space to not covered by messages
            paddingLeft: 4,
            paddingRight: `calc(${theme.spacing(4)} - 0.4rem)`, // considering scrollbar
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            id="projectinfo-header-box"
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{
                mr: onMedia.onDesktop ? 4 : 2,
                height: "96px",
                width: "96px",
              }}
              src={project?.icon_url}
            >
              <UploadFileIcon />
            </Avatar>
            <Typography
              color="text.primary"
              variant="h2"
              sx={{
                fontSize: onMedia.onDesktop ? "1.875rem" : "1.25rem",
                fontWeight: "bold",
              }}
            >
              {project?.title}
            </Typography>
          </Box>
          <Divider
            sx={{
              mt: 2,
              borderBottomWidth: 1,
              borderColor: "divider",
            }}
          />
          <Typography
            color="text.primary"
            variant="h3"
            sx={{
              mt: 4,
              mb: 1,
              fontSize: "1.25rem",
              fontWeight: "bold",
            }}
          >
            {"Description:"}
          </Typography>
          <Typography color="text.secondary" component="span" variant="body1">
            <pre
              style={{
                fontFamily: "inherit",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                display: "inline",
              }}
            >
              <Interweave
                content={project?.description}
                matchers={[new UrlMatcher("url")]}
              />
            </pre>
          </Typography>

          {project?.position_list?.length > 0 && (
            <Box
              id="projectinfo-positions-box"
              sx={{
                mt: 4,
                paddingX: 2,
                paddingY: 2,
                borderRadius: 2,
                backgroundColor: "primary.main",
              }}
            >
              <Typography
                color="white"
                variant="h3"
                sx={{ fontSize: "1.25rem", fontWeight: "bold" }}
              >
                {"Positions:"}
              </Typography>
              {project?.position_list?.map((position, index) => (
                <PositionListItem
                  key={index}
                  index={index}
                  posID={position.id}
                  posTitle={position.title}
                  posResp={position.responsibility}
                  posWeeklyHour={position.weekly_hour}
                  posLevel={position?.level || ""}
                  creator={projectCreator}
                  appFormURL={
                    project.application_form_url !== ""
                      ? project.application_form_url
                      : position.url
                      ? position.url
                      : ""
                  }
                />
              ))}
            </Box>
          )}

          {projectAllTags?.length > 0 && (
            <Box id="projectinfo-details-box">
              <Typography
                color="text.primary"
                variant="h3"
                sx={{ mt: 4, fontSize: "1.25rem", fontWeight: "bold" }}
              >
                {"Details: "}
              </Typography>

              {projectAllTags?.map((tag, index) => (
                <Chip
                  key={index}
                  color={"lightPrimary"}
                  label={tag}
                  sx={{
                    mt: 1,
                    mr: 1,
                    fontSize: "0.875rem",
                    fontWeight: "medium",
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </motion.div>
    </Paper>
  );
};

export default ProjectInfo;

{
  /* Top right founder box */
}
{
  /*
  onMedia.onDesktop &&
    (project?.creator_uid !== "T5q6FqwJFcRTKxm11lu0zmaXl8x2" ||
      ediumUser?.uid === "T5q6FqwJFcRTKxm11lu0zmaXl8x2") && (
      <Grid item xs={3}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            mt: 3,
            mr: 3,
            ml: 1.5,
          }}
        >
          <Avatar
            sx={{
              width: "96px",
              height: "96px",
              // color: "#dbdbdb",
              // backgroundColor: "#ffffff",
            }}
            src={projectCreator?.photo_url}
            referrerPolicy="no-referrer"
          />

          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "1.1em",
              mt: 1,
            }}
          >
            {projectCreator?.name || "Founder"}
          </Typography>

          {isCreator ? (
            <NextLink
              href={{
                pathname: "/projects/create",
              }}
              as="/projects/create"
              passHref
            >
              <Button
                
                variant="contained"
                sx={{
                  mt: 1,
                  border: 1,
                  borderColor: "#dbdbdb",
                  borderRadius: 8,
                  color: "text.primary",
                  backgroundColor: "#ffffff",
                  fontWeight: "bold",
                  fontSize: "0.8em",
                  "&:hover": {
                    backgroundColor: "#f6f6f6",
                  },
                  textTransform: "none",
                }}
                disableElevation
              >
                {"Modify"}
              </Button>
            </NextLink>
          ) : (
            <Tooltip title={ediumUser?.uid ? "" : "Edit your profile first"}>
              <span>
                <Button
                  disabled={!ediumUser?.uid}
                  disableElevation
                  sx={{
                    mt: 1,
                    border:1,
                    borderColor: "#dbdbdb",
                    borderRadius: 8,
                    color: "text.primary",
                    backgroundColor: "#ffffff",
                    fontWeight: "bold",
                    fontSize: "0.8em",
                    "&:hover": {
                      backgroundColor: "#f6f6f6",
                    },
                    textTransform: "none",
                  }}
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnect(
                      chats,
                      projectCreator,
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
          )}
        </Box>
      </Grid>
    );
*/
}
