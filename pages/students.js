import { useContext, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import {
  GlobalContext,
  StudentContext,
} from "../components/Context/ShareContexts";
import StudentPageBar from "../components/Header/StudentPageBar";
import StudentProfile from "../components/Student/StudentProfile";
import StudentGrid from "../components/Student/StudentGrid";

const Students = () => {
  // context
  const { setChat, setShowChat, setShowMsg } = useContext(GlobalContext);
  useEffect(() => {
    setShowChat(true);
    setShowMsg(false);
    setChat(null);
  }, [setChat, setShowChat, setShowMsg]);

  // local
  const [student, setStudent] = useState(null); // the selected student by clicking the student card in the StudentGrid
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
      <StudentPageBar />
      <Grid
        container
        spaceing={0}
        mt={1}
        direction="row"
        // alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={7}>
          <StudentGrid />
        </Grid>
        <Grid item xs={3}>
          <StudentProfile />
        </Grid>
      </Grid>
    </StudentContext.Provider>
  );
};

export default Students;
