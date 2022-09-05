import { useContext, useRef } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import InputBase from "@mui/material/InputBase";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SearchIcon from "@mui/icons-material/Search";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { GlobalContext, StudentContext } from "../Context/ShareContexts";

const StudentPageBar = () => {
  const { onMedia } = useContext(GlobalContext);
  const { setSearchTerm, setSearchCategory } = useContext(StudentContext);
  const textRef = useRef();

  const spSearchComp = (
    <Search sx={{ width: onMedia.onDesktop ? "300px" : "80%" }}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>

      <Tooltip title="Search for positions or fields of interest...">
        <StyledInputBase
          placeholder="Position or Field of Interest…"
          inputProps={{ "aria-label": "search" }}
          inputRef={textRef}
          fullWidth={true}
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
          {spSearchComp}
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
      {/* {!onMedia.onDesktop && (
        <Toolbar
          sx={{ height: "64px", paddingX: 1.5 }} // 1.5 to match navbar icon and projectlistitem
          disableGutters // disable auto padding
        >
          {project === null ? (
            // projectList version
            <Box sx={{ width: "100%", display: "flex" }}>
              {spSearchComp}
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
      )} */}
    </AppBar>
  );
};

export default StudentPageBar;

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
