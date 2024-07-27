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
  OutlinedInput,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import file1 from "../assets/main.jpg";
import { Toast } from "../components/CustomToast";
import axiosInstance from "../config/api";
import { OrderResponse, OrderResponseType } from "../types/OrderResponseType";
import { downloadFile } from "../utils/fileUtil";
import { formatDate, getStateName } from "../utils/StringUtil";
import {
  MarketResponse,
  MarketResponseType,
} from "../types/MarketResponseType";

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

const MarketScreen = () => {
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
    rows: MarketResponseType[];
    total: number;
  }>({
    rows: [],
    total: 0,
  });
  const [word, setWord] = useState<string>("");
  const [side, setSide] = useState<AutoCompleteType | null>(sides[0]);
  const [orderState, setOrderState] = useState<AutoCompleteType | null>(
    states[0]
  );

  const [file, setFile] = useState<File | null>(null);

  /**
   * 초기화
   */
  const init = () => {
    setWord("");
    setSide(sides[0]);
    setOrderState(states[0]);
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
  };

  const getRows = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.post("/market/user", {
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
        search: word,
      });
      console.log(response.data);

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
      field: "market",
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          Market
        </strong>
      ),
      width: 150,
      editable: true,
    },
    {
      field: "korean_name",
      width: 150,
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          한글명
        </strong>
      ),
    },

    {
      field: "english_name",
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          영문명
        </strong>
      ),
      type: "string",
      width: 150,
      editable: false,
    },
    {
      field: "market_warning",
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          유의 종목 여부
        </strong>
      ),
      sortable: false,
      flex: 1,
      // valueGetter: (value, row) => formatDate(row.english_name),
      renderCell(params) {
        return (
          <Chip
            label={
              params.row.market_warning === "NONE"
                ? "해당 사항 없음"
                : "투자유의"
            }
            color={params.row.market_warning === "NONE" ? "primary" : "warning"}
            sx={{
              color: "white",
            }}
          />
        );
      },
    },
  ];

  return (
    <Stack gap={2} flex={1}>
      <Stack flex={1}>
        <Paper elevation={3}>
          <Stack>
            <Stack flexDirection={"row"} gap={2} flex={1} p={2}>
              <Autocomplete
                disablePortal
                id="combo-box-side"
                value={side}
                options={sides}
                getOptionLabel={(option) => option.label}
                sx={{ flex: 1 }}
                renderInput={(params) => <TextField {...params} label="타입" />}
                onChange={(event, value) => {
                  if (value !== null && value !== undefined) {
                    setSide(value);
                  }
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
                    <Typography variant="h4">검색</Typography>
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={init}
                    startIcon={<BlockIcon color="primary" />}
                  >
                    <Typography variant="h4">초기화</Typography>
                  </Button>
                </ButtonGroup>
              </Stack>
              <Stack flexDirection={"row"} gap={1}>
                <Button
                  variant="outlined"
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
                <Button
                  variant="contained"
                  size="small"
                  startIcon={
                    <AddIcon
                      sx={{
                        color: "white",
                      }}
                    />
                  }
                >
                  <Typography variant="h4" color={"white"}>
                    추가
                  </Typography>
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={
                    <RemoveIcon
                      sx={{
                        color: "white",
                      }}
                    />
                  }
                >
                  <Typography variant="h4" color={"white"}>
                    삭제
                  </Typography>
                </Button>
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
                checkboxSelection
                disableRowSelectionOnClick
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
