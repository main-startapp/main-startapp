import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState, useRef, useMemo } from "react";
import { db } from "../../firebase";
import { GlobalContext } from "../Context/ShareContexts";
import { handleConnect } from "../Reusable/Resusable";
import ReactCardFlip from "react-card-flip";
import FaceRetouchingNaturalOutlinedIcon from "@mui/icons-material/FaceRetouchingNaturalOutlined";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkIcon from "@mui/icons-material/Link";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";

const TeamJoinRequestListItem = (props) => {
  // props
  const request = props.request; // chat_id, project_id, position_id, creator_uid, requester_uid, status
  const projectID = request.project_id;
  const positionID = request.position_id;
  const requesterUID = request.requester_uid;
  const chatID = request.chat_id;
  const status = request.status;

  // context
  const { users, chats, ediumUser, setChatPartner, setForceChatExpand } =
    useContext(GlobalContext);

  // local vars
  const currentUID = ediumUser?.uid;

  // requester's student data
  const [requestingStudent, setRequestingStudent] = useState(null);
  useEffect(() => {
    const found = users.find((student) => student.uid === requesterUID);
    if (!found) return; // is this even possible?

    setRequestingStudent(found);
    return found;
  }, [requesterUID, users]);

  // flip card
  const [isFlipped, setIsFlipped] = useState(false);
  const handleCardFlip = (e) => {
    e.preventDefault();
    setIsFlipped(!isFlipped);
  };

  // dialog modal
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [declineMsg, setDeclineMsg] = useState("");
  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  const handleReply = async (newStatus) => {
    // 1. find chat and send msg
    // !todo: update to newer infastructure
    const foundChat = chats.find((chat) => chat.id === chatID);
    if (!foundChat) return;
    const msgStr = declineMsg
      ? declineMsg
      : "Sorry. Creator didn't leave a note";
    const messageRef = {
      text: msgStr,
      sent_by: currentUID,
      sent_at: serverTimestamp(),
    };
    const receiver_unread_key = requesterUID + "_unread";
    const chatDocRef = doc(db, "chats", chatID);
    let newJoinRequests = foundChat.join_requests;
    const foundIndex = newJoinRequests.findIndex(
      (req) =>
        req.project_id === projectID &&
        req.position_id === positionID &&
        req.requester_uid === requesterUID
    );
    newJoinRequests[foundIndex] = {
      ...newJoinRequests[foundIndex],
      status: newStatus,
    };
    const chatRef = {
      ...foundChat,
      [receiver_unread_key]: foundChat[receiver_unread_key] + 1,
      join_requests: newJoinRequests,
      last_text: msgStr,
      last_timestamp: serverTimestamp(),
    };
    delete chatRef.id;
    const chatModRef = updateDoc(chatDocRef, chatRef).catch((error) => {
      console.log(error?.message);
    });
    const msgCollectionRef = collection(db, "chats", chatID, "messages");
    const msgModRef = addDoc(msgCollectionRef, messageRef).catch((error) => {
      console.log(error?.message);
    });
    await chatModRef;
    await msgModRef;
  };

  // detailed student info modal
  const [isStudentCardOpen, setIsStudentCardOpen] = useState(false);
  const handleStudentCardOpen = () => {
    setIsStudentCardOpen(true);
  };
  const handleStudentCardClose = () => {
    setIsStudentCardOpen(false);
  };

  // ref to detect overflow
  // !todo: optim
  const cardRef = useRef();
  const isOverflow = () => {
    return cardRef?.current?.clientHeight < cardRef?.current?.scrollHeight
      ? true
      : false;
  };

  return (
    <ReactCardFlip isFlipped={isFlipped}>
      <Card
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          ml: 1.5,
          mr: 1.5,
          backgroundColor: "#fafafa",
          border: "1px solid black",
          borderRadius: 4,
          minWidth: "175px",
          maxHeight: "300px",
          minHeight: "300px",
        }}
        onClick={handleCardFlip}
      >
        <Avatar
          sx={{
            mb: 1.5,
            width: "5em",
            height: "5em",
            border: 1,
            borderColor: "#dbdbdb",
            color: "#dbdbdb",
            backgroundColor: "#ffffff",
          }}
          src={requestingStudent?.photo_url}
          referrerPolicy="no-referrer"
        />

        <Typography sx={{ fontWeight: "bold", fontSize: "1em" }}>
          {requestingStudent?.name}
        </Typography>
        <Typography sx={{ fontSize: "0.9em" }}>
          {requestingStudent?.desired_position}
        </Typography>
        <Typography sx={{ fontSize: "0.9em" }}>
          {"Skill level: "}
          {requestingStudent?.skill_level}
        </Typography>

        <Button
          disableElevation
          size="small"
          sx={{
            mt: 1.5,
            mb: 0.5,
            borderRadius: 4,
            backgroundColor: "#3e95c2",
            width: 90,
          }}
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            handleConnect(
              chats,
              requestingStudent,
              ediumUser,
              setChatPartner,
              setForceChatExpand
            );
          }}
        >
          <Typography sx={{ fontSize: "0.9em" }}>Message</Typography>
        </Button>

        <Button
          disableElevation
          size="small"
          sx={{
            borderRadius: 4,
            backgroundColor: "#3e95c2",
            width: 90,
          }}
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            handleDialogOpen();
          }}
        >
          <Typography sx={{ fontSize: "0.9em" }}>Decline</Typography>
        </Button>
        <Dialog open={isDialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Message</DialogTitle>
          <DialogContent sx={{ paddingBottom: 0 }}>
            <DialogContentText>
              Leave a note to let them know this position was not a match.
            </DialogContentText>
            <TextField
              autoFocus
              multiline
              minRows={5}
              margin="dense"
              id="declineMsg"
              // label="Message"
              value={declineMsg}
              fullWidth
              onChange={(e) => setDeclineMsg(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleReply("declined");
                handleDialogClose();
              }}
            >
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </Card>

      <Card
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
          justifyContent: "start",
          ml: 1.5,
          mr: 1.5,
          backgroundColor: "#fafafa",
          border: "1px solid black",
          borderRadius: 4,
          minWidth: "175px",
          maxHeight: "300px",
          minHeight: "300px",
          overflow: "hidden",
        }}
        onClick={handleCardFlip}
      >
        <Box
          sx={{
            mx: 2,
            mt: 2,
            mb: isOverflow ? 0 : 2,
            display: "flex",
            flexDirection: "column",
            // flexFlow: "column wrap",
            overflow: "hidden",
          }}
          ref={cardRef}
        >
          <IconButton
            sx={{ position: "fixed", top: 0, right: 10 }}
            onClick={(e) => {
              e.stopPropagation();
              handleStudentCardOpen();
            }}
          >
            <OpenInFullRoundedIcon />
          </IconButton>
          <Modal
            open={isStudentCardOpen}
            onClose={(e) => {
              e.stopPropagation();
              handleStudentCardClose();
            }}
            aria-labelledby="modal-studentcard-title"
            aria-describedby="modal-studentcard-description"
          >
            <Card
              variant="outlined"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "left",
                justifyContent: "start",
                backgroundColor: "#fafafa",
                border: "1px solid black",
                borderRadius: 4,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
              }}
            >
              <Box
                sx={{
                  mx: 1.5,
                  my: 3,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* awards */}
                {requestingStudent?.awards?.length > 0 && (
                  <Typography sx={{ fontWeight: "bold", fontSize: "1em" }}>
                    {"Awards"}
                  </Typography>
                )}
                {requestingStudent?.awards?.length > 0 &&
                  requestingStudent.awards.map((awardStr, index) => {
                    if (awardStr.toLowerCase() === "betauser") {
                      return (
                        <Tooltip key={index} title="Beta User">
                          <FaceRetouchingNaturalOutlinedIcon
                            sx={{ fontSize: "2em", mr: 1 }}
                          />
                        </Tooltip>
                      );
                    }
                  })}
                {/* social media links */}
                {requestingStudent?.social_media?.length > 0 && (
                  <Typography
                    sx={{ fontWeight: "bold", fontSize: "1em", mt: 1 }}
                  >
                    {"Social media"}
                  </Typography>
                )}
                {requestingStudent?.social_media?.length > 0 &&
                  requestingStudent.social_media.map((link, index) => {
                    if (link.toLowerCase().includes("linkedin")) {
                      return (
                        <Link
                          key={index}
                          target="_blank"
                          href={link}
                          rel="noreferrer"
                        >
                          <LinkedInIcon
                            sx={{ fontSize: "2em", mr: 1, color: "black" }}
                          />
                        </Link>
                      );
                    } else if (link.toLowerCase().includes("facebook")) {
                      return (
                        <Link
                          key={index}
                          target="_blank"
                          href={link}
                          rel="noreferrer"
                        >
                          <FacebookIcon
                            sx={{ fontSize: "2em", mr: 1, color: "black" }}
                          />
                        </Link>
                      );
                    } else if (link.toLowerCase().includes("instagram")) {
                      return (
                        <Link
                          key={index}
                          target="_blank"
                          href={link}
                          rel="noreferrer"
                        >
                          <InstagramIcon
                            sx={{ fontSize: "2em", mr: 1, color: "black" }}
                          />
                        </Link>
                      );
                    } else {
                      return (
                        <Link
                          key={index}
                          target="_blank"
                          href={link}
                          rel="noreferrer"
                        >
                          <LinkIcon
                            sx={{ fontSize: "2em", mr: 1, color: "black" }}
                          />
                        </Link>
                      );
                    }
                  })}
                {/* past experience */}
                {requestingStudent?.past_exp?.length > 0 && (
                  <Typography
                    sx={{ fontWeight: "bold", fontSize: "1em", mt: 1 }}
                  >
                    {"Past experience"}
                  </Typography>
                )}
                {requestingStudent?.past_exp?.length > 0 &&
                  requestingStudent.past_exp.map((exp, index) => (
                    <Typography
                      key={index}
                      sx={{
                        ml: "1em",
                        mb: "1em",
                      }}
                    >
                      &bull; &nbsp; {exp}
                    </Typography>
                  ))}
              </Box>
            </Card>
          </Modal>

          {/* awards */}
          {requestingStudent?.awards?.length > 0 && (
            <Typography sx={{ fontWeight: "bold", fontSize: "1em" }}>
              {"Awards"}
            </Typography>
          )}
          {requestingStudent?.awards?.length > 0 &&
            requestingStudent.awards.map((awardStr, index) => {
              if (awardStr.toLowerCase() === "betauser") {
                return (
                  <Tooltip key={index} title="Beta User">
                    <FaceRetouchingNaturalOutlinedIcon
                      sx={{ fontSize: "2em", mr: 1 }}
                    />
                  </Tooltip>
                );
              }
            })}
          {/* social media links */}
          {requestingStudent?.social_media?.length > 0 && (
            <Typography sx={{ fontWeight: "bold", fontSize: "1em", mt: 1 }}>
              {"Social media"}
            </Typography>
          )}
          {requestingStudent?.social_media?.length > 0 &&
            requestingStudent.social_media.map((link, index) => {
              // todo!: too hacky, is there any library can do this properly?
              if (link.toLowerCase().includes("linkedin")) {
                return (
                  <Link
                    key={index}
                    target="_blank"
                    href={link}
                    rel="noreferrer"
                  >
                    <LinkedInIcon
                      sx={{ fontSize: "2em", mr: 1, color: "black" }}
                    />
                  </Link>
                );
              } else if (link.toLowerCase().includes("facebook")) {
                return (
                  <Link
                    key={index}
                    target="_blank"
                    href={link}
                    rel="noreferrer"
                  >
                    <FacebookIcon
                      sx={{ fontSize: "2em", mr: 1, color: "black" }}
                    />
                  </Link>
                );
              } else if (link.toLowerCase().includes("instagram")) {
                return (
                  <Link
                    key={index}
                    target="_blank"
                    href={link}
                    rel="noreferrer"
                  >
                    <InstagramIcon
                      sx={{ fontSize: "2em", mr: 1, color: "black" }}
                    />
                  </Link>
                );
              } else {
                return (
                  <Link
                    key={index}
                    target="_blank"
                    href={link}
                    rel="noreferrer"
                  >
                    <LinkIcon sx={{ fontSize: "2em", mr: 1, color: "black" }} />
                  </Link>
                );
              }
            })}
          {/* past experience */}
          {requestingStudent?.past_exp?.length > 0 && (
            <Typography sx={{ fontWeight: "bold", fontSize: "1em", mt: 1 }}>
              {"Past experience"}
            </Typography>
          )}
          {requestingStudent?.past_exp?.length > 0 &&
            requestingStudent.past_exp.map((exp, index) => (
              <Typography
                key={index}
                sx={{
                  ml: "1em",
                  mb: "1em",
                }}
              >
                &bull; &nbsp; {exp}
              </Typography>
            ))}
        </Box>
        {/* overflow */}
        {isOverflow && (
          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              fontWeight: "bold",
              fontSize: "1.5em",
              paddingBottom: 1.5,
            }}
          >
            {"..."}
          </Typography>
        )}
      </Card>
    </ReactCardFlip>
  );
};

export default TeamJoinRequestListItem;
