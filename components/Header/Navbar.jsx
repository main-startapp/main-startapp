import { AppBar, Toolbar, Box, Link as MuiLink, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import NextLink from "next/link";
import ExportedImage from "next-image-export-optimizer";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PeopleIcon from "@mui/icons-material/People";
import UserIconMenu from "./UserIconMenu";

const Navbar = () => {
  // url
  const url = new URL(window.location.href);

  return (
    <AppBar color="background" elevation={0} position="static">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "center",
          // minHeight: 0,
          // "@media (min-width: 600px)": {
          //   minHeight: 0,
          // },
          height: "65px", // 64+border
          borderBottom: 1,
          borderColor: "divider",
        }}
        disableGutters
      >
        <Box
          sx={{
            mx: 4,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
            width: "100%",
            maxWidth: "1392px",
          }}
        >
          <ExportedImage
            src="/images/EDIUMPlatformLogo256.png"
            placeholder=""
            height={40}
            width={40}
          />
          {/* tabs */}
          {/* https://stackoverflow.com/questions/32378953/keep-the-middle-item-centered-when-side-items-have-different-widths */}
          <Stack direction="row" spacing={8}>
            <NextLink href="/">
              <LinkIconBox
                sx={{
                  ":hover": {
                    cursor: "pointer",
                  },
                  borderBottom: url.pathname === "/" ? 2 : 0,
                }}
              >
                <DashboardIcon
                  color={
                    url.pathname === "/" ? "text.primary" : "unselectedIcon"
                  }
                  sx={{
                    height: "44px",
                    fontSize: "28px",
                  }}
                />
                <PageLink
                  color={
                    url.pathname === "/"
                      ? "text.primary"
                      : "unselectedIcon.main"
                  }
                >
                  {"Projects"}
                </PageLink>
              </LinkIconBox>
            </NextLink>
            <NextLink href="/events/">
              <LinkIconBox
                sx={{
                  ":hover": {
                    cursor: "pointer",
                  },
                  borderBottom: url.pathname === "/events/" ? 2 : 0,
                }}
              >
                <DateRangeIcon
                  color={
                    url.pathname === "/events/"
                      ? "text.primary"
                      : "unselectedIcon"
                  }
                  sx={{
                    height: "44px",
                    fontSize: "28px",
                  }}
                />
                <PageLink
                  color={
                    url.pathname === "/events/"
                      ? "text.primary"
                      : "unselectedIcon.main"
                  }
                >
                  {"Events"}
                </PageLink>
              </LinkIconBox>
            </NextLink>
            <NextLink href="/students/">
              <LinkIconBox
                sx={{
                  ":hover": {
                    cursor: "pointer",
                  },
                  borderBottom: url.pathname === "/students/" ? 2 : 0,
                }}
              >
                <PeopleIcon
                  color={
                    url.pathname === "/students/"
                      ? "text.primary"
                      : "unselectedIcon"
                  }
                  sx={{
                    height: "44px",
                    fontSize: "28px",
                  }}
                />
                <PageLink
                  color={
                    url.pathname === "/students/"
                      ? "text.primary"
                      : "unselectedIcon.main"
                  }
                >
                  {"Students"}
                </PageLink>
              </LinkIconBox>
            </NextLink>
          </Stack>

          <UserIconMenu iconHeight="40px" avatarHeight="40px" />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

const LinkIconBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
}));

// since the nav bar is fixed height, the font should also use fixed size
const PageLink = styled(MuiLink)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: theme.typography.fontWeightMedium,
  textDecoration: "none",
  height: "20px",
  display: "flex",
  alignItems: "end",
}));
