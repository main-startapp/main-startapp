import { Box, Card } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../Context/ShareContexts";

const TeamJoinRequestListItem = (props) => {
  const requesterUID = props.requesterUID;
  const { students } = useContext(GlobalContext);

  // local vars
  const [requestingStudent, setRequestingStudent] = useState(null);
  useEffect(() => {
    const found = students.find((student) => student.uid === requesterUID);

    if (!found) return;

    setRequestingStudent(found);

    return found;
  }, [requesterUID, students]);

  return (
    <Card
      variant="outlined"
      sx={{
        // mr: 3,
        // mt: 3,
        backgroundColor: "#fafafa",
        border: "1px solid black",
        borderRadius: 4,
        height: "100%",

        width: "200px",
        height: "250px",
      }}
    >
      {requestingStudent?.name}
    </Card>
  );
};

export default TeamJoinRequestListItem;
