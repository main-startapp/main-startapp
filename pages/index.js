import { useContext, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import {
  GlobalContext,
  ProjectContext,
} from "../components/Context/ShareContexts";
import ProjectPageBar from "../components/Header/ProjectPageBar";
import ProjectList from "../components/Project/ProjectList";
import ProjectInfo from "../components/Project/ProjectInfo";

// this page is also project homepage. Is this a good practice?
export default function Home() {
  // global context
  const { setChat, setShowChat, setShowMsg } = useContext(GlobalContext);
  useEffect(() => {
    setShowChat(true);
    setShowMsg(false);
    setChat(null);
  }, [setChat, setShowChat, setShowMsg]);

  // project state init
  const [project, setProject] = useState(null);
  const [projects, setProjects] = useState([]); // list of project
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  // listen to realtime projects collection
  // https://stackoverflow.com/questions/59841800/react-useeffect-in-depth-use-of-useeffect
  useEffect(() => {
    // db query
    const collectionRef = collection(db, "projects");
    const q = query(collectionRef, orderBy("last_timestamp", "desc"));

    // https://firebase.google.com/docs/firestore/query-data/listen
    const unsub = onSnapshot(q, (querySnapshot) => {
      setProjects(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          last_timestamp: doc.data().last_timestamp?.toDate().getTime(),
        }))
      );
    });

    return unsub;
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        project,
        setProject,
        projects,
        searchTerm,
        setSearchTerm,
        searchCategory,
        setSearchCategory,
      }}
    >
      {/* Toolbar for searching keywords, category and filter */}
      <ProjectPageBar />
      <Grid
        container
        spaceing={0}
        mt={1}
        direction="row"
        alignItems="start"
        justifyContent="center"
      >
        {/* left comp: list of projects */}
        <Grid item xs={4}>
          <ProjectList />
        </Grid>
        {/* right comp: selected project's info  */}
        <Grid item xs={8}>
          <ProjectInfo />
        </Grid>
      </Grid>
    </ProjectContext.Provider>
  );
}
