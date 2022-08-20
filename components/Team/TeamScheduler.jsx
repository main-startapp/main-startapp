import { Box, Button, Dialog, DialogContent, Typography } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import moment from "moment";
import ScheduleSelector from "react-schedule-selector";
import { useAuth } from "../Context/AuthContext";
import { TeamContext } from "../Context/ShareContexts";
import { db } from "../../firebase";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

const TeamScheduler = () => {
  // context
  const { currentUser } = useAuth();
  const { projectExt, setProjectExt } = useContext(TeamContext);

  // local var
  const [tableOpen, setTableOpen] = useState(false);
  const handleTableOpen = () => {
    setTableOpen(true);
  };
  const handleTableClose = () => {
    setTableOpen(false);
  };

  const [isClickable, setIsClickable] = useState(true);
  useEffect(() => {
    if (isClickable) return;
    // isClickable was false, set back to true after 1s delay
    const timeout1s = setTimeout(() => {
      setIsClickable(true);
    }, 1000);
    return () => {
      clearTimeout(timeout1s);
    };
  }, [isClickable]); // reset send button in 1s

  const [schedule, setSchedule] = useState([]);
  const scheduleIndex = useMemo(() => {
    const foundIndex = projectExt?.schedules?.findIndex(
      (schedule) => schedule.uid === currentUser?.uid
    );
    if (typeof foundIndex === "number") return foundIndex;
    return -1;
  }, [currentUser?.uid, projectExt?.schedules]);

  useEffect(() => {
    if (!projectExt || scheduleIndex < 0) return;
    setSchedule(projectExt?.schedules[scheduleIndex]?.availability);
    return;
  }, [projectExt, scheduleIndex]);

  // defaults: https://github.com/bibekg/react-schedule-selector/blob/master/src/lib/ScheduleSelector.tsx
  const startDate = new Date(1970, 0, 5); // this has to be a Sunday(depends on the first day), only workaround using this lib, month is 0-indexed
  const timeLabel = (date) => {
    const minutes = date.getMinutes();
    return (
      <Typography sx={{ textAlign: "right", mr: 2 }}>
        {minutes === 0 ? moment(date).format("h:mm a") : ""}
      </Typography>
    );
  };
  const dateCell = (datetime, selected, refSetter) => {
    const cellColor = selected ? "lightpink" : "lightblue"; // light

    return (
      <Box
        ref={refSetter}
        sx={{
          backgroundColor: cellColor,
          height: "100%",
          width: "100%",
          "&:hover": {
            backgroundColor: "steelblue",
          },
        }}
      />
    );
  };
  const handleScheduleChange = (e) => {
    setSchedule(e);
  };
  const handleScheduleClear = () => {
    setSchedule([]);
  };
  const handleSubmitSchedule = async () => {
    if (!isClickable) return;
    // ready
    setIsClickable(false);
    const docID = projectExt?.id;
    let newSchedules = projectExt?.schedules ? projectExt.schedules : [];
    if (scheduleIndex < 0) {
      console.log("pushed");
      newSchedules.push({ uid: currentUser?.uid, availability: schedule });
    } else {
      console.log("found index", scheduleIndex);
      newSchedules[scheduleIndex].availability = schedule;
    }
    const docRef = doc(db, "projects_ext", docID);
    let projectExtRef = {
      ...projectExt,
      // update schedules
      schedules: newSchedules,
      last_timestamp: serverTimestamp(),
    };
    // remove id to keep the doc consistent
    delete projectExtRef?.id;
    const projectExtModRef = updateDoc(docRef, projectExtRef).catch((err) => {
      console.log("updateDoc() error: ", err);
    });
    await projectExtModRef;
  };

  console.log(schedule);

  return (
    <Box>
      <Button onClick={handleTableOpen}>Open Table</Button>

      <Dialog
        open={tableOpen}
        onClose={handleTableClose}
        fullWidth
        maxWidth="lg"
      >
        <DialogContent
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography>{"Click and Drag to Toggle"}</Typography>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Button onClick={handleScheduleClear}>Clear</Button>
            <Button onClick={handleSubmitSchedule}>Save</Button>
          </Box>
          <Box sx={{ width: "50%" }}>
            <ScheduleSelector
              selection={schedule}
              startDate={startDate}
              dateFormat="ddd"
              numDays={7}
              minTime={8}
              maxTime={24}
              hourlyChunks={2}
              renderDateCell={dateCell}
              renderTimeLabel={timeLabel}
              onChange={(e) => {
                handleScheduleChange(e);
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TeamScheduler;
