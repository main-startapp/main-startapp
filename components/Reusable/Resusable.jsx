import {
  addDoc,
  arrayRemove,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { styled } from "@mui/material/styles";
import { Box, InputBase, TextField, Link as MuiLink } from "@mui/material";

//============================================================
// handle connect/message: if chat found, return; if not, create a chat with "request to connect" auto msg.
//============================================================
export const handleConnect = async (
  chats,
  partnerUser,
  ediumUser,
  setChatPartner,
  setForceChatExpand
) => {
  // chat accordion related, chat will always be expanded
  setChatPartner(partnerUser);
  setForceChatExpand(true);

  // find chat in chats
  const foundChat = chats.find((chat) =>
    chat.chat_user_ids.some((uid) => uid === partnerUser.uid)
  );

  if (foundChat) return;

  // build msg
  const msgStr = ediumUser.name + " requested to connect";
  const messageRef = {
    text: msgStr,
    sent_by: ediumUser.uid,
    sent_at: serverTimestamp(),
  };
  // add chat doc
  const collectionRef = collection(db, "chats");
  const my_name_key = ediumUser.uid + "_name";
  const partner_name_key = partnerUser.uid + "_name";
  const my_unread_key = ediumUser.uid + "_unread";
  const partner_unread_key = partnerUser.uid + "_unread";
  const chatRef = {
    chat_user_ids: [ediumUser.uid, partnerUser.uid],
    [my_name_key]: ediumUser.name,
    [partner_name_key]: partnerUser.name,
    [my_unread_key]: 0,
    [partner_unread_key]: 1,
    has_unread: true,
    last_text: msgStr,
    last_timestamp: serverTimestamp(),
  };
  const chatModRef = addDoc(collectionRef, chatRef).catch((error) => {
    console.log(error?.message);
  });
  let retID;
  await chatModRef.then((ret) => {
    retID = ret?.id;
  });
  if (!retID) return; // extra safe, although this will never happen
  // use returned chat doc id to add message
  const msgCollectionRef = collection(db, "chats", retID, "messages");
  const msgModRef = addDoc(msgCollectionRef, messageRef).catch((error) => {
    console.log(error?.message);
  });
  await msgModRef;
};

//============================================================
// handle reset unread
// https://stackoverflow.com/questions/43302584/why-doesnt-the-code-after-await-run-right-away-isnt-it-supposed-to-be-non-blo
// https://stackoverflow.com/questions/66263271/firebase-update-returning-undefined-is-it-not-supposed-to-return-the-updated
//============================================================
export const handleUnread = async (chat, setChat, ediumUser, chatPartner) => {
  const my_unread_key = ediumUser?.uid + "_unread";
  const partner_unread_key = chatPartner?.uid + "_unread";

  if (chat[my_unread_key] > 0) {
    const chatDocRef = doc(db, "chats", chat.id);
    let chatUpdateRef = {
      [my_unread_key]: 0,
      last_timestamp: serverTimestamp(),
    };
    if (chat[partner_unread_key] === 0) {
      chatUpdateRef = { ...chatUpdateRef, has_unread: false };
    }
    setChat({ ...chat, ...chatUpdateRef });
    const chatModRef = updateDoc(chatDocRef, chatUpdateRef).catch((error) => {
      console.log(error?.message); // .then() is useless as updateDoc() returns Promise<void>
    });
    await chatModRef;
  }
};

//============================================================
// change entry's visibility (project, event)
//============================================================
export const handleVisibility = async (collectionName, entry) => {
  const docRef = doc(db, collectionName, entry.id);
  const entryUpdateRef = {
    is_visible: entry?.is_visible !== undefined ? !entry.is_visible : true, // if has is_visible field, flip it; if not, hide it
    last_timestamp: serverTimestamp(),
  };
  const entryModRef = updateDoc(docRef, entryUpdateRef).catch((error) => {
    console.log(error?.message);
  });
  await entryModRef;
};

//============================================================
// change is_deleted field in entry and entryExt, remove id from my_entry_ids (project/event)
// !todo: use cloud function for batch deletion
//============================================================
export const handleDeleteEntry = async (
  colletionName,
  extColletionName,
  keyName,
  entryID,
  ediumUserID
) => {
  // set is_deleted to true in entry doc
  const docRef = doc(db, colletionName, entryID);
  const entryModRef = updateDoc(docRef, { is_deleted: true }).catch((error) => {
    console.log(error?.message);
  });

  // set is_deleted to true in entry ext doc
  const extDocRef = doc(db, extColletionName, entryID);
  const entryExtModRef = updateDoc(extDocRef, { is_deleted: true }).catch(
    (error) => {
      console.log(error?.message);
    }
  );

  // remove entry id from my_entry_ids
  const ediumUserExtDocRef = doc(db, "users_ext", ediumUserID);
  const ediumUserExtUpdateRef = {
    [keyName]: arrayRemove(entryID),
    last_timestamp: serverTimestamp(),
  };
  const ediumUserExtModRef = updateDoc(
    ediumUserExtDocRef,
    ediumUserExtUpdateRef
  ).catch((error) => {
    console.log(error?.message);
  });

  // wait
  await entryModRef;
  await entryExtModRef;
  await ediumUserExtModRef;
};

//============================================================
// get specific doc from db assumed permission
//============================================================
export const getDocFromDB = async (dbName, docID) => {
  const docRef = doc(db, dbName, docID);
  const docSnap = await getDoc(docRef).catch((error) => {
    console.log(error?.message);
  });

  return docSnap?.data() ? docSnap.data() : null;
};

//============================================================
// get docs using query from db assumed permission
//============================================================
export const getDocsByQueryFromDB = async (
  dbName,
  qSubject,
  qOperator,
  qObject
) => {
  const q = query(collection(db, dbName), where(qSubject, qOperator, qObject));
  const querySnapshot = await getDocs(q).catch((error) => {
    console.log(error?.message);
  });
  const retArray = [];
  if (querySnapshot?.size > 0) {
    querySnapshot.forEach((doc) => {
      retArray.push({ id: doc.id, data: doc.data() });
    });
  }
  return retArray;
};

//============================================================
// find item from list using id, like projects, events
//============================================================
export const findItemFromList = (list, key, itemID) => {
  return list.find((listItem) => listItem[key] === itemID);
};

//============================================================
// change google url photo resolution
//============================================================
export const getGooglePhotoURLwithRes = (photo_url, res) => {
  const newRes = "=s" + res + "-c";
  return photo_url.replace("=s96-c", newRes);
};

//============================================================
// styled components
//============================================================
export const DefaultTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: "#f0f0f0",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderWidth: 1,
    borderColor: "#dbdbdb",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderWidth: 1,
    borderColor: "#dbdbdb !important",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderWidth: 1,
    borderColor: "#3e95c2 !important",
  },
  "& .MuiFormHelperText-root": {
    color: "lightgray",
    fontSize: "12px",
  },
}));

export const SearchBox = styled(Box)(({ theme }) => ({
  //position: "relative",
  height: "36px",
  width: "100%",
  border: 0,
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.searchGary.main,
  // ":hover": { backgroundColor: "#3e95c2" },
  display: "flex",
  alignItems: "center",
}));

export const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  //height: "100%",
  //position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "gray",
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  "&.MuiInputBase-root": {
    width: "100%",
  },
  "& .MuiInputBase-input": {
    padding: theme.spacing(0, 2, 0, 0), // 2 units to the right
    fontSize: "1rem",
    color: theme.palette.text.primary,
  },
}));

export const MenuItemLink = styled(MuiLink)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: "none",
}));
//============================================================
// ADMIN: Duplicate Collections With New Name
//============================================================
// export const exportCollections = async (collection, newCollectionName) => {
//   collection.forEach(async (data) => {
//     const uid = data.uid;
//     delete data.uid;
//     await setDoc(doc(db, newCollectionName, uid), { ...data });
//   });
// };
