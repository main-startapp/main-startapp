import { Box, Grid } from "@mui/material";
import { useContext } from "react";
import { GlobalContext, StudentContext } from "../Context/ShareContexts";
import StudentGridCard from "./StudentGridCard";

const StudentGrid = () => {
  // context
  const { users, winWidth, winHeight } = useContext(GlobalContext);
  const { searchTerm } = useContext(StudentContext);

  return (
    <Box
      sx={{
        height: `calc(${winHeight}px - 64px - 64px - 1.5px)`,
        overflow: "auto",
      }}
    >
      <Grid container spacing={1.5} padding={1.5}>
        {users
          .filter((user) => {
            const isInPosition = user.desired_position
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
            const isInFoI = user.field_of_interest
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
            if (searchTerm === "" && user?.role == "student") {
              // no search
              return user;
            }
            if (user?.role == "student" && (isInPosition || isInFoI)) {
              // in position title or in field of interest
              return user;
            }
          })
          .map((user, index) => (
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
