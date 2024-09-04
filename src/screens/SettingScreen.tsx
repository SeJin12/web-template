import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  OutlinedInput,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../config/api";
import { SettingType } from "../types/SettingType";
import { errorHandler } from "../utils/apiUtil";
import { Toast } from "../components/CustomToast";

const SettingScreen = () => {
  const theme = useTheme();

  /**
   * 상수
   */
  const CANDLE_LIST = [
    { value: 10, label: "10분" },
    { value: 30, label: "30분" },
    { value: 60, label: "1시간" },
    { value: 240, label: "4시간" },
  ];

  /**
   * 변수 선언
   */

  const [loading, setLoading] = useState<boolean>(false);
  const [settings, setSettings] = useState<SettingType>({
    ID: "",
    BID_YN: false,
    ASK_YN: false,
    LIMIT_ASSET_KRW: 0,
    BID_PRICE: 0,
    BID_LIMIT_HOLDING_VALUATION_KRW: 0,
    BID_CANDLE_UNIT: 10,
    BID_CANDLE_COUNT: 0,
    BID_UNDER_TICK: 0,
    ASK_PROFIT_PER: 0,
    ASK_OVER_TICK: 0,
  });

  /**
   * 초기화
   */
  const init = () => {};

  /**
   * 호출
   */
  const getSettings = async () => {
    try {
      const response = await axiosInstance.get("/setting/user");

      const data: SettingType = response.data;
      setSettings(data);
    } catch (error) {
      errorHandler(error);
    }
  };

  /**
   * 화면 렌더링
   */
  useEffect(() => {
    getSettings();
  }, []);

  /**
   * 컴포넌트
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : Number(value),
    });
  };

  const onClickUpdate = async () => {
    try {
      await axiosInstance.put("/setting/user", settings);
      getSettings();
      Toast.success("설정을 변경 완료했습니다");
    } catch (error: unknown) {
      errorHandler(error);
    }
  };

  const renderTextField = (
    label: string,
    name: keyof SettingType,
    type = "number"
  ) => (
    <TextField
      sx={{ flex: 1 }}
      label={label}
      variant="outlined"
      value={settings[name]}
      name={name}
      type={type}
      onChange={handleChange}
      size="small"
    />
  );

  return (
    <Paper
      elevation={3}
      sx={{
        p: 5,
      }}
    >
      <Stack
        mb={2}
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
      >
        <Stack>
          <Box display={"flex"} flexDirection={"row"}>
            <Box alignContent={"center"}>
              <Typography variant="h3" mr={2}>
                실행 여부
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.BID_YN}
                  onChange={handleChange}
                  name="BID_YN"
                />
              }
              label="매수"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.ASK_YN}
                  onChange={handleChange}
                  name="ASK_YN"
                />
              }
              label="매도"
            />
          </Box>
          <Box display={"flex"} flexDirection={"row"} alignItems="center">
            <Typography variant="h3" mr={2}>
              분 캔들 설정
            </Typography>
            <FormControl>
              <RadioGroup
                row
                value={settings.BID_CANDLE_UNIT}
                name="BID_CANDLE_UNIT"
                onChange={handleChange}
              >
                {CANDLE_LIST.map((v) => (
                  <FormControlLabel
                    key={v.value}
                    value={v.value}
                    control={<Radio />}
                    label={v.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            onClick={onClickUpdate}
          >
            변경
          </Button>
        </Stack>
      </Stack>
      <Stack display={"flex"} flexDirection={"row"} gap={2}>
        <Box flex={1}>
          <Stack mb={2}>
            <Typography variant="h3">매수</Typography>
          </Stack>
          <Stack mb={5}>
            {renderTextField("탐색할 캔들 개수", "BID_CANDLE_COUNT")}
          </Stack>
          <Stack display={"flex"} flexDirection={"row"} gap={5} mb={5}>
            {renderTextField(
              "현금 아래로 내려가면 매수 안함",
              "LIMIT_ASSET_KRW"
            )}
            {renderTextField(
              "종목 금액 이상 시, 매수 금지",
              "BID_LIMIT_HOLDING_VALUATION_KRW"
            )}
          </Stack>
          <Stack display={"flex"} flexDirection={"row"} gap={5} mb={5}>
            {renderTextField("매수 금액", "BID_PRICE")}
            {renderTextField("매수 아래로 틱 (현재가 기준)", "BID_UNDER_TICK")}
          </Stack>
        </Box>
        <Box flex={1}>
          <Stack mb={2}>
            <Typography variant="h3">매도</Typography>
          </Stack>
          <Stack gap={5}>
            {renderTextField("매도할 수익률", "ASK_PROFIT_PER")}
            {renderTextField("매도 위로 틱 (현재가 기준)", "ASK_OVER_TICK")}
          </Stack>
        </Box>
      </Stack>
      <Stack>
        <Stack gap={1}>
          <Typography variant="h3">배치</Typography>
          <OutlinedInput
            name="description"
            value={`1. 탐색한 캔들 중 하락 캔들이 일정 비율 이상 (반 이상)이면 매수
2. 현재 캔들의 가격이 최저 가격일 경우 매수
3. 현재캔들 -1.2퍼 떨어지면 매수`}
            multiline
            // minRows={5}
            size="small"
            placeholder={"내용"}
            fullWidth
            readOnly
            sx={{
              fontSize: theme.typography.body2,
            }}
          />
        </Stack>
      </Stack>
    </Paper>
  );
};

export default SettingScreen;
