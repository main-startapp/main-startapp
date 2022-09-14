import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useContext, useEffect, useRef, useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { useAuth } from "../Context/AuthContext";
import { GlobalContext, StudentContext } from "../Context/ShareContexts";
import { useRouter } from "next/router";
import cloneDeep from "lodash/cloneDeep";

const StudentCreate = () => {
  // context & hooks
  const { currentUser } = useAuth();
  const { ediumUser, winHeight, onMedia } = useContext(GlobalContext);
  const { showAlert } = useContext(StudentContext);

  // router
  const router = useRouter();

  // local vars
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
    photo_url: currentUser?.photoURL || "",
    role: "student",
  });

  // update student data if ediumUser exists
  useEffect(() => {
    if (!ediumUser) return;

    const ediumUserRef = cloneDeep(ediumUser);
    // add empty string to the array to should textfiled
    if (!ediumUserRef.social_media.length) {
      ediumUserRef.social_media = [""];
    }
    if (!ediumUserRef.past_exp.length) {
      ediumUserRef.past_exp = [""];
    }
    setStudent(ediumUserRef);
  }, [ediumUser]);

  // local vars
  const [isClickable, setIsClickable] = useState(true); // button state to prevent click spam
  const [isCheckedClub, setIsCheckedClub] = useState(false);
  useEffect(() => {
    if (ediumUser?.role) {
      ediumUser.role === "club"
        ? setIsCheckedClub(true)
        : setIsCheckedClub(false);
    }
  }, [ediumUser?.role]);

  // helper func
  const handleSubmit = async (e) => {
    if (!isClickable) return;
    if (!formRef.current.reportValidity()) return;

    // button is clickable & form is valid
    setIsClickable(false);
    const uid = currentUser?.uid;
    const docRef = doc(db, "users", uid);
    let studentRef = {
      ...student,
      // remove empty strings
      social_media: student.social_media.filter((ele) => ele),
      past_exp: student.past_exp.filter((ele) => ele),
      last_timestamp: serverTimestamp(),
    };
    // remove uid to keep the doc consistent
    delete studentRef?.uid;

    let studentModRef;
    if (student.create_timestamp) {
      // update
      // can't update partially
      studentModRef = updateDoc(docRef, studentRef).catch((err) => {
        console.log("updateDoc() error: ", err);
      });
    } else {
      // create; add create_timestamp
      studentRef = {
        ...studentRef,
        create_timestamp: serverTimestamp(),
        last_timestamp: serverTimestamp(),
      };
      studentModRef = setDoc(docRef, studentRef).catch((err) => {
        console.log("setDoc() error: ", err);
      });

      const extDocRef = doc(db, "users_ext", uid);
      const studentExtRef = {
        my_project_ids: [],
        joined_project_ids: [],
        join_requests: [],
        last_timestamp: serverTimestamp(),
      };
      const studentExtModRef = setDoc(extDocRef, studentExtRef).catch((err) => {
        console.log("setDoc() error: ", err);
      });

      await studentExtModRef;
    }

    await studentModRef;

    // !todo: check return
    showAlert(
      "success",
      `"${student.name}" is updated successfully! Navigate to Students page.` // success -> green
    );

    setTimeout(() => {
      router.push(`/students`); // can be customized
    }, 2000); // wait 2 seconds then go to `projects` page
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

  // reuseable comps
  const nameTextField = (
    <StyledTextField
      required
      sx={
        onMedia.onDesktop
          ? { mr: 5, width: "75%", paddingY: 0, fontSize: "0.1em" }
          : { width: "100%", mb: 5, fontSize: "0.1em" }
      }
      label="Name"
      margin="none"
      inputProps={{
        maxLength: 20,
      }}
      value={student.name}
      onChange={(e) => {
        setStudent({ ...student, name: e.target.value });
      }}
    />
  );

  const yearTextField = (
    <StyledTextField
      required
      sx={onMedia.onDesktop ? { width: "25%" } : { width: "100%" }}
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
      }}
    />
  );

  const positionTextField = (
    <StyledTextField
      required
      sx={
        onMedia.onDesktop ? { mr: 5, width: "50%" } : { width: "100%", mb: 5 }
      }
      label="Desired Position"
      margin="none"
      inputProps={{
        maxLength: 20,
      }}
      value={student.desired_position}
      helperText="Project position you would like to try"
      onChange={(e) => {
        setStudent({ ...student, desired_position: e.target.value });
      }}
    />
  );

  const fieldSelect = (
    <FormControl
      required
      sx={{
        width: onMedia.onDesktop ? "50%" : "100%",

        "& .MuiOutlinedInput-root": {
          borderRadius: "10px",
          backgroundColor: "#f0f0f0",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          border: 1.5,
          borderColor: "#dbdbdb",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          border: 1.5,
          borderColor: "#dbdbdb",
        },
        ".MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
          border: 1.5,
          borderColor: "#3e95c2",
        },
      }}
    >
      <InputLabel>Field of Interest</InputLabel>
      <Select
        label="Field_of_Interest"
        defaultValue={""}
        value={student.field_of_interest}
        onChange={(e) => {
          setStudent({
            ...student,
            field_of_interest: e.target.value,
          });
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
      <FormHelperText
        id="sc-category-helper-text"
        sx={{ color: "lightgray", fontSize: "12px" }}
      >
        {"Doesn't have to be related to your major"}
      </FormHelperText>
    </FormControl>
  );

  return (
    <Grid
      container
      spacing={0}
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundColor: "#fafafa",
        height: onMedia.onDesktop
          ? `calc(${winHeight}px - 64px)`
          : `calc(${winHeight}px - 48px - 60px)`,
        overflow: "auto",
      }}
    >
      <Grid
        item
        xs={onMedia.onDesktop ? 8 : 10}
        sx={{
          backgroundColor: "#ffffff",
          borderLeft: 1.5,
          borderRight: 1.5,
          borderColor: "#dbdbdb",
          paddingX: 3,
          minHeight: "100%",
        }}
      >
        <Typography
          sx={{
            display: "flex",
            justifyContent: "center",
            fontSize: "2em",
            fontWeight: "bold",
            mt: 5,
            mb: 5,
          }}
        >
          {!ediumUser ? "Create New Profile" : "Update Profile"}
        </Typography>
        <Box sx={{ display: "flex" }}>
          <Checkbox
            sx={{ mr: 1.5, color: "#dbdbdb", padding: 0 }}
            checked={isCheckedClub}
            onChange={() => {
              setIsCheckedClub(!isCheckedClub);
              setStudent({
                ...student,
                role: !isCheckedClub ? "club" : "student",
              });
            }}
          />
          <Typography sx={{ color: "rgba(0,0,0,0.6)" }}>
            {"I am a club representative"}
          </Typography>
        </Box>
        <form ref={formRef}>
          {/* student's name and year */}
          {onMedia.onDesktop ? (
            <Box
              sx={{
                mt: 5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              {nameTextField}
              {yearTextField}
            </Box>
          ) : (
            <Box sx={{ mt: 5, display: "flex", flexDirection: "column" }}>
              {nameTextField}
              {yearTextField}
            </Box>
          )}
          {/* desired position and field of interest */}
          {onMedia.onDesktop ? (
            <Box
              sx={{
                mt: 5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              {positionTextField}
              {fieldSelect}
            </Box>
          ) : (
            <Box sx={{ mt: 5, display: "flex", flexDirection: "column" }}>
              {positionTextField}
              {fieldSelect}
            </Box>
          )}
          {/* social media links list */}
          <Divider sx={{ my: 5 }}>
            <Typography sx={{ color: "gray" }}>Optional</Typography>
          </Divider>
          {student.social_media.map((link, index) => {
            return (
              <Box
                key={index}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 2.5 }}
              >
                <StyledTextField
                  fullWidth
                  margin="none"
                  label={"Website or Social Media URL #" + (index + 1)}
                  helperText={
                    index === 0 ? "Will be shown on your profile" : ""
                  }
                  type="url"
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
                {index > 0 && (
                  <IconButton
                    sx={{ ml: 2.5, backgroundColor: "#f0f0f0" }}
                    onClick={() => {
                      handleRemoveSocialMedia(index);
                    }}
                  >
                    <RemoveRoundedIcon />
                  </IconButton>
                )}
                {index === student.social_media.length - 1 && (
                  <IconButton
                    sx={{ ml: 2.5, backgroundColor: "#f0f0f0" }}
                    onClick={() => {
                      setStudent({
                        ...student,
                        social_media: [...student.social_media, ""],
                      });
                    }}
                  >
                    <AddRoundedIcon />
                  </IconButton>
                )}
              </Box>
            );
          })}
          {/* past experience list */}

          {student.past_exp.map((exp_desc, index) => {
            return (
              <Box
                key={index}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={index === 0 ? 5 : 2.5}
              >
                <StyledTextField
                  fullWidth
                  margin="none"
                  inputProps={{
                    maxLength: 150,
                  }}
                  label={"Past Experience #" + (index + 1)}
                  helperText={
                    index === 0
                      ? "One sentence description of your past experience (limit: 150)"
                      : ""
                  }
                  value={exp_desc}
                  onChange={(e) => {
                    let newPastExp = student.past_exp;
                    newPastExp[index] = e.target.value;
                    setStudent({
                      ...student,
                      past_exp: newPastExp,
                    });
                  }}
                />
                {/* Add / Remove buttons */}
                {index > 0 && (
                  <IconButton
                    sx={{ ml: 2.5, backgroundColor: "#f0f0f0" }}
                    onClick={() => {
                      handleRemovePastExp(index);
                    }}
                  >
                    <RemoveRoundedIcon />
                  </IconButton>
                )}
                {index === student.past_exp.length - 1 && (
                  <IconButton
                    sx={{ ml: 2.5, backgroundColor: "#f0f0f0" }}
                    onClick={() => {
                      setStudent({
                        ...student,
                        past_exp: [...student.past_exp, ""],
                      });
                    }}
                  >
                    <AddRoundedIcon />
                  </IconButton>
                )}
              </Box>
            );
          })}
          {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <Button
              sx={{
                mt: 5,
                ml: 2.5,
                mb: 5,
                border: 1.5,
                borderColor: "#dbdbdb",
                borderRadius: "30px",
                backgroundColor: "#3e95c2",
                textTransform: "none",
                paddingX: 5,
              }}
              variant="contained"
              disableElevation
              disabled={!isClickable}
              onClick={(e) => handleSubmit(e)}
            >
              {"Confirm"}
            </Button>
          </Box>
        </form>
      </Grid>
    </Grid>
  );
};

export default StudentCreate;

const StyledTextField = styled(TextField)(({ theme }) => ({
  // "& .MuiInputBase-input": { padding: theme.spacing(1, 2) },

  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#f0f0f0",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderWidth: 1.5,
    borderColor: "#dbdbdb",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderWidth: 1.5,
    borderColor: "#dbdbdb !important",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderWidth: 1.5,
    borderColor: "#3e95c2 !important",
  },
  "& .MuiFormHelperText-root": {
    color: "lightgray",
    fontSize: "12px",
  },
}));
