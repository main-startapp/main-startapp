import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";

// can READ a project
// can UPDATE a project
// can CREATE a project
export default function handler(req, res) {
  if (req.method === "GET") {
    return handleGet(req, res);
  } else if (req.method === "PUT") {
    return handleUpdate(req, res);
  } else if (req.method === "POST") {
    return handleCreate(req, res);
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}

// can always Read
const handleGet = async (req, res) => {
  try {
    const { projectId } = req.query;

    const docRef = doc(db, "projects", projectId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists) {
      const docData = snapshot.data();
      return res.status(200).json({ data: docData });
    } else {
      return res.status(404).json({ error: "Project not found" });
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// can Update project when authorized -> user in members of project ext

// can Create project
// Create both project and ext in batch
