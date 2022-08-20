import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useContext, useEffect } from "react";
import { db } from "../firebase";
import { useAuth } from "./Context/AuthContext";
import { GlobalContext } from "./Context/ShareContexts";

const DBListener = () => {
  // context
  const { currentUser } = useAuth();
  const {
    setProjects,
    setProjectsExt,
    setStudents,
    setCurrentStudent,
    setChats,
  } = useContext(GlobalContext);

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
          last_timestamp: doc.data().last_timestamp?.toDate(),
        }))
      );
    });

    return unsub;
  }, [setProjects]);

  // listen to realtime projects ext collection
  useEffect(() => {
    const collectionRef = collection(db, "projects_ext");
    const q = query(
      collectionRef,
      where("members", "array-contains", currentUser?.uid),
      orderBy("last_timestamp", "desc")
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      setProjectsExt(
        querySnapshot.docs.map((doc) => {
          const projectExt = {
            ...doc.data(),
            id: doc.id,
            last_timestamp: doc.data().last_timestamp?.toDate(),
          };
          if (!projectExt?.schedules) return projectExt; // return if there's no schedules
          projectExt.schedules.forEach(
            (schedule) =>
              (schedule.availability = schedule.availability.map((dateTime) =>
                dateTime.toDate()
              ))
          );
          return projectExt;
        })
      );
    });

    return () => {
      unsub;
    };
  }, [currentUser, setProjectsExt]);

  // listen to realtime students collection
  useEffect(() => {
    // db query
    const collectionRef = collection(db, "students");
    const q = query(collectionRef, orderBy("name", "desc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      setStudents(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          uid: doc.id,
        }))
      );
    });

    return unsub;
  }, [setStudents]);

  // listen to realtime currentUser's student doc
  useEffect(() => {
    const docID = currentUser?.uid;
    if (!docID) return;

    const unsub = onSnapshot(doc(db, "students", docID), (doc) => {
      if (doc.exists()) {
        setCurrentStudent({ ...doc.data(), uid: docID });
      }
    });

    return unsub;
  }, [currentUser, setCurrentStudent]);

  // listen to realtime chats collection
  useEffect(() => {
    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      where("chat_user_ids", "array-contains", currentUser?.uid),
      orderBy("last_timestamp", "desc")
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      setChats(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });

    return unsub;
  }, [currentUser, setChats]);

  return null;
};

export default DBListener;
