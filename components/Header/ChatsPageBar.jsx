import { useContext, useRef } from "react";
import { styled } from "@mui/material/styles";
import { AppBar, Box, Toolbar, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { GlobalContext } from "../Context/ShareContexts";

const ChatsPageBar = () => {
  const { chat, setChat, chatPartner, setChatPartner, onMedia } =
    useContext(GlobalContext);

  return (
    <AppBar
      position="static"
      sx={{
        color: "text.primary",
        backgroundColor: "#ffffff",
        borderBottom: 1.5,
        borderColor: "#dbdbdb",
      }}
      elevation={0}
    >
      {/* mobile version */}
      {!onMedia.onDesktop && (
        <Toolbar
          sx={{
            minHeight: 0,
            "@media (min-width: 600px)": {
              minHeight: 0,
            },
            height: "48px",
            paddingX: 1.5,
          }} // 1.5 to match navbar icon and listitem
          disableGutters // disable auto padding
        >
          {(chat && chatPartner) === null ? (
            // list version
            <Box sx={{ width: "100%", display: "flex" }} />
          ) : (
            // info version
            <Box>
              <Button
                sx={{
                  backgroundColor: "#f0f0f0",
                  color: "gray",
                  borderRadius: "10px",
                }}
                onClick={() => {
                  setChat(null);
                  setChatPartner(null);
                }}
              >
                <ArrowBackIosRoundedIcon />
              </Button>
            </Box>
          )}
        </Toolbar>
      )}
    </AppBar>
  );
};

export default ChatsPageBar;
