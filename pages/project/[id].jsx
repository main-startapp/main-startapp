import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const Detail = ({ projectProps }) => {
  const project = JSON.parse(projectProps);
  return (
    <Grid container spacing={0} justifyContent="center">
      <Grid item xs={8}>
        <Typography
          variant="h4"
          component="div"
          sx={{ fontWeight: 600, mt: 6 }}
        >
          {project.hasOwnProperty("title") && project.title.length != 0
            ? project.title
            : "Project Title"}
        </Typography>
        <Divider sx={{ mt: 3 }} />
      </Grid>
    </Grid>
  );
};

export default Detail;

export const getStaticPaths = async () => {
  const snapShot = await getDocs(collection(db, "projects"));
  const paths = snapShot.docs.map((doc) => {
    return {
      params: { id: doc.id.toString() },
    };
  });

  return { paths, fallback: false };
};

export const getStaticProps = async (context) => {
  const id = context.params.id;
  const docRef = doc(db, "projects", id);
  const docSnap = await getDoc(docRef);
  return {
    props: { projectProps: JSON.stringify(docSnap.data() || null) },
  };
};
