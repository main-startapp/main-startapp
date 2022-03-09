import { useContext } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import InputBase from "@mui/material/InputBase";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { ProjectContext } from "../Context/ProjectContext";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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

export default function ProjectPageBar() {
  const { setSearchTerm } = useContext(ProjectContext);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ background: "#fafafa", color: "#000000" }}
      >
        <Toolbar>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Project or Position…"
              inputProps={{ "aria-label": "search" }}
              // onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  setSearchTerm(e.target.value);
                }
              }}
              onBlur={(e) => {
                e.target.value = "";
                setSearchTerm("");
              }}
            />
          </Search>
          {/* <FormControl sx={{ ml: 3, minWidth: 200 }} size="small">
            <InputLabel id="project-category-label">Category</InputLabel>
            <Select
              labelId="project-category-label"
              id="project-category"
              // value={age}
              label="Category"
              // onChange={handleChange}
              displayEmpty
            >
              <MenuItem value={10}>Science</MenuItem>
              <MenuItem value={20}>Business</MenuItem>
              <MenuItem value={30}>Engineering</MenuItem>
              <MenuItem value={40}>Unreasonablely long placeholder</MenuItem>
            </Select>
          </FormControl> */}
          <Box sx={{ flexGrow: 1 }} />
          <Search>
            <SearchIconWrapper>
              <FilterAltOutlinedIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Filter…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
