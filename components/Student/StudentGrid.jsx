import { Box, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useContext, useMemo, useEffect } from "react";
import { GlobalContext, StudentContext } from "../Context/ShareContexts";
import {
  FixedHeightPaper,
  SearchBox,
  SearchIconWrapper,
  StyledInputBase,
} from "../Reusable/Resusable";
import StudentCard from "./StudentCard";
import SearchIcon from "@mui/icons-material/Search";
import StudentListItem from "./StudentListItem";

const StudentGrid = () => {
  // context
  const { users, winWidth, onMedia } = useContext(GlobalContext);
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
    <FixedHeightPaper
      elevation={onMedia.onDesktop ? 2 : 0}
      isdesktop={onMedia.onDesktop ? 1 : 0}
      mobileheight={80}
      sx={{
        paddingTop: onMedia.onDesktop ? "32px" : 0,
      }}
    >
      {onMedia.onDesktop ? (
        <>
          <SearchBox sx={{ mt: 2, mx: 4, mb: 4 }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search for name or experise"
              inputProps={{ "aria-label": "search" }}
              // onChange={(e) => {
              //   if (e.target.value.length !== 0) return;
              //   setSearchTerm("");
              // }}
              // onKeyPress={(e) => {
              //   if (e.key === "Enter") {
              //     setSearchTerm(e.target.value);
              //   }
              // }}
            />
          </SearchBox>

          {/* <Box
        id="studentgrid-items-box"
        sx={{
          flexGrow: 1,
          overflowY: "scroll",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {filteredStudents?.map((user, index) => {
            return <StudentCard key={user.uid} student={user} />;
          })}
        </Box>
      </Box> */}

          <Box
            id="studentgrid-grid-box"
            sx={{
              flexGrow: 1,
              overflowY: "scroll",
              paddingLeft: 4,
              paddingRight: onMedia.onDesktop
                ? `calc(${theme.spacing(4)} - 0.4rem)`
                : 4, // considering scrollbar
              paddingTop: 1,
              paddingBottom: 4,
            }}
          >
            <Grid container spacing={4}>
              {filteredStudents?.map((user, index) => (
                <Grid
                  key={index}
                  item
                  xs={winWidth < 1440 ? (winWidth < 1113 ? 6 : 4) : 3}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <StudentCard key={user.uid} student={user} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      ) : (
        <Box
          id="studentgrid-listitems-box"
          sx={{
            flexGrow: 1,
            overflowY: "scroll",
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
      )}
    </FixedHeightPaper>
  );
};

export default StudentGrid;
