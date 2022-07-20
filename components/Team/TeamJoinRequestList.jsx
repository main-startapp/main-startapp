import { Box, Grid } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { useContext } from "react";
import { TeamContext } from "../Context/ShareContexts";
import TeamJoinRequestListItem from "./TeamJoinRequestListItem";

const TeamJoinRequestList = () => {
  // context
  const { joinRequests, project } = useContext(TeamContext);

  return (
    <Box
      sx={{
        height: "400px",
        border: 1,
        borderRadius: 4,
        borderColor: "text.secondary",
        boxShadow: 0,
      }}
    >
      {"Join Requests"}
      <Carousel>
        {joinRequests
          .filter((request) => request.project_id === project?.id)
          .map((request) => (
            <TeamJoinRequestListItem
              key={request.project_id}
              requesterUID={request.requester_uid}
            />
          ))}
      </Carousel>
    </Box>
  );
};

export default TeamJoinRequestList;
