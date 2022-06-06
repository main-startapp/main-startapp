import {
  Avatar,
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { GlobalContext, StudentContext } from "../Context/ShareContexts";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import LocalPoliceRoundedIcon from "@mui/icons-material/LocalPoliceRounded";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkIcon from "@mui/icons-material/Link";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

const StudentProfile = () => {
  // context
  const { chats, currentStudent, setOpenDirectMsg } = useContext(GlobalContext);
  const { student } = useContext(StudentContext);

  // local vars
  const currentUID = currentStudent?.uid;

  // helper func
  // !todo: handleConnect; function is bloated, might need an external lib to hold these func
  const handleConnect = async (e) => {
    e.stopPropagation();
    setOpenDirectMsg(true); // trigger the useEffect to show the msg
    {
      /* create or update chat */
    }
    const foundChat = chats.find((chat) =>
      chat.chat_user_ids.some((uid) => uid === student?.uid)
    );
    if (foundChat) {
      return;
    }

    // not found chat -> create
    const msgStr = currentStudent?.name + " requested to connect";
    const messageRef = {
      text: msgStr,
      sent_by: currentUID,
      sent_at: serverTimestamp(),
    };
    // add chat doc
    const collectionRef = collection(db, "chats");
    const my_unread_key = currentUID + "_unread";
    const it_unread_key = student?.uid + "_unread";
    const chatRef = {
      chat_user_ids: [currentStudent?.uid, student?.uid],
      last_text: msgStr,
      last_timestamp: serverTimestamp(),
      [my_unread_key]: 0,
      [it_unread_key]: 1,
    };
    const chatAddDocRef = await addDoc(collectionRef, chatRef).catch((err) => {
      console.log("addDoc() error: ", err);
    });
    // add message
    const msgCollectionRef = collection(
      db,
      "chats",
      chatAddDocRef.id,
      "messages"
    );
    const msgAddDocRef = await addDoc(msgCollectionRef, messageRef).catch(
      (err) => {
        console.log("addDoc() error: ", err);
      }
    );
  };

  // similar alg in components/Project/ProjectInfo
  // box ref to used by useEffect
  const boxRef = useRef();
  // useEffect to reset box scrollbar position
  useEffect(() => {
    boxRef.current.scrollTop = 0;
  }, [student]); // every time project changes, this forces each accordion to collapse

  return (
    <>
      <Box
        ref={boxRef}
        bgcolor="#fafafa"
        sx={{ height: "calc(99vh - 128px)", overflow: "auto" }}
      >
        {/* 1st box; center; avatar and student info */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              m: 6,
              width: "10em",
              height: "10em",
              border: "1px solid black",
            }}
            src={student?.photo_url}
          />
          {/* name */}
          {student?.name && (
            <Typography sx={{ fontWeight: "bold", fontSize: "1.2em" }}>
              {student.name}
            </Typography>
          )}
          {!student?.name && (
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.2em", color: "gray" }}
            >
              {"Name"}
            </Typography>
          )}
          {/* position */}
          {student?.desired_position && (
            <Typography sx={{ fontSize: "1em" }}>
              {student.desired_position}
            </Typography>
          )}
          {!student?.desired_position && (
            <Typography sx={{ fontSize: "1em", color: "gray" }}>
              {"Position"}
            </Typography>
          )}
          {/* field of interest */}
          {student?.field_of_interest && (
            <Typography sx={{ fontSize: "1em" }}>
              {student.field_of_interest}
            </Typography>
          )}
          {!student?.field_of_interest && (
            <Typography sx={{ fontSize: "1em", color: "gray" }}>
              {"Field"}
            </Typography>
          )}
          {/* education year */}
          {student?.year_of_ed && (
            <Typography sx={{ fontSize: "1em" }}>
              {"Education year: "}
              {student.year_of_ed}
            </Typography>
          )}
          {!student?.year_of_ed && (
            <Typography sx={{ fontSize: "1em", color: "gray" }}>
              {"Education year: "}
              {"0"}
            </Typography>
          )}
        </Box>
        {/* 2nd box; start; student details */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            m: 3,
          }}
        >
          {/* awards */}
          {/* <Typography sx={{ fontWeight: "bold", fontSize: "1.2em" }}>
            {"Awards"}
          </Typography>
          <Box direction="row">
            <VerifiedRoundedIcon sx={{ fontSize: "3em", mr: 1 }} />
            <LocalPoliceRoundedIcon sx={{ fontSize: "3em", mr: 1 }} />
          </Box> */}
          {/* social media links */}
          {student?.social_media.length > 0 && (
            <Typography sx={{ fontWeight: "bold", fontSize: "1.2em", mt: 1 }}>
              {"Social media"}
            </Typography>
          )}
          <Box direction="row">
            {student?.social_media.length > 0 &&
              student.social_media.map((link, index) => {
                // todo!: too hacky, is there any library can do this properly?
                if (!link.toLowerCase().includes("https://")) {
                  link = "https://" + link;
                }

                if (link.toLowerCase().includes("linkedin")) {
                  return (
                    <a
                      key={index}
                      target="_blank"
                      href={link}
                      rel="noopener noreferrer"
                    >
                      <LinkedInIcon
                        sx={{ fontSize: "3em", mr: 1, color: "black" }}
                      />
                    </a>
                  );
                } else if (link.toLowerCase().includes("facebook")) {
                  return (
                    <a
                      key={index}
                      target="_blank"
                      href={link}
                      rel="noopener noreferrer"
                    >
                      <FacebookIcon
                        sx={{ fontSize: "3em", mr: 1, color: "black" }}
                      />
                    </a>
                  );
                } else if (link.toLowerCase().includes("instagram")) {
                  return (
                    <a
                      key={index}
                      target="_blank"
                      href={link}
                      rel="noopener noreferrer"
                    >
                      <InstagramIcon
                        sx={{ fontSize: "3em", mr: 1, color: "black" }}
                      />
                    </a>
                  );
                } else {
                  return (
                    <a
                      key={index}
                      target="_blank"
                      href={link}
                      rel="noopener noreferrer"
                    >
                      <LinkIcon
                        sx={{ fontSize: "3em", mr: 1, color: "black" }}
                      />
                    </a>
                  );
                }
              })}
          </Box>
          {/* past experience */}
          {student?.past_exp.length > 0 && (
            <Typography sx={{ fontWeight: "bold", fontSize: "1.2em", mt: 1 }}>
              {"Past experience"}
            </Typography>
          )}
          {student?.past_exp.length > 0 &&
            student.past_exp.map((exp, index) => (
              <Typography key={index} sx={{ ml: "1em", mb: "1em" }}>
                &bull; &nbsp; {exp}
              </Typography>
            ))}
        </Box>
        {/* 3rd box; center; buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            m: 3,
          }}
        >
          {/* connect button */}
          <Tooltip title={currentUID ? "" : "Edit your profile first."}>
            <span>
              <Button
                disabled={
                  !currentUID || !student?.uid || currentUID === student?.uid
                }
                disableElevation
                size="large"
                sx={{
                  m: 3,
                  borderRadius: 4,
                  bgcolor: "#3e95c2",
                }}
                variant="contained"
                onClick={(e) => handleConnect(e)}
              >
                <Typography sx={{ fontSize: "0.9em" }}>
                  &emsp; {"Connect"} &emsp;
                </Typography>
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </>
  );
};

export default StudentProfile;
