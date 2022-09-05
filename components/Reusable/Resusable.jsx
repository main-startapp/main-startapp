import {
  addDoc,
  arrayRemove,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

//============================================================
// handle connect/message: if chat found, return; if not, create a chat with "request to connect" auto msg.
//============================================================
export const handleConnect = async (
  chats,
  partnerStudent,
  currentStudent,
  setChatPartner,
  setForceChatExpand
) => {
  // chat accordion related, chat will always be expanded
  setChatPartner(partnerStudent);
  setForceChatExpand(true);

  // find chat in chats
  const foundChat = chats.find((chat) =>
    chat.chat_user_ids.some((uid) => uid === partnerStudent.uid)
  );

  if (foundChat) return;

  // build msg
  const msgStr = currentStudent.name + " requested to connect";
  const messageRef = {
    text: msgStr,
    sent_by: currentStudent.uid,
    sent_at: serverTimestamp(),
  };
  // add chat doc
  const collectionRef = collection(db, "chats");
  const my_unread_key = currentStudent.uid + "_unread";
  const it_unread_key = partnerStudent.uid + "_unread";
  const chatRef = {
    chat_user_ids: [currentStudent.uid, partnerStudent.uid],
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
  if (!!!retID) return; // extra safe, although this will never happen
  // use returned chat doc id to add message
  const msgCollectionRef = collection(db, "chats", retID, "messages");
  const msgModRef = addDoc(msgCollectionRef, messageRef).catch((err) => {
    console.log("addDoc() error: ", err);
  });
  await msgModRef;
};

//============================================================
// handle reset unread
// https://stackoverflow.com/questions/43302584/why-doesnt-the-code-after-await-run-right-away-isnt-it-supposed-to-be-non-blo
// https://stackoverflow.com/questions/66263271/firebase-update-returning-undefined-is-it-not-supposed-to-return-the-updated
//============================================================
export const handleUnread = async (chat, setChat, currentStudent) => {
  const my_unread_key = currentStudent.uid + "_unread";

  if (chat[my_unread_key] > 0) {
    const chatDocRef = doc(db, "chats", chat.id);
    const chatUpdateRef = {
      [my_unread_key]: 0,
      last_timestamp: serverTimestamp(),
    };
    setChat({ ...chat, ...chatUpdateRef });
    const chatModRef = updateDoc(chatDocRef, chatUpdateRef).catch((err) => {
      console.log("updateDoc() error: ", err); // .then() is useless as updateDoc() returns Promise<void>
    });
    await chatModRef;
  }
};

//============================================================
// change project's visibility
//============================================================
export const handleVisibility = async (project) => {
  const docRef = doc(db, "projects", project.id);
  const projectUpdateRef = {
    is_visible: !project.is_visible,
    last_timestamp: serverTimestamp(),
  };
  const projectModRef = updateDoc(docRef, projectUpdateRef).catch((err) => {
    console.log("updateDoc() error: ", err);
  });
  await projectModRef;
};

//============================================================
// never delete, only hide
// !todo: use cloud function for batch deletion
//============================================================
export const handleDeleteProject = async (projectID, currentStudentExt) => {
  const docRef = doc(db, "projects", projectID);
  const projectModRef = updateDoc(docRef, { is_deleted: true }).catch((err) => {
    console.log("updateDoc() error: ", err);
  });

  // delete project ref from my_project_ids in student ext doc
  const curStudentExtDocRef = doc(db, "students_ext", currentStudentExt?.uid);
  const curStudentExtUpdateRef = {
    my_project_ids: arrayRemove(projectID),
    last_timestamp: serverTimestamp(),
  };
  const curStudentExtModRef = updateDoc(
    curStudentExtDocRef,
    curStudentExtUpdateRef
  ).catch((err) => {
    console.log("updateDoc() error: ", err);
  });

  // delete project_ext
  const extDocRef = doc(db, "projects_ext", projectID);
  const projectExtModRef = updateDoc(extDocRef, { is_deleted: true }).catch(
    (err) => {
      console.log("updateDoc() error: ", err);
    }
  );

  // wait
  await projectModRef;
  await curStudentExtModRef;
  await projectExtModRef;
};

//============================================================
// find data from id
//============================================================
export const findListItem = (itemID, key, list) => {
  return list.find((listItem) => listItem[key] === itemID);
};
