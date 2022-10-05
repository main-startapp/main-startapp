import {
  Autocomplete,
  Box,
  Button,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import cloneDeep from "lodash.clonedeep";
import { useContext, useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { GlobalContext } from "../Context/ShareContexts";
import { studentDepartmentStrList } from "../Reusable/MenuStringList";
import { DefaultTextField, getDocsByQueryFromDB } from "../Reusable/Resusable";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

const UserOrgCreate = (props) => {
  const isClickable = props.isClickable;
  const handleUserSubmit = props.handleUserSubmit;
  const redirectTo = props.redirectTo;

  // context & hooks
  const { currentUser } = useAuth();
  const { ediumUser, onMedia } = useContext(GlobalContext);

  // local vars
  const [newOrgUser, setNewOrgUser] = useState({
    name: "",
    create_timestamp: "",
    photo_url: currentUser?.photoURL || "",
    role: "org_admin",
  });

  const [newOrg, setNewOrg] = useState({
    title: "",
    department: "N/A",
    create_timestamp: "",
    social_media: [""],
    logo_url: "",
    admin_uid: currentUser?.uid,
    representatives: [currentUser?.uid],
  });
  const [orgDocID, setOrgDocID] = useState("");

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

  // helper func
  const handleRemoveSocialMedia = (index) => {
    let cur_social_media = newOrg.social_media;
    cur_social_media.splice(index, 1);
    setNewOrg({ ...newOrg, social_media: cur_social_media });
  };

  const handleOrgSubmit = async () => {
    // check will be done my handleUserSubmit
    let orgRef = {
      ...newOrg,
      // remove empty entries
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

  return (
    <Box>
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
            handleOrgSubmit();
            handleUserSubmit(newOrgUser);
            redirectTo();
          }}
        >
          {"Confirm"}
        </Button>
      </Box>
    </Box>
  );
};

export default UserOrgCreate;
