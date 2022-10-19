import {
  Autocomplete,
  Box,
  Button,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import cloneDeep from "lodash.clonedeep";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { GlobalContext } from "../Context/ShareContexts";
import {
  organizationTags,
  studentDepartmentStrList,
} from "../Reusable/MenuStringList";
import { DefaultTextField, getDocsByQueryFromDB } from "../Reusable/Resusable";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import stringSimilarity from "string-similarity";

const UserOrgCreate = (props) => {
  const handleUserSubmit = props.handleUserSubmit;
  const redirectTo = props.redirectTo;
  const userCreatedTags = props.userCreatedTags;

  // context & hooks
  const { currentUser } = useAuth();
  const { ediumUser, onMedia } = useContext(GlobalContext);

  // local vars
  const [isClickable, setIsClickable] = useState(true); // button state to prevent click spam

  const [newOrgUser, setNewOrgUser] = useState({
    name: "",
    create_timestamp: "",
    photo_url: currentUser?.photoURL || "",
    role: "org_admin",
  });

  const [newOrg, setNewOrg] = useState({
    title: "",
    department: "N/A",
    tags: [],
    create_timestamp: "",
    social_media: [""],
    logo_url: "",
    admin_uid: currentUser?.uid,
    representatives: [currentUser?.uid],
  });

  const [orgDocID, setOrgDocID] = useState("");

  const tagsOptions = useMemo(() => {
    return organizationTags.concat(userCreatedTags?.string_list).sort();
  }, [userCreatedTags?.string_list]);

  // update student data if ediumUser exists
  useEffect(() => {
    if (!ediumUser) return;

    // user
    const ediumUserRef = cloneDeep(ediumUser);
    setNewOrgUser(ediumUserRef);

    // org
    getDocsByQueryFromDB(
      "organizations",
      "admin_uid",
      "==",
      ediumUser.uid
    ).then((retArray) => {
      // each user can only create 1 org, thus retArray[0]
      const orgData = retArray[0].data;
      // check empty array
      if (!orgData?.social_media?.length) {
        orgData.social_media = [""];
      }
      setNewOrg(orgData);
      setOrgDocID(retArray[0].id);
    });
  }, [ediumUser]);

  const formRef = useRef();

  // helper func
  const handleRemoveSocialMedia = (index) => {
    let currentSocialMedia = newOrg.social_media;
    currentSocialMedia.splice(index, 1);
    setNewOrg({ ...newOrg, social_media: currentSocialMedia });
  };

  // submit org doc to organization collection
  const handleOrgSubmit = async () => {
    let orgRef = {
      ...newOrg,
      // remove empty entries
      tags: newOrg.tags.filter((ele) => ele),
      social_media: newOrg.social_media.filter((ele) => ele),
      last_timestamp: serverTimestamp(),
    };
    let orgModRef;
    if (orgDocID) {
      // update
      const docRef = doc(db, "organizations", orgDocID);
      orgModRef = updateDoc(docRef, orgRef).catch((error) => {
        console.log(error?.message);
      });
    } else {
      // create
      const collectionRef = collection(db, "organizations");
      orgRef = { ...orgRef, create_timestamp: serverTimestamp() };
      orgModRef = addDoc(collectionRef, orgRef).catch((error) => {
        console.log(error?.message);
      });
    }
    await orgModRef;
  };

  // submit new user created tags to user created list collection
  const handleUserCreatedTagsSubmit = async () => {
    const currentTags = newOrg.tags;
    const newTags = [];

    // traverse the list to see if the input is "unique"
    // !todo: find a better threshold, for now using 0.8
    // !todo: anyway to reduce calculation in the nested for loop?
    const curLen = currentTags.length;
    const optLen = tagsOptions.length;
    for (let i = 0; i < curLen; i++) {
      let isUnique = true;
      const currentTag = currentTags[i]?.toLowerCase();
      for (let j = 0; j < optLen; j++) {
        const similarity = stringSimilarity.compareTwoStrings(
          currentTag,
          tagsOptions[j]
        );
        if (similarity > 0.8) {
          isUnique = false;
          break;
        }
      }
      if (isUnique) newTags.push(currentTag);
    }

    // if submit to the shared list
    if (newTags.length) {
      const docRef = doc(db, "user_created_lists", "organization_tags");
      const updateRef = { string_list: arrayUnion(...newTags) };
      const modRef = updateDoc(docRef, updateRef).catch((error) => {
        console.log(error?.message);
      });
      await modRef;
    }
  };

  // update org tags in all projects if necessary
  const handleProjectTagsSubmit = () => {};

  const handleSubmit = () => {
    if (!isClickable) return;
    if (!formRef.current.reportValidity()) return;
    setIsClickable(false);

    handleUserSubmit(newOrgUser);
    handleOrgSubmit();
    handleUserCreatedTagsSubmit();
    redirectTo();
  };

  // reuseable comps
  const nameTextField = (
    <DefaultTextField
      required
      sx={
        onMedia.onDesktop
          ? { mr: 5, width: "75%", paddingY: 0 }
          : { width: "100%", mb: 5 }
      }
      label="Organization Title"
      margin="none"
      value={newOrg.title}
      onChange={(e) => {
        setNewOrg({ ...newOrg, title: e.target.value });
        setNewOrgUser({ ...newOrgUser, name: e.target.value + " Admin" });
      }}
    />
  );

  const departmentAutoComplete = (
    <Autocomplete
      sx={onMedia.onDesktop ? { width: "25%" } : { width: "100%" }}
      options={studentDepartmentStrList}
      value={newOrg.department}
      onChange={(event, newValue) => {
        setNewOrg({ ...newOrg, department: newValue });
      }}
      renderInput={(params) => (
        <DefaultTextField {...params} label="Department" required />
      )}
    />
  );

  const tagsAutoComplete = (
    <Autocomplete
      sx={{ width: "100%" }}
      freeSolo
      clearOnBlur
      multiple
      filterSelectedOptions
      options={tagsOptions}
      value={newOrg.tags}
      onChange={(event, newValue) => {
        setNewOrg({ ...newOrg, tags: newValue });
      }}
      renderInput={(params) => (
        <DefaultTextField
          {...params}
          label="Details"
          helperText="Tags to shortly describe the organization (e.g. mechanical, design, game dev, etc.)"
          required
          inputProps={{
            ...params.inputProps,
            required: newOrg.tags.length === 0,
          }}
        />
      )}
    />
  );

  return (
    <form ref={formRef}>
      {onMedia.onDesktop ? (
        <Box
          sx={{
            mt: 5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
          }}
        >
          {nameTextField}
          {departmentAutoComplete}
        </Box>
      ) : (
        <Box sx={{ mt: 5, display: "flex", flexDirection: "column" }}>
          {nameTextField}
          {departmentAutoComplete}
        </Box>
      )}
      <Box sx={{ mt: 5 }}>{tagsAutoComplete}</Box>
      {/* social media links list */}
      <Divider sx={{ my: 5 }}>
        <Typography sx={{ color: "gray" }}>Optional</Typography>
      </Divider>
      {newOrg.social_media.map((link, index) => {
        return (
          <Box
            key={index}
            display="flex"
            justifyContent="space-between"
            alignItems="start"
            sx={{ mt: 2.5 }}
          >
            <DefaultTextField
              fullWidth
              margin="none"
              label={"Website or Social Media URL #" + (index + 1)}
              helperText={index === 0 ? "Will be shown on your profile" : ""}
              type="url"
              value={link}
              onChange={(e) => {
                let cur_social_media = newOrg.social_media;
                cur_social_media[index] = e.target.value;
                setNewOrg({
                  ...newOrg,
                  social_media: cur_social_media,
                });
              }}
            />
            {/* Add / Remove buttons */}
            {index > 0 && (
              <IconButton
                sx={{ ml: 2.5, mt: "8px", backgroundColor: "#f0f0f0" }}
                onClick={() => {
                  handleRemoveSocialMedia(index);
                }}
              >
                <RemoveRoundedIcon />
              </IconButton>
            )}
            {index === newOrg.social_media.length - 1 && (
              <IconButton
                sx={{ ml: 2.5, mt: "8px", backgroundColor: "#f0f0f0" }}
                onClick={() => {
                  setNewOrg({
                    ...newOrg,
                    social_media: [...newOrg.social_media, ""],
                  });
                }}
              >
                <AddRoundedIcon />
              </IconButton>
            )}
          </Box>
        );
      })}
      <DefaultTextField
        sx={{ mt: 5 }}
        fullWidth
        margin="none"
        label={"Logo URL"}
        type="url"
        value={newOrg.logo_url}
        onChange={(e) => {
          setNewOrg({
            ...newOrg,
            logo_url: e.target.value,
          });
        }}
      />

      {/* Buttons */}
      <Box sx={{ display: "flex", justifyContent: "end" }}>
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
          disabled={!isClickable}
          onClick={() => {
            handleSubmit();
          }}
        >
          {"Confirm"}
        </Button>
      </Box>
    </form>
  );
};

export default UserOrgCreate;
