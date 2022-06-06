import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
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
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import DoDisturbAltRoundedIcon from "@mui/icons-material/DoDisturbAltRounded";
import { useAuth } from "../Context/AuthContext";
import { GlobalContext, StudentContext } from "../Context/ShareContexts";

const StudentCreate = () => {
  // context & hooks
  const { currentUser } = useAuth();
  const { currentStudent } = useContext(GlobalContext);
  const { showAlert } = useContext(StudentContext);

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
    requested_posititons: [],
    joined_projects: [],
    my_projects: [],
    photo_url: currentUser.photoURL,
  });

  // update currentStudent state
  useEffect(() => {
    if (!currentStudent?.uid) return; // !todo: what's the RoT to check existence? what if uid = 0 (not possible?)

    // currentStudent exists
    const currentStudentRef = { ...currentStudent };
    if (!currentStudent.social_media.length) {
      currentStudentRef.social_media = [""];
    }
    if (!currentStudent.past_exp.length) {
      currentStudentRef.past_exp = [""];
    }
    setStudent({ ...currentStudentRef });
  }, [currentStudent]);

  // local vars
  const [isClickable, setIsClickable] = useState(true); // button state to prevent click spam
  const [isChanged, setIsChanged] = useState(false); // check if user modified the contents

  // helper func
  const handleSubmit = async (e) => {
    if (!isClickable) return;
    if (!formRef.current.reportValidity()) return;

    // button is clickable & form is valid
    setIsClickable(false);
    const uid = currentUser?.uid;
    const docRef = doc(db, "students", uid);
    let studentRef = {
      ...student,
      // remove empty strings
      social_media: student.social_media.filter((ele) => ele),
      past_exp: student.past_exp.filter((ele) => ele),
    };
    // remove uid to keep the doc consistent
    delete studentRef?.uid;

    if (student.create_timestamp) {
      // update
      await updateDoc(docRef, studentRef).catch((err) => {
        console.log("updateDoc() error: ", err);
      });
    } else {
      // create; add create_timestamp
      studentRef = {
        ...studentRef,
        create_timestamp: serverTimestamp(),
      };
      await setDoc(docRef, studentRef).catch((err) => {
        console.log("setDoc() error: ", err);
      });
    }

    // !todo: check return
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
                maxLength: 20,
              }}
              value={student.name}
              onChange={(e) => {
                setStudent({ ...student, name: e.target.value });
                setIsChanged(true);
              }}
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
                max: 10,
              }}
              onChange={(e) => {
                setStudent({ ...student, year_of_ed: e.target.value });
                setIsChanged(true);
              }}
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
                maxLength: 20,
              }}
              value={student.desired_position}
              helperText="Project position you would like to try. Doesn't have to be related to your major."
              onChange={(e) => {
                setStudent({ ...student, desired_position: e.target.value });
                setIsChanged(true);
              }}
            />
            <FormControl sx={{ width: "50%" }} size="medium">
              <InputLabel>Field of Interest</InputLabel>
              <Select
                label="Field_of_Interest"
                defaultValue={""}
                value={student.field_of_interest}
                onChange={(e) => {
                  setStudent({ ...student, field_of_interest: e.target.value });
                  setIsChanged(true);
                }}
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
              <FormHelperText>
                {"Doesn't have to be related to your major"}
              </FormHelperText>
            </FormControl>
          </Box>
          {/* social media links list */}
          <Divider sx={{ mt: 5 }} />
          {student.social_media.map((link, index) => {
            return (
              <div key={index}>
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
                      setIsChanged(true);
                    }}
                  />
                  {/* Add / Remove buttons */}
                  {index > 0 && (
                    <IconButton
                      onClick={() => {
                        handleRemoveSocialMedia(index);
                        setIsChanged(true);
                      }}
                    >
                      <RemoveRoundedIcon />
                    </IconButton>
                  )}
                  {index === student.social_media.length - 1 && (
                    <IconButton
                      onClick={() => {
                        setStudent({
                          ...student,
                          social_media: [...student.social_media, ""],
                        });
                        setIsChanged(true);
                      }}
                    >
                      <AddRoundedIcon />
                    </IconButton>
                  )}
                </Box>
              </div>
            );
          })}
          {/* past experience list */}
          <Divider sx={{ mt: 5 }} />
          {student.past_exp.map((exp_desc, index) => {
            return (
              <div key={index}>
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
                      maxLength: 150,
                    }}
                    label="Past Experience"
                    helperText="One sentence description of your past experience (limit: 150)"
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
                  {index > 0 && (
                    <IconButton
                      onClick={() => {
                        handleRemovePastExp(index);
                        setIsChanged(true);
                      }}
                    >
                      <RemoveRoundedIcon />
                    </IconButton>
                  )}
                  {index === student.past_exp.length - 1 && (
                    <IconButton
                      onClick={() => {
                        setStudent({
                          ...student,
                          past_exp: [...student.past_exp, ""],
                        });
                        setIsChanged(true);
                      }}
                    >
                      <AddRoundedIcon />
                    </IconButton>
                  )}
                </Box>
              </div>
            );
          })}
          {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <Button
              sx={{ mt: 5, backgroundColor: "#3e95c2" }}
              variant="contained"
              disableElevation
              onClick={(e) => handleSubmit(e)}
              disabled={!isClickable}
            >
              {isClickable ? "Submit" : "Submitted"}
            </Button>
          </Box>
        </form>
      </Grid>
    </Grid>
  );
};

export default StudentCreate;
