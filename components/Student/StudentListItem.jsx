import { useContext, useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  ListItem,
  Typography,
} from "@mui/material";
import { GlobalContext, StudentContext } from "../Context/ShareContexts";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useRouter } from "next/router";
import { handleConnect, ordinal_suffix_of } from "../Reusable/Resusable";
import ExportedImage from "next-image-export-optimizer";

const StudentListItem = (props) => {
  const index = props.index;
  const student = props.student;
  const last = props.last;

  // context
  const { chats, ediumUser, setChatPartner, setForceChatExpand } =
    useContext(GlobalContext);
  const { setStudent } = useContext(StudentContext);

  // local
  const router = useRouter();

  const positionList = student?.desired_position
    ? student?.other_positions
      ? [student.desired_position, ...student.other_positions]
      : [student.desired_position]
    : [];

  const interestList = student?.field_of_interest
    ? student?.interests
      ? [student.field_of_interest, ...student.interests]
      : [student.field_of_interest]
    : [];

  return (
    <ListItem
      onClick={() => {
        setStudent(student);
      }}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        borderBottom: 1,
        borderColor: "divider",
        "&:hover": {
          backgroundColor: "gray100.main",
        },
        overflow: "hidden",
        paddingY: 2,
        paddingX: 2,
      }}
    >
      <Box
        id="studentlistitem-upper-box"
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* project icon uploaded by users*/}
        <Avatar
          sx={{
            mr: 2,
            height: "48px",
            width: "48px",
          }}
          src={student?.photo_url}
        >
          <UploadFileIcon />
        </Avatar>
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",

              alignItems: "center",
            }}
          >
            <Typography
              variant="h2"
              sx={{ mr: 2, fontSize: "1rem", fontWeight: "bold" }}
            >
              {student?.name}
            </Typography>
            <ExportedImage
              src="/images/ubc_logo_32.png"
              alt=""
              placeholder="empty"
              height={24}
              width={17}
            />
          </Box>
          {positionList.length > 0 && (
            <Box sx={{ mt: 1, height: "1.75rem", overflow: "hidden" }}>
              {positionList.map((position, index) => (
                <Chip
                  key={index}
                  color={index === 0 ? "primary" : "lightPrimary"}
                  label={position}
                  sx={{
                    mr: 1,
                    mb: 1,
                    fontSize: "0.75rem",
                    fontWeight: "medium",
                    height: "1.5rem",
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
        <IconButton
          color="primary"
          disabled={student?.uid === ediumUser?.uid}
          onClick={(e) => {
            e.stopPropagation();
            handleConnect(
              chats,
              student,
              ediumUser,
              setChatPartner,
              setForceChatExpand
            );
            router.push("/chats");
          }}
          sx={{
            padding: 0,
            mr: 1,
            height: "32px",
            width: "32px",
          }}
        >
          <PersonAddAlt1Icon sx={{ height: "32px", width: "32px" }} />
        </IconButton>
      </Box>

      <Typography
        color="text.secondary"
        sx={{
          mt: 2,
          mb: 2,
          display: "-webkit-box",
          overflow: "hidden",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 1,
          fontSize: "0.875rem",
        }}
      >
        {student?.year_of_ed !== (null || undefined) &&
          ordinal_suffix_of(student.year_of_ed) + " year"}
        {student?.major !== (null || undefined) && " " + student.major}
      </Typography>

      {interestList.length > 0 && (
        <Box sx={{ height: "1.75rem", overflow: "hidden" }}>
          {interestList.map((interest, index) => {
            return (
              <Chip
                key={index}
                color="lightPrimary"
                label={interest}
                sx={{
                  mr: 1,
                  mb: 1,
                  fontSize: "0.75rem",
                  fontWeight: "medium",
                  height: "1.5rem",
                }}
              />
            );
          })}
        </Box>
      )}
    </ListItem>
  );
};

export default StudentListItem;
