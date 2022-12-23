import { Box, Grid, Typography } from "@mui/material";
import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { GlobalContext, StudentContext } from "../Context/ShareContexts";
import { useRouter } from "next/router";
import UserStudentCreate from "./UserStudentCreate";
import UserOrgCreate from "./UserOrgCreate";

const UserCreate = () => {
  // context & hooks
  const { currentUser } = useAuth();
  const { ediumUser, winHeight, onMedia } = useContext(GlobalContext);
  const { showAlert } = useContext(StudentContext);

  // local vars
  const [isCreate, setIsCreate] = useState(true);
  const [isStudentMode, setIsStudentMode] = useState(true);

  useEffect(() => {
    if (!ediumUser) return;

    // found user data
    setIsCreate(false); // update profile
    setIsStudentMode(ediumUser?.role === "student"); // prev mode
  }, [ediumUser]);

  const [userCreatedFoI, setUserCreatedFoI] = useState([]);
  const [userCreatedTags, setUserCreatedTags] = useState([]);
  useEffect(() => {
    const unsub1 = onSnapshot(
      doc(db, "user_created_lists", "student_field_of_interests"),
      (doc) => {
        if (doc.exists()) {
          setUserCreatedFoI(doc.data());
        }
      },
      (error) => {
        console.log(error?.message);
      }
    );

    const unsub2 = onSnapshot(
      doc(db, "user_created_lists", "organization_tags"),
      (doc) => {
        if (doc.exists()) {
          setUserCreatedTags(doc.data());
        }
      },
      (error) => {
        console.log(error?.message);
      }
    );

    return () => {
      unsub1;
      unsub2;
    };
  }, []);

  const router = useRouter();

  // helper fun
  const handleUserSubmit = async (newUser) => {
    const uid = currentUser?.uid;
    const docRef = doc(db, "users", uid);
    let userRef = {
      ...newUser,
      last_timestamp: serverTimestamp(),
    };
    if (isStudentMode) {
      userRef = {
        ...userRef,
        // remove empty strings
        social_media: userRef.social_media.filter((ele) => ele),
        //past_exp: newStudent.past_exp.filter((ele) => ele),
      };
    }
    // remove uid to keep the doc consistent
    delete userRef?.uid;

    let userModRef;
    if (userRef?.create_timestamp) {
      // update
      // can't update partially
      userModRef = updateDoc(docRef, userRef).catch((error) => {
        console.log(error?.message);
      });
    } else {
      // create; add create_timestamp
      userRef = {
        ...userRef,
        create_timestamp: serverTimestamp(),
      };
      userModRef = setDoc(docRef, userRef).catch((error) => {
        console.log(error?.message);
      });

      const extDocRef = doc(db, "users_ext", uid);
      const userExtRef = {
        my_project_ids: [],
        joined_project_ids: [],
        join_requests: [],
        last_timestamp: serverTimestamp(),
      };
      const userExtModRef = setDoc(extDocRef, userExtRef).catch((error) => {
        console.log(error?.message);
      });

      await userExtModRef;
    }

    await userModRef;

    // !todo: check return
    showAlert(
      "success",
      `"${userRef.name}" is updated successfully! Navigate to Students page.` // success -> green
    );
  };

  const redirectTo = () => {
    setTimeout(() => {
      router.push(`/students`); // can be customized
    }, 2000); // wait 2 seconds then go to `projects` page
  };

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
          {!ediumUser ? "Create New Profile" : "Update Profile"}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            ":hover": { cursor: "pointer" },
          }}
        >
          <Box
            sx={{
              height: "3em",
              width: "300px",
              borderRadius: 8,
              border: 1.5,
              borderColor: "#dbdbdb",
              backgroundColor: isCreate ? "#3e95c2" : "#e0e0e0",
              display: "flex",
              justifyContent: isStudentMode ? "start" : "end",
              // justifyContent: "space-between",
              alignItems: "center",
            }}
            onClick={() => {
              if (isCreate) setIsStudentMode(!isStudentMode);
            }}
          >
            {!isStudentMode && (
              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "50%",
                  color: isCreate ? "white" : "#e0e0e0",
                }}
              >
                Student
              </Typography>
            )}
            <Box
              sx={{
                height: "80%",
                width: "50%",
                mx: "2%",
                borderRadius: 8,
                border: 1.5,
                borderColor: "#dbdbdb",
                backgroundColor: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: isCreate ? "black" : "#b1b1b1",
                }}
              >
                {isStudentMode ? "Student" : "Organization"}
              </Typography>
            </Box>
            {isStudentMode && (
              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "50%",
                  color: isCreate ? "white" : "#e0e0e0",
                }}
              >
                Organization
              </Typography>
            )}
          </Box>
        </Box>
        {isStudentMode ? (
          <UserStudentCreate
            handleUserSubmit={handleUserSubmit}
            redirectTo={redirectTo}
            userCreatedFoI={userCreatedFoI}
          />
        ) : (
          <UserOrgCreate
            handleUserSubmit={handleUserSubmit}
            redirectTo={redirectTo}
            userCreatedTags={userCreatedTags}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default UserCreate;
