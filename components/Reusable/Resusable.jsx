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
import {
  Box,
  InputBase,
  TextField,
  Link as MuiLink,
  Paper,
  FormControl,
} from "@mui/material";
import Router from "next/router";

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
  let retId;
  await chatModRef.then((ret) => {
    retId = ret?.id;
  });
  if (!retId) return; // extra safe, although this will never happen
  // use returned chat doc id to add message
  const msgCollectionRef = collection(db, "chats", retId, "messages");
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
  entryId,
  ediumUserId
) => {
  // set is_deleted to true in entry doc
  const docRef = doc(db, colletionName, entryId);
  const entryModRef = updateDoc(docRef, { is_deleted: true }).catch((error) => {
    console.log(error?.message);
  });

  // set is_deleted to true in entry ext doc
  const extDocRef = doc(db, extColletionName, entryId);
  const entryExtModRef = updateDoc(extDocRef, { is_deleted: true }).catch(
    (error) => {
      console.log(error?.message);
    }
  );

  // remove entry id from my_entry_ids
  const ediumUserExtDocRef = doc(db, "users_ext", ediumUserId);
  const ediumUserExtUpdateRef = {
    [keyName]: arrayRemove(entryId),
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
export const getDocFromDB = async (dbName, docId) => {
  const docRef = doc(db, dbName, docId);
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
export const findItemFromList = (list, key, itemId) => {
  return list.find((listItem) => listItem[key] === itemId);
};

//============================================================
// change google url photo resolution
//============================================================
export const getGooglePhotoURLwithRes = (photo_url, res) => {
  if (!photo_url) return null;
  const newRes = "=s" + res + "-c";
  return photo_url.replace("=s96-c", newRes);
};

//============================================================
// utility function: remove an element from array
// better than filter?
//============================================================
export const removeValueFromArray = (array, value) => {
  const index = array.findIndex((ele) => ele === value);
  return index >= 0
    ? [...array.slice(0, index), ...array.slice(index + 1)]
    : array;
};

//============================================================
// utility function: isExact ? str is substr : str contains substr
//============================================================
export const isStrInStr = (str, subStr, isExact) => {
  return isExact
    ? str.toLowerCase() === subStr.toLowerCase()
    : str.toLowerCase().includes(subStr.toLowerCase());
};

//============================================================
// utility function: whether substring is in a list of objs or a list of strings
//============================================================
export const isStrInStrList = (strList, subStr, isExact) => {
  return strList.some((str) => isStrInStr(str, subStr, isExact));
};

export const isStrInObjList = (objList, key, subStr, isExact) => {
  return objList.some((obj) => isStrInStr(obj[key], subStr, isExact));
};

//============================================================
// utility function: get ordinal suffix
// https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
//============================================================
export function ordinal_suffix_of(i) {
  let j = i % 10;
  if (j == 1) {
    return i + "st";
  }
  if (j == 2) {
    return i + "nd";
  }
  if (j == 3) {
    return i + "rd";
  }
  return i + "th";
}

//============================================================
// utility function: whether substring is in a list of obj / string
//============================================================
export const shallowUpdateURLQuery = (pathName, queryKey, queryValue) => {
  Router.push(
    {
      pathname: pathName,
      query: queryKey ? { [queryKey]: queryValue } : null,
    },
    undefined,
    { shallow: true }
  );
};

//============================================================
// styled components
//============================================================
export const DefaultFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.gray100.main,
    "& fieldset": {
      border: "none",
    },
    "&:hover fieldset": {
      border: "none",
    },
    "&.Mui-focused fieldset": {
      border: "none",
    },
  },
  // "& .MuiOutlinedInput-notchedOutline": {
  //   border: "none",
  // },
  // "&:hover .MuiOutlinedInput-notchedOutline": {
  //   border: "none",
  // },
  // ".MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
  //   border: "none",
  // },
  "& .MuiFormHelperText-root": {
    color: "lightgray",
    height: "1.5rem", // 24px
    fontSize: "0.75rem", // 12px
  },
  "& .MuiFormLabel-root": {
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.gray500.main,
    fontSize: "1rem",
  },
}));

export const DefaultTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.gray100.main,
    "& fieldset": {
      border: "none",
    },
    "&:hover fieldset": {
      border: "none",
    },
    "&.Mui-focused fieldset": {
      border: "none",
    },
  },
  // "& .MuiOutlinedInput-input": {
  //   padding: "16px",
  // },
  // "& .MuiOutlinedInput-notchedOutline": {
  //   border: "none",
  // },
  // "&:hover .MuiOutlinedInput-notchedOutline": {
  //   border: "none",
  // },
  // "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
  //   border: "none",
  // },
  "& .MuiFormHelperText-root": {
    color: "lightgray",
    height: "1.5rem", // 24px
    fontSize: "0.75rem", // 12px
  },
  "& .MuiFormLabel-root": {
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.gray500.main,
    fontSize: "1rem",
    zIndex: 1,
  },
}));

export const SearchBox = styled(Box)(({ theme }) => ({
  minHeight: "36px",
  height: "36px",
  maxHeight: "36px",
  border: 0,
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.gray300.main,
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

export const FixedHeightPaper = styled(Paper)(
  ({ theme, isdesktop, mobileheight }) => ({
    display: "flex",
    flexDirection: "column",
    height: isdesktop ? `calc(100dvh - 64px - ${theme.spacing(4)})` : "auto", // onDesktop: fixed height, onMobile: auto to enable hiding address bar
    minHeight: isdesktop
      ? `calc(100dvh - 64px - ${theme.spacing(4)})`
      : `calc(100dvh - ${mobileheight}px - 64px)`,
    marginTop: isdesktop ? 0 : `${mobileheight}px`, // mobile top bar
    marginBottom: isdesktop ? 0 : "64px", // mobile bottom navbar
    borderTop: isdesktop ? `1px solid ${theme.palette.divider}` : 0,
    borderRadius: isdesktop ? "32px 32px 0px 0px" : "0px 0px 0px 0px",
  })
);

export const StyledMuiLink = styled(MuiLink)(({ theme }) => ({
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
