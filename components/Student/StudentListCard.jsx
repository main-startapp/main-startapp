import { Card, CardHeader } from "@mui/material";
import { useContext } from "react";
import { StudentContext } from "../Context/ShareContexts";

const StudentListCard = (props) => {
  const student = props.student;

  // context
  const { setStudent } = useContext(StudentContext);

  return (
    <Card variant="outlined">
      <CardHeader title={student.name} />
    </Card>
  );
};

export default StudentListCard;
