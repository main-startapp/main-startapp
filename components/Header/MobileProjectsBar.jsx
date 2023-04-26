import { useContext, useRef, useState } from "react";
import { AppBar, Box, Chip, Toolbar, Typography } from "@mui/material";
import { ProjectContext } from "../Context/ShareContexts";
import {
  removeValueFromArray,
  SearchBox,
  SearchIconWrapper,
  StyledInputBase,
} from "../Reusable/Resusable";
import SearchIcon from "@mui/icons-material/Search";
import UserIconMenu from "./UserIconMenu";
import TuneIcon from "@mui/icons-material/Tune";
import { categoryStrList, projectStrList } from "../Reusable/MenuStringList";
import { handleChipClick } from "../Project/ProjectListHeader";

const MobileProjectsBar = () => {
  // context
  const {
    setIsSearchingClicked,
    setSearchTerm,
    searchCateList,
    setSearchCateList,
    searchTypeList,
    setSearchTypeList,
  } = useContext(ProjectContext);

  // local vars
  const textRef = useRef();

  // selector
  const [selected, setSelected] = useState("1");

  // category & type related
  const [cateList, setCateList] = useState(
    categoryStrList.map((cateStr) => {
      return { name: cateStr, isSelected: false };
    })
  );

  const [typeList, setTypeList] = useState(
    projectStrList.map((typeStr) => {
      return { name: typeStr, isSelected: false };
    })
  );

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
    <>
      <AppBar elevation={0} position="fixed">
        <Toolbar
          id="mobileprojectsbar-searchbox"
          disableGutters // disable auto padding
          sx={{
            // minHeight: 0,
            // "@media (min-width: 600px)": {
            //   minHeight: 0,
            // },
            height: "80px",
            paddingX: 2,
            backgroundColor: "background.paper",
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
                placeholder="Search for projects or positions..."
                inputProps={{ "aria-label": "search" }}
                inputRef={textRef}
                onChange={(e) => {
                  if (e.target.value.length !== 0) return;
                  setSearchTerm("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearchTerm(e.target.value);
                  }
                }}
              />
            </SearchBox>
          </Box>
        </Toolbar>
        <Toolbar
          id="mobileprojectsbar-tab"
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
              borderBottom: 1,
              borderColor: selected === "2" ? "white" : "primary.main",
            }}
            onClick={() => {
              setSelected("2");
            }}
          >
            Type
          </Typography>
          {searchCateList.length + searchTypeList.length > 0 && (
            <Chip
              label={
                searchCateList.length + searchTypeList.length + " selected"
              }
              color="pureWhite"
              size="small"
              onDelete={() => {
                setCateList(
                  categoryStrList.map((cateStr) => {
                    return { name: cateStr, isSelected: false };
                  })
                );
                setTypeList(
                  projectStrList.map((typeStr) => {
                    return { name: typeStr, isSelected: false };
                  })
                );
                setSearchCateList([]);
                setSearchTypeList([]);
                setIsSearchingClicked(true); // isSearchingClicked flag for auto set entry
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
        </Toolbar>
        <Toolbar
          id="mobileprojectsbar-tab-content"
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
          {selected === "1" &&
            cateList?.map((cate, index) => (
              <Chip
                key={index}
                clickable={false}
                color={cate.isSelected ? "pureWhite" : "lightPrimary"}
                label={cate.name}
                size="small"
                onClick={() => {
                  handleChipClick(
                    index,
                    cateList,
                    setCateList,
                    searchCateList,
                    setSearchCateList,
                    setIsSearchingClicked
                  );
                }}
                sx={{
                  mr: 1,
                  fontSize: "0.75rem",
                  fontWeight: "medium",
                  "&.MuiChip-root:hover": {
                    backgroundColor: cate.isSelected
                      ? "pureWhite.main"
                      : "lightPrimary.main",
                  },
                  "& .MuiChip-deleteIcon": {
                    color: "primary.main",
                  },
                }}
              />
            ))}
          {selected === "2" &&
            typeList?.map((type, index) => (
              <Chip
                key={index}
                clickable={false}
                color={type.isSelected ? "pureWhite" : "lightPrimary"}
                label={type.name}
                size="small"
                onClick={() => {
                  handleChipClick(
                    index,
                    typeList,
                    setTypeList,
                    searchTypeList,
                    setSearchTypeList,
                    setIsSearchingClicked
                  );
                }}
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
        </Toolbar>
      </AppBar>
    </>
  );
};

export default MobileProjectsBar;
