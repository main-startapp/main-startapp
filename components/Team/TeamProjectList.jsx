import { Box, Divider } from "@mui/material";
import { useContext, useEffect, useMemo } from "react";
import { GlobalContext } from "../Context/ShareContexts";
import TeamProjectListItem from "./TeamProjectListItem";
import TeamProjectListItemEmpty from "./TeamProjectListItemEmpty";

const TeamProjectList = () => {
  // contexts
  const { projects, projectsExt, ediumUserExt, chats } =
    useContext(GlobalContext);

  // local vars
  const maxProjectCount = 3;
  const myProjectCount = useMemo(() => {
    // if no ediumUser data, don't show the project creation slot
    // if no length or 0, treat it as 0
    // if number > 0, use it
    if (!ediumUserExt) return maxProjectCount;
    return ediumUserExt?.my_project_ids?.length || 0;
  }, [ediumUserExt]);

  // helper fun
  const getProject = (id) => {
    return projects.find((project) => project.id === id) || null;
  };

  const getProjectExt = (id) => {
    return projectsExt.find((projectExt) => projectExt.id === id) || null;
  };

  return (
    <Box
      sx={{
        height: "calc(98vh - 64px)", // navbar: 64px
        overflow: "auto",
      }}
    >
      {/* my projects */}
      {ediumUserExt?.my_project_ids?.map((myProjectID) => {
        return (
          <TeamProjectListItem
            key={myProjectID}
            project={getProject(myProjectID)}
            projectExt={getProjectExt(myProjectID)}
          />
        );
      })}
      {Array(
        maxProjectCount - myProjectCount > 0
          ? maxProjectCount - myProjectCount
          : 0
      )
        .fill("filler")
        ?.map((filler, index) => {
          return <TeamProjectListItemEmpty key={index} />;
        })}
      {/* divider: !! to transfer number to boolean; willl not show if no joined projects */}
      {/* involved projects */}
      {}
    </Box>
  );
};

export default TeamProjectList;
