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
import { StudentContext } from "../Context/ShareContexts";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export default function ProjectPageBar() {
  const { setSearchTerm, setSearchCategory } = useContext(StudentContext);
  const textRef = useRef();

  return (
    <AppBar position="static" sx={{ bgcolor: "#fafafa", color: "#000000" }}>
      <Toolbar sx={{ maxHeight: "64px" }}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <Tooltip title="Search for students or positions...">
            <StyledInputBase
              placeholder="Name or Position…"
              inputProps={{ "aria-label": "search" }}
              inputRef={textRef}
              // onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  setSearchTerm(e.target.value);
                }
              }}
            />
          </Tooltip>
          <Tooltip title="Reset">
            <IconButton
              sx={{ color: "#000000" }}
              onClick={() => {
                textRef.current.value = "";
                setSearchTerm("");
              }}
            >
              <RestartAltIcon />
            </IconButton>
          </Tooltip>
        </Search>
        {/* <FormControl sx={{ ml: 3, minWidth: 200 }} size="small">
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            defaultValue={""}
            onChange={(e) => {
              setSearchCategory(e.target.value);
            }}
          >
            <MenuItem value={""}>None</MenuItem>
            <MenuItem value={"Startup"}>Startup</MenuItem>
            <MenuItem value={"PersonalProject"}>Personal Project</MenuItem>
            <MenuItem value={"Event"}>Event</MenuItem>
            <MenuItem value={"CharityInitiative"}>Charity Initiative</MenuItem>
          </Select>
        </FormControl> */}
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
    </AppBar>
  );
}

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.25),
  },
  marginLeft: 10,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(0),
    width: "auto",
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "20ch",
      "&:focus": {
        width: "25ch",
      },
    },
  },
}));
