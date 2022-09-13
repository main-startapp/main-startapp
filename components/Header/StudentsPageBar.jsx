import { useContext, useRef } from "react";
import { styled } from "@mui/material/styles";
import {
  AppBar,
  Box,
  Toolbar,
  InputBase,
  Tooltip,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { GlobalContext, StudentContext } from "../Context/ShareContexts";

const StudentsPageBar = () => {
  const { onMedia } = useContext(GlobalContext);
  const { student, setStudent, setSearchTerm } = useContext(StudentContext);
  const textRef = useRef();

  const spSearch = (
    <Search
      sx={{
        width: onMedia.onDesktop ? "300px" : "100%",
        height: onMedia.onDesktop ? "40px" : "30px", // to match the small size category
      }}
    >
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
          {spSearch}
          <Box sx={{ flexGrow: 1 }} />
          <Search
            sx={{
              width: onMedia.onDesktop ? "300px" : "80%",
              height: onMedia.onDesktop ? "40px" : "30px", // to match the small size category
            }}
          >
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
          sx={{
            minHeight: 0,
            "@media (min-width: 600px)": {
              minHeight: 0,
            },
            height: "48px",
            paddingX: 1.5,
          }} // 1.5 to match navbar icon and listitem
          disableGutters // disable auto padding
        >
          {student === null ? (
            // list version
            <Box sx={{ width: "100%", display: "flex" }}>
              {spSearch}
              {/* <Button
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
              </Button> */}
            </Box>
          ) : (
            // info version
            <Box>
              <Button
                sx={{
                  backgroundColor: "#f0f0f0",
                  color: "gray",
                  borderRadius: "10px",
                }}
                onClick={() => setStudent(null)}
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

export default StudentsPageBar;

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
