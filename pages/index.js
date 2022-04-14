import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
} from "firebase/firestore";
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
  const [currentStudent, setCurrentStudent] = useState(null); // the student data of the currentUser

  // listen to Projects collection
  // https://stackoverflow.com/questions/59841800/react-useeffect-in-depth-use-of-useeffect
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

  // listen to the current user's student data for realtime update
  // similar alg in pages/students; pages/student/create
  // reason: Connect button in the ProjectInfo comp; Join Request button in the PositionListItem comp
  useEffect(() => {
    const docID = currentUser?.uid || 0;
    const unsub = onSnapshot(doc(db, "students", docID), (doc) => {
      if (doc.exists()) {
        setCurrentStudent({ ...doc.data(), uid: docID });
      }
    });

    return () => {
      unsub;
    };
  }, [currentUser]);

  return (
    <ProjectContext.Provider
      value={{
        currentUser,
        project,
        setProject,
        projects,
        searchTerm,
        setSearchTerm,
        searchCategory,
        setSearchCategory,
        currentStudent,
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
