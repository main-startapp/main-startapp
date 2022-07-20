import { Box, Grid } from "@mui/material";
import { useContext, useEffect } from "react";
import { GlobalContext, StudentContext } from "../Context/ShareContexts";
import StudentGridCard from "./StudentGridCard";

const StudentGrid = () => {
  // context
  const {
    students,
    openDirectMsg,
    chats,
    setForceChatExpand,
    setChat,
    setPartner,
    setShowMsg,
    setOpenDirectMsg,
  } = useContext(GlobalContext);
  const { searchTerm, student } = useContext(StudentContext);

  // local var
  // show chat msg after connect
  useEffect(() => {
    if (!openDirectMsg) return;

    const foundChat = chats.find((chat) =>
      chat.chat_user_ids.some((uid) => uid === student.uid)
    );

    if (foundChat) {
      setForceChatExpand(true);
      setTimeout(() => {
        setChat(foundChat);
        setPartner(student);
        setShowMsg(true);
      }, 200); // delayed effect to look smooth
      setOpenDirectMsg(false);
    }

    return foundChat;
  }, [
    chats,
    openDirectMsg,
    setChat,
    setForceChatExpand,
    setOpenDirectMsg,
    setPartner,
    setShowMsg,
    student,
  ]); // trigger mainly by chats update and openDirectMsg. will return if don't need to show direct msg.

  return (
    <Box
      sx={{
        height: "calc(99vh - 128px)",
        overflow: "auto",
      }}
    >
      <Grid container spacing={4} padding={4}>
        {students
          .filter((student) => {
            const isInName = student.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
            const isInPosition = student.desired_position
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
            if (searchTerm === "") {
              // no search
              return student;
            }
            if (isInName || isInPosition) {
              // in name or in position title
              return student;
            }
          })
          .map((student, index) => (
            <Grid key={index} item xs={3}>
              <StudentGridCard key={student.uid} student={student} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default StudentGrid;
