import { useContext } from "react";
import { StudentContext } from "../Context/ShareContexts";
import StudentListCard from "./StudentListCard";

const StudentList = () => {
  // context
  const { currentUser, students, setStudents, currentStudent } =
    useContext(StudentContext);

  return (
    <>
      {students.map((student) => (
        <StudentListCard key={student.uid} student={student} />
      ))}
    </>
  );
};

export default StudentList;
