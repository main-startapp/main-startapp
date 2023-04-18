// react
import { useContext, useEffect, useRef, useState } from "react";
// mui
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormHelperText,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddLinkIcon from "@mui/icons-material/AddLink";
// firebase
import {
  collection,
  doc,
  addDoc,
  serverTimestamp,
  updateDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
// edium
import { db } from "../../firebase";
import { useAuth } from "../Context/AuthContext";
import { GlobalContext, ProjectContext } from "../Context/ShareContexts";
import {
  DefaultFormControl,
  DefaultTextField,
  findItemFromList,
  FixedHeightPaper,
  handleDeleteEntry,
} from "../Reusable/Resusable";
import {
  projectTags,
  typeStrList,
  categoryStrList,
} from "../Reusable/MenuStringList";
import { StyledDateTimeField } from "../Event/EventCreate";
import TextEditor from "../TextEditor";
// next
import { useRouter } from "next/router";
import dayjs from "dayjs";

// comp
const ProjectCreate = (props) => {
  // context
  const { currentUser } = useAuth();
  const { projects, projectsExt, ediumUser, ediumUserExt, onMedia } =
    useContext(GlobalContext);
  const { showAlert } = useContext(ProjectContext);
  const router = useRouter();
  const formRef = useRef();
  const theme = useTheme();

  // click spam
  const [isClickable, setIsClickable] = useState(true); // button state to prevent click spam

  // can be wrapped up in useMemo if necessary, no premature optimization
  const oldProject = props.projectID
    ? findItemFromList(projects, "id", props.projectID)
    : null;

  // init new project
  // Project State Initialization.
  // https://stackoverflow.com/questions/68945060/react-make-usestate-initial-value-conditional
  const emptyProject = {
    title: "",
    icon_url: "",
    category: "",
    type: "",
    tags: [],
    short_description: "",
    description: "",
    is_visible: true,
    is_deleted: false,
  };
  const [newProject, setNewProject] = useState(() =>
    oldProject ? oldProject : emptyProject
  );

  // init new position fields
  const emptyPositionField = {
    id: Math.random().toString(16).slice(2),
    title: "",
    weekly_hour: "",
    count: "",
    responsibility: "",
    url: "",
    deadline: null,
  };
  const [positionFields, setPositionFields] = useState(() =>
    oldProject?.position_list?.length > 0
      ? oldProject.position_list
      : [emptyPositionField]
  );

  // upload-icon dialog modal
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  // check box
  const [isCheckedTransferable, setIsCheckedTransferable] = useState(false);
  const [isCheckedPosition, setIsCheckedPosition] = useState(false);
  const [showDescOverlay, setShowDescOverlay] = useState(true);

  useEffect(() => {
    if (!oldProject) {
      // create: defalut to check the positions
      setIsCheckedPosition(true);
      // if admin, check transfer project by default
      if (currentUser?.uid === "T5q6FqwJFcRTKxm11lu0zmaXl8x2")
        setIsCheckedTransferable(true);
    } else {
      // update: checked value depends on oldProject
      if (oldProject?.position_list?.length > 0) {
        setIsCheckedPosition(true);
      }
      // if creator is admin, check if updating transferable project
      if (
        currentUser?.uid === "T5q6FqwJFcRTKxm11lu0zmaXl8x2" &&
        !ediumUserExt?.my_project_ids?.includes(oldProject?.id)
      ) {
        setIsCheckedTransferable(true);
      }
    }
  }, [currentUser?.uid, ediumUserExt?.my_project_ids, oldProject]);

  // helper functions
  const handleSubmit = async (e) => {
    if (!isClickable) return;
    if (!formRef.current.reportValidity()) return;

    // button is clickable & form is valid
    setIsClickable(false);

    let projectModRef; // ref to addDoc() or updateDoc()
    if (!oldProject) {
      // create a new project
      const collectionRef = collection(db, "projects");
      let projectRef = {
        ...newProject,
        position_list: isCheckedPosition ? positionFields : [],
        creator_uid: ediumUser?.uid,
        create_timestamp: serverTimestamp(),
        last_timestamp: serverTimestamp(),
      };
      projectModRef = addDoc(collectionRef, projectRef).catch((error) => {
        console.log(error?.message);
      });
    } else {
      // update an existing project
      // since all changes are in newProject, can't just update partially
      const docRef = doc(db, "projects", newProject.id);
      const projectRef = {
        ...newProject,
        position_list: isCheckedPosition ? positionFields : [],
        last_timestamp: serverTimestamp(),
      };
      delete projectRef.id;
      projectModRef = updateDoc(docRef, projectRef).catch((error) => {
        console.log(error?.message);
      });
    }

    let retID;
    await projectModRef.then((ret) => {
      retID = ret?.id;
    });

    // retID: create; !retID: update
    if (retID) {
      // add to my_project_ids in user ext data if create
      const ediumUserExtDocRef = doc(db, "users_ext", ediumUser?.uid);
      const ediumUserExtUpdateRef = {
        my_project_ids: arrayUnion(retID),
        last_timestamp: serverTimestamp(),
      };
      const ediumUserExtModRef = updateDoc(
        ediumUserExtDocRef,
        ediumUserExtUpdateRef
      ).catch((error) => {
        console.log(error?.message);
      });

      // create extension doc for team management if create
      const extDocRef = doc(db, "projects_ext", retID);
      const projectExtRef = {
        is_deleted: false,
        members: [ediumUser?.uid],
        admins: [ediumUser?.uid],
        last_timestamp: serverTimestamp(),
      };
      const projectExtModRef = setDoc(extDocRef, projectExtRef).catch(
        (error) => {
          console.log(error?.message);
        }
      );

      await ediumUserExtModRef;
      await projectExtModRef;
    }

    // !todo: since updateDoc return Promise<void>, we need other method to check the results
    showAlert(
      "success",
      `"${newProject.title}" is updated successfully! Navigate to Projects page.`
    );

    setTimeout(() => {
      router.push(`/`); // can be customized
    }, 2000); // wait 2 seconds then go to `projects` page
  };

  const handleSubmitTransferable = async () => {
    if (!isClickable) return;
    if (!formRef.current.reportValidity()) return;

    // button is clickable & form is valid
    setIsClickable(false);

    let projectModRef; // ref to addDoc() or updateDoc()
    if (!oldProject) {
      // create a new newProject
      const collectionRef = collection(db, "projects");
      let projectRef = {
        ...newProject,
        position_list: isCheckedPosition ? positionFields : [],
        creator_uid: ediumUser?.uid,
        create_timestamp: serverTimestamp(),
        last_timestamp: serverTimestamp(),
      };
      projectModRef = addDoc(collectionRef, projectRef).catch((error) => {
        console.log(error?.message);
      });
    } else {
      // update an existing newProject
      // since all changes are in newProject, can't just update partially
      const docRef = doc(db, "projects", newProject.id);
      const projectRef = {
        ...newProject,
        position_list: isCheckedPosition ? positionFields : [],
        last_timestamp: serverTimestamp(),
      };
      delete projectRef.id;
      projectModRef = updateDoc(docRef, projectRef).catch((error) => {
        console.log(error?.message);
      });
    }

    let retID;
    await projectModRef.then((ret) => {
      retID = ret?.id;
    });

    // retID: create; !retID: update
    if (retID) {
      // don't add project id to my_project_ids
      // do create extenion doc with extra field
      const extDocRef = doc(db, "projects_ext", retID);
      const projectExtRef = {
        is_deleted: false,
        members: [ediumUser?.uid],
        admins: [ediumUser?.uid],
        last_timestamp: serverTimestamp(),
        transfer_code: Math.random().toString(16).slice(2),
      };
      const projectExtModRef = setDoc(extDocRef, projectExtRef).catch(
        (error) => {
          console.log(error?.message);
        }
      );

      await projectExtModRef;
    } else {
      // update a project to transferable
      // remove ids from my project list
      const project_ids = ediumUserExt?.my_project_ids;
      if (project_ids.find((project_id) => project_id === oldProject.id)) {
        const ediumUserExtDocRef = doc(db, "users_ext", ediumUser?.uid);
        const ediumUserExtUpdateRef = {
          my_project_ids: arrayRemove(oldProject.id),
          last_timestamp: serverTimestamp(),
        };
        const ediumUserExtModRef = updateDoc(
          ediumUserExtDocRef,
          ediumUserExtUpdateRef
        ).catch((error) => {
          console.log(error?.message);
        });
        await ediumUserExtModRef;
      }
      // add transfer code
      const projectExt = findItemFromList(projectsExt, "id", oldProject.id);
      if (!projectExt.transfer_code) {
        const extDocRef = doc(db, "projects_ext", oldProject.id);
        const projectExtRef = {
          last_timestamp: serverTimestamp(),
          transfer_code: Math.random().toString(16).slice(2),
        };
        const projectExtModRef = updateDoc(extDocRef, projectExtRef).catch(
          (error) => {
            console.log(error?.message);
          }
        );
        await projectExtModRef;
      }
    }

    // !todo: since updateDoc return Promise<void>, we need other method to check the results
    showAlert(
      "success",
      `"${newProject.title}" is updated successfully! Navigate to Projects page.`
    );

    setTimeout(() => {
      router.push(`/`); // can be customized
    }, 2000); // wait 2 seconds then go to `projects` page
  };

  // clean the current page's state and redirect to Projects page
  const handleDiscard = () => {
    showAlert("info", `Draft discarded! Navigate to Projects page.`);

    setTimeout(() => {
      router.push(`/`); // can be customized
    }, 2000); // wait 2 seconds then go to `projects` page
  };

  // call deleteEntry BE function
  const handleDelete = (docID) => {
    handleDeleteEntry(
      "projects",
      "projects_ext",
      "my_project_ids",
      docID,
      ediumUser?.uid
    );

    showAlert(
      "success",
      `"${newProject.title}" is deleted sucessfully! Navigate to Projects page.`
    );

    setTimeout(() => {
      router.push(`/`); // can be customized
    }, 2000); // wait 2 seconds then go to `projects` page
  };

  const handlePosInputChange = (index, e) => {
    let pFields = [...positionFields];
    let fieldValue;
    switch (e.target.name) {
      case "weekly_hour":
      case "count":
        fieldValue = Number(e.target.value);
        break;
      default:
        fieldValue = e.target.value;
    }
    pFields[index][e.target.name] = fieldValue;
    setPositionFields(pFields);
  };

  const handleAddPosField = (index) => {
    setPositionFields([
      ...positionFields,
      {
        ...emptyPositionField,
      },
    ]);
  };

  const handleRemovePosField = (index) => {
    const pFields = [...positionFields];
    pFields.splice(index, 1);
    setPositionFields(pFields);
  };

  return (
    <FixedHeightPaper
      elevation={onMedia.onDesktop ? 2 : 0}
      isdesktop={onMedia.onDesktop ? 1 : 0}
      mobileheight={0}
      sx={{
        paddingTop: onMedia.onDesktop ? "32px" : 0,
      }}
    >
      <Box
        id="projectcreate-box"
        sx={{
          flexGrow: 1,
          position: "relative",
          overflowX: "hidden",
          overflowY: "scroll",
          //paddingTop: onMedia.onDesktop ? 2 : 2, // align with project list
          paddingBottom: onMedia.onDesktop ? 8 : 4, // enough space for messages
          paddingLeft: onMedia.onDesktop ? 4 : 2,
          paddingRight: onMedia.onDesktop
            ? `calc(${theme.spacing(4)} - 0.4rem)`
            : 2, // onDesktop: scrollbar
        }}
      >
        <Typography
          sx={{
            display: "flex",
            justifyContent: "center",
            fontSize: "2rem",
            fontWeight: "bold",
            mt: 4,
            mb: 8,
          }}
        >
          {oldProject ? "Update Project" : "Create New Project"}
        </Typography>
        {currentUser?.uid === "T5q6FqwJFcRTKxm11lu0zmaXl8x2" && (
          <Box sx={{ mb: 4, display: "flex" }}>
            <Typography sx={{ color: "adminOrange.main", fontWeight: "bold" }}>
              {"This is a transferable project"}
            </Typography>
            <Checkbox
              checked={isCheckedTransferable}
              onChange={() => {
                setIsCheckedTransferable(!isCheckedTransferable);
              }}
              sx={{ ml: 2, color: "gray500.main", padding: 0 }}
            />
          </Box>
        )}
        <form ref={formRef}>
          {/* Title textfield & Upload logo button */}
          <Box display="flex" justifyContent="space-between" alignItems="start">
            <DefaultTextField
              required
              fullWidth
              label="Project Title"
              helperText="Name of your project/club/organization"
              margin="none"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
            />

            <Button
              sx={{
                ml: 4,
                color: newProject.icon_url ? "text.primary" : "gray500.main",
                backgroundColor: "#f0f0f0",
                borderRadius: 2,
                height: "56px",
                textTransform: "none",
                width: "50%",
                maxWidth: "112px",
                border: "none",
                padding: "16.5px 14px",
                display: "flex",
                justifyContent: "space-between",
              }}
              // variant="contained"
              disableElevation
              onClick={handleDialogOpen}
            >
              <Typography
                sx={{
                  fontWeight: "medium",
                  fontSize: "16px",
                }}
              >
                {"Logo"}
              </Typography>
              <AddLinkIcon sx={{ fontSize: "24px", fontWeight: "medium" }} />
            </Button>
            <Dialog
              open={isDialogOpen}
              onClose={handleDialogClose}
              fullWidth
              maxWidth="md"
            >
              <DialogTitle>Upload Logo from URL</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {"Please enter the URL of your icon here. "}
                  <Link
                    target="_blank"
                    href={"https://imgur.com/upload"}
                    rel="noreferrer"
                  >
                    Imgur
                  </Link>
                  {" is a good image hosting service to start with."}
                  <br />
                  {
                    "After uploaded your icon, hover the image, click Copy Link and paste it here."
                  }
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Icon URL"
                  type="url"
                  fullWidth
                  variant="standard"
                  value={newProject.icon_url}
                  onChange={(e) => {
                    let url = e.target.value;
                    if (url.includes("https://imgur.com/")) {
                      url = url
                        .replace("https://imgur.com/", "https://i.imgur.com/")
                        .concat(".png");
                    }
                    setNewProject({
                      ...newProject,
                      icon_url: url,
                    });
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose}>Confirm</Button>
              </DialogActions>
            </Dialog>
          </Box>

          {/* Category select & type select*/}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="start"
            sx={{ mt: 4 }}
          >
            {/* Category Container */}
            <DefaultFormControl required fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                value={newProject.category}
                onChange={(e) =>
                  setNewProject({ ...newProject, category: e.target.value })
                }
              >
                {categoryStrList?.map((projectStr, index) => {
                  return (
                    <MenuItem key={index} value={projectStr}>
                      {projectStr}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText
                id="projectcreate-category-helper-text"
                sx={{ color: "lightgray", fontSize: "12px" }}
              >
                {"General category of your project"}
              </FormHelperText>
            </DefaultFormControl>

            {/* Type Container */}
            <DefaultFormControl
              required
              fullWidth
              sx={{
                ml: 4,
              }}
            >
              <InputLabel>Type</InputLabel>
              <Select
                label="Type"
                value={newProject.type}
                onChange={(e) =>
                  setNewProject({ ...newProject, type: e.target.value })
                }
              >
                {typeStrList?.map((projectStr, index) => {
                  // need to change typeStrList to typeStrList
                  return (
                    <MenuItem key={index} value={projectStr}>
                      {projectStr}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText
                id="projectcreate-type-helper-text"
                sx={{ color: "lightgray", fontSize: "12px" }}
              >
                {"General type of your project"}
              </FormHelperText>
            </DefaultFormControl>
          </Box>

          {/* tags */}
          <Box
            display="flex"
            alignItems="start"
            sx={{
              mt: 4,
            }}
          >
            {/* Details */}
            <Autocomplete
              fullWidth
              freeSolo
              clearOnBlur
              multiple
              filterSelectedOptions
              options={projectTags}
              value={newProject?.tags}
              onChange={(event, newValue) => {
                setNewProject({ ...newProject, tags: newValue });
              }}
              renderInput={(params) => (
                <DefaultTextField
                  {...params}
                  required
                  inputProps={{
                    ...params.inputProps,
                    required: newProject?.tags?.length === 0,
                  }}
                  label="Details"
                  helperText="Keywords to shortly describe the new project (e.g. tags)"
                />
              )}
            />
          </Box>

          {/* Short description */}
          <DefaultTextField
            required
            fullWidth
            label="Short Description"
            helperText="One sentence description of your project"
            value={newProject.short_description}
            onChange={(e) =>
              setNewProject({
                ...newProject,
                short_description: e.target.value,
              })
            }
            sx={{ mt: 4, mb: 4 }}
          />

          {/* Description */}
          <TextEditor
            update={setNewProject}
            project={newProject}
            overlay={showDescOverlay}
            showOverlay={setShowDescOverlay}
          />
          <FormHelperText
            sx={{ color: "lightgray", fontSize: "12px", mx: "14px", mt: "3px" }}
          >
            {
              "A brief description of the new project (e.g. scope, mission, work format, timeline) *"
            }
          </FormHelperText>

          {/* Positions */}
          <Box
            sx={{
              mt: 4,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Typography color="gray500.main">
              {"I want to add positions"}
            </Typography>
            <Checkbox
              checked={isCheckedPosition}
              onChange={() => {
                setIsCheckedPosition(!isCheckedPosition);
              }}
              sx={{ ml: 2, color: "gray500.main", padding: 0 }}
            />
          </Box>
          {/* firebase dynamic array: http://y2u.be/zgKH12s_95A */}
          {isCheckedPosition &&
            positionFields?.map((positionField, index) => {
              return (
                <Box key={index}>
                  <Divider
                    sx={{
                      mt: 4,
                      mb: 4,
                      borderBottomWidth: 1,
                      borderColor: "divider",
                    }}
                  />
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    {/* Title */}
                    <DefaultTextField
                      required
                      fullWidth
                      name="title" // has to be the same as key
                      label="Position Title"
                      value={positionField.title}
                      onChange={(e) => {
                        handlePosInputChange(index, e);
                      }}
                    />
                    {/* Weekly hour */}
                    <DefaultTextField
                      sx={{ ml: 2, minWidth: "20%" }}
                      required
                      type="number"
                      name="weekly_hour" // has to be the same as key
                      label="Weekly Hour"
                      value={positionField.weekly_hour}
                      onChange={(e) => {
                        e.target.value > 1
                          ? e.target.value
                          : (e.target.value = 1);
                        handlePosInputChange(index, e);
                      }}
                      inputProps={{
                        min: 1,
                      }}
                    />

                    {/* Number of people */}
                    <DefaultTextField
                      required
                      type="number"
                      name="count" // has to be the same as key
                      label="Pos. Count"
                      inputProps={{
                        min: 1,
                      }}
                      value={positionField.count}
                      onChange={(e) => {
                        e.target.value > 1
                          ? e.target.value
                          : (e.target.value = 1);
                        handlePosInputChange(index, e);
                      }}
                      sx={{ ml: 2, minWidth: "20%" }}
                    />
                    {/* Add / Remove position button */}
                    {index > 0 && (
                      <IconButton
                        sx={{
                          ml: 2,
                          backgroundColor: "secondary.main",
                          ":hover": { backgroundColor: "secondary.dark" },
                        }}
                        onClick={() => handleRemovePosField(index)}
                      >
                        <RemoveRoundedIcon />
                      </IconButton>
                    )}
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mt: 2 }}
                  >
                    {/* Responsibilities */}
                    <DefaultTextField
                      required
                      fullWidth
                      multiline
                      minRows={2}
                      maxRows={8}
                      name="responsibility"
                      label="Role Description"
                      value={positionField.responsibility}
                      onChange={(e) => {
                        handlePosInputChange(index, e);
                      }}
                    />
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mt: 2 }}
                  >
                    <DefaultTextField
                      fullWidth
                      type="url"
                      name="url"
                      label="Application Form URL"
                      value={positionField.url}
                      onChange={(e) => {
                        handlePosInputChange(index, e);
                      }}
                    />
                    {/* Application deadline container */}

                    <StyledDateTimeField
                      // inputRef={focusState === "datetime" ? focusRef : null}
                      sx={{ ml: 2, width: "50%" }}
                      required
                      name="deadline"
                      label="Application Deadline"
                      value={
                        positionField.deadline
                          ? dayjs(positionField.deadline)
                          : null
                      }
                      onChange={(newValue) => {
                        let pFields = [...positionFields];
                        pFields[index]["deadline"] = newValue?.toDate();
                        setPositionFields(pFields);
                      }}
                      // onKeyDown={(e) => {
                      //   if (e.key === "Enter") {
                      //     updateFocus("duration");
                      //   }
                      // }}
                    />
                  </Box>
                </Box>
              );
            })}
          {/* add button */}
          {isCheckedPosition && (
            <>
              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconButton
                  sx={{
                    width: "128px",
                    borderRadius: 8,
                    backgroundColor: "secondary.main",
                    ":hover": { backgroundColor: "secondary.dark" },
                  }}
                  onClick={() => handleAddPosField(positionFields?.length - 1)}
                >
                  <AddRoundedIcon />
                </IconButton>
              </Box>
              <Divider
                sx={{
                  mt: 4,
                  borderBottomWidth: 1,
                  borderColor: "divider",
                }}
              />
            </>
          )}

          {/* Buttons */}
          <Box sx={{ mt: 8, display: "flex", justifyContent: "space-between" }}>
            {oldProject && (
              <Button
                color="primary"
                disabled={!isClickable || !ediumUser?.uid}
                disableElevation
                variant="contained"
                onClick={() => handleDelete(newProject.id)}
                sx={{
                  width: "128px",
                  height: "32px",
                  borderRadius: 8,
                }}
              >
                {"Delete"}
              </Button>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Button
              color="primary"
              disabled={!isClickable || !ediumUser?.uid}
              disableElevation
              variant="outlined"
              onClick={(e) => handleDiscard(e)}
              sx={{
                ml: onMedia.onDesktop ? 4 : 2,
                width: "128px",
                height: "32px",
                borderRadius: 8,
              }}
            >
              {"Discard"}
            </Button>

            <Button
              color="primary"
              disabled={!isClickable || !ediumUser?.uid}
              disableElevation
              variant="contained"
              onClick={(e) => {
                if (
                  currentUser?.uid === "T5q6FqwJFcRTKxm11lu0zmaXl8x2" &&
                  isCheckedTransferable
                ) {
                  handleSubmitTransferable(e);
                } else {
                  handleSubmit(e);
                }
              }}
              sx={{
                ml: onMedia.onDesktop ? 4 : 2,
                width: "128px",
                height: "32px",
                borderRadius: 8,
              }}
            >
              {"Confirm"}
            </Button>
          </Box>
        </form>
      </Box>
    </FixedHeightPaper>
  );
};

export default ProjectCreate;
