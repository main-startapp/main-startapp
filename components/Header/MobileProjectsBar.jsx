import { useContext, useRef, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import { GlobalContext, ProjectContext } from "../Context/ShareContexts";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import {
  SearchBox,
  SearchIconWrapper,
  StyledInputBase,
} from "../Reusable/Resusable";
import UserIconMenu from "./UserIconMenu";

const MobileProjectsBar = () => {
  // context
  const {
    fullProject,
    setFullProject,
    setSearchTerm,
    searchCategory,
    setSearchCategory,
  } = useContext(ProjectContext);

  // local vars
  const project = fullProject?.project;
  const textRef = useRef();

  // const categoryComp = (
  //   <FormControl
  //     sx={{
  //       ml: onMedia.onDesktop ? 3 : 0,
  //       width: "300px",
  //       "& .MuiOutlinedInput-root": {
  //         borderRadius: 2,
  //         backgroundColor: "#f0f0f0",
  //       },
  //       "&:hover .MuiOutlinedInput-root": {
  //         backgroundColor: "#dbdbdb",
  //       },
  //       "& .MuiOutlinedInput-notchedOutline": {
  //         border: 0,
  //       },
  //       "&:hover .MuiOutlinedInput-notchedOutline": {
  //         border: 0,
  //       },
  //       "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
  //         {
  //           border: 1,
  //           borderColor: "#3e95c2",
  //         },
  //     }}
  //     size="small"
  //   >
  //     <InputLabel sx={{ color: "#b1b1b1" }}>Category</InputLabel>
  //     <Select
  //       label="Category"
  //       defaultValue={""}
  //       value={searchCategory}
  //       onChange={(e) => {
  //         setSearchCategory(e.target.value);
  //       }}
  //     >
  //       <MenuItem value={""}>None</MenuItem>
  //       {projectStrList?.map((projectStr, index) => {
  //         return (
  //           <MenuItem key={index} value={projectStr}>
  //             {projectStr}
  //           </MenuItem>
  //         );
  //       })}
  //     </Select>
  //   </FormControl>
  // );

  return (
    <AppBar color="background" elevation={0} position="static">
      <Toolbar
        sx={{
          // minHeight: 0,
          // "@media (min-width: 600px)": {
          //   minHeight: 0,
          // },
          height: "64px",
          paddingX: 2,
        }}
        disableGutters // disable auto padding
      >
        {fullProject === null ? (
          // projectList version
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
            }}
          >
            <SearchBox sx={{ mr: 2, width: "100%" }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                fullWidth={true}
                placeholder="Search for projects or positions..."
                inputProps={{ "aria-label": "search" }}
                inputRef={textRef}
                onChange={(e) => {
                  if (e.target.value.length !== 0) return;
                  setSearchTerm("");
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    setSearchTerm(e.target.value);
                  }
                }}
              />
            </SearchBox>
            {/* <Button
              sx={{
                width: "20%",
                height: "30px",
                backgroundColor: "#f0f0f0",
                color: "gray",
                borderRadius: 2,
                ml: 1.5,
              }}
              id="mobileprojectsbar-menu-button"
              aria-controls={open ? "mobileprojectsbar-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={(e) => {
                open ? handleUserMenuClose() : handleUserMenu(e);
              }}
            >
              <TuneRoundedIcon />
              <Menu
                id="mobileprojectsbar-menu"
                anchorEl={anchorEl}
                // anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={open}
                onClose={handleUserMenuClose}
                MenuListProps={{
                  "aria-labelledby": "mobileprojectsbar-menu-button",
                }}
              >
                <MenuItem>{categoryComp}</MenuItem>
              </Menu>
            </Button> */}
            <UserIconMenu iconHeight="32px" avatarHeight="32px" />
          </Box>
        ) : (
          // projectInfo version
          <Box>
            <Button
              sx={{
                backgroundColor: "#f0f0f0",
                color: "gray",
                borderRadius: 2,
                height: "30px",
              }}
              onClick={() => {
                setFullProject(null);
              }}
            >
              <ArrowBackIosRoundedIcon />
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default MobileProjectsBar;

// const Search = styled(Box)(({ theme }) => ({
//   // position: "relative",
//   border: 0,
//   borderRadius: 2,
//   backgroundColor: "#f0f0f0",
//   "&:hover": {
//     backgroundColor: "#dbdbdb",
//   },
//   display: "flex",
//   alignItems: "center",
// }));

// const SearchIconWrapper = styled("div")(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: "100%",
//   position: "absolute",
//   pointerEvents: "none",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   color: "gray",
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//   color: "inherit",
//   "& .MuiInputBase-input": {
//     padding: theme.spacing(0, 2, 0, 0), // 2 units to the right
//     // vertical padding + font size from searchIcon
//     paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//   },
// }));
