import { Box, Grid } from "@mui/material";
import { useContext, useMemo, useEffect } from "react";
import { GlobalContext, StudentContext } from "../Context/ShareContexts";
import StudentGridCard from "./StudentGridCard";
import { motion } from "framer-motion";

const StudentGrid = () => {
  // context
  const { users, winWidth, winHeight, onMedia } = useContext(GlobalContext);
  const { searchTerm, student, setStudent } = useContext(StudentContext);

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
  }, [setStudent, users, onMedia.onDesktop]);

  return (
    <Box
      sx={{
        height: `calc(${winHeight}px - 64px - 64px - 1.5px)`,
        overflowX: "hidden",
        overflowY: "scroll",
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
            <motion.div
              whileHover={{ scale: 1.2, rotate: 360 }}
              //transition={{ duration: 0.5 }}
            >
              <StudentGridCard key={user.uid} student={user} />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StudentGrid;
