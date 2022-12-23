import { Grid } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import {
  GlobalContext,
  TeamContext,
} from "../../components/Context/ShareContexts";
import Filler from "../../components/Filler";
import TeamInfo from "../../components/Team/TeamInfo";
import TeamProjectList from "../../components/Team/TeamProjectList";

const TeamManagement = () => {
  // context
  const { setChat, setChatPartner, setShowChat, setShowMsg, chats, ediumUser } =
    useContext(GlobalContext);
  useEffect(() => {
    setShowChat(true);
    setShowMsg(false);
    setChat(null);
    setChatPartner(null);
  }, [setChat, setChatPartner, setShowChat, setShowMsg]);

  // local vars
  // team states init
  const [project, setProject] = useState(null);
  const [projectExt, setProjectExt] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]);
  const [forceInfoUpdate, setForceInfoUpdate] = useState(false);

  // hook to find all the join requests for all the created projects
  useEffect(() => {
    const requests = [];

    chats.forEach((chat) => {
      chat?.join_requests?.forEach((request) => {
        if (ediumUser?.uid === request.creator_uid) {
          requests.push({ ...request, chat_id: chat.id });
        }
      });
    });
    setJoinRequests(requests);

    return requests;
  }, [chats, ediumUser?.uid]);

  return (
    // <TeamContext.Provider
    //   value={{
    //     project,
    //     setProject,
    //     projectExt,
    //     setProjectExt,
    //     joinRequests,
    //     forceInfoUpdate,
    //     setForceInfoUpdate,
    //   }}
    // >
    //   <Grid
    //     container
    //     spacing={0}
    //     mt={1}
    //     direction="row"
    //     alignItems="start"
    //     justifyContent="center"
    //   >
    //     {/* left comp: list of projects */}
    //     <Grid item xs={3}>
    //       <TeamProjectList />
    //     </Grid>
    //     {/* right comp: selected project's info  */}
    //     <Grid item xs={9}>
    //       <TeamInfo />
    //     </Grid>
    //   </Grid>
    // </TeamContext.Provider>
    <Filler />
  );
};

export default TeamManagement;
