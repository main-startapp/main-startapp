import { useState } from "react";
import ProjectPageBar from "../components/Header/ProjectPageBar";
import { ProjectContext } from "../components/Context/ProjectContext";
import { useAuth } from "../components/Context/AuthContext";
import ProjectPanel from "../components/Project/ProjectPanel";

export default function Home() {
  const { currentUser } = useAuth();
  // Project State Initialization
  const [project, setProject] = useState({
    title: "",
    category: "",
    completion_date: "",
    details: "", // will be a list latter
    description: "",
    cur_member_count: 1, // include the creator
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
        currentUser,
      }}
    >
      {/* Toolbar for searching keywords, category and filter */}
      <ProjectPageBar />
      <ProjectPanel />
    </ProjectContext.Provider>
  );
}
