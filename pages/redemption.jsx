import { Button, Grid, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useAuth } from "../components/Context/AuthContext";
import { GlobalContext } from "../components/Context/ShareContexts";
import { db } from "../firebase";

function Redemption() {
  // context
  const { currentUser } = useAuth();
  const {
    ediumUser,
    ediumUserExt,
    setChat,
    setChatPartner,
    setShowChat,
    setShowMsg,
    onMedia,
  } = useContext(GlobalContext);
  useEffect(() => {
    setShowChat(false);
    setShowMsg(false);
    setChat(null);
    setChatPartner(null);
  }, [setChat, setChatPartner, setShowChat, setShowMsg]);

  // local
  const [isAdminMode, setIsAdminMode] = useState(
    currentUser?.uid === "T5q6FqwJFcRTKxm11lu0zmaXl8x2"
  );
  const [generatedURL, setGeneratedURL] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [theCipher, setTheCipher] = useState("");
  const [projectCodes, setProjectCodes] = useState([""]);
  const [eventCodes, setEventCodes] = useState([""]);
  const [adminProjectCodes, setAdminProjectCodes] = useState([""]);
  const [adminEventCodes, setAdminEventCodes] = useState([""]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const queries = new URLSearchParams(url.search);
    // const shift = queries.get("s");
    const cipher = queries.get("c");
    const pCodes = queries.getAll("p");
    const eCodes = queries.getAll("e");
    // decode caesar shifting
    setTheCipher(cipher || "");
    setProjectCodes(pCodes.length > 0 ? pCodes : [""]);
    setEventCodes(eCodes.length > 0 ? eCodes : [""]);
  }, []);

  // helper funs
  const handleChangeCodes = (codeArray, setCodeArray, index, e) => {
    const cFields = [...codeArray];
    cFields[index] = e.target.value;
    setCodeArray(cFields);
  };

  const handleAddCodes = (codeArray, setCodeArray) => {
    setCodeArray([...codeArray, ""]);
  };

  const handleRemoveCodes = (codeArray, setCodeArray, index) => {
    const cFields = [...codeArray];
    cFields.splice(index, 1);
    setCodeArray(cFields);
  };

  const handleGenerateURL = () => {
    setErrorMessage("");
    setGeneratedURL("");
    if (!theCipher) {
      setErrorMessage("Input Cipher");
      return;
    }

    const url = new URL(window.location.href);
    const params = new URLSearchParams();
    params.append("s", 0);
    params.append("c", theCipher);
    adminProjectCodes.forEach((aPCode) => {
      params.append("p", aPCode);
    });
    adminEventCodes.forEach((aECode) => {
      params.append("e", aECode);
    });
    // encode caesar shifting
    const urlStr =
      `${url.origin.toString() + url.pathname.toString()  }?${  params.toString()}`;
    navigator.clipboard.writeText(urlStr);
    setGeneratedURL(urlStr);
  };

  const handleRedeem = async () => {
    setErrorMessage("");
    if (!theCipher) {
      setErrorMessage("No Cipher");
      return;
    }
    const pCodes = projectCodes.filter((code) => code);
    const eCodes = eventCodes.filter((code) => code);
    if (pCodes.length === 0 && eCodes.length === 0) {
      setErrorMessage("No Project or Event");
      return;
    }

    async function transfer(
      codeArray,
      docName,
      docExtName,
      myIds,
      failedCodes
    ) {
      codeArray.forEach(async (code) => {
        let docID;
        let docExtData;
        // 1. use pCode to get doc id from doc ext
        const collectionRef = collection(db, docExtName);
        const q = query(collectionRef, where("transfer_code", "==", code));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((qDoc) => {
          docID = qDoc.id;
          docExtData = qDoc.data();
        });
        if (!docID) {
          failedCodes.push(code);
          return;
        }
        myIds.push(docID);
        // 2. update doc
        const docRef = doc(db, docName, docID);
        const docUpdateRef = {
          bypass_code: theCipher,
          creator_uid: ediumUser?.uid,
          last_timestamp: serverTimestamp(),
        };
        const docModRef = updateDoc(docRef, docUpdateRef).catch((err) => {
          console.log("updateDoc() error: ", err);
        });
        // 3. update doc ext
        const extDocRef = doc(db, docExtName, docID);
        delete docExtData.transfer_code;
        const docExtUpdateRef = {
          ...docExtData,
          admins: [ediumUser?.uid],
          members: [ediumUser?.uid],
          last_timestamp: serverTimestamp(),
        };
        const docExtModRef = setDoc(extDocRef, docExtUpdateRef).catch((err) => {
          failedCodes.push(code);
          console.log("updateDoc() error: ", err);
        });

        await docModRef;
        await docExtModRef;
      });
    }

    // update projects and events
    const myProjectIDs = ediumUserExt?.my_project_ids
      ? ediumUserExt.my_project_ids
      : [];
    const myEventIDs = ediumUserExt?.my_event_ids
      ? ediumUserExt.my_event_ids
      : [];
    const failedProjectCodes = [];
    const failedEventCodes = [];
    let isFailedUserExt = false;
    if (pCodes.length > 0) {
      await transfer(
        pCodes,
        "projects",
        "projects_ext",
        myProjectIDs,
        failedProjectCodes
      );
    }
    if (eCodes.length > 0) {
      await transfer(
        eCodes,
        "events",
        "events_ext",
        myEventIDs,
        failedEventCodes
      );
    }
    // update user ext
    const userExtDocRef = doc(db, "users_ext", currentUser?.uid);
    const userExtUpdateRef = {
      my_project_ids: myProjectIDs,
      my_event_ids: myEventIDs,
      last_timestamp: serverTimestamp(),
    };
    console.log(userExtUpdateRef);
    const userExtModRef = updateDoc(userExtDocRef, userExtUpdateRef).catch(
      (err) => {
        isFailedUserExt = true;
        console.log("updateDoc() error: ", err);
      }
    );

    await userExtModRef;

    setProjectCodes([""]);
    setEventCodes([""]);
    if (
      failedProjectCodes.length === 0 &&
      failedEventCodes.length === 0 &&
      !isFailedUserExt
    ) {
      setTheCipher("");
      setErrorMessage("All Set!");
    }
    if (failedProjectCodes.length > 0) {
      setProjectCodes(failedProjectCodes);
      setErrorMessage("Please recheck the codes on the screen!");
    }
    if (failedEventCodes.length > 0) {
      setEventCodes(failedEventCodes);
      setErrorMessage("Please recheck the codes on the screen!");
    }
    if (isFailedUserExt) {
      setErrorMessage("Can't update your user profile with new projects!");
    }
  };

  // reusable comp
  const codeList = (codesArray, setCodesArray, name, isLeft) => (
    <>
      {codesArray.map((code, index) => (
          <Box key={code} sx={{ mt: 3, width: "100%" }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#3e95c2",
                display: "flex",
                justifyContent: isLeft ? "start" : "end",
              }}
            >
              {isLeft
                ? `> ${  name  } Code #${  index + 1}`
                : `${  name  } Code #${  index + 1  } <`}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <StyledTextField
                required
                fullWidth
                margin="none"
                inputProps={{
                  maxLength: 50,
                }}
                // helperText="The name of your newProject (limit: 50)"
                value={code}
                onChange={(e) =>
                  handleChangeCodes(codesArray, setCodesArray, index, e)
                }
              />
              {index > 0 && (
                <StyledIconBox
                  sx={{
                    ml: "10px",
                  }}
                  onClick={() => {
                    handleRemoveCodes(codesArray, setCodesArray, index);
                  }}
                >
                  <RemoveRoundedIcon sx={{ color: "white" }} />
                </StyledIconBox>
              )}
              {index === codesArray.length - 1 && (
                <StyledIconBox
                  sx={{
                    ml: "10px",
                  }}
                  onClick={() => {
                    handleAddCodes(codesArray, setCodesArray);
                  }}
                >
                  <AddRoundedIcon sx={{ color: "white" }} />
                </StyledIconBox>
              )}
            </Box>
          </Box>
        ))}
    </>
  );

  const confirmButton = (buttonName, color, handleFunction) => (
    <>
      <Box
        sx={{
          mt: 5,
          display: "flex",
          alignItems: "center",
          color,
        }}
      >
        <KeyboardArrowDownIcon />
      </Box>
      <Button
        sx={{
          height: "35px",
          width: "100px",
          borderRadius: 0,
          padding: 0,
          textTransform: "none",
          fontSize: "16px",
          fontWeight: "bold",
          backgroundColor: color,
          color: "white",
          ":hover": {
            backgroundColor: "#002145",
          },
        }}
        onClick={handleFunction}
      >
        {buttonName}
      </Button>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          color,
        }}
      >
        <KeyboardArrowUpIcon />
      </Box>
    </>
  );

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
          ? "calc(100vh - 64px)"
          : "calc(100vh - 48px - 60px)",
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
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              fontSize: "2em",
              fontWeight: "bold",
              mt: 5,
              color: "white",
              backgroundColor: "#3e95c2",
              paddingX: 6,
              paddingY: 3,
              width: "400px",
            }}
          >
            Edium Redemption
          </Typography>

          {currentUser?.uid === "T5q6FqwJFcRTKxm11lu0zmaXl8x2" && (
            <>
              <Typography
                sx={{ mt: 2.5, fontWeight: "bold", color: "#f4511e" }}
              >
                ADMIN
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <KeyboardArrowRightIcon
                  sx={{ color: isAdminMode ? "#f4511e" : "#3e95c2" }}
                />
                <Box
                  sx={{
                    height: "35px",
                    width: "150px",
                    borderRadius: 0,
                    border: 1,
                    borderColor: "#dbdbdb",
                    display: "flex",
                    justifyContent: isAdminMode ? "end" : "start",
                  }}
                  onClick={() => setIsAdminMode(!isAdminMode)}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: "50%",
                      backgroundColor: isAdminMode ? "#f4511e" : "#3e95c2",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: "12px",
                        color: "white",
                      }}
                    >
                      {isAdminMode ? "Generate" : "Redeem"}
                    </Typography>
                  </Box>
                </Box>
                <KeyboardArrowLeftIcon
                  sx={{ color: isAdminMode ? "#f4511e" : "#3e95c2" }}
                />
              </Box>
            </>
          )}
        </Box>
        <Box
          sx={{
            mt: "10vh",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "400px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#3e95c2",
              }}
            >
              {"> The Cipher"}
            </Typography>
            <StyledTextField
              sx={{ color: isAdminMode ? "#f4511e" : "#3e95c2" }}
              required
              fullWidth
              margin="none"
              inputProps={{
                maxLength: 50,
              }}
              value={theCipher}
              onChange={(e) => setTheCipher(e.target.value)}
            />

            {!isAdminMode && (
              <>
                {codeList(projectCodes, setProjectCodes, "Projects", true)}
                {codeList(eventCodes, setEventCodes, "Event", false)}
                {confirmButton("Redeem", "#3e95c2", handleRedeem)}
              </>
            )}

            {isAdminMode && (
              <>
                {codeList(
                  adminProjectCodes,
                  setAdminProjectCodes,
                  "ADMIN Projects",
                  true
                )}
                {codeList(
                  adminEventCodes,
                  setAdminEventCodes,
                  "ADMIN Event",
                  false
                )}
                {confirmButton("Generate", "#f4511e", handleGenerateURL)}
                <Box
                  sx={{
                    display: "flex",

                    alignItems: "center",
                    ":hover": {
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => {
                    if (!(generatedURL === "Copied")) {
                      navigator.clipboard.writeText(generatedURL);
                    }
                    setGeneratedURL("Copied");
                  }}
                >
                  {generatedURL ? (
                    <>
                      <KeyboardArrowRightIcon sx={{ color: "#f4511e" }} />
                      <Typography sx={{ fontWeight: "bold", color: "#f4511e" }}>
                        {generatedURL}
                      </Typography>
                      <KeyboardArrowLeftIcon sx={{ color: "#f4511e" }} />
                    </>
                  ) : (
                    <br />
                  )}
                </Box>
              </>
            )}

            {!!errorMessage && (
              <Box
                sx={{
                  mt: 5,
                  width: "400px",
                  height: "35px",
                  backgroundColor:
                    errorMessage === "All Set!" ? "green" : "red",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  {errorMessage}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Redemption;

const StyledIconBox = styled(Box)(() => ({
  minHeight: "35px",
  minWidth: "35px",
  backgroundColor: "#3e95c2",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const StyledTextField = styled(TextField)(() => ({
  "& .MuiInputBase-input": {
    padding: "6px 12px",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: 0,
    color: "white",
    backgroundColor: "#3e95c2",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderWidth: 1.5,
    borderColor: "#3e95c2",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderWidth: 1.5,
    borderColor: "#3e95c2 !important",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderWidth: 1.5,
    borderColor: "#3e95c2 !important",
  },
  "& .MuiFormHelperText-root": {
    color: "lightgray",
    fontSize: "12px",
  },
}));
