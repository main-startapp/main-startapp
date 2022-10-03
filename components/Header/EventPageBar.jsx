import { useContext, useRef, useState, useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import InputBase from "@mui/material/InputBase";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Tooltip,
  Typography,
  ClickAwayListener,
} from "@mui/material";
import { GlobalContext, EventContext } from "../Context/ShareContexts";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";

const EventPageBar = ({ toggleFilter, isFilterOpen }) => {
  // context
  const { onMedia } = useContext(GlobalContext);
  const { event, setEvent, setSearchTerm, searchCategory, setSearchCategory } =
    useContext(EventContext);

  // menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleUserMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  // ref
  const textRef = useRef();

  // reuseable comp
  const ekSearch = (
    <Search
      sx={{
        width: onMedia.onDesktop ? "300px" : "80%",
        height: onMedia.onDesktop ? "40px" : "30px", // to match the small size category
      }}
    >
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <Tooltip title="Search for events or keywords...">
        <StyledInputBase
          fullWidth={true}
          placeholder="Event or Keyword…"
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
      </Tooltip>
    </Search>
  );

  const categoryComp = (
    <FormControl
      sx={{
        ml: onMedia.onDesktop ? 3 : 0,
        width: "300px",
        "& .MuiOutlinedInput-root": {
          borderRadius: "10px",
          backgroundColor: "#f0f0f0",
        },
        "&:hover .MuiOutlinedInput-root": {
          backgroundColor: "#dbdbdb",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          border: 0,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          border: 0,
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
          {
            border: 1.5,
            borderColor: "#3e95c2",
          },
      }}
      size="small"
    >
      <InputLabel sx={{ color: "#b1b1b1" }}>Category</InputLabel>
      <Select
        label="Category"
        defaultValue={""}
        value={searchCategory}
        onChange={(e) => {
          setSearchCategory(e.target.value);
        }}
      >
        <MenuItem value={""}>None</MenuItem>
        {eventStrList.map((eventStr, index) => {
          return (
            <MenuItem key={index} value={eventStr}>
              {eventStr}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );

  const filterComp = (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      touchEvent="onTouchStart"
      onClickAway={() => toggleFilter(false)}
    >
      <Button
        sx={{
          width: onMedia.onDesktop ? "10%" : "18%",
          height: onMedia.onDesktop ? "40px" : "30px", // to match the small size category
          ml: onMedia.onDesktop ? 0 : 1.5,
          backgroundColor: "#f0f0f0",
          border: "none",
          borderRadius: "10px",
          color: "gray",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#ffffff",
          },
          mr: 1,
          overflow: "hidden",
          paddingX: "10px",
        }}
        onClick={() => toggleFilter(!isFilterOpen)}
        variant="contained"
        disableElevation
      >
        {onMedia.onDesktop && (
          <FilterAltOutlinedIcon
            sx={{
              mr: 1,
            }}
          />
        )}
        <Typography>{"Filter"}</Typography>
      </Button>
    </ClickAwayListener>
  );

  return (
    <AppBar
      position="static"
      sx={{
        color: "text.primary",
        backgroundColor: "#ffffff",
        borderBottom: 1.5,
        borderColor: "#dbdbdb",
        position: "relative",
        zIndex: "1500",
      }}
      elevation={0}
    >
      {/* desktop version */}
      {onMedia.onDesktop && (
        <Toolbar
          sx={{
            height: "64px",
            paddingX: 3,
          }}
          disableGutters // will be customozied in sx
        >
          {ekSearch}
          {categoryComp}
          <Box sx={{ flexGrow: 1 }} />

          {filterComp}
        </Toolbar>
      )}

      {/* mobile version */}
      {!onMedia.onDesktop && (
        <Toolbar
          sx={{ height: "48px", paddingX: 1.5 }} // 1.5 to match navbar icon and listitem
          disableGutters // disable auto padding
        >
          {event === null ? (
            // list version
            <Box sx={{ width: "100%", display: "flex" }}>
              {ekSearch}
              <Button
                sx={{
                  width: "20%",
                  height: "30px",
                  backgroundColor: "#f0f0f0",
                  color: "gray",
                  borderRadius: "10px",
                  ml: 1.5,
                }}
                id="epb-menu-button"
                aria-controls={open ? "epb-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={(e) => {
                  open ? handleUserMenuClose() : handleUserMenu(e);
                }}
              >
                <TuneRoundedIcon />
                <Menu
                  id="epb-menu"
                  anchorEl={anchorEl}
                  // anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  open={open}
                  onClose={handleUserMenuClose}
                  MenuListProps={{
                    "aria-labelledby": "epb-menu-button",
                  }}
                  //onClick={(e) => e.stopPropagation()}
                >
                  <MenuItem
                    sx={{
                      "&:hover": {
                        backgroundColor: "#ffffff",
                      },
                    }}
                  >
                    {categoryComp}
                  </MenuItem>
                </Menu>
              </Button>
            </Box>
          ) : (
            // info version
            <Box>
              <Button
                sx={{
                  backgroundColor: "#f0f0f0",
                  color: "gray",
                  borderRadius: "10px",
                  height: "30px",
                }}
                onClick={() => setEvent(null)}
              >
                <ArrowBackIosRoundedIcon />
              </Button>
            </Box>
          )}
          {filterComp}
        </Toolbar>
      )}
    </AppBar>
  );
};

export default EventPageBar;

const Search = styled(Box)(({ theme }) => ({
  // position: "relative",
  border: 0,
  borderRadius: "10px",
  backgroundColor: "#f0f0f0",
  "&:hover": {
    backgroundColor: "#dbdbdb",
  },
  display: "flex",
  alignItems: "center",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "gray",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(0, 2, 0, 0), // 2 units to the right
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  },
}));

export const eventStrList = [
  "Case Competition",
  "Community Event",
  "Concert",
  "Conference",
  "Expo",
  "Festival",
  "Hackathon",
  "Info Session",
  "Networking Session",
  "Sports",
  "Workshop",
];
