import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  PaletteMode,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useAppDispatch } from "../store";
import { useSelector } from "react-redux";
import { RootState } from "../store/reducer";
import userSlice from "../slices/user";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { grey } from "@mui/material/colors";

interface Props {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

const HeaderBar = ({ mode, toggleColorMode }: Props) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { id, name } = useSelector((state: RootState) => state.userReducer);

  const onClickLogout = () => {
    dispatch(userSlice.actions.setUserLogout());
  };

  return (
    <Stack
      bgcolor={theme.palette.background.default}
      height={65}
      flexDirection={"row"}
      justifyContent={"space-between"}
      pr={3}
      pl={1}
    >
      <Stack justifyContent={"center"}>
        <IconButton aria-label="delete" size="medium">
          <KeyboardDoubleArrowLeftIcon
            fontSize="inherit"
            sx={{ color: theme.palette.text.primary }}
          />
        </IconButton>
      </Stack>
      <Stack flexDirection={"row"} gap={1}>
        <Stack justifyContent={"center"}>
          <IconButton
            aria-label="delete"
            size="medium"
            onClick={toggleColorMode}
          >
            {mode === "dark" ? (
              <DarkModeOutlinedIcon
                fontSize="inherit"
                sx={{ color: theme.palette.text.primary }}
              />
            ) : (
              <WbSunnyOutlinedIcon
                fontSize="inherit"
                sx={{ color: theme.palette.text.primary }}
              />
            )}
          </IconButton>
        </Stack>
        <Stack justifyContent={"center"}>
          <IconButton aria-label="delete" onClick={onClickLogout} size="medium">
            <ExitToAppOutlinedIcon
              fontSize="inherit"
              sx={{ color: theme.palette.text.primary }}
            />
          </IconButton>
        </Stack>
        <Stack flexDirection={"row"} justifyContent={"space-evenly"} gap={1}>
          <Box alignContent={"center"}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
              <Typography color={theme.palette.primary.contrastText}>
                {id.substring(0, 2).toUpperCase()}
              </Typography>
            </Avatar>
          </Box>
          <Box alignContent={"center"} sx={{}}>
            {name}
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default HeaderBar;
