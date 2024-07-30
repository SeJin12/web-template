import AddIcon from "@mui/icons-material/Add";
import BlockIcon from "@mui/icons-material/Block";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import {
  Button,
  OutlinedInput,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import { isAxiosError } from "axios";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { CustomNoRowsOverlay } from "../../components/CustomNoRowsOverlay";
import { Toast } from "../../components/CustomToast";
import axiosInstance from "../../config/api";
import { NoticeType } from "../../types/NoticeType";
import { formatDate } from "../../utils/StringUtil";
import NoticeAddPopup from "../../components/notice/NoticeAddPopup";
import NoticeViewPopup from "../../components/notice/NoticeViewPopup";

export function SortedDescendingIcon() {
  return (
    <ExpandMoreIcon
      className="icon"
      sx={{
        color: "white",
      }}
    />
  );
}

export function SortedAscendingIcon() {
  return (
    <ExpandLessIcon
      className="icon"
      sx={{
        color: "white",
      }}
    />
  );
}

export function UnsortedIcon() {
  return (
    <SortIcon
      className="icon"
      sx={{
        color: "white",
      }}
    />
  );
}

const NoticeScreen = () => {
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
    rows: NoticeType[];
    total: number;
  }>({
    rows: [],
    total: 0,
  });
  const [word, setWord] = useState<string>("");
  const [startDate, setStartDate] = useState<Dayjs>(
    dayjs(new Date().getFullYear() + "-01-01")
  );
  const [endDate, setEndDate] = useState<Dayjs>(dayjs(new Date()));
  const [openAdd, setOpenAdd] = useState(false);
  const [notice, setNotice] = useState<NoticeType>();

  /**
   * 초기화
   */
  const init = () => {
    setWord("");
    setStartDate(dayjs(new Date().getFullYear() + "-01-01"));
    setEndDate(dayjs(new Date()));
  };

  /**
   * 화면 렌더링
   */
  useEffect(() => {
    getRows();
  }, [paginationModel]);

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
      const response = await axiosInstance.get("/notice", {
        params: {
          page: paginationModel.page,
          pageSize: paginationModel.pageSize,
          title: word,
          startDate: startDate.format("YYYYMMDD"),
          endDate: endDate.format("YYYYMMDD"),
        },
      });
      const data: NoticeType[] = response.data;

      setState({
        rows: data,
        total: data.length > 0 ? data[0].total_count : 0,
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

  const onClickNoticeRow = (row: NoticeType) => {
    setNotice(row);
  };

  /**
   * 컴포넌트
   */
  const columns: GridColDef<(typeof state.rows)[number]>[] = [
    {
      field: "번호",
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          번호
        </strong>
      ),
      width: 80,
      // editable: true,
      // headerAlign:'center',
      // align:'center',
      valueGetter: (value, row) => row.notice_id,
    },
    {
      field: "제목",
      width: 400,
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          제목
        </strong>
      ),
      // valueGetter: (value, row) => row.title,
      renderCell(params) {
        return (
          <Button color="info" onClick={() => onClickNoticeRow(params.row)}>
            {params.row.title}
          </Button>
        );
      },
    },

    {
      field: "작성자",
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          작성자
        </strong>
      ),
      type: "string",
      width: 150,
      editable: false,
      valueGetter: (value, row) => row.writer,
    },
    {
      field: "작성 날짜",
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          작성 날짜
        </strong>
      ),
      width: 200,
      sortable: false,
      valueGetter: (value, row) => formatDate(row.created_at),
    },
    {
      field: "조회수",
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          조회수
        </strong>
      ),
      sortable: false,
      flex: 1,
      valueGetter: (value, row) => row.view_count,
    },
  ];

  return (
    <Stack>
      {notice !== undefined && (
        <NoticeViewPopup
          notice={notice}
          open={notice !== undefined ? true : false}
          onCancel={() => {
            setNotice(undefined);
            getRows();
          }}
        />
      )}

      <NoticeAddPopup
        open={openAdd}
        onSubmit={() => {
          setOpenAdd(false);
          getRows();
        }}
        onCancel={() => setOpenAdd(false)}
      />
      <Stack flex={1}>
        <Paper elevation={3}>
          <Stack>
            <Stack flexDirection={"row"} gap={2} flex={1} p={2}>
              <Stack>
                <DatePicker
                  label={"시작일"}
                  // defaultValue={startDate}
                  format="YYYY-MM-DD"
                  value={startDate}
                  onChange={(newValue) => {
                    if (newValue !== null) {
                      setStartDate(newValue);
                    }
                  }}
                />
              </Stack>
              <Stack>
                <DatePicker
                  label={"종료일"}
                  // defaultValue={endDate}
                  value={endDate}
                  format="YYYY-MM-DD"
                  onChange={(newValue) => {
                    if (newValue !== null) {
                      setEndDate(newValue);
                    }
                  }}
                  // slotProps={{
                  //   textField: {
                  //     helperText: "MM/DD/YYYY",
                  //   },
                  // }}
                />
              </Stack>
              <Stack flexDirection={"row"} flex={1}>
                <OutlinedInput
                  name="word"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  onKeyDown={handleKeyPress}
                  size="small"
                  placeholder={"제목"}
                  fullWidth
                />
              </Stack>
              <Stack flexDirection={"row"} justifyContent={"space-between"}>
                <Stack flexDirection={"row"} gap={1}>
                  <Button
                    variant="contained"
                    size="medium"
                    color="info"
                    startIcon={
                      <AddIcon
                        sx={{
                          color: "white",
                        }}
                      />
                    }
                    onClick={() => setOpenAdd(true)}
                  >
                    <Typography variant="h4" color={"white"}>
                      글 작성
                    </Typography>
                  </Button>
                  <Button
                    variant="outlined"
                    color="info"
                    size="small"
                    onClick={getRows}
                    startIcon={<SearchIcon color="info" />}
                  >
                    <Typography variant="h4">검색</Typography>
                  </Button>
                  <Button
                    variant="outlined"
                    color="info"
                    size="small"
                    onClick={init}
                    startIcon={<BlockIcon color="info" />}
                  >
                    <Typography variant="h4">초기화</Typography>
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Stack
            sx={
              {
                // minHeight: 600,
                // display: "flex",
              }
            }
          >
            <DataGrid
              rows={state.rows}
              rowCount={state.total}
              columns={columns}
              autoHeight
              getRowId={(row) => row.notice_id}
              pagination
              paginationMode="server"
              pageSizeOptions={[5, 10, 30]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              loading={loading}
              // checkboxSelection
              disableRowSelectionOnClick
              localeText={{
                MuiTablePagination: {
                  labelRowsPerPage: "페이지 행",
                },
              }}
              slots={{
                columnSortedDescendingIcon: SortedDescendingIcon,
                columnSortedAscendingIcon: SortedAscendingIcon,
                columnUnsortedIcon: UnsortedIcon,
                noRowsOverlay: CustomNoRowsOverlay,
              }}
              sx={{
                "&.MuiDataGrid-root": {
                  border: "none",
                  // backgroundColor: theme.palette.background.paper,
                },
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: theme.palette.info.main,
                },
              }}
            />
          </Stack>
        </Paper>
      </Stack>
    </Stack>
  );
};

export default NoticeScreen;
