import { Box, Grid } from "@mui/material";
import { useContext, useMemo } from "react";
import { GlobalContext, StudentContext } from "../Context/ShareContexts";
import StudentGridCard from "./StudentGridCard";

const StudentGrid = () => {
  // context
  const { users, winWidth, winHeight } = useContext(GlobalContext);
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
    <Box
      sx={{
        height: `calc(${winHeight}px - 64px - 64px - 1.5px)`,
        overflow: "auto",
      }}
    >
      <Grid container spacing={1.5} padding={1.5}>
        {filteredStudents.map((user, index) => (
          <Grid
            key={index}
            item
            xs={
              winWidth < 1333
                ? 4
                : winWidth < 1770
                ? 3
                : winWidth < 2207
                ? 2.4
                : 2
            }
          >
            <StudentGridCard key={user.uid} student={user} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StudentGrid;
