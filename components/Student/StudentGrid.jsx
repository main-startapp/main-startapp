import { Box, Grid, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useContext, useMemo, useEffect } from "react";
import { GlobalContext, StudentContext } from "../Context/ShareContexts";
import StudentGridCard from "./StudentGridCard";

const StudentGrid = () => {
  // context
  const { users, winWidth, winHeight, onMedia } = useContext(GlobalContext);
  const { searchTerm, setStudent } = useContext(StudentContext);
  const theme = useTheme();

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

  // set initial student to be first in list to render out immediately
  useEffect(() => {
    if (onMedia.onDesktop) setStudent(users.length > 0 ? users[0] : null);
  }, [onMedia.onDesktop, setStudent, users]);

  return (
    <Paper
      elevation={onMedia.onDesktop ? 2 : 0}
      sx={{
        // mt: onMedia.onDesktop ? 4 : 2,
        // ml: onMedia.onDesktop ? 4 : 2,
        // mr: onMedia.onDesktop ? 2 : 0,
        backgroundColor: "background.paper",
        borderTop: onMedia.onDesktop ? 1 : 0,
        borderColor: "divider",
        borderRadius: onMedia.onDesktop
          ? "32px 32px 0px 0px"
          : "32px 0px 0px 0px",
        paddingTop: "32px",
      }}
    >
      <Box
        id="studentgrid-grid-box"
        sx={{
          height: `calc(${winHeight}px - 65px - ${theme.spacing(
            4
          )} - 1px - 32px)`,
          overflowX: "hidden",
          overflowY: "scroll",
        }}
      >
        <Grid container>
          {filteredStudents?.map((user, index) => (
            <Grid key={index} item xs={3}>
              <StudentGridCard key={user.uid} student={user} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default StudentGrid;
