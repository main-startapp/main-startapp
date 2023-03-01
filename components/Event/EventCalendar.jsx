import { Box, Modal, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useContext, useState } from "react";
import { EventContext, GlobalContext } from "../Context/ShareContexts";
import { FixedHeightPaper } from "../Reusable/Resusable";
// full cal
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
// icons
import EventIcon from "@mui/icons-material/Event";
import ChairIcon from "@mui/icons-material/Chair";
import WorkIcon from "@mui/icons-material/Work";
import { EventInfoContent } from "./EventInfo";

const EventCalendar = () => {
  // context
  const { onMedia } = useContext(GlobalContext);
  const { fullEvents, setFullEvent } = useContext(EventContext);
  const theme = useTheme();

  // modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // xiao ming color scheme no.145
  // pink #f5d1d9; yellow #f5eacf; blue #d0e7f4
  // roast red #ff5583; roast yellow #ffbb3b; roast blue #1396ff
  function getColor(eventType) {
    switch (eventType) {
      case "Festival":
      case "Party":
      case "Sports":
        return "#f5d1d9";

      case "Community Event":
      case "Concert":
      case "Hackathon":
        return "#f5eacf";

      case "Case Competition":
      case "Conference":
      case "Info Session":
      case "Networking Session":
      case "Workshop":
        return "#d0e7f4";

      default:
        return "#bbb7b6"; // gray granite
    }
  }

  const StyledIcon = (props) => {
    switch (props.type) {
      case "Festival":
      case "Party":
      case "Sports":
        return <ChairIcon {...props} />;

      case "Community Event":
      case "Concert":
      case "Hackathon":
        return <WorkIcon {...props} />;

      default:
        return <EventIcon {...props} />;
    }
  };

  const styledTitle = (viewType, event, eventType) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        overflow: "hidden",
        width: "100%",
        maxWidth: "100%",
        borderWidth: viewType === "dayGridMonth" ? "2px" : "0px",
        backgroundColor: getColor(eventType),
        borderStyle: "solid",
        borderColor: getColor(eventType),
        borderRadius: "4px",
        paddingX: viewType === "dayGridMonth" ? "4px" : "0px",
        paddingY: viewType === "dayGridMonth" ? "2px" : "0px",
        marginX: viewType === "dayGridMonth" ? "2px" : "0px",
      }}
    >
      <StyledIcon
        type={eventType}
        sx={{
          fontSize: viewType === "dayGridMonth" ? "13px" : "1rem",
          //color: viewType === "dayGridMonth" ? getColor(eventType) : "black",
          color: "rgba(0,0,0,0.87)",
        }}
      />
      <Typography
        sx={
          viewType === "dayGridMonth"
            ? {
                ml: "4px",
                overflow: "hidden",
                //whiteSpace: "nowrap",
                //textOverflow: "ellipsis",
                fontSize: "13px",
                fontWeight: "medium",
                color: "rgba(0,0,0,0.87)",
              }
            : { ml: "16px", fontSize: "1rem", color: "rgba(0,0,0,0.87)" }
        }
      >
        {event.title}
      </Typography>
    </Box>
  );

  function parseEvent(eventData) {
    return {
      id: eventData.event.id,
      title: eventData.event.title,
      start: eventData.event.start_date,
      end: eventData.event.end_date,
      type: eventData.event.category, //!todo: may renamed to type
      fullEvent: eventData,
    };
  }

  function renderEvent(eventInfo) {
    return styledTitle(
      eventInfo.view.type,
      eventInfo.event,
      eventInfo.event.extendedProps?.type
    );
  }

  function clickEvent(eventClickInfo) {
    setFullEvent(eventClickInfo.event.extendedProps?.fullEvent);
    handleOpen();
  }

  return (
    <FixedHeightPaper
      elevation={onMedia.onDesktop ? 2 : 0}
      isdesktop={onMedia.onDesktop ? 1 : 0}
      mobileheight={0}
      sx={{
        paddingTop: onMedia.onDesktop ? "32px" : 0,
      }}
    >
      <Box
        id="eventinfo-box"
        sx={{
          minHeight: "1024px",
          flexGrow: 1,
          overflowY: "scroll",
          paddingTop: onMedia.onDesktop ? 2 : 2, // align with project list
          paddingBottom: onMedia.onDesktop ? 6 : 4, // enough space to not covered by messages; overall padding top = 2*8+32 = 48 = 6*8 = padding bottom
          paddingLeft: onMedia.onDesktop ? 4 : 2,
          paddingRight: onMedia.onDesktop
            ? `calc(${theme.spacing(4)} - 0.4rem)`
            : 2, // considering scrollbar
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin, listPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          fixedWeekCount={false}
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "dayGridMonth,listWeek", // user can switch between the two}
          }}
          buttonText={{
            month: "Month",
            list: "Week",
          }}
          events={fullEvents}
          eventDataTransform={parseEvent}
          eventDisplay={"list-item"}
          eventContent={renderEvent}
          eventClick={clickEvent}
          height={"100%"}
        />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="event-calendar-modal-event-info"
        >
          <Paper
            elevation={2}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              maxHeight: "75dvh",
              minWidth: "572px",
              maxWidth: "840px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "32px 32px 32px 32px",
              paddingY: "32px",
            }}
          >
            <Box
              sx={{
                overflowY: "scroll",
                paddingLeft: 4,
                paddingRight: `calc(${theme.spacing(4)} - 0.4rem)`, // considering scrollbar
                paddingY: 0,
              }}
            >
              <EventInfoContent />
            </Box>
          </Paper>
        </Modal>
      </Box>
    </FixedHeightPaper>
  );
};

export default EventCalendar;
