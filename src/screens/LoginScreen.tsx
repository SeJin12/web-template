import VpnKeyIcon from "@mui/icons-material/VpnKey";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { isAxiosError } from "axios";
import { useRef } from "react";
import bg from "../assets/main.jpg";
import { Toast } from "../components/CustomToast";
import axiosInstance from "../config/api";
import userSlice from "../slices/user";
import { useAppDispatch } from "../store";

const LoginScreen = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const idRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleLogin = async () => {
    const id = idRef.current?.value;
    const password = passwordRef.current?.value;

    if (!id || !password) {
      alert("ID와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await axiosInstance.post("/user/login", {
        USER_ID: id,
        PASSWORD: password,
      });

      const data: {
        ID: string;
        NAME: string;
        ACCESS_TOKEN: string;
        REFRESH_TOKEN: string;
      } = response.data;

      dispatch(
        userSlice.actions.setUserLogin({
          id: data.ID,
          name: data.NAME,
          accessToken: data.ACCESS_TOKEN,
          refreshToken: data.REFRESH_TOKEN,
        })
      );
    } catch (error) {
      if (isAxiosError(error)) {
        Toast.warning("로그인에 실패했습니다");
      } else {
        Toast.error("예상치 못한 오류 발생");
      }
    }
  };

  return (
    <Stack
      sx={{
        flexDirection: "row",
        flex: 1,
      }}
    >
      <Box
        sx={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          flex: 1,
          justifyContent: "center",
        }}
      />

      <Stack
        sx={{
          backgroundColor: theme.palette.background.paper,
          width: "30%",
        }}
        p={3}
        gap={2}
        justifyContent={"center"}
      >
        <Stack>
          <Typography variant="h3" textAlign={"center"}>
            데이터 관리 시스템
          </Typography>
        </Stack>
        <Stack gap={2}>
          <TextField
            inputRef={idRef}
            id="outlined-basic"
            label="ID"
            variant="outlined"
          />
          <TextField
            inputRef={passwordRef}
            id="outlined-basic"
            label="Password"
            variant="outlined"
            type="password"
          />
        </Stack>
        <Stack>
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{
              p: 1,
            }}
            onClick={handleLogin}
          >
            <VpnKeyIcon
              sx={{
                color: "white",
                mr: 1,
              }}
            />
            <Typography variant="h4" color={"white"}>
              로그인
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default LoginScreen;
