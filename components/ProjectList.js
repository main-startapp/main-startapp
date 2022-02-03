import { collection, query, orderBy, onSnapshot } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import Project from "./Project";

// a list of Project component
const ProjectList = () => {
  const [projects, setProjects] = useState([]); // don't be confused with [project, setProject]

  useEffect(() => {
    const collectionRef = collection(db, "projects");
    const q = query(collectionRef, orderBy("last_timestamp", "desc"));

    // Get realtime updates with Cloud Firestore
    // https://firebase.google.com/docs/firestore/query-data/listen
    // !todo: simply the listener, especially the docs.map?
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
    <div>
      {projects.map((project) => (
        <Project
          key={project.id}
          id={project.id}
          title={project.title}
          detail={project.detail}
          last_timestamp={project.last_timestamp}
          max_member={project.max_member}
          creator_email={project.creator_email}
        />
      ))}
    </div>
  );
};

export default ProjectList;
