import BlockIcon from "@mui/icons-material/Block";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  ButtonGroup,
  FormControlLabel,
  InputAdornment,
  OutlinedInput,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import { Toast } from "../components/CustomToast";
import axiosInstance from "../config/api";
import { AccountType } from "../types/AccountType";
import {
  MarketResponse,
  MarketResponseType,
} from "../types/MarketResponseType";
import { MarketType } from "../types/MarketType";
import { SocketTickType } from "../types/SocketTickType";
import { errorHandler } from "../utils/apiUtil";
import {
  getEvalutationAmount,
  getEvalutationGainsAndLosses,
} from "../utils/convertUtil";
import { formatNumber, getOrderPrice } from "../utils/StringUtil";
import { useSelector } from "react-redux";
import { RootState } from "../store/reducer";
import { WebSocket as PWebSocket } from "ws";
import { useLocation } from "react-router-dom";

const MarketScreen = () => {
  const theme = useTheme();

  // 소켓
  const ws = useRef<WebSocket | null>(null);

  /**
   * 상수 선언
   */
  const initBidPrice = 10000;
  const initTick = 5;
  const location = useLocation();

  /**
   * 변수 선언
   */
  const { accessKey, secretKey } = useSelector(
    (state: RootState) => state.userReducer
  );

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
  const [bidPrice, setBidPrice] = useState<number>(initBidPrice);
  const [orderTick, setOrderTick] = useState<number>(initTick);
  const [account, setAccount] = useState<AccountType>();
  // const [accounts, setAccounts] = useState<AccountType[]>();

  /**
   * 초기화
   */
  const init = () => {
    setWord("");
    setBidPrice(initBidPrice);
    setOrderTick(initTick);
  };

  /**
   * 호출
   */
  const getAccount = async () => {
    try {
      const response = await axiosInstance.get("/account");

      const data: AccountType[] = response.data;
      setAccount(data.find((v) => v.currency === "KRW"));
      // setAccounts(data);
    } catch (error) {
      errorHandler(error);
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
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };

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

  const updateMarketSetting = async (
    payload: MarketResponseType,
    key: keyof MarketResponseType
  ) => {
    await axiosInstance.put("/market", {
      market: payload.market,
      [key]: payload[key],
    });
    getRows();
  };

  const handleSwitchChange = (
    row: MarketResponseType,
    key: keyof MarketResponseType
  ) => {
    if (key === "bid_yn" || key === "ask_yn" || key === "bookmark_yn") {
      updateMarketSetting(row, key);
    }
  };

  /**
   * 화면 렌더링
   */
  useEffect(() => {
    getRows();
    getMarket();
    getAccount();
  }, [paginationModel]);

  // useEffect(() => {
  //   if (accounts) {
  //     connectTradeSocket();
  //   }
  // }, [accounts]);

  useEffect(() => {
    if (state.rows.length > 0) {
      if (!ws.current) {
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

            // Socket Error
            // console.log(JSON.parse(message));

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

    return () => {
      if (location.pathname !== "/market") {
        console.log("hi");
      }
    };
  }, [location, state]);

  /**
   * 컴포넌트
   */
  const onClickOrder = async (type: "bid" | "ask", row: MarketResponseType) => {
    try {
      await axiosInstance.post("/order/spec", {
        market: row.market,
        side: type,
        bid_price: bidPrice,
        tick: orderTick,
        ord_type: "limit",
      });

      Toast.success(
        `${row.korean_name} ${type === "bid" ? "매수" : "매도"} 완료`
      );
    } catch (error: unknown) {
      errorHandler(error);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      getRows();
    }
  };

  /**
   * 컴포넌트
   */
  const columns: GridColDef<(typeof state.rows)[number]>[] = [
    {
      field: "심볼",
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          심볼
        </strong>
      ),
      width: 90,
      display: "flex",
      editable: true,
      renderCell(params) {
        return (
          <Box alignContent={"center"}>
            <Typography variant="h6">
              {params.row.market.substring(4)}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "코인명",
      width: 150,
      display: "flex",
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          코인명
        </strong>
      ),
      renderCell(params) {
        return (
          <Stack pt={2} pb={2} flexDirection={"row"} gap={1}>
            <Box display={"flex"}>
              <img
                src={`https://static.upbit.com/logos/${params.row.market.substring(
                  4
                )}.png`}
                alt="symbol"
                width={25}
                height={25}
              />
            </Box>
            <Box alignContent={"center"}>
              <Typography variant="h6">{params.row.korean_name}</Typography>
            </Box>
          </Stack>
        );
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
      headerAlign: "right",
      align: "right",
      width: 150,
      editable: false,
      renderCell(params) {
        return params.row.currency === "" ? (
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
      headerAlign: "right",
      align: "right",
      width: 120,
      sortable: false,
      renderCell(params) {
        return params.row.currency === "" ? (
          <></>
        ) : (
          <Stack flexDirection={"row"} gap={1}>
            <Typography variant="h6">
              {params.row.currency === ""
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
      width: 120,
      sortable: false,
      headerAlign: "right",
      align: "right",
      renderCell(params) {
        return params.row.currency === "" || params.row.ticker === undefined ? (
          <></>
        ) : (
          <Stack flexDirection={"row"} gap={1}>
            <Typography variant="h6">
              {formatNumber(
                Number(getEvalutationAmount(params.row).toFixed(0))
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
      field: "수익률",
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          수익률
        </strong>
      ),
      display: "flex",
      headerAlign: "right",
      align: "right",
      sortable: false,
      minWidth: 80,
      renderCell(params) {
        return params.row.currency === "" || params.row.ticker === undefined ? (
          <Stack pt={1} pb={1}></Stack>
        ) : (
          <Stack pt={1} pb={1}>
            <Stack flexDirection={"row"} gap={1}>
              <Typography
                variant="h6"
                sx={{
                  color:
                    getEvalutationGainsAndLosses(params.row) > 0
                      ? theme.palette.error.main
                      : theme.palette.warning.main,
                }}
              >
                {(
                  (params.row.ticker.trade_price /
                    Number(params.row.avg_buy_price) -
                    1) *
                  100
                ).toFixed(2)}{" "}
              </Typography>
              <Typography variant="h6" color={theme.palette.text.secondary}>
                %
              </Typography>
            </Stack>
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
      headerAlign: "right",
      align: "right",
      display: "flex",
      sortable: false,
      // minWidth: 210,
      renderCell(params) {
        return params.row.currency === "" || params.row.ticker === undefined ? (
          <Stack pt={1} pb={1}></Stack>
        ) : (
          <Stack pt={1} pb={1}>
            <Stack flexDirection={"row"} gap={1}>
              <Typography
                variant="h6"
                sx={{
                  color:
                    getEvalutationGainsAndLosses(params.row) > 0
                      ? theme.palette.error.main
                      : theme.palette.warning.main,
                }}
              >
                {formatNumber(
                  Number(getEvalutationGainsAndLosses(params.row).toFixed(0))
                )}
              </Typography>
              <Typography variant="h6" color={theme.palette.text.secondary}>
                KRW
              </Typography>
            </Stack>
          </Stack>
        );
      },
    },
    {
      field: "전일 대비",
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
          <Stack flexDirection={"row"} gap={1}>
            <Typography
              variant="h6"
              sx={{
                color:
                  params.row.ticker === undefined
                    ? "black"
                    : params.row.ticker.change === "RISE"
                    ? theme.palette.error.main
                    : theme.palette.warning.main,
              }}
            >
              {params.row.ticker === undefined
                ? ""
                : formatNumber(
                    Number(
                      (params.row.ticker.signed_change_rate * 100).toFixed(2)
                    )
                  )}
            </Typography>
            <Typography variant="h6" color={theme.palette.text.secondary}>
              %
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: "현재가",
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          현재가
        </strong>
      ),
      width: 160,
      type: "string",
      headerAlign: "right",
      align: "right",
      display: "flex",
      editable: false,
      renderCell(params) {
        return (
          <Stack flexDirection={"row"} gap={1}>
            <Typography
              variant="h6"
              sx={{
                color:
                  params.row.ticker === undefined
                    ? "black"
                    : params.row.ticker.change === "RISE"
                    ? theme.palette.error.main
                    : theme.palette.warning.main,
              }}
            >
              {params.row.ticker === undefined
                ? ""
                : formatNumber(params.row.ticker.trade_price)}
            </Typography>
            <Typography variant="h6" color={theme.palette.text.secondary}>
              KRW
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: "actions",
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          Action
        </strong>
      ),
      flex: 1,
      type: "string",
      display: "flex",
      editable: false,
      renderCell(params) {
        return (
          <Stack flexDirection={"row"} gap={1}>
            <Button
              variant="contained"
              size="small"
              onClick={() => onClickOrder("bid", params.row)}
            >
              <Typography variant="h6">매수</Typography>
            </Button>
            {params.row.currency && (
              <Button
                variant="contained"
                size="small"
                onClick={() => onClickOrder("ask", params.row)}
              >
                <Typography variant="h6">매도</Typography>
              </Button>
            )}
          </Stack>
        );
      },
    },
    {
      field: "autoBid",
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          매수 (Auto)
        </strong>
      ),
      flex: 1,
      type: "string",
      display: "flex",
      editable: false,
      renderCell(params) {
        return (
          <Switch
            checked={params.row.bid_yn}
            onClick={() => handleSwitchChange(params.row, "bid_yn")}
          />
        );
      },
    },
    {
      field: "autoAsk",
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          매도 (Auto)
        </strong>
      ),
      flex: 1,
      type: "string",
      display: "flex",
      editable: false,
      renderCell(params) {
        return (
          <Switch
            checked={params.row.ask_yn}
            onClick={() => handleSwitchChange(params.row, "ask_yn")}
          />
        );
      },
    },
  ];

  return (
    <Stack flex={1} p={2} mt={2}>
      <Stack flex={1} gap={2}>
        <Stack flexDirection={"row"} justifyContent={"space-between"}>
          <Stack flexDirection={"row"} gap={1}>
            <TextField
              name="KRW"
              value={
                account === undefined
                  ? 0
                  : formatNumber(
                      Number(
                        (
                          Number(account.balance) + Number(account.locked)
                        ).toFixed(0)
                      )
                    )
              }
              label={"보유 원화"}
              inputMode="numeric"
              size="small"
              placeholder="KRW"
              sx={{
                width: 150,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">원</InputAdornment>
                ),
              }}
            />
            <TextField
              name="KRW"
              value={
                account === undefined
                  ? 0
                  : formatNumber(Number(Number(account.balance).toFixed(0)))
              }
              label={"주문 가능"}
              inputMode="numeric"
              size="small"
              placeholder="KRW"
              sx={{
                width: 150,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">원</InputAdornment>
                ),
              }}
            />
            <OutlinedInput
              // fullWidth
              name="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyDown={handleKeyPress}
              size="small"
              placeholder="코인명/심볼 검색"
            />
            <ButtonGroup>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  getRows();
                  getMarket();
                }}
                startIcon={
                  <SearchIcon
                    sx={{ color: theme.palette.primary.contrastText }}
                  />
                }
              >
                <Typography variant="h6">검색</Typography>
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={init}
                startIcon={
                  <BlockIcon
                    sx={{ color: theme.palette.primary.contrastText }}
                  />
                }
              >
                <Typography variant="h6">초기화</Typography>
              </Button>
            </ButtonGroup>
          </Stack>
          <Stack flexDirection={"row"} gap={1}>
            <TextField
              name="orderTick"
              value={orderTick}
              label={"Tick"}
              inputMode="numeric"
              type="number"
              onChange={(e) => setOrderTick(Number(e.target.value))}
              // onKeyDown={handleKeyPress}
              size="small"
              placeholder="orderTick"
            />
            <TextField
              name="bidPrice"
              value={bidPrice}
              label={"매수 금액"}
              type="number"
              onChange={(e) => setBidPrice(Number(e.target.value))}
              // onKeyDown={handleKeyPress}
              size="small"
              placeholder="Market"
            />
          </Stack>
        </Stack>

        <Stack width={"100%"}>
          <DataGrid
            style={{ width: "100%" }}
            rows={state.rows}
            rowCount={state.total}
            columns={columns}
            autoHeight
            getRowId={(row) => row.market}
            pagination
            paginationMode="server"
            pageSizeOptions={[10, 20, 30, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            loading={loading}
            // checkboxSelection
            disableColumnSorting
            disableColumnFilter
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
                backgroundColor: theme.palette.background.default,
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: theme.palette.primary.light,
              },
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default MarketScreen;
