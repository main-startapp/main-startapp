import { useContext, useState, useRef } from "react";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { GlobalContext, StudentContext } from "../Context/ShareContexts";
import UserIconMenu from "./UserIconMenu";
import TuneIcon from "@mui/icons-material/Tune";
import {
  SearchBox,
  SearchIconWrapper,
  StyledInputBase,
} from "../Reusable/Resusable";

const MobileStudentsBar = () => {
  const { onMedia } = useContext(GlobalContext);
  const { student, setStudent, setSearchTerm } = useContext(StudentContext);

  // local vars
  const textRef = useRef();

  // selector
  const [selected, setSelected] = useState("2");

  // const spSearch = (
  //   <Search
  //     sx={{
  //       width: onMedia.onDesktop ? "300px" : "100%",
  //       height: onMedia.onDesktop ? "40px" : "30px", // to match the small size category
  //     }}
  //   >
  //     <SearchIconWrapper>
  //       <SearchIcon />
  //     </SearchIconWrapper>

  //     <Tooltip title="Search for positions or fields of interest...">
  //       <StyledInputBase
  //         placeholder="Position or Field of Interest…"
  //         inputProps={{ "aria-label": "search" }}
  //         inputRef={textRef}
  //         fullWidth={true}
  //         onChange={(e) => {
  //           if (e.target.value.length !== 0) return;
  //           setSearchTerm("");
  //         }}
  //         onKeyPress={(e) => {
  //           if (e.key === "Enter") {
  //             setSearchTerm(e.target.value);
  //           }
  //         }}
  //       />
  //     </Tooltip>
  //   </Search>
  // );

  return (
    <>
      <AppBar elevation={0} position="fixed">
        <Toolbar
          id="mobilestudentsbar-searchbox"
          disableGutters // disable auto padding
          sx={{
            // minHeight: 0,
            // "@media (min-width: 600px)": {
            //   minHeight: 0,
            // },
            height: "80px",
            paddingX: 2,
            backgroundColor: "background.default",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
            }}
          >
            <UserIconMenu iconHeight="32px" avatarHeight="32px" />
            <SearchBox sx={{ ml: 2, width: "100%" }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                fullWidth={true}
                placeholder="Search for students or keywords..."
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
          </Box>
        </Toolbar>
        {/* <Toolbar
          id="mobilestudentsbar-tab"
          disableGutters // disable auto padding
          sx={{
            alignItems: "flex-end",
            minHeight: 0,
            height: "40px",
            paddingX: 2,
            paddingBottom: 0.5,
            backgroundColor: "primary.main",
            position: "relative",
            // overflow: "scroll",
            // "&::-webkit-scrollbar": {
            //   display: "none",
            // },
          }}
        >
          <TuneIcon sx={{ mr: 2 }} />
          <Typography
            sx={{
              mr: 2,
              fontSize: "1rem",
              fontWeight: "regular",
              borderBottom: 1,
              borderColor: selected === "1" ? "white" : "primary.main",
            }}
            onClick={() => {
              setSelected("1");
            }}
          >
            Category
          </Typography>
          <Typography
            sx={{
              mr: 2,
              fontSize: "1rem",
              fontWeight: "regular",
              borderBottom: 1,
              borderColor: selected === "2" ? "white" : "primary.main",
            }}
            onClick={() => {
              setSelected("2");
            }}
          >
            Type
          </Typography>
          {searchTypeList.length > 0 && (
            <Chip
              label={searchTypeList.length + " selected"}
              color="pureWhite"
              size="small"
              onDelete={() => {
                const newTypeList = [...typeList];
                newTypeList.forEach((type) => {
                  if (type.isSelected) type.isSelected = false;
                });
                setTypeList(newTypeList);
                setSearchTypeList([]);
              }}
              sx={{
                position: "absolute",
                bottom: 4,
                right: 16,
                height: "24px",
                "& .MuiChip-deleteIcon": {
                  color: "primary.main",
                },
              }}
            />
          )}
        </Toolbar> */}
        {/* <Toolbar
          id="mobilestudentsbar-tab-content"
          disableGutters // disable auto padding
          sx={{
            alignItems: "flex-start",
            minHeight: 0,
            height: "40px",
            paddingX: 2,
            paddingTop: 0.5,
            backgroundColor: "primary.main",
            overflow: "scroll",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {selected === "2" &&
            typeList?.map((type, index) => (
              <Chip
                key={index}
                color={type.isSelected ? "pureWhite" : "lightPrimary"}
                label={type.name}
                size="small"
                onClick={() => {
                  handleSelect(index);
                }}
                {...(type.isSelected && {
                  onDelete: () => {
                    handleRemove(index);
                  },
                })}
                sx={{
                  mr: 1,
                  fontSize: "0.75rem",
                  fontWeight: "medium",
                  "&.MuiChip-root:hover": {
                    backgroundColor: type.isSelected
                      ? "pureWhite.main"
                      : "lightPrimary.main",
                  },
                  "& .MuiChip-deleteIcon": {
                    color: "primary.main",
                  },
                }}
              />
            ))}
        </Toolbar> */}
      </AppBar>
    </>
  );
};

export default MobileStudentsBar;
