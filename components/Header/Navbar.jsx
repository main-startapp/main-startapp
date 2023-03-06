import { AppBar, Toolbar, Box, Stack, Typography } from "@mui/material";
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
            mx: 8,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            //height: "100%",
            width: "100%",
            maxWidth: "1312px",
          }}
        >
          {/* https://stackoverflow.com/questions/46973910/accessing-files-from-firebase-storage-vs-firebase-hosting */}
          <ExportedImage
            src="/images/edium_v4_512.png"
            alt=""
            height={40}
            width={40}
          />
          {/* tabs */}
          {/* https://stackoverflow.com/questions/32378953/keep-the-middle-item-centered-when-side-items-have-different-widths */}
          <Stack direction="row" spacing={8}>
            <NextLink href="/" style={{ color: "inherit" }}>
              <LinkIconBox url={url} pathname="/">
                <DashboardIcon
                  color={url.pathname === "/" ? "text.primary" : "gray700"}
                  sx={{
                    height: "40px",
                    fontSize: "28px",
                  }}
                />
                <LinkTypography url={url} pathname="/">
                  {"Projects"}
                </LinkTypography>
              </LinkIconBox>
            </NextLink>
            <NextLink
              href="/events/"
              style={{
                color: "inherit",
              }}
            >
              <LinkIconBox url={url} pathname="/events/">
                <DateRangeIcon
                  color={
                    url.pathname === "/events/" ? "text.primary" : "gray700"
                  }
                  sx={{
                    height: "40px",
                    fontSize: "28px",
                  }}
                />
                <LinkTypography url={url} pathname="/events/">
                  {"Events"}
                </LinkTypography>
              </LinkIconBox>
            </NextLink>
            <NextLink
              href="/students/"
              style={{
                color: "inherit",
              }}
            >
              <LinkIconBox url={url} pathname="/students/">
                <PeopleIcon
                  color={
                    url.pathname === "/students/" ? "text.primary" : "gray700"
                  }
                  sx={{
                    height: "40px",
                    fontSize: "28px",
                  }}
                />
                <LinkTypography url={url} pathname="/students/">
                  {"Students"}
                </LinkTypography>
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

const LinkIconBox = styled(Box)(({ theme, url, pathname }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  borderBottomWidth: url.pathname === pathname ? 2 : 0,
  borderBottomColor: theme.palette.text.primary,
  borderBottomStyle: "solid",
}));

const LinkTypography = styled(Typography)(({ theme, url, pathname }) => ({
  height: "24px",
  fontSize: "16px",
  fontWeight: theme.typography.fontWeightMedium,
  color:
    url.pathname === pathname
      ? theme.palette.text.primary
      : theme.palette.gray700.main,
}));
