import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
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
import StudentList from "../components/Student/StudentList";

export default function Students() {
  const { currentUser } = useAuth();
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);

  // fetch the students collection
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

  // fetch the users student data (in case it's not in the students)
  // !todo: can this be merged into the prev useEffect?
  useEffect(() => {
    // !todo: also used in /student/create.jsx, should this go into lib?
    async function fetchDoc(argDocRef) {
      const docSnap = await getDoc(argDocRef).catch((err) => {
        console.log("getDoc() error: ", err);
      });
      if (docSnap.exists()) {
        // return docSnap.data();
        setCurrentStudent({ ...docSnap.data(), uid: uid });
      } else {
        console.log("No such document for this student!");
      }
    }

    const uid = currentUser?.uid;
    const docRef = doc(db, "students", uid);
    fetchDoc(docRef);

    return docRef;
  }, [currentUser]);

  // debug console logs
  console.log("students state: ", students);
  // console.log("currentStudent state: ", currentStudent);

  return (
    <StudentContext.Provider
      value={{ currentUser, students, setStudents, currentStudent }}
    >
      <StudentPageBar />
      <Grid
        container
        spaceing={0}
        mt={1}
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={8}>
          <StudentList />
        </Grid>
        <Grid item xs={2}>
          <StudentProfile />
        </Grid>
      </Grid>
    </StudentContext.Provider>
  );
}
