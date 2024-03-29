import { Box, Chip, Collapse, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { styled } from "@mui/material/styles";
import {
  removeValueFromArray,
  SearchBox,
  SearchIconWrapper,
  StyledInputBase,
} from "../Reusable/Resusable";
import SearchIcon from "@mui/icons-material/Search";
import { useContext, useRef, useState } from "react";
import { ProjectContext } from "../Context/ShareContexts";
import { categoryStrList, projectStrList } from "../Reusable/MenuStringList";

const ProjectListHeader = () => {
  const {
    setIsSearchingClicked,
    setSearchTerm,
    searchCateList,
    setSearchCateList,
    searchTypeList,
    setSearchTypeList,
  } = useContext(ProjectContext);

  // tabs related
  const [tabValue, setTabValue] = useState("1");
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // tabs expand collapse
  const tabsRef = useRef();
  const [expanded, setExpanded] = useState(false);
  const handleExpand = () => {
    setExpanded(true);
  };
  const handleCollapse = (event) => {
    if (
      tabsRef.current &&
      expanded &&
      !tabsRef.current.contains(event.target)
    ) {
      setExpanded(false);
    }
  };
  document.addEventListener("mousedown", handleCollapse);
  window.addEventListener("wheel", handleCollapse);

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

  return (
    <Box
      id="projectlist-header-box"
      ref={tabsRef}
      onClick={() => {
        if (!expanded) handleExpand();
      }}
    >
      <Typography
        variant="h1"
        sx={{ m: 2, fontSize: "1.5rem", fontWeight: "bold" }}
      >
        {"Project Board"}
      </Typography>

      <SearchBox sx={{ mx: 2, mb: 2 }}>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search for projects or positions"
          inputProps={{ "aria-label": "search" }}
          onChange={(e) => {
            if (e.target.value.length !== 0) return;
            setSearchTerm("");
            setIsSearchingClicked(true); // isSearchingClicked flag for auto set entry
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSearchTerm(e.target.value);
              setIsSearchingClicked(true); // isSearchingClicked flag for auto set entry
            }
          }}
        />
      </SearchBox>

      <Box sx={{ position: "relative" }}>
        <TabContext value={tabValue}>
          <TabList
            aria-label="projectlistheader-tabs"
            onChange={handleChange}
            sx={{ minHeight: 0, borderBottom: 1, borderColor: "divider" }}
          >
            <StyledTab label="Category" value="1" />
            <StyledTab label="Type" value="2" />
          </TabList>
          <Box id="projectlist-positionref-box" sx={{ position: "relative" }}>
            <Collapse
              in={expanded}
              timeout="auto"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1,
              }}
            >
              <TabPanel
                value="1"
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: "0px 0px 8px 8px",
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                {cateList?.map((cate, index) => (
                  <Chip
                    key={index}
                    clickable={false}
                    color={cate.isSelected ? "primary" : "lightPrimary"}
                    label={cate.name}
                    size="medium"
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
                      mb: 1,
                      fontSize: "0.75rem",
                      fontWeight: "medium",
                    }}
                  />
                ))}
              </TabPanel>
              <TabPanel
                value="2"
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: "0px 0px 8px 8px",
                  paddingTop: 2,
                  paddingBottom: 1,
                  paddingX: 2,
                  boxShadow: `0px 1px 2px #ccc`,
                }}
              >
                {typeList?.map((type, index) => (
                  <Chip
                    key={index}
                    clickable={false}
                    color={type.isSelected ? "primary" : "lightPrimary"}
                    label={type.name}
                    size="medium"
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
                      mb: 1,
                      fontSize: "0.75rem",
                      fontWeight: "medium",
                      // "&.MuiChip-root:hover": {
                      //   backgroundColor: type.isSelected
                      //     ? "primary.main"
                      //     : "lightPrimary.main",
                      // },
                    }}
                  />
                ))}
              </TabPanel>
            </Collapse>
          </Box>
        </TabContext>
        {searchCateList.length + searchTypeList.length > 0 && (
          <Chip
            label={searchCateList.length + searchTypeList.length + " selected"}
            color="primary"
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
              top: 0,
              right: 16,
              height: "24px",
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default ProjectListHeader;

const StyledTab = styled(Tab)(({ theme }) => ({
  paddingTop: 0,
  paddingLeft: 0,
  paddingRight: 0,
  paddingBottom: theme.spacing(1),
  marginLeft: theme.spacing(2), // the reason is using marginX can shortern the underscore
  marginRight: theme.spacing(2),
  // marginBottom: theme.spacing(1),
  minHeight: 0,
  minWidth: 0,
  fontSize: "1rem",
}));

export const handleChipClick = (
  i,
  localList,
  setLocalList,
  sharedList,
  setSharedList,
  setSearchingFlag
) => {
  // update the local list
  let newLocalList = [...localList];
  newLocalList[i] = {
    ...newLocalList[i],
    isSelected: !newLocalList[i].isSelected,
  };

  // update the shared search list
  let newSharedList = [...sharedList];
  newSharedList = localList[i].isSelected
    ? removeValueFromArray(newSharedList, localList[i].name)
    : [...newSharedList, localList[i].name];

  // set new states
  setLocalList(newLocalList);
  setSharedList(newSharedList);

  // isSearchingClicked flag for auto set entry
  setSearchingFlag(true);
};
