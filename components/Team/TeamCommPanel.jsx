import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  Link,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useContext, useEffect, useRef, useState } from "react";
import { TeamContext } from "../Context/ShareContexts";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import cloneDeep from "lodash/cloneDeep";

const TeamCommPanel = () => {
  // context
  const { projectExt, setProjectExt } = useContext(TeamContext);

  // local var
  // !todo:  if we want to keep org state
  // // https://stackoverflow.com/questions/48710797/how-do-i-deep-clone-an-object-in-react
  const [confirmOpen, setConfirmOpen] = useState(false);
  const handleConfirmOpen = () => {
    setConfirmOpen(true);
  };
  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };
  const [isEditing, setIsEditing] = useState(false);
  const handleEdit = () => {
    // setIsEditing will be handled in handleConfirmOpen() in case of user choosing continue editing
    if (isEditing) {
      handleConfirmOpen();
    } else {
      setIsEditing(!isEditing);
    }
    return;
  };

  const hexArray = ["#f6f4f8", "#eef4ec", "#e9f3f8"];
  function colorLoop(index) {
    const i = index % hexArray.length;
    return hexArray[i];
  }

  const [linkOpen, setLinkOpen] = useState(false);
  const handleLinkOpen = () => {
    setLinkOpen(true);
  };
  const handleLinkClose = () => {
    setLinkOpen(false);
  };

  const [dialogLinkIndex, setDialogLinkIndex] = useState(-1);

  const [isClickable, setIsClickable] = useState(true);
  useEffect(() => {
    if (isClickable) return;
    // isClickable was false, set back to true after 1s delay
    const timeout1s = setTimeout(() => {
      setIsClickable(true);
    }, 1000);
    return () => {
      clearTimeout(timeout1s);
    };
  }, [isClickable]); // reset send button in 1s

  // box ref to used by useEffect
  const scrollRef = useRef();
  // useEffect to reset box scrollbar position
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [projectExt]);

  // helper fun
  const handleAddLink = () => {
    const linkObj = {
      type: "default",
      name: "Name",
      url_text: "Link",
      url: "",
    };
    let newLinks = projectExt?.links ? projectExt.links : [];
    newLinks.push(linkObj);
    setProjectExt({ ...projectExt, links: newLinks });
  };

  const handleDeleteLink = (index) => {
    let newLinks = projectExt.links;
    newLinks.splice(index, 1);
    setProjectExt({ ...projectExt, links: newLinks });
  };

  const handleOnChangeLink = (key, value, index) => {
    setProjectExt({
      ...projectExt,
      links: [
        ...projectExt.links.slice(0, index),
        { ...projectExt.links[index], [key]: value },
        ...projectExt.links.slice(index + 1),
      ],
    });
  };

  // project_ext was created with project
  const handleSubmit = async (e) => {
    if (!isClickable) return;
    if (!formRef.current.reportValidity()) return;

    // button is clickable & form is valid
    setIsClickable(false);
    const docID = projectExt?.id;
    const docRef = doc(db, "projects_ext", docID);
    let projectExtRef = {
      ...projectExt,
      // remove link with empty url in links
      links: projectExt?.links?.filter((link) => link?.url),
      last_timestamp: serverTimestamp(),
    };
    if (!projectExtRef.links) {
      delete projectExtRef?.links;
    }
    // remove id to keep the doc consistent
    delete projectExtRef?.id;
    const projectExtModRef = updateDoc(docRef, projectExtRef).catch((error) => {
      console.log(error?.message);
    });
    await projectExtModRef;
  };

  const formRef = useRef();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <form ref={formRef}>
        {/* title and edit icon */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{ ml: "16px", fontWeight: "bold", fontSize: "1.5em" }}
          >
            Info Panel
          </Typography>
          <IconButton
            sx={{
              ml: 1.5,
              height: "20px",
              width: "20px",
            }}
            onClick={handleEdit}
          >
            {isEditing ? <DriveFileRenameOutlineIcon /> : <EditOutlinedIcon />}
          </IconButton>
        </Box>
        {/* comm info */}
        {isEditing ? (
          <TextField
            fullWidth
            margin="none"
            multiline
            //name="project info"
            //label="Project Info"
            sx={{
              border: 1,
              borderRadius: 4,
              borderColor: "darkgray",
              padding: "15px 15px",
              "&: hover": {
                borderColor: "#3e95c2",
                backgroundColor: "#fafafa",
              },
              "& .MuiInput-root": {
                padding: "0",
              },
            }}
            variant="standard"
            InputProps={{
              disableUnderline: true,
            }}
            value={projectExt?.info}
            onChange={(e) => {
              setProjectExt({ ...projectExt, info: e.target.value });
            }}
          />
        ) : (
          // lineHeight are taken from mui textfield
          // padding = textfiled border + padding
          <Box
            sx={{
              display: "block",
              padding: "16px 16px",
              lineHeight: "1.4375em",
            }}
          >
            {projectExt?.info ? projectExt.info : "..."}
          </Box>
        )}
        {/* links */}
        {projectExt?.links?.map((link, index) => {
          return (
            <LinkWrapper
              sx={{
                backgroundColor: colorLoop(index),
                justifyContent: "start",
                //  padding: 2,
                mt: 1,
                borderRadius: 4,
              }}
              key={index}
            >
              {isEditing ? (
                <TextField
                  required
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  sx={{
                    border: 1,
                    borderRadius: 2,
                    borderColor: "darkgray",
                    ml: "10px",
                    padding: "1px 0px 1px 6px",
                    "&: hover": {
                      borderColor: "#3e95c2",
                      backgroundColor: "#fafafa",
                    },
                    "& .MuiInput-input": {
                      padding: "0",
                    },
                  }}
                  value={link.name}
                  margin="none"
                  onChange={(e) => {
                    handleOnChangeLink("name", e.target.value, index);
                  }}
                />
              ) : (
                <Box
                  sx={{ padding: "0px 0px 0px 16px", lineHeight: "1.4375em" }}
                >
                  {link.name}
                </Box>
              )}
              <Typography sx={{ mr: "1em" }}>{":"}</Typography>
              {isEditing ? (
                <TextField
                  required
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  sx={{
                    border: 1,
                    borderRadius: 2,
                    borderColor: "darkgray",
                    padding: "1px 6px",
                    "&: hover": {
                      borderColor: "#3e95c2",
                      backgroundColor: "#fafafa",
                    },
                    "& .MuiInput-input": {
                      padding: "0",
                    },
                  }}
                  value={link.url_text}
                  margin="none"
                  onChange={(e) => {
                    handleOnChangeLink("url_text", e.target.value, index);
                  }}
                  onPaste={(e) => {
                    const selected = window.getSelection().toString();
                    if (selected) {
                      e.preventDefault();
                      handleOnChangeLink(
                        "url",
                        e.clipboardData.getData("Text"),
                        index
                      );
                    }
                  }}
                />
              ) : (
                <Link
                  key={index}
                  target="_blank"
                  href={link.url}
                  rel="noreferrer"
                >
                  <Tooltip title={link.url}>
                    <Typography>{link.url_text}</Typography>
                  </Tooltip>
                </Link>
              )}
              {isEditing && (
                <IconButton
                  onClick={() => {
                    setDialogLinkIndex(index);
                    handleLinkOpen();
                  }}
                >
                  <LinkOutlinedIcon />
                </IconButton>
              )}
              <Box sx={{ flexGrow: 1 }} />
              {isEditing && (
                <IconButton
                  onClick={() => {
                    handleDeleteLink(index);
                  }}
                >
                  <DeleteOutlinedIcon />
                </IconButton>
              )}
            </LinkWrapper>
          );
        })}
        {isEditing && (
          <LinkWrapper
            sx={{
              backgroundColor: "#fafafa",
              justifyContent: "center",
              mt: 1,
              borderRadius: 4,
              "&:hover": {
                backgroundColor: "#f0f0f0",
                cursor: "pointer",
              },
            }}
            onClick={handleAddLink}
          >
            <AddCircleOutlineIcon
              sx={{ width: "1.5em", height: "1.5em", color: "lightgrey" }}
            />
          </LinkWrapper>
        )}
      </form>
      <div ref={scrollRef} />
      {/* dialog must be outside of map, otherwise funky thing happens */}
      <Dialog
        open={linkOpen}
        onClose={() => {
          setDialogLinkIndex(-1);
          handleLinkClose();
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogContent sx={{ paddingBottom: 1 }}>
          <DialogContentText>Edit the link text.</DialogContentText>
          <TextField
            required
            autoFocus
            margin="dense"
            id="url_text"
            // label="Message"
            value={
              dialogLinkIndex === -1
                ? ""
                : projectExt.links[dialogLinkIndex].url_text
            }
            fullWidth
            onChange={(e) => {
              handleOnChangeLink("url_text", e.target.value, dialogLinkIndex);
            }}
          />
        </DialogContent>
        <DialogContent>
          <DialogContentText>Edit the link URL.</DialogContentText>
          <TextField
            required
            margin="dense"
            id="url"
            multiline
            // label="Message"
            value={
              dialogLinkIndex === -1
                ? ""
                : projectExt.links[dialogLinkIndex].url
            }
            fullWidth
            onChange={(e) => {
              handleOnChangeLink("url", e.target.value, dialogLinkIndex);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DialogContentText sx={{ fontSize: "1.2em" }}>
            Update project info?
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            disabled={!isClickable}
            onClick={() => {
              handleSubmit();
              setIsEditing(!isEditing);
              handleConfirmClose();
            }}
          >
            Confirm
          </Button>
          <Button variant="contained" onClick={handleConfirmClose} autoFocus>
            Keep Editing
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamCommPanel;

const LinkWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  height: "4em",
  "&:hover": {
    cursor: "default",
  },
}));
