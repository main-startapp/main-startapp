import {
  Autocomplete,
  Box,
  Button,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { useAuth } from "../Context/AuthContext";
import { GlobalContext } from "../Context/ShareContexts";
import cloneDeep from "lodash/cloneDeep";
import { studentFoIStrList } from "../Reusable/MenuStringList";
import { DefaultTextField } from "../Reusable/Resusable";

const UserStudentCreate = (props) => {
  const isClickable = props.isClickable;
  const handleUserSubmit = props.handleUserSubmit;
  const redirectTo = props.redirectTo;

  // context & hooks
  const { currentUser } = useAuth();
  const { ediumUser, onMedia } = useContext(GlobalContext);

  // local vars
  const [newStudent, setNewStudent] = useState({
    name: "",
    year_of_ed: 0,
    skill_level: 0,
    desired_position: "",
    create_timestamp: "",
    field_of_interest: "",
    social_media: [""],
    //past_exp: [""],
    awards: [],
    photo_url: currentUser?.photoURL || "",
    role: "student",
  });

  // update student data if ediumUser exists
  useEffect(() => {
    if (!ediumUser) return;

    const ediumUserRef = cloneDeep(ediumUser);
    // add empty string to the array to show textfiled
    if (!ediumUserRef?.social_media?.length) {
      ediumUserRef.social_media = [""];
    }
    // if (!ediumUserRef.past_exp.length) {
    //   ediumUserRef.past_exp = [""];
    // }
    setNewStudent(ediumUserRef);
  }, [ediumUser]);

  // helper func
  const handleRemoveSocialMedia = (index) => {
    let cur_social_media = newStudent.social_media;
    cur_social_media.splice(index, 1);
    setNewStudent({ ...newStudent, social_media: cur_social_media });
  };

  // const handleRemovePastExp = (index) => {
  //   let cur_past_exp = newStudent.past_exp;
  //   cur_past_exp.splice(index, 1);
  //   setNewStudent({ ...newStudent, past_exp: cur_past_exp });
  // };

  // reuseable comps
  const nameTextField = (
    <DefaultTextField
      required
      sx={
        onMedia.onDesktop
          ? { mr: 5, width: "75%", paddingY: 0 }
          : { width: "100%", mb: 5 }
      }
      label="Name"
      margin="none"
      value={newStudent.name}
      onChange={(e) => {
        setNewStudent({ ...newStudent, name: e.target.value });
      }}
    />
  );

  const yearTextField = (
    <DefaultTextField
      required
      sx={onMedia.onDesktop ? { width: "25%" } : { width: "100%" }}
      margin="none"
      label="Year of education"
      value={newStudent.year_of_ed}
      type="number"
      inputProps={{
        min: 0,
        max: 10,
      }}
      onChange={(e) => {
        setNewStudent({ ...newStudent, year_of_ed: e.target.value });
      }}
    />
  );

  const positionTextField = (
    <DefaultTextField
      required
      sx={
        onMedia.onDesktop ? { mr: 5, width: "50%" } : { width: "100%", mb: 5 }
      }
      label="Desired Position"
      margin="none"
      value={newStudent.desired_position}
      helperText="Project position you would like to try"
      onChange={(e) => {
        setNewStudent({ ...newStudent, desired_position: e.target.value });
      }}
    />
  );

  // const fieldSelect = (
  //   <FormControl
  //     required
  //     sx={{
  //       width: onMedia.onDesktop ? "50%" : "100%",

  //       "& .MuiOutlinedInput-root": {
  //         borderRadius: "10px",
  //         backgroundColor: "#f0f0f0",
  //       },
  //       "& .MuiOutlinedInput-notchedOutline": {
  //         border: 1.5,
  //         borderColor: "#dbdbdb",
  //       },
  //       "&:hover .MuiOutlinedInput-notchedOutline": {
  //         border: 1.5,
  //         borderColor: "#dbdbdb",
  //       },
  //       ".MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
  //         border: 1.5,
  //         borderColor: "#3e95c2",
  //       },
  //     }}
  //   >
  //     <InputLabel>Field of Interest</InputLabel>
  //     <Select
  //       label="Field_of_Interest"
  //       defaultValue={""}
  //       value={newStudent.field_of_interest}
  //       onChange={(e) => {
  //         setNewStudent({
  //           ...newStudent,
  //           field_of_interest: e.target.value,
  //         });
  //       }}
  //     >
  //       <MenuItem value={"Accounting"}>Accounting</MenuItem>
  //       <MenuItem value={"Art"}>Art</MenuItem>
  //       <MenuItem value={"Engineering"}>Engineering</MenuItem>
  //       <MenuItem value={"Finance"}>Finance</MenuItem>
  //       <MenuItem value={"Management"}>Management</MenuItem>
  //       <MenuItem value={"Marketing"}>Marketing</MenuItem>
  //       <MenuItem value={"Software"}>Software</MenuItem>
  //       <MenuItem value={"Other"}>Other</MenuItem>
  //     </Select>
  //     <FormHelperText
  //       id="sc-category-helper-text"
  //       sx={{ color: "lightgray", fontSize: "12px" }}
  //     >
  //       {"Doesn't have to be related to your major"}
  //     </FormHelperText>
  //   </FormControl>
  // );

  const foiAutoComplete = (
    <Autocomplete
      sx={onMedia.onDesktop ? { width: "50%" } : { width: "100%" }}
      freeSolo
      options={studentFoIStrList}
      value={newStudent.field_of_interest}
      onChange={(event, newValue) => {
        setNewStudent({ ...newStudent, field_of_interest: newValue });
      }}
      renderInput={(params) => (
        <DefaultTextField
          {...params}
          label="Field of Interest"
          helperText="Doesn't have to be related to your major"
          required
        />
      )}
    />
  );

  return (
    <Box>
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
          {foiAutoComplete}
        </Box>
      ) : (
        <Box sx={{ mt: 5, display: "flex", flexDirection: "column" }}>
          {positionTextField}
          {foiAutoComplete}
        </Box>
      )}
      {/* social media links list */}
      <Divider sx={{ my: 5 }}>
        <Typography sx={{ color: "gray" }}>Optional</Typography>
      </Divider>
      {newStudent.social_media.map((link, index) => {
        return (
          <Box
            key={index}
            display="flex"
            justifyContent="space-between"
            alignItems="start"
            sx={{ mt: 2.5 }}
          >
            <DefaultTextField
              fullWidth
              margin="none"
              label={"Website or Social Media URL #" + (index + 1)}
              helperText={index === 0 ? "Will be shown on your profile" : ""}
              type="url"
              value={link}
              onChange={(e) => {
                let cur_social_media = newStudent.social_media;
                cur_social_media[index] = e.target.value;
                setNewStudent({
                  ...newStudent,
                  social_media: cur_social_media,
                });
              }}
            />
            {/* Add / Remove buttons */}
            {index > 0 && (
              <IconButton
                sx={{ ml: 2.5, mt: "8px", backgroundColor: "#f0f0f0" }}
                onClick={() => {
                  handleRemoveSocialMedia(index);
                }}
              >
                <RemoveRoundedIcon />
              </IconButton>
            )}
            {index === newStudent.social_media.length - 1 && (
              <IconButton
                sx={{ ml: 2.5, mt: "8px", backgroundColor: "#f0f0f0" }}
                onClick={() => {
                  setNewStudent({
                    ...newStudent,
                    social_media: [...newStudent.social_media, ""],
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
      {/*newStudent.past_exp.map((exp_desc, index) => {
        return (
          <Box
            key={index}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={index === 0 ? 5 : 2.5}
          >
            <DefaultTextField
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
                let newPastExp = newStudent.past_exp;
                newPastExp[index] = e.target.value;
                setNewStudent({
                  ...newStudent,
                  past_exp: newPastExp,
                });
              }}
            />
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
            {index === newStudent.past_exp.length - 1 && (
              <IconButton
                sx={{ ml: 2.5, backgroundColor: "#f0f0f0" }}
                onClick={() => {
                  setNewStudent({
                    ...newStudent,
                    past_exp: [...newStudent.past_exp, ""],
                  });
                }}
              >
                <AddRoundedIcon />
              </IconButton>
            )}
          </Box>
        );
      })*/}

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
          onClick={() => {
            handleUserSubmit(newStudent);
            redirectTo();
          }}
        >
          {"Confirm"}
        </Button>
      </Box>
    </Box>
  );
};

export default UserStudentCreate;
