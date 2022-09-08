import { useContext, useMemo } from "react";
import NextLink from "next/link";
import { Box, Button, Tooltip } from "@mui/material";
import { GlobalContext, StudentContext } from "../Context/ShareContexts";
import StudentListItem from "./StudentListItem";

// always !onDesktop

const StudentList = () => {
  // context
  const { students } = useContext(GlobalContext);
  const { searchTerm } = useContext(StudentContext);

  // local vars
  const filteredStudents = useMemo(
    () =>
      students.filter((student) => {
        const isInPosition = student.desired_position
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const isInFoI = student.field_of_interest
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        if (searchTerm === "" && !!!student?.is_club) {
          // no search
          return student;
        }
        if (!!!student?.is_club && (isInPosition || isInFoI)) {
          // in position title or in field of interest
          return student;
        }
      }),
    [students, searchTerm]
  );

  return (
    <Box
      sx={{
        backgroundColor: "#fafafa",
        height: "calc(100vh - 48px - 48px - 1.5px)", // navbar; appbar; border
      }}
    >
      <Box
        sx={{
          height: "calc(100vh - 48px - 48px - 1.5px - 36px - 24px)", // navbar; appbar; border; bottom
          overflow: "auto",
        }}
      >
        {filteredStudents.map((student, index) => (
          <StudentListItem
            key={student.uid}
            index={index}
            student={student}
            last={filteredStudents.length - 1}
          />
        ))}
      </Box>
    </Box>
  );
};

export default StudentList;
