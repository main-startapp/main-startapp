import { Box, Grid } from "@mui/material";
import { useContext, useEffect } from "react";
import { GlobalContext, StudentContext } from "../Context/ShareContexts";
import useWindowDimensions from "../Reusable/WindowDimensions";
import StudentGridCard from "./StudentGridCard";

const StudentGrid = () => {
  // context
  const { users } = useContext(GlobalContext);
  const { searchTerm, setStudent } = useContext(StudentContext);
  const { height, width } = useWindowDimensions();

  // set initial student to be first in list to render out immediately
  useEffect(() => {
    setStudent(users.length > 0 ? users[0] : null);
  }, [setStudent, users]);

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px - 64px - 1.5px)",
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
              xs={width < 1333 ? 4 : width < 1770 ? 3 : width < 2207 ? 2.4 : 2}
            >
              <StudentGridCard key={user.uid} student={user} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default StudentGrid;
