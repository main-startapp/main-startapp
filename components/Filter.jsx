import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  ListSubheaderm,
  FormLabel,
  InputLabel,
  Checkbox,
  ClickAwayListener,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const Filter = ({ isToggled, toggleFilter }) => {
  const drawerWidth = 240;

  const DrawerHeader = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "flex-start",
    fontWeight: "bold",
    fontSize: "20px",
  }));

  // reusable components
  const filterSection = (name, body) => {
    return (
      <Box>
        <InputLabel
          sx={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "black",
          }}
        >
          {name}
        </InputLabel>
        {body}
      </Box>
    );
  };

  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      touchEvent="onTouchStart"
      onClickAway={() => toggleFilter(false)}
    >
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            border: "solid red 2px",
            padding: "8% 1%",
          },
        }}
        variant="persistent"
        anchor="right"
        open={isToggled}
      >
        <DrawerHeader>Filter</DrawerHeader>
        <Divider />
        {filterSection(
          "Fees",
          <Box>
            <Checkbox
              sx={{ mr: 1.5, color: "#dbdbdb", padding: 0 }}
              checked={true}
            />
          </Box>
        )}
      </Drawer>
    </ClickAwayListener>
  );
};

export default Filter;
