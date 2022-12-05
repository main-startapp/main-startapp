import { useContext, useMemo, useEffect, useState } from "react";
import NextLink from "next/link";
import { Box, Button, Paper, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { GlobalContext, ProjectContext } from "../Context/ShareContexts";
import ProjectListItem from "./ProjectListItem";
import ProjectListHeader from "./ProjectListHeader";
import {
  findItemFromList,
  isStrInObjList,
  isStrInStr,
  isStrInStrList,
} from "../Reusable/Resusable";

// link/router https://stackoverflow.com/questions/65086108/next-js-link-vs-router-push-vs-a-tag
// description: a list of projects (project list items); a button to create new project (router.push)
// behavior: filters projects based on the search term and/or search category
const ProjectList = () => {
  // context
  const { projects, users, ediumUser, winHeight, onMedia } =
    useContext(GlobalContext);
  const { setFullProject, searchTerm, searchTypeList } =
    useContext(ProjectContext);
  const theme = useTheme();

  // projects with extra info from other dataset (creator, merged tags)
  const fullProjects = useMemo(() => {
    return projects?.map((project) => {
      // creator
      const projectCreator = findItemFromList(
        users,
        "uid",
        project?.creator_uid
      );
      // allTags
      let projectTags = [];
      if (project?.tags?.length > 0) {
        projectTags = projectTags.concat(project.tags); // project tags
      }
      if (
        projectCreator?.role === "org_admin" &&
        projectCreator?.org_tags?.length > 0
      ) {
        projectTags = projectTags.concat(projectCreator.org_tags); // org tags
      }
      // category
      projectTags.push(project?.category?.toLowerCase()); // type
      return {
        project: project,
        creator: projectCreator,
        allTags: projectTags,
      };
    });
  }, [projects, users]);

  // project list with filtering
  const filteredFullProjects = useMemo(() => {
    return fullProjects?.filter((fullProject) => {
      if (!fullProject.project.is_visible) return false;

      if (searchTerm === "" && searchTypeList.length === 0) {
        return true; // no search
      } else if (searchTerm !== "" && searchTypeList.length === 0) {
        return (
          isStrInStr(fullProject.project.title, searchTerm, false) ||
          isStrInObjList(
            fullProject.project.position_list,
            "title",
            searchTerm,
            false
          )
        ); // only term: in project title || position title
      } else if (searchTerm === "" && searchTypeList.length > 0) {
        return searchTypeList.some((type) => {
          return isStrInStrList(fullProject.allTags, type, true);
        }); // only tags
      } else {
        return (
          searchTypeList.some((type) => {
            return isStrInStrList(fullProject.allTags, type, true);
          }) &&
          (isStrInStr(fullProject.project.title, searchTerm, false) ||
            isStrInObjList(
              fullProject.project.position_list,
              "title",
              searchTerm,
              false
            ))
        ); // term && tags
      }
    });
  }, [fullProjects, searchTerm, searchTypeList]);

  // set initial project to be the first in list to render out immediately
  useEffect(() => {
    if (!onMedia.onDesktop) return;

    if (filteredFullProjects?.length > 0) {
      setFullProject(filteredFullProjects[0]);
    } else {
      setFullProject(null);
    }
  }, [filteredFullProjects, onMedia.onDesktop, setFullProject]);

  return (
    <Paper
      elevation={onMedia.onDesktop ? 2 : 0}
      sx={{
        // mt: onMedia.onDesktop ? 4 : 2,
        // ml: onMedia.onDesktop ? 4 : 2,
        // mr: onMedia.onDesktop ? 2 : 0,
        backgroundColor: "background.paper",
        borderTop: onMedia.onDesktop ? 1 : 0,
        borderColor: "divider",
        borderRadius: onMedia.onDesktop
          ? "32px 32px 0px 0px"
          : "32px 0px 0px 0px",
        paddingTop: "32px",
      }}
    >
      {onMedia.onDesktop && <ProjectListHeader />}

      <Box
        id="projectlist-projectlistitem-box"
        sx={{
          height: onMedia.onDesktop
            ? `calc(${winHeight}px - 65px - ${theme.spacing(
                4
              )} - 1px - 32px - 112px - 29px - 96px)` // navbar; spacing; paper t-border; paper t-padding; header; button box
            : `calc(${winHeight}px - 160px - ${theme.spacing(
                2
              )} - 32px + 1px - 65px)`, // mobile bar; spacing margin; inner t-padding; last entry border; bottom navbar
          overflowY: "scroll",
        }}
      >
        {filteredFullProjects?.map((fullProject, index) => (
          <ProjectListItem
            key={fullProject?.project?.id}
            fullProject={fullProject}
            index={index}
            last={filteredFullProjects.length - 1}
          />
        ))}
      </Box>

      {onMedia.onDesktop && (
        <Box
          id="projectlist-button-box"
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingY: 3,
            paddingX: 2,
          }}
        >
          <Tooltip
            title={ediumUser?.uid ? "" : "Edit your profile first"}
            style={{ width: "100%" }}
          >
            <span>
              <NextLink
                href={{
                  pathname: "/projects/create",
                }}
                as="/projects/create"
                passHref
              >
                <Button
                  color="secondary"
                  disabled={!ediumUser?.uid}
                  disableElevation
                  fullWidth
                  variant="contained"
                  sx={{
                    height: "48px",
                    borderRadius: 8,
                  }}
                >
                  <Typography variant="button" sx={{ fontSize: "1.125rem" }}>
                    {"Create Project"}
                  </Typography>
                </Button>
              </NextLink>
            </span>
          </Tooltip>
        </Box>
      )}
    </Paper>
  );
};

export default ProjectList;
