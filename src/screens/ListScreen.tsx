import AddIcon from "@mui/icons-material/Add";
import BlockIcon from "@mui/icons-material/Block";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Chip,
  InputAdornment,
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
import * as XLSX from "xlsx";
import file1 from "../assets/main.jpg";
import { Toast } from "../components/CustomToast";
import axiosInstance from "../config/api";
import { OrderResponse, OrderResponseType } from "../types/OrderResponseType";
import { downloadFile } from "../utils/fileUtil";
import { formatDate, formatNumber, getStateName } from "../utils/StringUtil";
import { getProfitKrw, getProfitPercent } from "../utils/convertUtil";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { errorHandler } from "../utils/apiUtil";
import FiberManualRecordOutlinedIcon from "@mui/icons-material/FiberManualRecordOutlined";
import { grey } from "@mui/material/colors";

interface AutoCompleteType {
  label: string;
  value: string;
}

const sides: AutoCompleteType[] = [
  { label: "전체", value: "" },
  { label: "매도", value: "ask" },
  { label: "매수", value: "bid" },
];

const states: AutoCompleteType[] = [
  { label: "전체", value: "all" },
  { label: "전체 체결 완료", value: "done" },
  { label: "체결 대기", value: "wait" },
  { label: "예약주문 대기", value: "watch" },
  { label: "주문 취소", value: "cancel" },
];

