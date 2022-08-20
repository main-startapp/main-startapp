import { Box, Grid } from "@mui/material";
import { useContext, useEffect } from "react";
import { GlobalContext, StudentContext } from "../Context/ShareContexts";
import StudentGridCard from "./StudentGridCard";

const StudentGrid = () => {
  // context
  const { students } = useContext(GlobalContext);
  const { searchTerm } = useContext(StudentContext);

  return (
    <Box
      sx={{
        height: "calc(99vh - 128px)",
        overflow: "auto",
      }}
    >
      <Grid container spacing={4} padding={4}>
        {students
          .filter((student) => {
            const isInName = student.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
            const isInPosition = student.desired_position
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
            if (searchTerm === "") {
              // no search
              return student;
            }
            if (isInName || isInPosition) {
              // in name or in position title
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
