import { Box, ListItem } from "@mui/material";
import NextLink from "next/link";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const TeamProjectListItemEmpty = () => {
  return (
    <Box m={3}>
      <NextLink
        href={{
          pathname: "/project/create",
          query: { isCreateStr: "true" },
        }}
        as="/project/create"
        passHref
      >
        <ListItem
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: 1,
            borderRadius: 4,
            borderColor: "text.secondary",
            "&:hover": {
              backgroundColor: "#f6f6f6",
              cursor: "pointer",
            },
            minHeight: "150px",
            overflow: "hidden",
          }}
        >
          <AddCircleOutlineIcon
            sx={{ height: "70px", width: "70px", color: "lightgray" }}
          />
        </ListItem>
      </NextLink>
    </Box>
  );
};

export default TeamProjectListItemEmpty;
