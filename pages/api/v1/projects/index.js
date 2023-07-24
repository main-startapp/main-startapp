import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  limit,
} from "firebase/firestore";
import { db } from "../../../../firebase";

// can only GET a list of projects
export default function handler(req, res) {
  if (req.method === "GET") {
    return handleGet(req, res);
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}

const handleGet = async (req, res) => {
  try {
    const collectionRef = collection(db, "projects");
    const docMax = 10;
    const q = query(
      collectionRef,
      where("is_deleted", "==", false),
      orderBy("create_timestamp", "desc"),
      limit(docMax)
    );
    const snapshot = await getDocs(q);
    const docsData = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    return res.status(200).json({ data: docsData });
  } catch (error) {
    console.error("Error retrieving data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
