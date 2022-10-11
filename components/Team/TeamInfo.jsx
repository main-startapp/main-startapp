import { Avatar, Box, Divider, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { GlobalContext, TeamContext } from "../Context/ShareContexts";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import TeamJoinRequestList from "./TeamJoinRequestList";
import TeamCommPanel from "./TeamCommPanel";
import TeamScheduler from "./TeamScheduler";

const TeamInfo = () => {
  // context
  const { ediumUser } = useContext(GlobalContext);
  const { project, projectExt } = useContext(TeamContext);

  return (
    <Box
      sx={{
        height: "calc(98vh - 64px)", // navbar: 64px
        overflow: "auto",
      }}
    >
      {project?.id && (
        <Box sx={{ mt: 3, mx: 3 }}>
          {/* title */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {/* default unit is px */}
            <Avatar sx={{ mr: 2, height: "72px", width: "72px" }}>
              <UploadFileIcon />
            </Avatar>
            <Typography sx={{ fontWeight: "bold", fontSize: "2.5em" }}>
              {project?.title}
            </Typography>
          </Box>
          <Divider sx={{ mt: 3 }} />
          {/* join requests */}
          {projectExt?.admins?.includes(ediumUser?.uid) && (
            <TeamJoinRequestList />
          )}
          {/* info panel + meeting panel */}
          <Box sx={{ display: "flex", flexDirection: "row", mt: 3 }}>
            <Box
              sx={{
                width: "100%",
              }}
            >
              <TeamCommPanel />
            </Box>
            {/* <Box
              sx={{
                width: "40%",
              }}
            >
              <TeamScheduler />
            </Box> */}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TeamInfo;
