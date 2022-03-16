import {
  Alert,
  Avatar,
  Container,
  Grid,
  IconButton,
  Snackbar,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { useState } from "react";
import ProjectList from "../components/Project/ProjectList";
import { auth } from "../firebase";
import ProjectPageBar from "../components/Header/ProjectPageBar";
import { ProjectContext } from "../components/Context/ProjectContext";
import { useAuth } from "../components/Context/AuthContext";

export default function Home() {
  const { currentUser } = useAuth();
  // Project State Initialization
  const [project, setProject] = useState({
    title: "",
    category: "",
    completion_date: "",
    description: "",
    detail: "",
    cur_member_count: 0,
    max_member_count: 1,
    create_timestamp: "",
    last_timestamp: "",
    creator_email: "",
    creator_uid: "",
    position_list: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  return (
    <ProjectContext.Provider
      value={{
        project,
        setProject,
        searchTerm,
        setSearchTerm,
        searchCategory,
        setSearchCategory,
      }}
    >
      <ProjectPageBar />

      <ProjectList />

      {/* <Divider>End of Project Homepage</Divider>
      <Box
        sx={{
          maxWidth: "40%",
        }}
      >
        <ProjectForm />
      </Box> */}
    </ProjectContext.Provider>
  );
}