const ListScreen = () => {
  const theme = useTheme();

  /**
   * 변수 선언
   */
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const [state, setState] = useState<{
    rows: OrderResponseType[];
    profit: number;
    total: number;
  }>({
    rows: [],
    profit: 0,
    total: 0,
  });
  const [word, setWord] = useState<string>("");
  const [side, setSide] = useState<AutoCompleteType | null>(sides[0]);
  const [orderState, setOrderState] = useState<AutoCompleteType | null>(
    states[0]
  );
  const [startDate, setStartDate] = useState<Dayjs>(
    dayjs(
      new Date().getFullYear() +
        "-" +
        String(new Date().getMonth() + 1).padStart(2, "0") +
        "-01"
    )
  );
  const [endDate, setEndDate] = useState<Dayjs>(dayjs(new Date()));

  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /**
   * 초기화
   */
  const init = () => {
    setWord("");
    setSide(sides[0]);
    setOrderState(states[0]);
    setStartDate(
      dayjs(
        new Date().getFullYear() +
          "-" +
          String(new Date().getMonth() + 1).padStart(2, "0") +
          "-01"
      )
    );
    setEndDate(dayjs(new Date()));
  };

  /**
   * 화면 렌더링
   */
  useEffect(() => {
    getRows();
  }, [paginationModel, side, orderState]);

  /**
   * 컴포넌트
   */
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      getRows();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    console.log("a");

    if (selectedFile) {
      // setFile(selectedFile);
      console.log("Selected file:", selectedFile.type);

      const fileType = selectedFile.type;
      const fileName = selectedFile.name;

      if (fileType === "text/plain") {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const fileContent = e.target?.result;
          console.log("TXT file content:", fileContent);
        };
        reader.readAsText(selectedFile);
      } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const binaryStr = e.target?.result;
          if (binaryStr) {
            const workbook = XLSX.read(binaryStr, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            console.log("Excel file content:", jsonData);
          }
        };
        reader.readAsArrayBuffer(selectedFile);
        // reader.readAsBinaryString(selectedFile);
      }
    }

    if (fileRef.current) {
      fileRef.current.value = ""; // input의 값을 빈 문자열로 설정하여 초기화
    }
  };

  const getRows = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.post("/order/history/user", {
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
        search: word,
        side: side === null ? "" : side.value,
        state: orderState === null ? "all" : orderState.value,
        startDate,
        endDate,
      });

      const data: OrderResponse = response.data;
      setState({
        rows: data.result,
        profit: data.PROFIT,
        total: data.CNT,
      });
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 컴포넌트
   */
  const columns: GridColDef<(typeof state.rows)[number]>[] = [
    {
      field: "코인명",
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          코인명
        </strong>
      ),
      width: 200,
      editable: true,
      display: "flex",
      renderCell(params) {
        return (
          <Stack flexDirection={"row"} gap={1}>
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
      field: "주문 종류",
      display: "flex",
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          주문 종류
        </strong>
      ),
      renderCell(params) {
        return (
          <Typography variant="h6">
            {params.row.side === "bid" ? "매수" : "매도"}
          </Typography>
        );
      },
    },

    {
      field: "주문 상태",
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          주문 상태
        </strong>
      ),
      type: "string",
      width: 150,
      editable: false,
      display: "flex",
      renderCell(params) {
        const state = params.row.state;
        const stateName = getStateName(params.row.state);

        if (state !== "")
          return (
            <Chip
              variant="outlined"
              label={stateName}
              size="small"
              color={
                state === "wait"
                  ? "success"
                  : state === "done"
                  ? "primary"
                  : "error"
              }
              // sx={{
              //   color: theme.palette.text.primary,
              // }}
              icon={
                <FiberManualRecordOutlinedIcon
                  fontSize="large"
                  color={
                    state === "wait"
                      ? "success"
                      : state === "done"
                      ? "primary"
                      : "error"
                  }
                />
              }
            />
          );
      },
    },
    {
      field: "주문가",
      // width: 150,
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          주문가 (원)
        </strong>
      ),
      sortable: false,
      display: "flex",
      renderCell(params) {
        return (
          <Typography variant="h5">
            {formatNumber(Number(params.row.price))}{" "}
            <span style={{ color: "#8C8C8C" }}>KRW</span>
          </Typography>
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
      // width: 150,
      editable: true,
      display: "flex",
      renderCell(params) {
        return params.row.side === "ask" ? (
          <Typography variant="h5">
            {formatNumber(Number(params.row.avg_buy_price))}{" "}
            <span style={{ color: "#8C8C8C" }}>KRW</span>
          </Typography>
        ) : (
          <></>
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
      // width: 80,
      editable: true,
      display: "flex",
      renderCell(params) {
        return params.row.side === "ask" ? (
          <Typography
            variant="h5"
            sx={{
              color:
                Number(
                  getProfitPercent(
                    Number(params.row.price),
                    Number(params.row.avg_buy_price)
                  )
                ) > 0
                  ? theme.palette.error.main
                  : theme.palette.warning.main,
            }}
          >
            {getProfitPercent(
              Number(params.row.price),
              Number(params.row.avg_buy_price)
            )}{" "}
            <span style={{ color: "#8C8C8C" }}>%</span>
          </Typography>
        ) : (
          <></>
        );
      },
    },
    {
      field: "수익 금액",
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          수익 금액
        </strong>
      ),
      // width: 150,
      editable: true,
      display: "flex",
      renderCell(params) {
        return params.row.side === "ask" ? (
          <Typography
            variant="h5"
            sx={{
              color:
                Number(
                  getProfitPercent(
                    Number(params.row.price),
                    Number(params.row.avg_buy_price)
                  )
                ) > 0
                  ? theme.palette.error.main
                  : theme.palette.warning.main,
            }}
          >
            {formatNumber(
              Number(
                getProfitKrw(
                  Number(params.row.price),
                  Number(params.row.avg_buy_price),
                  Number(params.row.volume)
                ).toFixed(0)
              )
            )}{" "}
            <span style={{ color: "#8C8C8C" }}>KRW</span>
          </Typography>
        ) : (
          <></>
        );
      },
    },
    {
      field: "생성 시간",
      flex: 1,
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          생성 시간
        </strong>
      ),
      sortable: false,
      valueGetter: (value, row) => formatDate(row.created_at),
    },
  ];

  return (
    <Stack p={2} gap={2} mt={2}>
      <Stack gap={2}>
        <Stack flexDirection={"row"} gap={1} flex={1}>
          <Stack flexDirection={"row"} gap={1}>
            <DatePicker
              label={"시작일"}
              format="YYYY-MM-DD"
              value={startDate}
              onChange={(newValue) => {
                if (newValue !== null) {
                  setStartDate(newValue);
                }
              }}
            />
            <DatePicker
              label={"종료일"}
              value={endDate}
              format="YYYY-MM-DD"
              onChange={(newValue) => {
                if (newValue !== null) {
                  setEndDate(newValue);
                }
              }}
            />
          </Stack>
          <Autocomplete
            disablePortal
            id="combo-box-side"
            value={side}
            options={sides}
            getOptionLabel={(option) => option.label}
            sx={{ flex: 1 }}
            renderInput={(params) => <TextField {...params} label="타입" />}
            onChange={(event, value) => {
              setSide(value);
            }}
            isOptionEqualToValue={(option, value) => {
              return option.value === value.value;
            }}
          />
          <Autocomplete
            disablePortal
            id="combo-box-order-state"
            value={orderState}
            options={states}
            sx={{ flex: 1 }}
            renderInput={(params) => (
              <TextField {...params} label="주문 상태" />
            )}
            onChange={(event, value) => {
              if (value !== null && value !== undefined) {
                setOrderState(value);
              }
            }}
            isOptionEqualToValue={(option, value) => {
              return option.value === value.value;
            }}
          />
        </Stack>
        <Stack flexDirection={"row"} justifyContent={"space-between"}>
          <Stack flexDirection={"row"} gap={1}>
            <TextField
              name="KRW"
              value={formatNumber(Number(state.profit.toFixed(0)))}
              label={"수익금"}
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
              name="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyDown={handleKeyPress}
              size="small"
              placeholder="코인명"
            />
            <ButtonGroup>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={getRows}
                startIcon={
                  <SearchIcon
                    sx={{ color: theme.palette.primary.contrastText }}
                  />
                }
              >
                <Typography variant="h4">검색</Typography>
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
                <Typography variant="h4">초기화</Typography>
              </Button>
            </ButtonGroup>
          </Stack>
          <Stack flexDirection={"row"} gap={1}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => downloadFile(file1, "main1.jpg")}
              startIcon={<CloudDownloadIcon />}
            >
              <Typography variant="h4">엑셀 다운로드</Typography>
            </Button>

            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              엑셀 업로드 {file?.name}
              <input
                type="file"
                ref={fileRef}
                onChange={handleFileChange}
                style={{
                  clip: "rect(0 0 0 0)",
                  clipPath: "inset(50%)",
                  height: 1,
                  overflow: "hidden",
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  whiteSpace: "nowrap",
                  width: 1,
                }}
              />
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <Stack width={"100%"}>
        <DataGrid
          style={{ width: "100%" }}
          rows={state.rows}
          rowCount={state.total}
          columns={columns}
          autoHeight
          getRowId={(row) => row.uuid}
          pagination
          paginationMode="server"
          pageSizeOptions={[5, 10]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          loading={loading}
          // checkboxSelection
          disableRowSelectionOnClick
          disableColumnFilter
          disableColumnSorting
          // disableColumnResize
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
  );
};

export default ListScreen;
