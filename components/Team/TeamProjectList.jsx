import { Box } from "@mui/material";
import { useContext, useEffect } from "react";
import { GlobalContext, TeamContext } from "../Context/ShareContexts";
import TeamProjectListItem from "./TeamProjectListItem";
import TeamProjectListItemEmpty from "./TeamProjectListItemEmpty";

const TeamProjectList = () => {
  // contexts
  const { projects, currentStudent, chats } = useContext(GlobalContext);
  const { setJoinRequests } = useContext(TeamContext);

  // local vars
  const currentUID = currentStudent?.uid;
  const maxProjectCount = 3;
  const myProjectCount = 0;

  // hook to find all the join requests for all the created projects
  useEffect(() => {
    const requests = [];

    chats.forEach((chat) => {
      chat?.join_requests?.forEach((request) => {
        if (currentUID === request.creator_uid) {
          requests.push(request);
        }
      });
    });
    setJoinRequests(requests);

    return requests;
  }, [chats, currentUID, setJoinRequests]);

  return (
    <Box
      sx={{
        height: "calc(98vh - 64px)", // navbar: 64px
        overflow: "auto",
      }}
    >
      {/* my projects */}
      {projects
        .filter((project) => {
          if (project.creator_uid === currentUID) {
            myProjectCount++;
            return project;
          }
        })
        .map((project) => {
          return <TeamProjectListItem key={project.id} project={project} />;
        })}
      {Array(maxProjectCount - myProjectCount)
        .fill("filler")
        .map((filler, index) => {
          return <TeamProjectListItemEmpty key={index} />;
        })}
    </Box>
  );
};

export default TeamProjectList;
