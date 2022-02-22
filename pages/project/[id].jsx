import { stringify } from "@firebase/util";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const Detail = ({ projectProps }) => {
  const project = JSON.parse(projectProps);
  return (
    <Grid
      container
      spaceing={0}
      direction="row"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={8}>
        <Card
          sx={{
            minWidth: 275,
            boxShadow: 3,
            maxWidth: "100%",
          }}
          style={{ backgroundColor: "#fafafa" }}
        >
          <CardContent>
            <Typography variant="h5" component="div">
              {project.title}
            </Typography>
            <Typography sx={{ mt: 3 }} color="text.secondary">
              {project.detail}
            </Typography>
            <Typography sx={{ mt: 3 }} color="text.secondary">
              {"Max members: "}
              {project.max_member}
            </Typography>
            <Typography sx={{ mt: 3 }} color="text.secondary">
              {"Creator: "}
              {project.creator_email}
            </Typography>
          </CardContent>
          <CardActions>
            <Link href="/">
              <Button size="small">Go back</Button>
            </Link>
          </CardActions>
        </Card>
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
