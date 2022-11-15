import { Box, Typography } from "@mui/material";
import {
  SearchBox,
  SearchIconWrapper,
  StyledInputBase,
} from "../Reusable/Resusable";
import SearchIcon from "@mui/icons-material/Search";

const ProjectListHeader = () => {
  return (
    <Box
      id="projectlist-header-box"
      sx={{ paddingTop: 6, paddingBottom: 2, paddingX: 2 }}
    >
      <Typography
        variant="h1"
        sx={{ mb: 2, fontSize: "24px", fontWeight: "bold" }}
      >
        {"Project Board"}
      </Typography>
      <SearchBox>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search for projects or positions"
          inputProps={{ "aria-label": "search" }}
        />
      </SearchBox>
    </Box>
  );
};

export default ProjectListHeader;
