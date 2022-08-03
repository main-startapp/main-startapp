import {
  Box,
  Button,
  Grid,
  IconButton,
  styled,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { TeamContext } from "../Context/ShareContexts";
import TeamJoinRequestListItem from "./TeamJoinRequestListItem";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";

const TeamJoinRequestList = () => {
  // context
  const { joinRequests, project } = useContext(TeamContext);

  // local vars
  const [projectJoinRequests, setProjectJoinRequests] = useState([]);
  useEffect(() => {
    const filteredJRs = joinRequests.filter(
      (request) => request.project_id === project?.id
    );
    setProjectJoinRequests(filteredJRs);
    return filteredJRs;
  }, [joinRequests, project]);

  const sliderSettings = {
    //  arrows: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: false,
    dots: false,
    draggable: false,
  };

  const StyledSlider = styled(Slider)`
    .slick-prev {
      left: -50px;
    }

    .slick-next {
      right: -50px;
    }

    .slick-prev,
    .slick-next {
      width: 50px;
      height: 50px;
    }

    .slick-prev:before,
    .slick-next:before {
      font-size: 50px;
      color: SteelBlue;
    }
  `;

  return (
    <Box
      sx={{
        // height: "400px",
        border: 1,
        borderRadius: 4,
        borderColor: "text.secondary",
        boxShadow: 0,
        display: "flex",
        flexDirection: "column",
        // backgroundColor: "green",
      }}
    >
      <Typography
        sx={{
          fontWeight: "bold",
          color: "black",
          // backgroundColor: "#3e95c2",
          // borderTopLeftRadius: 15,
          // borderTopRightRadius: 15,
          height: "50px",
          display: "flex",
          alignItems: "center",
        }}
        color="text.primary"
      >
        &emsp; {"Join Requests"}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: "80%" }}>
          <StyledSlider {...sliderSettings}>
            {projectJoinRequests.map((request) => (
              <div key={request.project_id}>
                <TeamJoinRequestListItem request={request} />
              </div>
            ))}
          </StyledSlider>
        </Box>
      </Box>
    </Box>
  );
};

export default TeamJoinRequestList;
