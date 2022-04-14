import { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../components/Context/AuthContext";
import { StudentContext } from "../components/Context/ShareContexts";
import StudentPageBar from "../components/Header/StudentPageBar";
import StudentProfile from "../components/Student/StudentProfile";
import StudentGrid from "../components/Student/StudentGrid";

export default function Students() {
  const { currentUser } = useAuth();
  const [student, setStudent] = useState(null); // the selected student by clicking the student card in the StudentGrid
  const [students, setStudents] = useState([]); // the list of realtime students from the db
  const [currentStudent, setCurrentStudent] = useState(null); // the student data of the currentUser

  // listen to Students collection for realtime updates
  // !todo: do we need to fetch all data?
  useEffect(() => {
    // db query
    const collectionRef = collection(db, "students");
    const q = query(collectionRef, orderBy("name", "desc")); // for now

    // Get realtime updates with Cloud Firestore
    // https://firebase.google.com/docs/firestore/query-data/listen
    const unsub = onSnapshot(q, (querySnapshot) => {
      setStudents(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          uid: doc.id,
        }))
      );
    });

    return unsub;
  }, []);

  // listen to the current user's student data for realtime update
  // similar alg in pages/student/create; pages/index
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

  // debug console logs
  // console.log("students state: ", students);
  // console.log("currentStudent state: ", currentStudent);

  return (
    <StudentContext.Provider
      value={{
        currentUser,
        student,
        setStudent,
        students,
        setStudents,
        currentStudent,
      }}
    >
      <StudentPageBar />
      <Grid
        container
        spaceing={0}
        mt={1}
        direction="row"
        // alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={7}>
          <StudentGrid />
        </Grid>
        <Grid item xs={3}>
          <StudentProfile />
        </Grid>
      </Grid>
    </StudentContext.Provider>
  );
}
