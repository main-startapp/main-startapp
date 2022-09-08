import { Box, Grid } from "@mui/material";
import { useContext, useEffect } from "react";
import { GlobalContext, StudentContext } from "../Context/ShareContexts";
import useWindowDimensions from "../Reusable/WindowDimensions";
import StudentGridCard from "./StudentGridCard";

const StudentGrid = () => {
  // context
  const { students } = useContext(GlobalContext);
  const { searchTerm } = useContext(StudentContext);
  const { height, width } = useWindowDimensions();

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px - 64px - 1.5px)",
        overflow: "auto",
      }}
    >
      <Grid container spacing={1.5} padding={1.5}>
        {students
          .filter((student) => {
            const isInPosition = student.desired_position
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
            const isInFoI = student.field_of_interest
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
            if (
              searchTerm === "" &&
              !!!student?.is_club &&
              student?.uid !== "T5q6FqwJFcRTKxm11lu0zmaXl8x2"
            ) {
              // no search
              return student;
            }
            if (
              !!!student?.is_club &&
              student?.uid !== "T5q6FqwJFcRTKxm11lu0zmaXl8x2" &&
              (isInPosition || isInFoI)
            ) {
              // in position title or in field of interest
              return student;
            }
          })
          .map((student, index) => (
            <Grid
              key={index}
              item
              xs={width < 1333 ? 4 : width < 1770 ? 3 : width < 2207 ? 2.4 : 2}
            >
              <StudentGridCard key={student.uid} student={student} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default StudentGrid;
