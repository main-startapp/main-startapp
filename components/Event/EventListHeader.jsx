import { Box, Chip, Collapse, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { styled } from "@mui/material/styles";
import {
  SearchBox,
  SearchIconWrapper,
  StyledInputBase,
} from "../Reusable/Resusable";
import SearchIcon from "@mui/icons-material/Search";
import { EventContext } from "../Context/ShareContexts";
import { useContext, useRef, useState } from "react";
import { categoryStrList, eventStrList } from "../Reusable/MenuStringList";
import { handleChipClick } from "../Project/ProjectListHeader";

const EventListHeader = () => {
  const {
    setIsSearchingClicked,
    setSearchTerm,
    searchCateList,
    setSearchCateList,
    searchTypeList,
    setSearchTypeList,
  } = useContext(EventContext);

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
    eventStrList.map((typeStr) => {
      return { name: typeStr, isSelected: false };
    })
  );

  return (
    <Box
      id="eventlist-header-box"
      ref={tabsRef}
      onClick={() => {
        if (!expanded) handleExpand();
      }}
    >
      <Typography
        variant="h1"
        sx={{ m: 2, fontSize: "1.5rem", fontWeight: "bold" }}
      >
        {"Event Board"}
      </Typography>

      <SearchBox sx={{ mx: 2, mb: 2 }}>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search for events or keywords"
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
            aria-label="eventlistheader-tabs"
            onChange={handleChange}
            sx={{ minHeight: 0, borderBottom: 1, borderColor: "divider" }}
          >
            <StyledTab label="Category" value="1" />
            <StyledTab label="Type" value="2" />
          </TabList>
          <Box id="eventlist-positionref-box" sx={{ position: "relative" }}>
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
                    clickable={false}
                    key={index}
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
                eventStrList.map((typeStr) => {
                  return { name: typeStr, isSelected: false };
                })
              );
              setSearchCateList([]);
              setSearchTypeList([]);
              setIsSearchingClicked(true); // isSearchingClicked flag for auto set entry
            }}
            sx={{
              height: "24px",
              position: "absolute",
              top: 0,
              right: 16,
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default EventListHeader;

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
