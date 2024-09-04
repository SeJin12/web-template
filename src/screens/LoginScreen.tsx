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
import { errorHandler } from "../utils/apiUtil";

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
        ACCESS_KEY: string;
        SECRET_KEY: string;
      } = response.data;
      
      dispatch(
        userSlice.actions.setUserLogin({
          id: data.ID,
          name: data.NAME,
          accessToken: data.ACCESS_TOKEN,
          refreshToken: data.REFRESH_TOKEN,
          accessKey: data.ACCESS_KEY,
          secretKey: data.SECRET_KEY,
        })
      );
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <Stack
      sx={{
        flexDirection: "row",
        height:'100vh'
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
          <Typography variant="subtitle1" textAlign={"center"}>
            데이터 관리 시스템
          </Typography>
        </Stack>
        <Stack gap={2}>
          <TextField
            inputRef={idRef}
            id="outlined-id"
            label="ID"
            variant="outlined"
          />
          <TextField
            inputRef={passwordRef}
            id="outlined-password"
            label="Password"
            variant="outlined"
            type="password"
          />
        </Stack>
        <Stack>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleLogin}
          >
            <Typography variant="h3" color={"white"}>
              로그인
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default LoginScreen;
