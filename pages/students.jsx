import { useContext, useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import {
  GlobalContext,
  StudentContext,
} from "../components/Context/ShareContexts";
import { motion } from "framer-motion";
import StudentProfile from "../components/Student/StudentProfile";
import StudentGrid from "../components/Student/StudentGrid";
import StudentList from "../components/Student/StudentList";

const Students = () => {
  // context
  const {
    setChat,
    setChatPartner,
    setShowChat,
    setShowMsg,
    onMedia,
    isAnimated,
    setIsAnimated,
  } = useContext(GlobalContext);

  // page setup
  useEffect(() => {
    setShowChat(true);
    setShowMsg(false);
    setChat(null);
    setChatPartner(null);
  }, [setChat, setChatPartner, setShowChat, setShowMsg]);

  // turn off introduction animation after initialization
  useEffect(() => {
    setIsAnimated({ ...isAnimated, projects: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // student state init
  const [student, setStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  return (
    <StudentContext.Provider
      value={{
        student,
        setStudent,
        searchTerm,
        setSearchTerm,
        searchCategory,
        setSearchCategory,
      }}
    >
      {/* <StudentsPageBar /> */}

      <Box
        id="students-main-box"
        sx={{ display: "flex", justifyContent: "center", overflow: "hidden" }}
      >
        {onMedia.onDesktop ? (
          <>
            <Box
              id="students-desktop-grid-box"
              sx={{
                paddingTop: 4,
                paddingLeft: 4,
                paddingRight: 2,
                width: "61.54%",
                maxWidth: "896px",
              }}
            >
              <motion.div
                initial={isAnimated.projects ? false : { y: 200, opacity: 0 }}
                animate={isAnimated.projects ? false : { y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <StudentGrid />
              </motion.div>
            </Box>
            <Box
              id="students-desktop-profile-box"
              sx={{
                paddingTop: 4,
                paddingLeft: 2,
                paddingRight: 4,
                width: "38.46%",
                maxWidth: "560px",
              }}
            >
              <motion.div
                initial={isAnimated.projects ? false : { x: 200, opacity: 0 }}
                animate={isAnimated.projects ? false : { x: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <StudentProfile />
              </motion.div>
            </Box>
          </>
        ) : student === null ? (
          <Box
            id="students-mobile-list-box"
            sx={{
              paddingTop: 2,
              paddingLeft: 2,
              width: "100%",
              backgroundColor: "hoverGray.main",
            }}
          >
            <StudentList />
          </Box>
        ) : (
          <Box
            id="students-mobile-info-box"
            sx={{
              paddingTop: 2,
              paddingLeft: 2,
              width: "100%",
              backgroundColor: "hoverGray.main",
            }}
          >
            <StudentProfile />
          </Box>
        )}
      </Box>
    </StudentContext.Provider>
  );
};

export default Students;

{
  /* <Grid
  container
  spacing={0}
  direction="row"
  // alignItems="center"
  justifyContent="center"
  sx={{ backgroundColor: "#fafafa" }}
>
  {onMedia.onDesktop ? (
    <>
      <Grid item xs={7}>
        <StudentGrid />
      </Grid>
      <Grid item xs={3}>
        <StudentProfile />
      </Grid>
    </>
  ) : student === null ? (
    <Grid item xs={12}>
      <StudentList />
    </Grid>
  ) : (
    <Grid item xs={12}>
      <StudentProfile />
    </Grid>
  )}
</Grid>; */
}
