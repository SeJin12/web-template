import { Stack, useTheme } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import StateStatsChart from "../components/dashboard/StateStatsChart";
import store from "../store";

const MainScreen = () => {
  const theme = useTheme();
  const { id } = store.getState().userReducer;

  return (
    <Stack
      sx={{
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Stack flexDirection={"row"}>
        <Stack flex={1}>
          <StateStatsChart id={id} />
        </Stack>
        <Stack flex={1}>
          <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[
              {
                data: [2, 5.5, 2, 8.5, 1.5, 5],
              },
            ]}
            width={500}
            height={300}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default MainScreen;
