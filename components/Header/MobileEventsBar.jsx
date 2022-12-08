import { useContext, useEffect, useRef, useState } from "react";
import { AppBar, Box, Chip, Fab, Toolbar, Typography } from "@mui/material";
import { EventContext } from "../Context/ShareContexts";
import {
  removeValueFromArray,
  SearchBox,
  SearchIconWrapper,
  StyledInputBase,
} from "../Reusable/Resusable";
import SearchIcon from "@mui/icons-material/Search";
import UserIconMenu from "./UserIconMenu";
import TuneIcon from "@mui/icons-material/Tune";
import { eventStrList } from "../Reusable/MenuStringList";

const MobileEventsBar = () => {
  // context
  const {
    setSearchTerm,
    searchCategory,
    setSearchCategory,
    searchTypeList,
    setSearchTypeList,
  } = useContext(EventContext);

  // local vars
  const textRef = useRef();

  // selector
  const [selected, setSelected] = useState("2");

  // type related
  const [typeList, setTypeList] = useState([]);
  useEffect(() => {
    const retList = [];
    eventStrList.forEach((typeStr) => {
      retList.push({ name: typeStr, isSelected: false });
    });
    setTypeList(retList);
  }, []);

  const handleSelect = (i) => {
    if (typeList[i].isSelected) return;
    // update the local type list
    let newTypeList = [...typeList];
    newTypeList[i] = {
      ...newTypeList[i],
      isSelected: true,
    };
    setTypeList(newTypeList);
    // update the project type state
    let newSearchType = [...searchTypeList];
    newSearchType.push(newTypeList[i].name);
    setSearchTypeList(newSearchType);
  };

  const handleRemove = (i) => {
    if (!typeList[i].isSelected) return;
    // update the local type list
    let newTypeList = [...typeList];
    newTypeList[i] = {
      ...newTypeList[i],
      isSelected: false,
    };
    setTypeList(newTypeList);
    // update the project search type name list
    let newSearchTypeList = [...searchTypeList];
    newSearchTypeList = removeValueFromArray(
      newSearchTypeList,
      newTypeList[i].name
    );
    setSearchTypeList(newSearchTypeList);
  };

  // // reuseable comp
  // const ekSearch = (
  //   <Search
  //     sx={{
  //       width: onMedia.onDesktop ? "300px" : "80%",
  //       height: onMedia.onDesktop ? "40px" : "30px", // to match the small size category
  //     }}
  //   >
  //     <SearchIconWrapper>
  //       <SearchIcon />
  //     </SearchIconWrapper>
  //     <Tooltip title="Search for events or keywords...">
  //       <StyledInputBase
  //         fullWidth={true}
  //         placeholder="Event or Keyword…"
  //         inputProps={{ "aria-label": "search" }}
  //         inputRef={textRef}
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
  //           border: 1.5,
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
  //       {eventStrList?.map((eventStr, index) => {
  //         return (
  //           <MenuItem key={index} value={eventStr}>
  //             {eventStr}
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
          id="mobileeventsbar-searchbox"
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
                placeholder="Search for events or keywords..."
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
        <Toolbar
          id="mobileeventsbar-tab"
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
              color="selectedWhite"
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
        </Toolbar>
        <Toolbar
          id="mobileeventsbar-tab-content"
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
                color={type.isSelected ? "selectedWhite" : "lightPrimary"}
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
                      ? "selectedWhite.main"
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

export default MobileEventsBar;
