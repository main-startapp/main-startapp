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
import { DefaultTextField } from "../Reusable/Resusable";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
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
    role: "org_admin",
    org_title: "",
    org_department: "N/A",
    org_tags: [],
    org_social_media: [""],
    org_logo_url: "",
    org_agents: [],
  });

  const tagsOptions = useMemo(() => {
    return organizationTags.concat(userCreatedTags?.string_list).sort();
  }, [userCreatedTags?.string_list]);

  // update student data if ediumUser exists
  useEffect(() => {
    if (!ediumUser) return;

    // user
    const ediumUserRef = cloneDeep(ediumUser);
    setNewOrgUser(ediumUserRef);
  }, [ediumUser]);

  const formRef = useRef();

  // helper func
  const handleRemoveSocialMedia = (index) => {
    let currentSocialMedia = newOrgUser.org_social_media;
    currentSocialMedia.splice(index, 1);
    setNewOrgUser({ ...newOrgUser, org_social_media: currentSocialMedia });
  };

  // submit new user created tags to user created list collection
  const handleUserCreatedTagsSubmit = async () => {
    const currentTags = newOrgUser.org_tags;
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

  const handleSubmit = () => {
    if (!isClickable) return;
    if (!formRef.current.reportValidity()) return;
    setIsClickable(false);

    const orgUserRef = {
      ...newOrgUser,
      // remove empty entries
      org_social_media: newOrgUser.org_social_media.filter((ele) => ele),
    };
    handleUserSubmit(orgUserRef);
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
      value={newOrgUser.org_title}
      onChange={(e) => {
        setNewOrgUser({
          ...newOrgUser,
          org_title: e.target.value,
          name: e.target.value + " Admin",
        });
      }}
    />
  );

  const departmentAutoComplete = (
    <Autocomplete
      sx={onMedia.onDesktop ? { width: "25%" } : { width: "100%" }}
      options={studentDepartmentStrList}
      value={newOrgUser.org_department}
      onChange={(event, newValue) => {
        setNewOrgUser({ ...newOrgUser, org_department: newValue });
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
      value={newOrgUser.org_tags}
      onChange={(event, newValue) => {
        setNewOrgUser({ ...newOrgUser, org_tags: newValue });
      }}
      renderInput={(params) => (
        <DefaultTextField
          {...params}
          label="Details"
          helperText="Tags to shortly describe the organization (e.g. mechanical, design, game dev, etc.)"
          required
          inputProps={{
            ...params.inputProps,
            required: newOrgUser.org_tags.length === 0,
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
      {newOrgUser.org_social_media.map((link, index) => {
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
                let cur_social_media = newOrgUser.org_social_media;
                cur_social_media[index] = e.target.value;
                setNewOrgUser({
                  ...newOrgUser,
                  org_social_media: cur_social_media,
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
            {index === newOrgUser.org_social_media.length - 1 && (
              <IconButton
                sx={{ ml: 2.5, mt: "8px", backgroundColor: "#f0f0f0" }}
                onClick={() => {
                  setNewOrgUser({
                    ...newOrgUser,
                    org_social_media: [...newOrgUser.org_social_media, ""],
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
        value={newOrgUser.org_logo_url}
        onChange={(e) => {
          setNewOrgUser({
            ...newOrgUser,
            org_logo_url: e.target.value,
            photo_url: e.target.value,
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
