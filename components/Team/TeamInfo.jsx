import { Avatar, Box, Divider, Typography } from "@mui/material";
import { useContext } from "react";
import { TeamContext } from "../Context/ShareContexts";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import TeamJoinRequestList from "./TeamJoinRequestList";

const TeamInfo = () => {
  const { project } = useContext(TeamContext);

  return (
    <Box
      sx={{
        height: "calc(98vh - 64px)", // navbar: 64px
        overflow: "auto",
      }}
    >
      {project?.id && (
        <Box mt={3} ml={3} mr={3}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {/* default unit is px */}
            <Avatar sx={{ mr: 2, height: 75, width: "75px" }}>
              <UploadFileIcon />
            </Avatar>
            <Typography sx={{ fontWeight: "bold", fontSize: "2.5em" }}>
              {project?.title}
            </Typography>
          </Box>
          <Divider sx={{ mt: 3, mb: 3 }} />
          <TeamJoinRequestList />
        </Box>
      )}
    </Box>
  );
};

export default TeamInfo;
