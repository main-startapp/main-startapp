import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../components/Context/AuthContext";
import { ProjectContext } from "../components/Context/ShareContexts";
import ProjectPageBar from "../components/Header/ProjectPageBar";
import ProjectList from "../components/Project/ProjectList";
import ProjectInfo from "../components/Project/ProjectInfo";

// this page is also project homepage. Is this a good practice?
export default function Home() {
  const { currentUser } = useAuth();

  // project state init
  const [project, setProject] = useState(null);
  const [projects, setProjects] = useState([]); // list of project
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  // fetch the projects collection (don't fetch data in the comps to avoid confusion)
  // https://stackoverflow.com/questions/59841800/react-useeffect-in-depth-use-of-useeffect
  // useEffect(() => {}, []) initializing comps state by data fetching once
  useEffect(() => {
    // db query
    const collectionRef = collection(db, "projects");
    const q = query(collectionRef, orderBy("last_timestamp", "desc"));

    // Get realtime updates with Cloud Firestore
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
        currentUser,
        project,
        setProject,
        projects,
        setProjects,
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
        alignItems="center"
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
