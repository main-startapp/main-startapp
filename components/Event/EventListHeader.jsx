import { Box, Typography } from "@mui/material";
import {
  SearchBox,
  SearchIconWrapper,
  StyledInputBase,
} from "../Reusable/Resusable";
import SearchIcon from "@mui/icons-material/Search";
import { EventContext } from "../Context/ShareContexts";
import { useContext } from "react";

const EventListHeader = () => {
  const { setSearchTerm } = useContext(EventContext);

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
      </SearchBox>
    </Box>
  );
};

export default EventListHeader;
