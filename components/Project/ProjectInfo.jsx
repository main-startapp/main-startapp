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
    <Paper>
      <Box
        ref={boxRef}
        sx={{
          height: onMedia.onDesktop
            ? `calc(${winHeight}px - 64px - 1.5px)`
            : `calc(${winHeight}px - 2*48px - 1.5px - 60px)`,
          overflow: "auto",
          backgroundColor: "#fafafa",
        }}
      >
        {!!project && (
          <Grid container>
            {/* Top left info box */}
            <Grid item xs={onMedia.onDesktop ? 9 : 12}>
              <Box
                sx={
                  onMedia.onDesktop
                    ? { mt: 3, ml: 3, mr: 1.5 }
                    : { mt: 1.5, mx: 1.5 }
                }
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {/* default unit is px */}
                  <Avatar
                    sx={{
                      mr: onMedia.onDesktop ? 3 : 1.5,
                      height: "72px",
                      width: "72px",
                    }}
                    src={project?.icon_url}
                  >
                    <UploadFileIcon />
                  </Avatar>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: onMedia.onDesktop ? "2em" : "1em",
                    }}
                  >
                    {project?.title}
                  </Typography>
                </Box>
                <Divider
                  sx={{
                    mt: onMedia.onDesktop ? 3 : 1.5,
                    mb: onMedia.onDesktop ? 3 : 1.5,
                    borderBottomWidth: 1.5,
                    borderColor: "#dbdbdb",
                  }}
                />
                <Typography
                  sx={{
                    fontWeight: "bold",
                  }}
                  color="text.primary"
                >
                  {"Details: "}
                </Typography>
                <Typography color="text.secondary">
                  {project?.details}
                </Typography>
                {project.max_member_count && (
                  <div>
                    <Typography
                      sx={{
                        mt: onMedia.onDesktop ? 3 : 1.5,
                        fontWeight: "bold",
                      }}
                      color="text.primary"
                    >
                      {"Team size: "}
                    </Typography>
                    <Typography color="text.secondary">
                      {/* {project?.cur_member_count}
                {"/"} */}
                      {project?.max_member_count}
                    </Typography>
                  </div>
                )}
              </Box>
            </Grid>

            {/* Top right founder box */}
            {onMedia.onDesktop &&
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
                      <Tooltip
                        title={ediumUser?.uid ? "" : "Edit your profile first"}
                      >
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
              )}

            {/* Bottom description and position boxes */}
            <Grid item xs={12}>
              <Box
                sx={
                  onMedia.onDesktop
                    ? {
                        mt: 3,
                        mx: 3,
                        mb: project?.position_list?.length > 0 ? 0 : "64xp",
                      }
                    : {
                        mt: 1.5,
                        mx: 1.5,
                      }
                }
              >
                <Typography sx={{ fontWeight: "bold" }} color="text.primary">
                  {"Description:"}
                </Typography>
                {/* <Typography component="span" color="text.secondary">
                  <pre
                    style={{
                      fontFamily: "inherit",
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                      display: "inline",
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: project?.description }}
                    />
                  </pre>
                </Typography> */}
                <Typography color="text.secondary">
                  <Interweave
                    content={project?.description}
                    matchers={[new UrlMatcher("url")]}
                  />
                </Typography>
              </Box>
              {/* position details */}
              {project?.position_list?.length > 0 && (
                <Box
                  sx={{
                    mt: 3,
                    mx: onMedia.onDesktop ? 3 : 0,
                    mb: onMedia.onDesktop ? "64px" : 3,
                    paddingY: 1.5,
                    border: 1.5,
                    borderColor: "#dbdbdb",
                    borderRadius: "10px",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Typography
                    sx={{ ml: 3, fontWeight: "bold" }}
                    color="text.primary"
                  >
                    {"Positions:"}
                  </Typography>
                  {project?.position_list.map((position, index) => (
                    <PositionListItem
                      key={index}
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
            </Grid>

            {onMedia.onDesktop &&
              project?.creator_uid === "T5q6FqwJFcRTKxm11lu0zmaXl8x2" &&
              currentUser?.uid === "T5q6FqwJFcRTKxm11lu0zmaXl8x2" &&
              !ediumUserExt?.my_project_ids?.includes(project?.id) && (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      mt: 3,
                      mr: 3,
                      ml: 1.5,
                    }}
                  >
                    <Button
                      variant="contained"
                      disableElevation
                      color="AdminOrange"
                      sx={{
                        borderRadius: "0px",
                        color: "white",
                        mb: 1.5,
                        width: "200px",
                        height: "64px",
                        textTransform: "none",
                        fontWeight: "bold",
                      }}
                      onClick={() => {
                        getDocFromDB("projects_ext", project?.id).then(
                          (ret) => {
                            setTCode(ret?.transfer_code);
                            navigator.clipboard.writeText(
                              ret?.transfer_code || "null"
                            );
                          }
                        );
                      }}
                    >
                      {"ADMIN"}
                      <br />
                      {"Get Transfer Code"}
                    </Button>
                    <Box
                      sx={{
                        width: "200px",
                        height: "64px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        ":hover": {
                          cursor: "pointer",
                        },
                      }}
                      onClick={() => {
                        if (!(tCode === "Copied")) {
                          navigator.clipboard.writeText(tCode);
                        }
                        setTCode("Copied");
                      }}
                    >
                      {tCode ? (
                        <>
                          <KeyboardArrowRightIcon sx={{ color: "#f4511e" }} />
                          <Typography
                            sx={{ fontWeight: "bold", color: "#f4511e" }}
                          >
                            {tCode}
                          </Typography>
                          <KeyboardArrowLeftIcon sx={{ color: "#f4511e" }} />
                        </>
                      ) : (
                        <br />
                      )}
                    </Box>
                    {!!tCode && (
                      <Button
                        variant="contained"
                        disableElevation
                        color="AdminOrange"
                        sx={{
                          borderRadius: "0px",
                          color: "white",
                          mt: 1.5,
                          width: "200px",
                          height: "64px",
                          textTransform: "none",
                          fontWeight: "bold",
                        }}
                        onClick={() => {
                          router.push(`/redemption`);
                        }}
                      >
                        {"To the Redemption"}
                      </Button>
                    )}
                  </Box>
                </Grid>
              )}
          </Grid>
        )}
        {!project && (
          <Box
            id="logo placeholder container"
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              id="logo placeholder wrapper"
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
        )}
      </Box>
    </Paper>
  );
};

export default ProjectInfo;
