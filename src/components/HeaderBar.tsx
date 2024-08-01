import {
  Avatar,
  Box,
  Button,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useAppDispatch } from "../store";
import { useSelector } from "react-redux";
import { RootState } from "../store/reducer";
import userSlice from "../slices/user";

const HeaderBar = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { id, name } = useSelector((state: RootState) => state.userReducer);

  const onClickLogout = () => {
    dispatch(userSlice.actions.setUserLogout());
  };

  return (
    <Stack
      bgcolor={theme.palette.background.paper}
      height={65}
      //   zIndex={10001}
      flexDirection={"row"}
      justifyContent={"end"}
      gap={2}
      pr={2}
    >
      <Stack flexDirection={"row"} justifyContent={"space-evenly"} gap={1}>
        <Box alignContent={"center"}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
            {id.substring(0, 2).toUpperCase()}
          </Avatar>
        </Box>
        <Box alignContent={"center"} sx={{}}>
          {name}
        </Box>
      </Stack>
      <Stack justifyContent={'center'}>
        <Button variant="contained" onClick={onClickLogout}>
          <Typography variant="h4">로그아웃</Typography>
        </Button>
      </Stack>
    </Stack>
  );
};

export default HeaderBar;
