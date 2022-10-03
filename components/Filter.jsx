import React, { useState } from "react";
import { Drawer, Box, Typograpahy } from "@mui/material";

const Filter = ({ isToggled }) => {
  const drawerWidth = 240;

  return (
    <Drawer
      anchor="right"
      open={isToggled}
      variant="persistent"
      sx={{
        position: "absolute",
      }}
    >
      helloasdfasdfasdfasdfasd
    </Drawer>
  );
};

export default Filter;
