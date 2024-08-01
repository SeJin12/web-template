import BlockIcon from "@mui/icons-material/Block";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  OutlinedInput,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { isAxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { Toast } from "../components/CustomToast";
import axiosInstance from "../config/api";
import {
  MarketResponse,
  MarketResponseType,
} from "../types/MarketResponseType";
import { MarketType } from "../types/MarketType";
import { SocketTickType } from "../types/SocketTickType";
import { formatNumber, getOrderPrice } from "../utils/StringUtil";

interface AutoCompleteType {
  label: string;
  value: string;
}

const MarketScreen = () => {
  const theme = useTheme();

  // 소켓
  const ws = useRef<WebSocket | null>(null);

  /**
   * 변수 선언
   */
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const [state, setState] = useState<{
    rows: MarketResponseType[];
    total: number;
  }>({
    rows: [],
    total: 0,
  });
  const [word, setWord] = useState<string>("");

  /**
   * 초기화
   */
  const init = () => {
    setWord("");
  };

  /**
   * 화면 렌더링
   */
  useEffect(() => {
    getRows();
    getMarket();
  }, [paginationModel]);

  const getMarket = async () => {
    if (ws.current) {
      const response = await axiosInstance.get("/market");
      const data: MarketType[] = response.data;

      // const codes: string[] = state.rows.map((row) => row.market);
      const codes: string[] = data.map((row) => row.market);
      ws.current.send(
        JSON.stringify([
          { ticket: "market_list" },
          { type: "ticker", codes }, // trade , ticker
          // { format: "SIMPLE" },
        ])
      );
    }
  };

  useEffect(() => {
    if (state.rows.length > 0) {
      if (!ws.current) {
        console.log("컴포넌트가 화면 2");
        ws.current = new WebSocket("wss://api.upbit.com/websocket/v1");

        ws.current.onopen = () => {
          console.log("WebSocket connected");
          getMarket();
        };

        ws.current.onmessage = (event) => {
          event.data.arrayBuffer().then((buffer: any) => {
            const decoder = new TextDecoder();
            const message = decoder.decode(buffer);
            const data: SocketTickType = JSON.parse(message);

            setState((prevState) => {
              const updatedRows = prevState.rows.map((row) => {
                if (row.market === data.code) {
                  return { ...row, ticker: data };
                }
                return row;
              });
              return { ...prevState, rows: updatedRows };
            });
          });
        };

        ws.current.onerror = (error) => {
          console.error(error);
        };

        ws.current.onclose = () => {
          console.log("WebSocket disconnected");
        };
      }
    }
  }, [ws, state]);

  /**
   * 컴포넌트
   */
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      getRows();
    }
  };

  const getRows = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.post("/market/user", {
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
        search: word,
      });

      const data: MarketResponse = response.data;
      setState({
        rows: data.result,
        total: data.CNT,
      });
    } catch (error) {
      if (isAxiosError(error)) {
        Toast.warning("통신 오류");
      } else {
        Toast.error("예상치 못한 오류 발생");
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * 컴포넌트
   */
  const columns: GridColDef<(typeof state.rows)[number]>[] = [
    {
      field: "이름",
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          Market
        </strong>
      ),
      width: 90,
      display: "flex",
      editable: true,
      renderCell(params) {
        return (
          <Stack pt={1} pb={1}>
            <Typography variant="h6">
              {params.row.market.substring(4)}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: "한글명",
      width: 150,
      display: "flex",
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          한글명
        </strong>
      ),
      renderCell(params) {
        return <Typography variant="h6">{params.row.korean_name}</Typography>;
      },
    },

    {
      field: "매수 평균가",
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          매수 평균가
        </strong>
      ),
      display: "flex",
      type: "string",
      width: 150,
      editable: false,
      renderCell(params) {
        return params.row.avg_buy_price === "0" ? (
          <></>
        ) : (
          <Stack flexDirection={"row"} gap={1}>
            <Typography variant="h6">
              {formatNumber(getOrderPrice(Number(params.row.avg_buy_price)))}
            </Typography>
            <Typography variant="h6" color={theme.palette.text.secondary}>
              KRW
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: "매수 금액",
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          매수 금액
        </strong>
      ),
      display: "flex",
      sortable: false,
      renderCell(params) {
        return params.row.avg_buy_price === "0" ? (
          <></>
        ) : (
          <Stack flexDirection={"row"} gap={1}>
            <Typography variant="h6">
              {params.row.avg_buy_price === "0"
                ? ""
                : formatNumber(
                    Number(
                      (
                        Number(params.row.avg_buy_price) *
                        (Number(params.row.balance) + Number(params.row.locked))
                      ).toFixed(0)
                    )
                  )}
            </Typography>
            <Typography variant="h6" color={theme.palette.text.secondary}>
              KRW
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: "평가 금액",
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          평가 금액
        </strong>
      ),
      display: "flex",
      sortable: false,
      renderCell(params) {
        return params.row.avg_buy_price === "0" ||
          params.row.ticker === undefined ? (
          <></>
        ) : (
          <Stack flexDirection={"row"} gap={1}>
            <Typography variant="h6">
              {formatNumber(
                Number(
                  (
                    Number(params.row.ticker.trade_price) *
                    (Number(params.row.balance) + Number(params.row.locked))
                  ).toFixed(0)
                )
              )}
            </Typography>
            <Typography variant="h5" color={theme.palette.text.secondary}>
              KRW
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: "평가 손익",
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          평가 손익
        </strong>
      ),
      display: "flex",
      sortable: false,
      renderCell(params) {
        return params.row.avg_buy_price === "0" ||
          params.row.ticker === undefined ? (
          <Stack pt={1} pb={1}></Stack>
        ) : (
          <Stack pt={1} pb={1}>
            <Stack flexDirection={"row"}>
              <Typography variant="h6">
                {(
                  (params.row.ticker.trade_price /
                    Number(params.row.avg_buy_price) -
                    1) *
                  100
                ).toFixed(2)}
              </Typography>
              <Typography variant="h5">%</Typography>
            </Stack>
            <Stack flexDirection={"row"}>
              <Typography variant="h6">
                {(
                  Number(params.row.ticker.trade_price) *
                    (Number(params.row.balance) + Number(params.row.locked)) -
                  Number(params.row.avg_buy_price) *
                    (Number(params.row.balance) + Number(params.row.locked))
                ).toFixed(0)}
              </Typography>
              <Typography variant="h5" color={theme.palette.text.secondary}>
                KRW
              </Typography>
            </Stack>
          </Stack>
        );
      },
    },
    {
      field: "signed_change_rate",
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          전일 대비
        </strong>
      ),
      type: "string",
      width: 150,
      display: "flex",
      editable: false,
      align: "right",
      headerAlign: "right",
      renderCell(params) {
        return (
          <Typography
            variant="h6"
            sx={{
              color:
                params.row.ticker === undefined
                  ? "black"
                  : params.row.ticker.change === "RISE"
                  ? "red"
                  : "blue",
            }}
          >
            {params.row.ticker === undefined
              ? ""
              : formatNumber(
                  Number(
                    (params.row.ticker.signed_change_rate * 100).toFixed(2)
                  )
                ) + " %"}
          </Typography>
        );
      },
    },
    {
      field: "tradePrice",
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          현재가
        </strong>
      ),
      flex: 1,
      type: "string",
      width: 150,
      display: "flex",
      editable: false,
      renderCell(params) {
        return (
          <Typography
            variant="h6"
            sx={{
              color:
                params.row.ticker === undefined
                  ? "black"
                  : params.row.ticker.change === "RISE"
                  ? "red"
                  : "blue",
            }}
          >
            {params.row.ticker === undefined
              ? ""
              : formatNumber(params.row.ticker.trade_price) + " 원"}
          </Typography>
        );
      },
    },
  ];

  return (
    <Stack gap={2} flex={1}>
      <Stack flex={1}>
        <Paper elevation={3}>
          <Stack>
            <Stack flexDirection={"row"} p={2} justifyContent={"space-between"}>
              <Stack flexDirection={"row"} gap={1}>
                <OutlinedInput
                  name="word"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  onKeyDown={handleKeyPress}
                  size="small"
                  placeholder="Market"
                />
                <ButtonGroup>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={getRows}
                    startIcon={<SearchIcon color="primary" />}
                  >
                    <Typography variant="h6">검색</Typography>
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={init}
                    startIcon={<BlockIcon color="primary" />}
                  >
                    <Typography variant="h6">초기화</Typography>
                  </Button>
                </ButtonGroup>
              </Stack>
            </Stack>
          </Stack>
          <Stack flex={1} sx={{}}>
            <Box
              sx={{
                flex: 1,
              }}
            >
              <DataGrid
                rows={state.rows}
                rowCount={state.total}
                columns={columns}
                autoHeight
                getRowId={(row) => row.market}
                pagination
                paginationMode="server"
                pageSizeOptions={[5, 10, 30]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                loading={loading}
                // checkboxSelection
                disableRowSelectionOnClick
                getRowHeight={() => "auto"}
                localeText={{
                  MuiTablePagination: {
                    labelRowsPerPage: "페이지 행",
                  },
                }}
                sx={{
                  "&.MuiDataGrid-root": {
                    border: "none",
                    // backgroundColor: theme.palette.background.paper,
                  },
                  "& .MuiDataGrid-columnHeader": {
                    backgroundColor: theme.palette.primary.light,
                  },
                }}
              />
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Stack>
  );
};

export default MarketScreen;
