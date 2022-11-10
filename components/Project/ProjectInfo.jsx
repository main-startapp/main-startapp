import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { GlobalContext, ProjectContext } from "../Context/ShareContexts";
import PositionListItem from "./PositionListItem";
import ExportedImage from "next-image-export-optimizer";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import NextLink from "next/link";
import {
  findItemFromList,
  getDocFromDB,
  handleConnect,
} from "../Reusable/Resusable";
import { useAuth } from "../Context/AuthContext";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useRouter } from "next/router";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";

const ProjectInfo = () => {
  // context
  const { currentUser } = useAuth();
  const {
    setOldProject,
    chats,
    ediumUser,
    ediumUserExt,
    users,
    setChatPartner,
    setForceChatExpand,
    winHeight,
    onMedia,
  } = useContext(GlobalContext);
  const { project } = useContext(ProjectContext);
  const theme = useTheme();

  // local vars
  const [tCode, setTCode] = useState("");
  useEffect(() => {
    setTCode("");
  }, [project]);

  const router = useRouter();

  // hooks
  const isCreator = useMemo(() => {
    return ediumUser?.uid === project?.creator_uid ? true : false;
  }, [ediumUser?.uid, project]);

  const creatorUser = useMemo(() => {
    return findItemFromList(users, "uid", project?.creator_uid);
  }, [users, project?.creator_uid]);

  const orgTags = useMemo(() => {
    if (creatorUser?.role !== "org_admin") return "";
    let retStr = "";
    creatorUser?.org_tags?.forEach((tag) => {
      retStr += ", " + tag;
    });
    return retStr;
  }, [creatorUser]);

  // box ref to used by useEffect
  const boxRef = useRef();

  // useEffect to reset box scrollbar position
  useEffect(() => {
    boxRef.current.scrollTop = 0;
  }, [project]); // every time project changes, this forces each accordion to collapse

  return (
    <Paper
      elevation={2}
      sx={{
        mt: 4,
        backgroundColor: "background",
        border: 1.5,
        borderColor: "divider",
        borderRadius: "30px 30px 0px 0px",
      }}
    >
      <Box id="projectinfo-box" ref={boxRef}>
        <Box
          id="projectinfo-header-box"
          sx={{
            paddingTop: 6,
            paddingX: 4,
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
              fontSize: onMedia.onDesktop ? "32px" : "16px",
              fontWeight: "bold",
            }}
          >
            {project?.title}
          </Typography>
        </Box>
        <Divider
          sx={{
            mx: 4,
            mt: onMedia.onDesktop ? 2 : 1,
            borderBottomWidth: 1.5,
            borderColor: "divider",
          }}
        />
        <Box
          id="projectinfo-content-box"
          sx={{
            height: onMedia.onDesktop
              ? `calc(${winHeight}px - 64px - 1.5px - ${theme.spacing(
                  4
                )} - 1.5px - 144px - 1.5px - ${theme.spacing(2)} - 1.5px )` // window height; navbar; navbar border; spacing; paper top border; header; divider+margin; paper bottom border
              : `calc(${winHeight}px - 2*48px - 1.5px - 60px)`,
            overflow: "auto",
            paddingY: 4,
            paddingX: 4,
          }}
        >
          <Typography
            color="text.primary"
            variant="h3"
            sx={{ mb: 1, fontSize: "1.25rem", fontWeight: "bold" }}
          >
            {"Description:"}
          </Typography>
          <Typography color="text.secondary" component="span" variant="body1">
            <Interweave
              content={project?.description}
              matchers={[new UrlMatcher("url")]}
            />
          </Typography>

          <Typography
            color="text.primary"
            variant="h3"
            sx={{ mt: 4, mb: 1, fontSize: "1.25rem", fontWeight: "bold" }}
          >
            {"Details: "}
          </Typography>
          <Typography color="text.secondary">
            {project?.details + orgTags}
          </Typography>

          {project?.position_list?.length > 0 && (
            <Box
              sx={{
                mt: 4,
                paddingX: 2,
                paddingY: 2,
                borderRadius: "10px",
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
              {project?.position_list.map((position, index) => (
                <PositionListItem
                  key={index}
                  index={index}
                  posID={position.id}
                  posTitle={position.title}
                  posResp={position.responsibility}
                  posWeeklyHour={position.weekly_hour}
                  isCreator={isCreator}
                  creator={creatorUser}
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
        </Box>
      </Box>
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
            src={creatorUser?.photo_url}
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
            {creatorUser?.name || "Founder"}
          </Typography>

          {isCreator ? (
            <NextLink
              href={{
                pathname: "/projects/create",
                query: { isCreateStr: "false" },
              }}
              as="/projects/create"
              passHref
            >
              <Button
                onClick={() => setOldProject(project)}
                variant="contained"
                sx={{
                  mt: 1,
                  border: 1.5,
                  borderColor: "#dbdbdb",
                  borderRadius: "30px",
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
                    border: 1.5,
                    borderColor: "#dbdbdb",
                    borderRadius: "30px",
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
                      creatorUser,
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

{
  /* {!project && (
          <Box
            id="projectinfo-logo-placeholder-box"
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              id="projectinfo-logo-placeholder-wrapper-box"
              sx={{
                display: "flex",
                justifyContent: "center",
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
          </Box>
        )} */
}
