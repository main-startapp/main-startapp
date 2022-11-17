import { Box, Typography } from "@mui/material";
import {
  SearchBox,
  SearchIconWrapper,
  StyledInputBase,
} from "../Reusable/Resusable";
import SearchIcon from "@mui/icons-material/Search";

const EventListHeader = () => {
  return (
    <Box id="eventlist-header-box" sx={{ padding: 2 }}>
      <Typography
        variant="h1"
        sx={{ mb: 2, fontSize: "1.5rem", fontWeight: "bold" }}
      >
        {"Event Board"}
      </Typography>
      <SearchBox>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search for events or keywords"
          inputProps={{ "aria-label": "search" }}
        />
      </SearchBox>
    </Box>
  );
};

export default EventListHeader;
