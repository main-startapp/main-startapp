import { Avatar, Typography } from "@mui/material";
import { useContext } from "react";
import { StudentContext } from "../Context/ShareContexts";

const StudentProfile = () => {
  // context
  const { currentUser, students, currentStudent } = useContext(StudentContext);

  return (
    <>
      <Avatar src={currentUser?.photoURL} />
      {/* name */}
      {currentStudent?.name && <Typography>{currentStudent.name}</Typography>}
      {!currentStudent?.name && <Typography>{"Name"}</Typography>}
      {/* position */}
      {currentStudent?.desired_position && (
        <Typography>{currentStudent.desired_position}</Typography>
      )}
      {!currentStudent?.desired_position && (
        <Typography>{"Position"}</Typography>
      )}
      {/* skill level */}
      {currentStudent?.skill_level && (
        <Typography>
          {"Skill level: "}
          {currentStudent.skill_level}
        </Typography>
      )}
      {!currentStudent?.skill_level && (
        <Typography>
          {"Skill level: "}
          {"0"}
        </Typography>
      )}
      {/* awards */}
      <Typography>{"Awards"}</Typography>
      {/* social media links */}
      <Typography>{"Social media"}</Typography>
      {/* past experience */}
      <Typography>{"Past experience"}</Typography>
      {currentStudent?.past_exp &&
        currentStudent.past_exp.map((exp, index) => (
          <Typography key={index}>{exp}</Typography>
        ))}
    </>
  );
};

export default StudentProfile;
