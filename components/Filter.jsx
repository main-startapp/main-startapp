import React, { useState, useContext } from "react";
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
  FormControl,
  Grid,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  GlobalContext,
  EventContext,
} from "../components/Context/ShareContexts";
import AddIcon from "@mui/icons-material/Add";

const Filter = ({ isToggled, toggleFilter }) => {
  const onMedia = useContext(GlobalContext);
  const drawerWidth = 500;
  const departmentsList = ["None", "Science", "Business", "Arts"];
  const majorList = [
    "None",
    "Computer Science",
    "Biochemistry",
    "Biology",
    "Neuroscience",
  ];

  // states
  const [universityList, setUniversityList] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [isCheckedAddUni, setIsCheckedAddUni] = useState(false);
  const [isCheckedAddTag, setIsCheckedAddTag] = useState(false);

  const DrawerHeader = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "flex-start",
    fontWeight: "bold",
    fontSize: "20px",
  }));

  // reusable components

  const Item = styled(Box)(({ theme }) => ({
    padding: "6px",
    display: "flex",
    gap: "10px",
    alignItems: "center",
  }));

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

  const categoryComp = (list, type) => {
    return (
      <FormControl
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            backgroundColor: "#f0f0f0",
          },
          "&:hover .MuiOutlinedInput-root": {
            backgroundColor: "#dbdbdb",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: 0,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: 0,
          },
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              border: 1.5,
              borderColor: "#3e95c2",
            },
          mb: 1.6,
        }}
        size="small"
      >
        <InputLabel />
        <Select
          defaultValue={list[0]}
          sx={{
            mt: 2,
          }}
        >
          {list.map((name, index) => {
            return (
              <MenuItem key={index} value={name}>
                {name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  };

  const multipleOptionComp = (list, add, type) => {
    return (
      <Grid container columns={16} spacing={"5px"}>
        {list.map((name, index) => {
          return (
            <Grid key={index} item xs={8}>
              <Item>
                <FormControlLabel control={<Checkbox />} label={name} />
              </Item>
            </Grid>
          );
        })}
        {add && !isCheckedAddUni && type === "University" && gridAddField(type)}
        {add && isCheckedAddUni && type === "University" && gridAddInput(type)}
        {add && !isCheckedAddTag && type === "Tag" && gridAddField(type)}
        {add && isCheckedAddTag && type === "Tag" && gridAddInput(type)}
      </Grid>
    );
  };

  const gridAddInput = (type) => {
    return (
      <Grid item xs={8} sx={{ alignItems: "center" }}>
        <Item>
          <TextField
            autoFocus
            size="small"
            helperText={`${type} name`}
            onKeyPress={(e) => {
              type === "University"
                ? handleUniversityClick(e)
                : handleTagClick(e);
            }}
          ></TextField>
        </Item>
      </Grid>
    );
  };

  const gridAddField = (type) => {
    return (
      <Grid item xs={8}>
        <Item sx={{ ml: 0.7 }}>
          <FormControlLabel
            control={<AddIcon />}
            label={`Add a ${type}`}
            sx={{
              mt: 1.5,
              padding: "1px 3px",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "#dbdbdb",
              },
              gap: "12px",
            }}
            onClick={(e) => {
              type === "University"
                ? setIsCheckedAddUni(true)
                : setIsCheckedAddTag(true);
            }}
          />
        </Item>
      </Grid>
    );
  };

  const handleUniversityClick = (e) => {
    if (e.key === "Enter") {
      setIsCheckedAddUni(false);
      setUniversityList([...universityList, e.target.value]);
    }
  };

  const handleTagClick = (e) => {
    if (e.key === "Enter") {
      setIsCheckedAddTag(false);
      setTagList([...tagList, e.target.value]);
    }
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
        <Divider sx={{ mt: 1.5 }} />
        {filterSection("Fees", multipleOptionComp(["Free", "Paid"], false))}
        <Divider sx={{ mt: 1.5 }} />
        {filterSection(
          "Department",
          categoryComp(departmentsList, "Department")
        )}
        <Divider sx={{ mt: 1.5 }} />
        {filterSection("Major", categoryComp(majorList, "Major"))}
        <Divider sx={{ mt: 1.5 }} />
        {filterSection(
          "University",
          multipleOptionComp(universityList, true, "University")
        )}
        <Divider sx={{ mt: 1.5 }} />
        {filterSection("Tags", multipleOptionComp(tagList, true, "Tag"))}
      </Drawer>
    </ClickAwayListener>
  );
};

export default Filter;
