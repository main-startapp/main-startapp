import { Box, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import ChatList from "../components/Chat/ChatList";
import ChatMessages from "../components/Chat/ChatMessages";
import ChatSidebar from "../components/Chat/ChatSidebar";
import { useAuth } from "../components/Context/AuthContext";
import { ChatContext } from "../components/Context/ShareContexts";
import { db } from "../firebase";

const Courier = () => {
  //
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [chat, setChat] = useState(null);
  const [students, setStudents] = useState([]);
  const [partner, setPartner] = useState(null);

  useEffect(() => {
    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      where("chat_user_ids", "array-contains", currentUser.uid)
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      setChats(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });

    return () => {
      unsub;
    };
  }, [currentUser]);

  // students list
  useEffect(() => {
    // db query
    const collectionRef = collection(db, "students");
    const q = query(collectionRef, orderBy("name", "desc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      setStudents(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          uid: doc.id,
        }))
      );
    });

    return unsub;
  }, []);

  return (
    <ChatContext.Provider
      value={{
        currentUser,
        chats,
        setChats,
        chat,
        setChat,
        students,
        setStudents,
        partner,
        setPartner,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(99vh - 64px)",
          width: "90vw",
          margin: "auto",
          boxShadow: "0 0 1rem 0.05rem rgba(0, 0, 0, 0.1)",
        }}
      >
        <ChatSidebar />
        <ChatMessages />
      </Box>
    </ChatContext.Provider>
  );
};

export default Courier;
