import React, { useState } from "react";
import { Drawer, Box, Typograpahy } from "@mui/material";

const Filter = ({ isToggled }) => {
  return (
    <Drawer anchor="right" open={isToggled} variant="persistent">
      <Box>{/* <IconButton></IconButton> */}</Box>
      hello
    </Drawer>
  );
};

export default Filter;
