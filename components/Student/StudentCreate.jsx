import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useContext, useEffect, useRef, useState } from "react";
import { StudentContext } from "../Context/ShareContexts";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import DoDisturbAltRoundedIcon from "@mui/icons-material/DoDisturbAltRounded";
import { useAuth } from "../Context/AuthContext";

const StudentCreate = () => {
  // context & hooks
  const { showAlert, currentStudent } = useContext(StudentContext);
  const { currentUser } = useAuth();

  const [student, setStudent] = useState({
    name: "",
    year_of_ed: 0,
    skill_level: 0,
    desired_position: "",
    create_timestamp: "",
    field_of_interest: "",
    social_media: [""],
    past_exp: [""],
    awards: [],
    connections: [],
    pending_connections: [],
    requested_posititons: [],
    joined_projects: [],
    my_projects: [],
  });

  // if currentStudent changes, update the student state
  useEffect(() => {
    if (currentStudent?.uid) {
      setStudent({ ...currentStudent });
    }
  }, [currentStudent]);

  // helper func
  const handleSubmit = async (e) => {
    if (formRef.current.reportValidity()) {
      const uid = currentUser?.uid;
      if (student.create_timestamp) {
        // update
        const docRef = doc(db, "students", uid);
        const studentRef = {
          ...student,
        };
        await updateDoc(docRef, studentRef).catch((err) => {
          console.log("updateDoc() error: ", err);
        });
      } else {
        // create
        const studentRef = { ...student, create_timestamp: serverTimestamp() };
        const docRef = await setDoc(doc(db, "students", uid), studentRef).catch(
          (err) => {
            console.log("setDoc() error: ", err);
          }
        );
      }
    }
    showAlert(
      "success",
      `"${student.name}" is updated successfully!` // success -> green
    );
  };

  const handleRemoveSocialMedia = (index) => {
    let cur_social_media = student.social_media;
    cur_social_media.splice(index, 1);
    setStudent({ ...student, social_media: cur_social_media });
  };

  const handleRemovePastExp = (index) => {
    let cur_past_exp = student.past_exp;
    cur_past_exp.splice(index, 1);
    setStudent({ ...student, past_exp: cur_past_exp });
  };

  const formRef = useRef();

  // debug console logs

  return (
    <Grid
      container
      spacing={0}
      direction="row"
      alignItems="center"
      justifyContent="center"
    >
      <Grid item xs={8}>
        <form ref={formRef}>
          {/* student's name and year */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={5}
          >
            <TextField
              required
              sx={{ mr: 5, width: "75%" }}
              label="Name"
              margin="none"
              inputProps={{
                maxLength: 50,
              }}
              value={student.name}
              onChange={(e) => setStudent({ ...student, name: e.target.value })}
            />
            <TextField
              required
              sx={{ width: "25%" }}
              margin="none"
              label="Year of education"
              value={student.year_of_ed}
              type="number"
              inputProps={{
                min: 0,
                max: 100,
              }}
              onChange={(e) =>
                setStudent({ ...student, year_of_ed: e.target.value })
              }
            />
          </Box>
          {/* desired position and field of interest */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={5}
          >
            <TextField
              required
              sx={{ mr: 5, width: "50%" }}
              label="Desired Position"
              margin="none"
              inputProps={{
                maxLength: 50,
              }}
              value={student.desired_position}
              onChange={(e) =>
                setStudent({ ...student, desired_position: e.target.value })
              }
            />
            <FormControl sx={{ width: "50%" }} size="medium">
              <InputLabel>Field of Interest</InputLabel>
              <Select
                label="Field_of_Interest"
                defaultValue={""}
                value={student.field_of_interest}
                onChange={(e) =>
                  setStudent({ ...student, field_of_interest: e.target.value })
                }
              >
                <MenuItem value={"Accounting"}>Accounting</MenuItem>
                <MenuItem value={"Art"}>Art</MenuItem>
                <MenuItem value={"Engineering"}>Engineering</MenuItem>
                <MenuItem value={"Finance"}>Finance</MenuItem>
                <MenuItem value={"Management"}>Management</MenuItem>
                <MenuItem value={"Marketing"}>Marketing</MenuItem>
                <MenuItem value={"Software"}>Software</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {/* social media links list */}
          {student.social_media.map((link, index) => {
            return (
              <div key={index}>
                <Divider sx={{ mt: 5 }} />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={5}
                >
                  <TextField
                    fullWidth
                    margin="none"
                    label="Website or Social Media link"
                    value={link}
                    onChange={(e) => {
                      let cur_social_media = student.social_media;
                      cur_social_media[index] = e.target.value;
                      setStudent({
                        ...student,
                        social_media: cur_social_media,
                      });
                    }}
                  />
                  {/* Add / Remove buttons */}
                  {index == 0 && (
                    <IconButton disabled>
                      <DoDisturbAltRoundedIcon />
                    </IconButton>
                  )}
                  {index > 0 && (
                    <IconButton onClick={() => handleRemoveSocialMedia(index)}>
                      <RemoveRoundedIcon />
                    </IconButton>
                  )}
                  <IconButton
                    onClick={() =>
                      setStudent({
                        ...student,
                        social_media: [...student.social_media, ""],
                      })
                    }
                  >
                    <AddRoundedIcon />
                  </IconButton>
                </Box>
              </div>
            );
          })}
          {/* past experience list */}
          {student.past_exp.map((exp_desc, index) => {
            return (
              <div key={index}>
                <Divider sx={{ mt: 5 }} />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={5}
                >
                  <TextField
                    fullWidth
                    margin="none"
                    inputProps={{
                      maxLength: 100,
                    }}
                    label="Past Experience"
                    helperText="One sentence description of your past experience (limit: 100)"
                    value={exp_desc}
                    onChange={(e) => {
                      let cur_past_exp = student.past_exp;
                      cur_past_exp[index] = e.target.value;
                      setStudent({
                        ...student,
                        past_exp: cur_past_exp,
                      });
                    }}
                  />
                  {/* Add / Remove buttons */}
                  {index == 0 && (
                    <IconButton disabled>
                      <DoDisturbAltRoundedIcon />
                    </IconButton>
                  )}
                  {index > 0 && (
                    <IconButton onClick={() => handleRemovePastExp(index)}>
                      <RemoveRoundedIcon />
                    </IconButton>
                  )}
                  <IconButton
                    onClick={() =>
                      setStudent({
                        ...student,
                        past_exp: [...student.past_exp, ""],
                      })
                    }
                  >
                    <AddRoundedIcon />
                  </IconButton>
                </Box>
              </div>
            );
          })}
          {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <Button
              sx={{ mt: 5 }}
              variant="contained"
              disableElevation
              style={{ background: "#3e95c2" }}
              onClick={(e) => handleSubmit(e)}
            >
              {"Update"}
            </Button>
          </Box>
        </form>
      </Grid>
    </Grid>
  );
};

export default StudentCreate;
