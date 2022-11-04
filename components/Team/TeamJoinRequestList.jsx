import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useContext, useEffect, useState } from "react";
import { TeamContext } from "../Context/ShareContexts";
import TeamJoinRequestListItem from "./TeamJoinRequestListItem";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TeamJoinRequestList = () => {
  // context
  const { joinRequests, project } = useContext(TeamContext);

  // local vars
  const [projectJoinRequests, setProjectJoinRequests] = useState([]);
  useEffect(() => {
    const filteredJRs = joinRequests.filter(
      (request) =>
        request.project_id === project?.id && request.status === "requesting"
    );
    setProjectJoinRequests(filteredJRs);
    return filteredJRs;
  }, [joinRequests, project]);

  const sliderSettings = {
    //  arrows: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: false,
    dots: true,
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
      color: blue;
    }
  `;

  return projectJoinRequests?.length > 0 ? (
    <Box
      sx={{
        height: "400px",
        border: 1,
        borderRadius: 4,
        borderColor: "text.secondary",
        display: "flex",
        flexDirection: "column",
        // backgroundColor: "green",
        mt: 3,
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
          ml: "15px",
        }}
        color="text.primary"
      >
        {"Join Requests"}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "80%",
            paddingTop: 1.5,
            paddingBottom: 1.5,
          }}
        >
          <StyledSlider {...sliderSettings}>
            {projectJoinRequests.map((request) => (
              <TeamJoinRequestListItem
                key={request.project_id}
                request={request}
              />
            ))}
          </StyledSlider>
        </Box>
      </Box>
    </Box>
  ) : null;
};

export default TeamJoinRequestList;
