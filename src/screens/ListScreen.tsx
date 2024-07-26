import AddIcon from "@mui/icons-material/Add";
import BlockIcon from "@mui/icons-material/Block";
import DownloadIcon from "@mui/icons-material/Download";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchIcon from "@mui/icons-material/Search";
import UploadIcon from "@mui/icons-material/Upload";
import {
  Alert,
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Link,
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
import { OrderResponse, OrderResponseType } from "../types/OrderResponseType";
import { formatDate, getStateName } from "../utils/StringUtil";
import file from "../assets/main.jpg"

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
    console.log(process.env.REACT_APP_PUBLIC_URL);
    
  }, [paginationModel, word, side, orderState]);

  /**
   * 컴포넌트
   */

  const downloadFile = async () => { // 해야함
    // 파일 경로 (src/assets 폴더 경로)
    const fileUrl = file;
    console.log(fileUrl);
    
    // Fetch를 사용하여 파일 데이터 가져오기
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    
    // Blob URL 생성
    const url = URL.createObjectURL(blob);
    
    // 링크 요소 생성 및 클릭 이벤트 트리거
    const a = document.createElement('a');
    a.href = url;
    a.download = 'main.jpg'; // 다운로드할 파일 이름 지정
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // 메모리 해제
    URL.revokeObjectURL(url);
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
      });

      const data: OrderResponse = response.data;
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
      field: "korean_name",
      renderHeader: () => <strong style={{color:theme.palette.primary.contrastText}}>Market</strong>,
      width: 150,
      editable: true,
    },
    {
      field: "side",
      renderHeader: () => <strong style={{color:theme.palette.primary.contrastText}}>주문 종류</strong>,
      renderCell(params) {
        return (
          <Chip
            label={params.row.side === "bid" ? "매수" : "매도"}
            color={params.row.side === "bid" ? "warning" : "primary"}
            sx={{
              color: "white",
            }}
          />
        );
      },
    },

    {
      field: "state",
      renderHeader: () => <strong style={{color:theme.palette.primary.contrastText}}>주문 상태</strong>,
      type: "string",
      width: 150,
      editable: false,
      valueGetter: (value, row) => getStateName(row.state),
    },
    {
      field: "created_at",
      renderHeader: () => <strong style={{color:theme.palette.primary.contrastText}}>생성 시간</strong>,
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      // width: 160,
      flex: 1,
      valueGetter: (value, row) => formatDate(row.created_at),
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
            <Stack flexDirection={"row"} p={2} justifyContent={"space-between"}>
              <Stack flexDirection={"row"} gap={1}>
                <OutlinedInput
                  name="word"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  size="small"
                  placeholder="Search"
                />
                <Button variant="outlined" color="primary" size="small">
                  <SearchIcon color="primary" />
                  <Typography variant="h4">검색</Typography>
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={init}
                >
                  <BlockIcon color="primary" />
                  <Typography variant="h4">초기화</Typography>
                </Button>
              </Stack>
              <Stack flexDirection={"row"} gap={1}>
                <Button variant="outlined" color="primary" size="small" onClick={downloadFile}>
                  <DownloadIcon color="primary" />
                  <Typography variant="h4">엑셀 다운로드</Typography>
                </Button>
                <Button variant="outlined" size="small">
                  <UploadIcon color="primary" />
                  <Typography variant="h4">엑셀 업로드</Typography>
                </Button>
                <Button variant="contained" size="small">
                  <AddIcon
                    sx={{
                      color: "white",
                    }}
                  />
                  <Typography variant="h4" color={"white"}>
                    추가
                  </Typography>
                </Button>
                <Button variant="contained" size="small">
                  <RemoveIcon
                    sx={{
                      color: "white",
                    }}
                  />
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
                getRowId={(row) => row.uuid}
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

export default ListScreen;
