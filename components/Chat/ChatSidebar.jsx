import { styled } from "@mui/material/styles";
import { useContext, useEffect, useState } from "react";
import { Autocomplete, Avatar, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ChatContext } from "../Context/ShareContexts";
import { db } from "../../firebase";
import ChatListItem from "./ChatListItem";

const ChatSidebar = () => {
  // context
  const { currentUser, chats, students } = useContext(ChatContext);

  // add new chat to db
  const [selectedStudent, setSelectedStudent] = useState(null);
  useEffect(() => {
    async function addChat() {
      const collectionRef = collection(db, "chats");
      const chatRef = {
        chat_user_ids: [currentUser?.uid, selectedStudent?.uid],
        last_text: "",
        last_timestamp: serverTimestamp(),
      };
      const docRef = await addDoc(collectionRef, chatRef).catch((err) => {
        console.log("addDoc() error: ", err);
      });
    }

    let found = false;
    chats.forEach((chat) => {
      chat.chat_user_ids.forEach((id) => {
        if (id === selectedStudent?.uid) {
          found = true;
        }
      });
    });
    if (selectedStudent?.uid && !found) {
      addChat();
    }
  }, [selectedStudent, chats, currentUser]);

  return (
    <Container>
      <Header>
        <Avatar src={currentUser.photoURL} />
      </Header>
      <SearchArea>
        <Autocomplete
          freeSolo
          disableClearable
          value={selectedStudent}
          onChange={(e, newValue) => {
            setSelectedStudent(newValue);
          }}
          options={students}
          getOptionLabel={(student) => student.name}
          renderInput={(params) => (
            <TextField
              sx={{ backgroundColor: "white" }}
              variant="standard"
              {...params}
              InputProps={{
                ...params.InputProps,
                type: "search",
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </SearchArea>
      {/* chat list */}
      <ChatList>
        {chats.map((chat) => (
          <ChatListItem key={chat.id} chat={chat} />
        ))}
      </ChatList>
    </Container>
  );
};

export default ChatSidebar;

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: "white",
  width: "20%",
  height: "100%",
}));

const Header = styled("div")(({ theme }) => ({
  display: "flex",
  top: 0,
  backgroundColor: "white",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px",
  borderBottom: "1px solid whitesmoke",
  width: "100%",
}));

const SearchArea = styled("div")(({ theme }) => ({
  backgroundColor: "#f6f6f6",
  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
  alignItems: "center",
  padding: "15px",
}));

const ChatList = styled("div")(({ theme }) => ({
  width: "100%",
  height: "100%",
  overflow: "auto",
}));
