import React, { useState } from "react";
import {
  Drawer,
  Box,
  InputLabel,
  Checkbox,
  ClickAwayListener,
  Divider,
  FormControlLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const Filter = ({ isToggled, toggleFilter }) => {
  const drawerWidth = 300;
  const departmentsList = ["Science", "Business", "Arts"];
  const majorList = [
    "Computer Science",
    "Biochemistry",
    "Biology",
    "Neuroscience",
  ];

  const DrawerHeader = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "flex-start",
    fontWeight: "bold",
    fontSize: "20px",
  }));

  // reusable components
  const filterSection = (name, body) => {
    return (
      <Box
        sx={{
          mt: 2,
        }}
      >
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
            padding: "150px 2%",
          },
        }}
        variant="persistent"
        anchor="right"
        open={isToggled}
      >
        <DrawerHeader>Filter</DrawerHeader>
        <Divider sx={{ mt: 1.5, mb: 1.5 }} />
        {filterSection(
          "Fees",
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              justifyContent: "flex-start",
            }}
          >
            <FormControlLabel control={<Checkbox />} label="Free" />
            <FormControlLabel control={<Checkbox />} label="Paid" />
          </Box>
        )}
        <Divider sx={{ mt: 1.5, mb: 1.5 }} />
        {filterSection(
          "Department",
          <Box>
            <Select
              defaultValue={""}
              sx={{
                width: "100%",
                mt: 1.6, // match the spacing with component on top
              }}
            >
              {departmentsList.map((department, index) => {
                return (
                  <MenuItem key={index} value={department}>
                    {department}
                  </MenuItem>
                );
              })}
            </Select>
          </Box>
        )}
        <Divider sx={{ mt: 1.5, mb: 1.5 }} />
        {filterSection(
          "Major",
          <Box>
            <Select
              defaultValue={""}
              sx={{
                width: "100%",
                mt: 1.6, // match the spacing with component on top
              }}
            >
              {majorList.map((major, index) => {
                return (
                  <MenuItem key={index} value={major}>
                    {major}
                  </MenuItem>
                );
              })}
            </Select>
          </Box>
        )}
      </Drawer>
    </ClickAwayListener>
  );
};

export default Filter;
