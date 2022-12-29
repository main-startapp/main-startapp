import { Button } from "@mui/material";
import { useState } from "react";
import useDrivePicker from "react-google-drive-picker";
import useGoogleSheets from "use-google-sheets";

const Form = () => {
  const API_KEY = "AIzaSyB-Si9BOXFbX9W50sNPsDZqMfyAd_qCh7g";
  const CLIENT_ID =
    "373522521624-rhjmlkv7d4llpqihl50u2j9hejeltbvo.apps.googleusercontent.com";
  const [openPicker, authResponse] = useDrivePicker();
  const [sheet, setSheet] = useState(null);
  // const customViewsArray = [new google.picker.DocsView()]; // custom view
  const handleOpenPicker = () => {
    openPicker({
      clientId: CLIENT_ID,
      developerKey: API_KEY,
      viewId: "SPREADSHEETS",
      // token: token, // pass oauth token in case you already have one
      showUploadView: false,
      showUploadFolders: false,
      supportDrives: false,
      multiselect: false,
      // customViews: customViewsArray, // custom view
      callbackFunction: (data) => {
        if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
        }
        console.log(data);
        if (data?.docs?.length > 0) setSheet(data.docs[0]);
      },
    });
  };

  const { data, loading, error, refetch, called } = useGoogleSheets({
    apiKey: API_KEY,
    sheetId: sheet?.id,
  });
  console.log(data);

  return (
    <>
      <Button onClick={() => handleOpenPicker()}>Google Drive</Button>
    </>
  );
};

export default Form;
