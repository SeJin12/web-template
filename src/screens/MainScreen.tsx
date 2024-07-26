import { Skeleton, Stack, useTheme } from "@mui/material";

const MainScreen = () => {
  const theme = useTheme();

  return (
    <Stack
      sx={{
        backgroundColor: theme.palette.background.default,
        height: "100vh",
        // display: "flex",
        // direction: "ltr",
        // flexDirection: "row",
      }}
    >
      <Skeleton variant="text" sx={{ fontSize: "1rem" }} />

      {/* For other variants, adjust the size with `width` and `height` */}
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="rectangular" width={210} height={60} />
      <Skeleton variant="rounded" width={210} height={60} />
    </Stack>
  );
};

export default MainScreen;
