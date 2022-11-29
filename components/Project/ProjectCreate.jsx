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
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import UploadFileIcon from "@mui/icons-material/UploadFile";
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
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { db } from "../../firebase";
import { GlobalContext, ProjectContext } from "../Context/ShareContexts";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useRouter } from "next/router";
import {
  DefaultTextField,
  findItemFromList,
  handleDeleteEntry,
} from "../Reusable/Resusable";
import { useAuth } from "../Context/AuthContext";
import { projectTags, projectStrList } from "../Reusable/MenuStringList";
import TextEditor from "../TextEditor";
import moment from "moment/moment";

const ProjectCreate = (props) => {
  // context
  const { currentUser } = useAuth();
  const {
    projectsExt,
    ediumUser,
    ediumUserExt,
    oldProject,
    setOldProject,
    winHeight,
    onMedia,
  } = useContext(GlobalContext);
  const { showAlert } = useContext(ProjectContext);

  // props from push query
  const isCreate = useMemo(() => {
    return props.isCreateStr === "false" ? false : true; // null, undefined, "true" are all true isCreate
  }, [props.isCreateStr]);

  // local vars
  const [isClickable, setIsClickable] = useState(true); // button state to prevent click spam
  const router = useRouter();
  const formRef = useRef();
  const dateRef = useRef();
  const teamSizeRef = useRef();

  // Project State Initialization.
  // https://stackoverflow.com/questions/68945060/react-make-usestate-initial-value-conditional
  const currentTime = new Date();
  const emptyProject = {
    title: "",
    category: "",
    completion_date: "",
    max_member_count: 0, 
    tags: [],
    description: "",
    is_visible: true,
    icon_url: "",
    application_form_url: "",
    is_deleted: false,
  };
  const [newProject, setNewProject] = useState(() =>
    isCreate ? emptyProject : oldProject
  );

  const emptyPositionField = {
    id: Math.random().toString(16).slice(2),
    title: "",
    responsibility: "",
    weekly_hour: 1,
    count: 1,
    url: "",
  };
  const [positionFields, setPositionFields] = useState(() =>
    isCreate
      ? [emptyPositionField]
      : oldProject?.position_list?.length > 0
      ? oldProject.position_list
      : [emptyPositionField]
  );

  // details/tags
  // const tagsOptions = useMemo(() => {
  //   return organizationTags.concat(userCreatedTags?.string_list).sort();
  // }, [userCreatedTags?.string_list]);

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
  const [isCheckedAppForm, setIsCheckedAppForm] = useState(false);
  const [isCheckedCompDate, setIsCheckedCompDate] = useState(newProject.completion_date != "");
  const [isCheckedTeamSize, setIsCheckedTeamSize] = useState(false);
  useEffect(() => {
    if (isCreate) {
      // defalut to check the positions
      setIsCheckedPosition(true);
    } else {
      // update, checked value depends on oldProject
      if (oldProject?.position_list?.length > 0) {
        setIsCheckedPosition(true);
      }
      if (oldProject?.application_form_url?.length > 0) {
        setIsCheckedAppForm(true);
      }
      // if creator is admin, check if updating transferable project
      if (
        currentUser?.uid === "T5q6FqwJFcRTKxm11lu0zmaXl8x2" &&
        !ediumUserExt?.my_project_ids.includes(oldProject?.id)
      ) {
        setIsCheckedTransferable(true);
      }
    }
  }, [isCreate, oldProject, currentUser?.uid, ediumUserExt?.my_project_ids]);

  // helper functions
  const handleSubmit = async (e) => {
  
    if (!isClickable) return;
    if (!formRef.current.reportValidity()) return;

    // button is clickable & form is valid
    setIsClickable(false);

    // change field value into an int if not null
    let maxMemberCount = newProject.max_member_count
      ? parseInt(newProject.max_member_count)
      : null;

    // !yichen: don't auto calculate the team size, use this num as is.
    // if checked position, add number of positions to count
    // if (maxMemberCount && isCheckedPosition) {
    //   positionFields.forEach((position) => (maxMemberCount += position.count));
    // }

    let projectModRef; // ref to addDoc() or updateDoc()
    if (isCreate) {
      // create a new newProject
      const collectionRef = collection(db, "projects");
      let projectRef = {
        ...newProject,
        // update max num of members
        max_member_count: maxMemberCount,
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
        // update max num of members
        max_member_count: maxMemberCount,
        position_list: isCheckedPosition ? positionFields : [],
        application_form_url: isCheckedAppForm
          ? newProject.application_form_url
          : "",
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

    setOldProject(null);

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

    // change field value into an int if not null
    let maxMemberCount = newProject.max_member_count
      ? parseInt(newProject.max_member_count)
      : null;

    let projectModRef; // ref to addDoc() or updateDoc()
    if (isCreate) {
      // create a new newProject
      const collectionRef = collection(db, "projects");
      let projectRef = {
        ...newProject,
        // update max num of members
        max_member_count: maxMemberCount,
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
        // update max num of members
        max_member_count: maxMemberCount,
        position_list: isCheckedPosition ? positionFields : [],
        application_form_url: isCheckedAppForm
          ? newProject.application_form_url
          : "",
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

    setOldProject(null);

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
    setOldProject(null);

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

    setOldProject(null);

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
    let fieldValue =
      e.target.name === "weekly_hour" || e.target.name === "count"
        ? Number(e.target.value)
        : e.target.value;
    pFields[index][e.target.name] = fieldValue;
    setPositionFields(pFields);
  };

  const handleAddPosField = (index) => {
    setPositionFields([
      ...positionFields,
      {
        ...emptyPositionField,
        url: index >= 0 ? positionFields[index].url : "",
      },
    ]);
  };

  const handleRemovePosField = (index) => {
    const pFields = [...positionFields];
    pFields.splice(index, 1);
    setPositionFields(pFields);
  };

  const handleDateTimeChange = (e) => {
    setNewProject({
      ...newProject,
      completion_date: e?._d,
    });
  };

  const handleCompDateChange = (e) => {
    setIsCheckedCompDate(!isCheckedCompDate);
    if (isCheckedCompDate) {
       setNewProject({
         ...newProject,
         completion_date: "",
       });
    } else {
       setNewProject({
         ...newProject,
         completion_date: new Date(),
       });
    }
  };

  const handleTeamSizeChange = (e) => {
    setIsCheckedTeamSize(!isCheckedTeamSize);
    setNewProject({
      ...newProject,
      max_member_count: teamSizeRef.current.children[0].firstChild.value
    });
  };

  // new projects will get link from the project.url attribute, old projects will get from
  // project.application_form_url link
  const getAppLink = (index) => {
    // old project versions will have this attribute set to a url
    if (newProject.application_form_url !== "")
      return newProject.application_form_url;

    // get app link of previous position if possible
    if (index === 0) return positionFields[index].url;
    else {
      return positionFields[index - 1].url;
    }
  };

  // debugging console logs if there's any

  return (
    <Grid
      container
      spacing={0}
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundColor: "#fafafa",
        height: onMedia.onDesktop
          ? `calc(${winHeight}px - 64px)`
          : `calc(${winHeight}px - 48px - 60px)`,
        overflow: "auto",
      }}
    >
      <Grid
        item
        xs={onMedia.onDesktop ? 8 : 10}
        sx={{
          backgroundColor: "#ffffff",
          borderLeft: 1.5,
          borderRight: 1.5,
          borderColor: "#dbdbdb",
          paddingX: 3,
          minHeight: "100%",
        }}
      >
        <Typography
          sx={{
            display: "flex",
            justifyContent: "center",
            fontSize: "2em",
            fontWeight: "bold",
            mt: 5,
            mb: 5,
          }}
        >
          {isCreate ? "Create New Project" : "Update Project"}
        </Typography>
        {ediumUser?.uid === "T5q6FqwJFcRTKxm11lu0zmaXl8x2" && (
          <Box sx={{ mb: 5, display: "flex" }}>
            <Checkbox
              sx={{ mr: 1.5, color: "#dbdbdb", padding: 0 }}
              checked={isCheckedTransferable}
              onChange={() => {
                setIsCheckedTransferable(!isCheckedTransferable);
              }}
            />
            <Typography sx={{ color: "#f4511e", fontWeight: "bold" }}>
              {"ADMIN This is a transferable project"}
            </Typography>
          </Box>
        )}
        <form ref={formRef}>
          {/* Title textfield & Upload logo button */}
          <Box display="flex" justifyContent="space-between" alignItems="start">
            <DefaultTextField
              sx={{ mr: 5 }}
              required
              fullWidth
              label="Project Title"
              margin="none"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
            />
            <Button
              sx={{
                backgroundColor: "#f0f0f0",
                border: 1.5,
                borderRadius: "10px",
                borderColor: "#dbdbdb",
                color: "rgba(0, 0, 0, 0.6)",
                height: "56px",
                textTransform: "none",
                width: "15%",
                paddingLeft: "30px",
              }}
              // variant="contained"
              disableElevation
              onClick={handleDialogOpen}
            >
              <UploadFileIcon sx={{ position: "absolute", left: "5%" }} />
              <Typography>{"Logo"}</Typography>
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

          {/* Category select & completion date*/}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="start"
            sx={{ mt: 5 }}
          >
            <FormControl
              required
              fullWidth
              sx={{
                mr: 5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: "#f0f0f0",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: 1.5,
                  borderColor: "#dbdbdb",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: 1.5,
                  borderColor: "#dbdbdb",
                },
                ".MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    border: 1.5,
                    borderColor: "#3e95c2",
                  },
              }}
            >
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                value={newProject.category}
                onChange={(e) =>
                  setNewProject({ ...newProject, category: e.target.value })
                }
              >
                {projectStrList.map((projectStr, index) => {
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
                {"A general category of your project"}
              </FormHelperText>
            </FormControl>

            {/* completion date container */}
            <Box display="flex" flexDirection="column">
              {/* date and checkbox */}
              <Box
                display="flex"
                justifyContent="center"
                alignContent="center"
                gap="10%"
              >
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DesktopDatePicker
                    ref={dateRef}
                    renderInput={(props) => {
                      return (
                        <DefaultTextField
                          sx={{
                            width: onMedia.onDesktop ? "175px" : "100px",
                          }}
                          {...props}
                          required={true}
                          disabled={!isCheckedCompDate}
                        />
                      );
                    }}
                    // label="Completion Date"
                    disabled={!isCheckedCompDate}
                    border="none"
                    value={newProject.completion_date}
                    onChange={(e) => {
                      handleDateTimeChange(e);
                    }}
                  />
                </LocalizationProvider>
                <Checkbox
                  sx={{ mr: 1.5, color: "#dbdbdb", padding: 0 }}
                  checked={isCheckedCompDate}
                  onChange={handleCompDateChange}
                />
              </Box>
              <FormHelperText
                sx={{ color: "lightgray", fontSize: "12px", ml: 1 }}
              >
                {"Completion Date"}
              </FormHelperText>
            </Box>
          </Box>

          {/* tags and total team size */}
          <Box
            display="flex"
            alignItems="start"
            sx={{
              mt: 5,
              mb: 5,
            }}
          >
            {/* <DefaultTextField
              sx={{ mr: 5 }}
              fullWidth
              label="Details"
              margin="none"
              helperText="Keywords to shortly describe the new project seperated by commas (e.g. tags)"
              value={newProject.details}
              onChange={(e) =>
                setNewProject({ ...newProject, details: e.target.value })
              }
            /> */}
            <Autocomplete
              sx={{ mr: 5 }}
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
                  label="Details"
                  helperText="Keywords to shortly describe the new project (e.g. tags)"
                  required
                  inputProps={{
                    ...params.inputProps,
                    required: newProject?.tags?.length === 0,
                  }}
                />
              )}
            />

            {/* Team Size container */}
            <Box display="flex" flexDirection="column">
              {/* Size and checkbox */}
              <Box
                display="flex"
                justifyContent="center"
                alignContent="center"
                gap="10%"
                // sx={{
                //   ml: 8,
                //   border: "solid red 2px"
                // }}
              >
                <DefaultTextField
                  sx={{
                    width: onMedia.onDesktop ? "175px" : "100px",
                  }}
                  ref={teamSizeRef}
                  fullWidth
                  // label="Team Size"
                  type="number"
                  margin="none"
                  disabled={!isCheckedTeamSize}
                  value={
                    newProject.max_member_count
                      ? newProject.max_member_count
                      : ""
                  }
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      max_member_count: e.target.value,
                    })
                  }
                />
                <Checkbox
                  sx={{ mr: 1.5, color: "#dbdbdb", padding: 0 }}
                  checked={isCheckedTeamSize}
                  onChange={handleTeamSizeChange}
                />
              </Box>
              <FormHelperText
                sx={{ color: "lightgray", fontSize: "12px", ml: 1 }}
              >
                {"Team Size"}
              </FormHelperText>
            </Box>
          </Box>

          <TextEditor update={setNewProject} project={newProject} />
          <FormHelperText sx={{ color: "lightgray", fontSize: "12px", ml: 1 }}>
            {
              "A brief description of the new project (e.g. scope, mission, work format, timeline) *"
            }
          </FormHelperText>
          <Box
            sx={{
              mt: 5,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Checkbox
              sx={{ mr: 1.5, color: "#dbdbdb", padding: 0 }}
              checked={isCheckedPosition}
              onChange={() => {
                setIsCheckedPosition(!isCheckedPosition);
              }}
            />
            <Typography sx={{ color: "rgba(0,0,0,0.6)" }}>
              {"I want to add positions"}
            </Typography>
          </Box>
          {/* firebase dynamic array: http://y2u.be/zgKH12s_95A */}
          {isCheckedPosition &&
            positionFields.map((positionField, index) => {
              return (
                <div key={index}>
                  <Divider
                    sx={{
                      mt: 2.5,
                      borderBottomWidth: 1.5,
                      borderColor: "#dbdbdb",
                    }}
                  />
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={2.5}
                  >
                    {/* Title */}
                    <DefaultTextField
                      required
                      sx={{ mr: 2.5 }}
                      fullWidth
                      margin="none"
                      name="title" // has to be the same as key
                      label="Position Title"
                      value={positionField.title}
                      onChange={(e) => {
                        handlePosInputChange(index, e);
                      }}
                    />
                    {/* Weekly hour */}
                    <DefaultTextField
                      required
                      sx={{ mr: 2.5 }}
                      margin="none"
                      type="number"
                      name="weekly_hour" // has to be the same as key
                      label="Weekly Hour"
                      inputProps={{
                        min: 1,
                      }}
                      value={positionField.weekly_hour}
                      onChange={(e) => {
                        e.target.value > 1
                          ? e.target.value
                          : (e.target.value = 1);
                        handlePosInputChange(index, e);
                      }}
                    />
                    {/* Number of people */}
                    <DefaultTextField
                      required
                      margin="none"
                      type="number"
                      name="count" // has to be the same as key
                      label="NO. of People"
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
                    />
                    {/* Add / Remove position button */}
                    {index > 0 && (
                      <IconButton
                        sx={{ ml: 2.5, backgroundColor: "#f0f0f0" }}
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
                    mt={2.5}
                  >
                    {/* Responsibilities */}
                    <DefaultTextField
                      fullWidth
                      required
                      multiline
                      minRows={2}
                      maxRows={8}
                      margin="none"
                      name="responsibility"
                      label="Responsibilities & Qualifications"
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
                    mt={2.5}
                  >
                    <DefaultTextField
                      fullWidth
                      margin="none"
                      name="url"
                      label="Application Form Link"
                      defaultValue={getAppLink(index)}
                      onChange={(e) => handlePosInputChange(index, e)}
                    />
                  </Box>
                </div>
              );
            })}
          {/* add button */}
          {isCheckedPosition && (
            <Box
              sx={{
                mt: 5,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconButton
                sx={{
                  width: "12%",
                  borderRadius: "30px",
                  border: 1.5,
                  borderColor: "#dbdbdb",
                  backgroundColor: "#fafafa",
                  color: "black",
                }}
                onClick={() => handleAddPosField(positionFields.length - 1)}
              >
                <AddRoundedIcon />
              </IconButton>
            </Box>
          )}

          {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {!isCreate && (
              <Button
                sx={{
                  mt: 5,
                  mb: 5,
                  border: 1.5,
                  borderColor: "#dbdbdb",
                  borderRadius: "30px",
                  backgroundColor: "#3e95c2",
                  textTransform: "none",
                  paddingX: 5,
                }}
                variant="contained"
                disableElevation
                disabled={!isClickable || !ediumUser?.uid}
                onClick={() => handleDelete(newProject.id)}
              >
                {"Delete"}
              </Button>
            )}
            <Box sx={{ flexGrow: 1 }} />
            {/* <Button
              sx={{ mt: 5, mb: 5, backgroundColor: "#3e95c2" }}
              variant="contained"
              disableElevation
              onClick={(e) => handleGoBack(e)}
            >
              {"Go Back"}
            </Button> */}
            <Button
              sx={{
                mt: 5,
                ml: 2.5,
                mb: 5,
                border: 1.5,
                borderColor: "#dbdbdb",
                borderRadius: "30px",
                backgroundColor: "#fafafa",
                color: "black",
                textTransform: "none",
                paddingX: 5,
              }}
              variant="contained"
              disableElevation
              disabled={!isClickable || !ediumUser?.uid}
              onClick={(e) => handleDiscard(e)}
            >
              {"Discard"}
            </Button>

            <Button
              sx={{
                mt: 5,
                ml: 2.5,
                mb: 5,
                border: 1.5,
                borderColor: "#dbdbdb",
                borderRadius: "30px",
                backgroundColor: "#3e95c2",
                textTransform: "none",
                paddingX: 5,
              }}
              variant="contained"
              disableElevation
              disabled={!isClickable || !ediumUser?.uid}
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
            >
              {"Confirm"}
            </Button>
          </Box>
        </form>
      </Grid>
    </Grid>
  );
};

export default ProjectCreate;
