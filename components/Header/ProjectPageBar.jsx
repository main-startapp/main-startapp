import { useContext, useRef, useState } from "react";
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
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { GlobalContext, ProjectContext } from "../Context/ShareContexts";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";

const ProjectPageBar = () => {
  // context
  const { onMedia } = useContext(GlobalContext);
  const { project, setProject, setSearchTerm, setSearchCategory } =
    useContext(ProjectContext);

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
  const ppSearchComp = (
    <Search sx={{ width: onMedia.onDesktop ? "300px" : "80%" }}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <Tooltip title="Search for projects or positions...">
        <StyledInputBase
          fullWidth={true}
          placeholder="Project or Position…"
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
        onChange={(e) => {
          setSearchCategory(e.target.value);
        }}
      >
        <MenuItem value={""}>None</MenuItem>
        <MenuItem value={"Charity Initiative"}>Charity Initiative</MenuItem>
        <MenuItem value={"Club"}>Club</MenuItem>
        <MenuItem value={"Fun Project"}>Fun Project</MenuItem>
        <MenuItem value={"Learning Project"}>Learning Project</MenuItem>
        <MenuItem value={"Startup"}>Startup</MenuItem>
      </Select>
    </FormControl>
  );

  return (
    <AppBar
      position="static"
      sx={{
        color: "text.primary",
        backgroundColor: "#ffffff",
        borderBottom: 1.5,
        borderColor: "#dbdbdb",
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
          {ppSearchComp}
          {categoryComp}
          <Box sx={{ flexGrow: 1 }} />
          <Search>
            <SearchIconWrapper>
              <FilterAltOutlinedIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Filter… (coming soon)"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Toolbar>
      )}

      {/* mobile version */}
      {!onMedia.onDesktop && (
        <Toolbar
          sx={{ height: "64px", paddingX: 1.5 }} // 1.5 to match navbar icon and projectlistitem
          disableGutters // disable auto padding
        >
          {project === null ? (
            // projectList version
            <Box sx={{ width: "100%", display: "flex" }}>
              {ppSearchComp}
              <Button
                sx={{
                  width: "20%",
                  backgroundColor: "#f0f0f0",
                  color: "gray",
                  borderRadius: "10px",
                  ml: 1.5,
                }}
                id="ppb-menu-button"
                aria-controls={open ? "ppb-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={(e) => {
                  open ? handleUserMenuClose() : handleUserMenu(e);
                }}
              >
                <TuneRoundedIcon />
                <Menu
                  id="ppb-menu"
                  anchorEl={anchorEl}
                  // anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  open={open}
                  onClose={handleUserMenuClose}
                  MenuListProps={{
                    "aria-labelledby": "ppb-menu-button",
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
            // projectInfo version
            <Box>
              <Button
                sx={{
                  backgroundColor: "#f0f0f0",
                  color: "gray",
                  borderRadius: "10px",
                }}
                onClick={() => setProject(null)}
              >
                <ArrowBackIosRoundedIcon />
              </Button>
            </Box>
          )}
        </Toolbar>
      )}
    </AppBar>
  );
};

export default ProjectPageBar;

const Search = styled(Box)(({ theme }) => ({
  // position: "relative",
  border: 0,
  borderRadius: "10px",
  backgroundColor: "#f0f0f0",
  "&:hover": {
    backgroundColor: "#dbdbdb",
  },
  height: "40px", // to match the small size category
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
