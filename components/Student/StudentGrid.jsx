import { Box } from "@mui/material";
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

const StudentGrid = () => {
  // context
  const { users, onMedia } = useContext(GlobalContext);
  const { searchTerm, setStudent } = useContext(StudentContext);

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
      islist={1}
      sx={{
        paddingTop: "32px",
      }}
    >
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

      <Box
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
      </Box>

      {/* <Box
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
              <StudentCard key={user.uid} student={user} />
            </Grid>
          ))}
        </Grid>
      </Box> */}
    </FixedHeightPaper>
  );
};

export default StudentGrid;
