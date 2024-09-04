import { Paper, Stack, Typography, useTheme } from "@mui/material";
import axiosInstance from "../../config/api";
import { errorHandler } from "../../utils/apiUtil";
import { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts";
import { getStateName } from "../../utils/StringUtil";
import dayjs, { Dayjs } from "dayjs";

interface Props {
  id: string;
}

interface StateType {
  id: string;
  state: string;
  cnt: number;
}

interface ChartDataType {
  id: number;
  value: number;
  label: string;
}

const StateStatsChart = ({ id }: Props) => {
  const theme = useTheme();
  const [data, setData] = useState<ChartDataType[]>();
  const [date, setDate] = useState<Dayjs>(dayjs(new Date()));

  const getStats = async () => {
    try {
      const response = await axiosInstance.get("/order/stats/state");
      const states: StateType[] = response.data;

      const arr: ChartDataType[] = [];
      for (let i = 0; i < states.length; i++) {
        arr.push({
          id: i,
          value: states[i].cnt,
          label: getStateName(states[i].state),
        });
      }

      setData(arr);
    } catch (error) {
      errorHandler(error);
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  return (
    <Paper
      sx={{
        flex: 1,
        alignContent: "center",
        p: 2,
        flexDirection: "row",
        display: "flex",
      }}
    >
      <Stack 
    //   justifyContent={"center"}
      >
        <Typography variant="h3">
          {date.year() + "년 " + String(date.month() + 1).padStart(2, "0") + "월"}
        </Typography>
        <Typography variant="h3">통계</Typography>
      </Stack>
      {data !== undefined && (
        <Stack>
          <PieChart
            colors={[
              theme.palette.primary.main,
              theme.palette.error.main,
              theme.palette.warning.main,
            ]}
            series={[
              {
                arcLabel: (item) => `${item.value}`,
                data: data,
              },
            ]}
            sx={{
              fontSize: 15,
              fontWeight: "500",
            }}
            width={450}
            height={200}
          />
        </Stack>
      )}
    </Paper>
  );
};

export default StateStatsChart;
