import { useContext, useMemo } from "react";
import { Box } from "@mui/material";
import { GlobalContext, StudentContext } from "../Context/ShareContexts";
import StudentListItem from "./StudentListItem";
import { useEffect } from "react";

// always !onDesktop

const StudentList = () => {
  // context
  const { users, winHeight } = useContext(GlobalContext);
  const { searchTerm } = useContext(StudentContext);

  // local vars
  const filteredStudents = useMemo(
    () =>
      users.filter((user) => {
        if (user?.role !== "student") return;
        if (searchTerm === "") return user;

        const isInPosition = user.desired_position
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const isInFoI = user.field_of_interest
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        if (isInPosition || isInFoI) return user;
      }),
    [users, searchTerm]
  );

  return (
    <Box sx={{ backgroundColor: "#fafafa" }}>
      <Box
        sx={{
          height: `calc(${winHeight}px - 48px - 48px - 1.5px - 60px)`, // navbar; appbar; border; bottom
          overflow: "auto",
        }}
      >
        {filteredStudents?.map((student, index) => (
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
