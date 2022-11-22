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

// purpose: Firebase prefer consistent subscription. This comp serves this purpose by subscribing the essential db and also providing the derived data required by other comps.
// https://stackoverflow.com/questions/61094496/how-can-i-secure-my-component-state-details-from-react-dev-tool-on-production
// tldr; you can't. don't pass sensitive data to client

const DBListener = () => {
  // context
  const { currentUser } = useAuth();
  const {
    setProjects,
    setProjectsExt,
    setEvents,
    setEventsExt,
    setUsers,
    setEdiumUser,
    setEdiumUserExt,
    setChats,
  } = useContext(GlobalContext);

  {
    /* db listeners */
  }

  // listen to realtime projects collection, public
  // https://stackoverflow.com/questions/59841800/react-useeffect-in-depth-use-of-useeffect
  useEffect(() => {
    // db query
    const collectionRef = collection(db, "projects");
    const q = query(
      collectionRef,
      where("is_deleted", "==", false),
      orderBy("create_timestamp", "desc")
    );

    // https://firebase.google.com/docs/firestore/query-data/listen
    const unsub = onSnapshot(
      q,
      (querySnapshot) => {
        setProjects(
          querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            completion_date: doc.data()?.completion_date
              ? doc.data().completion_date.toDate()
              : "",
            create_timestamp: doc.data().create_timestamp?.toDate(),
            last_timestamp: doc.data().last_timestamp?.toDate(),
          }))
        );
      },
      (error) => {
        console.log("projects", error?.message);
      }
    );

    return unsub;
  }, [setProjects]);

  // listen to realtime projects ext collection, only doc's field: memebers contains currentUser will be pulled
  useEffect(() => {
    const memberID = currentUser?.uid;
    if (!memberID) return;

    const collectionRef = collection(db, "projects_ext");
    const q = query(
      collectionRef,
      where("members", "array-contains", memberID),
      orderBy("last_timestamp", "desc")
    );
    const unsub = onSnapshot(
      q,
      (querySnapshot) => {
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
      },
      (error) => {
        console.log("projects ext", error?.message);
      }
    );

    return () => {
      unsub;
    };
  }, [currentUser, setProjectsExt]);

  // listen to realtime events collection, public
  useEffect(() => {
    // db query
    const collectionRef = collection(db, "events");
    const q = query(
      collectionRef,
      where("is_deleted", "==", false),
      orderBy("start_date", "asc")
    );

    const unsub = onSnapshot(
      q,
      (querySnapshot) => {
        setEvents(
          querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            create_timestamp: doc.data().create_timestamp?.toDate(),
            last_timestamp: doc.data().last_timestamp?.toDate(),
            start_date: doc.data().start_date?.toDate(),
            end_date: doc.data().end_date?.toDate(),
          }))
        );
      },
      (error) => {
        console.log("events", error?.message);
      }
    );

    return unsub;
  }, [setEvents]);

  // listen to realtime events ext collection, only doc's field: memebers contains currentUser will be pulled
  useEffect(() => {
    const memberID = currentUser?.uid;
    if (!memberID) return;

    const collectionRef = collection(db, "events_ext");
    const q = query(
      collectionRef,
      where("members", "array-contains", memberID),
      orderBy("last_timestamp", "desc")
    );
    const unsub = onSnapshot(
      q,
      (querySnapshot) => {
        setEventsExt(
          querySnapshot.docs.map((doc) => {
            const eventExt = {
              ...doc.data(),
              id: doc.id,
              last_timestamp: doc.data().last_timestamp?.toDate(),
            };
            return eventExt;
          })
        );
      },
      (error) => {
        console.log("events ext", error?.message);
      }
    );

    return () => {
      unsub;
    };
  }, [currentUser, setEventsExt]);

  // listen to realtime users collection, public
  useEffect(() => {
    // db query
    const collectionRef = collection(db, "users");
    const q = query(collectionRef, orderBy("name", "desc"));
    const unsub = onSnapshot(
      q,
      (querySnapshot) => {
        setUsers(
          querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            uid: doc.id,
          }))
        );
      },
      (error) => {
        console.log("users", error?.message);
      }
    );

    return unsub;
  }, [setUsers]);

  // listen to realtime currentUser's doc
  useEffect(() => {
    const docID = currentUser?.uid;
    if (!docID) return;

    const unsub = onSnapshot(
      doc(db, "users", docID),
      (doc) => {
        if (doc.exists()) {
          setEdiumUser({ ...doc.data(), uid: docID });
        }
      },
      (error) => {
        console.log("edium user", error?.message);
      }
    );

    return unsub;
  }, [currentUser, setEdiumUser]);

  // listen to realtime currentUser's ext doc
  useEffect(() => {
    const docID = currentUser?.uid;
    if (!docID) return;

    const unsub = onSnapshot(
      doc(db, "users_ext", docID),
      (doc) => {
        if (doc.exists()) {
          setEdiumUserExt({ ...doc.data(), uid: docID });
        }
      },
      (error) => {
        console.log("edium user ext", error?.message);
      }
    );

    return unsub;
  }, [currentUser, setEdiumUserExt]);

  // listen to realtime chats collection, only doc's field: chat_user_ids contains currentUser will be pulled
  useEffect(() => {
    const userID = currentUser?.uid;
    if (!userID) return;

    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      where("chat_user_ids", "array-contains", userID),
      orderBy("last_timestamp", "desc")
    );
    const unsub = onSnapshot(
      q,
      (querySnapshot) => {
        setChats(
          querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      },
      (error) => {
        console.log("chats", error?.message);
      }
    );

    return unsub;
  }, [currentUser, setChats]);

  return null;
};

export default DBListener;
