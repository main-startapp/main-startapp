import { Box, Grid } from "@mui/material";
import { useContext } from "react";
import { StudentContext } from "../Context/ShareContexts";
import StudentGridCard from "./StudentGridCard";

const StudentGrid = () => {
  // context
  const { students, currentStudent } = useContext(StudentContext);

  return (
    <Box
      sx={{
        maxHeight: "calc(99vh - 128px)",
        overflow: "auto",
      }}
    >
      <Grid direction="row" container spacing={0}>
        {students
          .filter((student) => {
            // filter out self
            if (student.uid != currentStudent?.uid) {
              return student;
            }
          })
          .map((student, index) => (
            <Grid key={index} item xs={3}>
              <StudentGridCard key={student.uid} student={student} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default StudentGrid;
