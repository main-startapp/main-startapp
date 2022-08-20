import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

// handle connect/message: if chat found, return; if not, create a chat with "request to connect" auto msg.
export const handleConnect = async (
  chats,
  student,
  currentStudent,
  setPartner,
  setForceChatExpand
) => {
  setPartner(student);
  setForceChatExpand(true);

  const foundChat = chats.find((chat) =>
    chat.chat_user_ids.some((uid) => uid === student.uid)
  );

  if (foundChat) {
    return;
  }

  const msgStr = currentStudent.name + " requested to connect";
  const messageRef = {
    text: msgStr,
    sent_by: currentStudent.uid,
    sent_at: serverTimestamp(),
  };
  // add chat doc
  const collectionRef = collection(db, "chats");
  const my_unread_key = currentStudent.uid + "_unread";
  const it_unread_key = student.uid + "_unread";
  const chatRef = {
    chat_user_ids: [currentStudent.uid, student.uid],
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
  // use returned chat doc id to add message
  const msgCollectionRef = collection(db, "chats", retID, "messages");
  const msgModRef = addDoc(msgCollectionRef, messageRef).catch((err) => {
    console.log("addDoc() error: ", err);
  });
  await msgModRef;
};

// handle reset unread
// https://stackoverflow.com/questions/43302584/why-doesnt-the-code-after-await-run-right-away-isnt-it-supposed-to-be-non-blo
// https://stackoverflow.com/questions/66263271/firebase-update-returning-undefined-is-it-not-supposed-to-return-the-updated
export const handleUnread = async (chat, currentStudent) => {
  const my_unread_key = currentStudent.uid + "_unread";

  if (chat[my_unread_key] > 0) {
    const chatDocRef = doc(db, "chats", chat.id);
    const chatRef = {
      ...chat,
      [my_unread_key]: 0,
    };
    delete chatRef.id;
    const chatModRef = updateDoc(chatDocRef, chatRef).catch((err) => {
      console.log("updateDoc() error: ", err); // .then() is useless as updateDoc() returns Promise<void>
    });
    await chatModRef;
  }
};
