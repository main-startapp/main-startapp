import { useContext, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import {
  GlobalContext,
  StudentContext,
} from "../components/Context/ShareContexts";
import StudentsPageBar from "../components/Header/StudentsPageBar";
import StudentProfile from "../components/Student/StudentProfile";
import StudentGrid from "../components/Student/StudentGrid";
import StudentList from "../components/Student/StudentList";

const Students = () => {
  // context
  const { setChat, setChatPartner, setShowChat, setShowMsg, onMedia } =
    useContext(GlobalContext);
  useEffect(() => {
    setShowChat(true);
    setShowMsg(false);
    setChat(null);
    setChatPartner(null);
  }, [setChat, setChatPartner, setShowChat, setShowMsg]);

  // local
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
      <Grid
        container
        spacing={0}
        direction="row"
        // alignItems="center"
        justifyContent="center"
        sx={{ backgroundColor: "#fafafa" }}
      >
        {onMedia.onDesktop ? (
          <Grid item xs={7}>
            <StudentGrid />
          </Grid>
        ) : (
          student === null && (
            <Grid item xs={12}>
              <StudentList />
            </Grid>
          )
        )}
        {onMedia.onDesktop ? (
          <Grid item xs={3}>
            <StudentProfile />
          </Grid>
        ) : (
          student !== null && (
            <Grid item xs={12}>
              <StudentProfile />
            </Grid>
          )
        )}
      </Grid>
    </StudentContext.Provider>
  );
};

export default Students;
