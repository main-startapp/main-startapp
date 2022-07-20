import { Box, IconButton, ListItem } from "@mui/material";
import NextLink from "next/link";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useRouter } from "next/router";

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
            boxShadow: 0,
            "&:hover": {
              backgroundColor: "#f6f6f6",
              cursor: "default",
            },
            minHeight: "150px",
            overflow: "hidden",
          }}
        >
          <AddCircleOutlineIcon
            sx={{ height: "70px", width: "70px", opacity: "50%" }}
          />
        </ListItem>
      </NextLink>
    </Box>
  );
};

export default TeamProjectListItemEmpty;
