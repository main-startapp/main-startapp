import { Box, Button, Grid, TextField } from "@mui/material";
import { collection, addDoc, serverTimestamp, doc } from "firebase/firestore";
import { useState } from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import { useAuth } from "../../pages/AuthContext";

// !todo: the form should be move to its own page
const ProjectCreate = () => {
  // project
  const [project, setProject] = useState({
    title: "",
    description: "",
    detail: "",
    max_member: "",
  });
  // current user
  const { currentUser } = useAuth();
  const router = useRouter();

  const onSubmit = async (e) => {
    // to Create
    if (project.title.length != 0 && project.max_member.length != 0) {
      const collectionRef = collection(db, "projects");
      const projectRef = {
        ...project,
        create_timestamp: serverTimestamp(),
        last_timestamp: serverTimestamp(),
        creator_email: currentUser.email,
        current_member: 1,
      };
      const docRef = await addDoc(collectionRef, projectRef);
      setProject({ title: "", description: "", detail: "", max_member: "" });
    }
    // showAlert(
    //   "success",
    //   `Project with id ${docRef.id} is added successfully!` // success -> green
    // );
    e.stopPropagation();
    router.push(`/`);
  };

  return (
    <div>
      {/* <pre>{JSON.stringify(project, null, "\t")}</pre> */}
      <Grid container spacing={0} justifyContent="center">
        <Grid item xs={6}>
          <TextField
            sx={{ mt: 5 }}
            fullWidth
            required
            label="title"
            margin="none"
            inputProps={{
              maxLength: 50,
            }}
            helperText="Project title is required (char limit: 50)"
            value={project.title}
            onChange={(e) => setProject({ ...project, title: e.target.value })}
          />
          <TextField
            sx={{ mt: 5 }}
            fullWidth
            label="description"
            margin="none"
            multiline
            rows={4}
            inputProps={{
              maxLength: 200,
            }}
            helperText="Short description (char limit: 200)"
            value={project.description}
            onChange={(e) =>
              setProject({ ...project, description: e.target.value })
            }
          />
          <TextField
            sx={{ mt: 5 }}
            fullWidth
            label="detail"
            margin="none"
            multiline
            rows={8}
            helperText="Project details (e.g., scope, potential member requirement, contact info)"
            value={project.detail}
            onChange={(e) => setProject({ ...project, detail: e.target.value })}
          />
          <TextField
            sx={{ mt: 5 }}
            fullWidth
            required
            label="max team members"
            margin="none"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            helperText="Positive integer"
            value={project.max_member}
            onChange={(e) =>
              e.target.value < 1
                ? setProject({ ...project, max_member: 1 })
                : setProject({ ...project, max_member: e.target.value })
            }
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              sx={{ mt: 5 }}
              variant="contained"
              disableElevation
              style={{ background: "#6fa8dc" }}
              onClick={(e) => onSubmit(e)}
            >
              {"Submit & Go Back"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProjectCreate;
