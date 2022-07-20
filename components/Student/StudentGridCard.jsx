import { Avatar, Box, Button, Card, Tooltip, Typography } from "@mui/material";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useContext } from "react";
import { db } from "../../firebase";
import { GlobalContext, StudentContext } from "../Context/ShareContexts";

const StudentGridCard = (props) => {
  const student = props.student;

  // context
  const { chats, currentStudent, setOpenDirectMsg } = useContext(GlobalContext);
  const { setStudent } = useContext(StudentContext);

  // local vars
  const currentUID = currentStudent?.uid;

  // helper func
  // !todo: handleConnect; function is bloated, might need an external lib to hold these func
  const handleConnect = async (e) => {
    e.stopPropagation();
    setStudent(student);
    setOpenDirectMsg(true); // trigger the useEffect to show the msg
    {
      /* create or update chat */
    }
    const foundChat = chats.find((chat) =>
      chat.chat_user_ids.some((uid) => uid === student.uid)
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
    const it_unread_key = student.uid + "_unread";
    const chatRef = {
      chat_user_ids: [currentStudent?.uid, student.uid],
      [my_unread_key]: 0,
      [it_unread_key]: 1,
      last_text: msgStr,
      last_timestamp: serverTimestamp(),
    };
    const chatModRef = addDoc(collectionRef, chatRef).catch((err) => {
      console.log("addDoc() error: ", err);
    });
    let retID;
    await chatModRef.then((ret) => {
      retID = ret?.id;
    });
    // add message
    const msgCollectionRef = collection(db, "chats", retID, "messages");
    const msgModRef = addDoc(msgCollectionRef, messageRef).catch((err) => {
      console.log("addDoc() error: ", err);
    });
    await msgModRef;
  };

  return (
    <Card
      variant="outlined"
      onClick={() => setStudent(student)}
      sx={{
        // mr: 3,
        // mt: 3,
        backgroundColor: "#fafafa",
        border: "1px solid black",
        borderRadius: 4,
        height: "100%",
        minWidth: "200px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          // justifyContent: "center",
        }}
      >
        <Avatar
          sx={{
            m: 3,
            width: "5em",
            height: "5em",
            border: "1px solid black",
          }}
          src={student.photo_url}
        />
        {/* <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "green",
          }}
        > */}
        <Typography sx={{ fontWeight: "bold", fontSize: "1em" }}>
          {student.name}
        </Typography>
        <Typography sx={{ fontSize: "0.9em" }}>
          {student.desired_position}
        </Typography>
        <Typography sx={{ fontSize: "0.9em" }}>
          {student.field_of_interest}
        </Typography>
        <Typography sx={{ fontSize: "0.9em" }}>
          {"Education year: "}
          {student.year_of_ed}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title={currentUID ? "" : "Please edit your profile first."}>
          <span>
            <Button
              disabled={!currentUID || currentUID === student.uid}
              disableElevation
              size="small"
              sx={{
                m: 3,
                borderRadius: 4,
                backgroundColor: "#3e95c2",
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
        {/* </CardContent> */}
      </Box>
    </Card>
  );
};

export default StudentGridCard;
