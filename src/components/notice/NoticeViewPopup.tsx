import CropDinIcon from "@mui/icons-material/CropDin";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import {
  Box,
  Divider,
  IconButton,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import axiosInstance from "../../config/api";
import { NoticeDetailType, NoticeType } from "../../types/NoticeType";
import { Toast } from "../CustomToast";
import { DataGrid, GridColDef, GridRowHeightParams } from "@mui/x-data-grid";
import { formatDate } from "../../utils/StringUtil";
import ClearIcon from "@mui/icons-material/Clear";
import { errorHandler } from "../../utils/apiUtil";

interface Props {
  open: boolean;
  notice: NoticeType;
  onCancel: () => void;
}

export default function NoticeViewPopup({ open, notice, onCancel }: Props) {
  const theme = useTheme();
  const [fullScreen, setFullScreen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [maxWidth, setMaxWidth] = useState<DialogProps["maxWidth"]>("lg");
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [state, setState] = useState<{
    rows: NoticeDetailType[];
    total: number;
  }>({
    rows: [],
    total: 0,
  });
  const [comment, setComment] = useState<string>("");

  const getRows = async () => {
    try {
      const response = await axiosInstance.get("/notice/detail", {
        params: {
          page: paginationModel.page,
          pageSize: paginationModel.pageSize,
          notice_id: notice.notice_id,
        },
      });
      const data: NoticeDetailType[] = response.data;

      setState({
        rows: data,
        total: data.length > 0 ? data[0].total_count : 0,
      });
      setComment("");
    } catch (error) {
      errorHandler(error)
    }
  };

  const generateComment = async () => {
    try {
      const response = await axiosInstance.post("/notice/detail", {
        notice_id: notice.notice_id,
        comment,
      });

      getRows();
    } catch (error) {
      errorHandler(error)
    }
  };

  /**
   * 컴포넌트
   */
  const columns: GridColDef<(typeof state.rows)[number]>[] = [
    {
      field: "댓글",
      width: 400,
      // minWidth: 200,
      // valueGetter: (value, row) => row.comment,
      renderHeader: () => (
        <strong style={{ color: theme.palette.primary.contrastText }}>
          댓글
        </strong>
      ),
      flex: 1,
      resizable: false,
      display: "flex",
      renderCell(params) {
        return (
          <Stack
            sx={{
              flex: 1,
            }}
          >
            <TextField
              type="text"
              variant="standard"
              value={params.row.comment}
              color="info"
              multiline
              InputProps={{ disableUnderline: true }}
            />
          </Stack>
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
      width: 100,
      editable: false,
      display: "flex",
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
      display: "flex",
      sortable: false,
      valueGetter: (value, row) => formatDate(row.created_at),
    },
  ];

  useEffect(() => {
    if (open) {
      setTitle(notice.title);
      setContent(notice.content);
      updateViewCount();
      setComment("");
      getRows();
    }
  }, [open, paginationModel]);

  const updateViewCount = () => {
    try {
      const response = axiosInstance.put("/notice/count", {
        notice_id: notice.notice_id,
      });
    } catch (error) {
      errorHandler(error)
    }
  };

  const handleClickOpen = async () => {
    try {
      // const response = await axiosInstance.post("/notice", {
      //   title,
      //   content,
      // });

      Toast.success("글 작성 완료했습니다");
    } catch (error) {
      errorHandler(error)
    } finally {
    }
  };

  const handleClose = () => {
    onCancel();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth={!fullScreen}
      maxWidth={maxWidth}
      fullScreen={fullScreen}
    >
      <Stack p={2} gap={2} flex={1} display={"flex"}>
        <Stack flexDirection={"row"} justifyContent={"space-between"}>
          <Box alignContent={"center"}>
            <Typography variant="subtitle1">공지사항</Typography>
          </Box>
          <Stack flexDirection={"row"}>
            <IconButton
              aria-label="screen"
              onClick={() => setFullScreen(!fullScreen)}
              size="medium"
            >
              {fullScreen ? (
                <FilterNoneIcon fontSize="small" />
              ) : (
                <CropDinIcon fontSize="medium" />
              )}
            </IconButton>
            <IconButton aria-label="close" onClick={handleClose} size="medium">
              <ClearIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        </Stack>
        <Stack gap={2}>
          <OutlinedInput
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            //   onKeyDown={handleKeyPress}
            size="small"
            fullWidth
            readOnly
            sx={{
              fontSize:theme.typography.subtitle1
            }}
          />

          <OutlinedInput
            name="content"
            value={content}
            multiline
            minRows={5}
            onChange={(e) => setContent(e.target.value)}
            size="small"
            placeholder={"내용"}
            fullWidth
            readOnly
            sx={{
              fontSize:theme.typography.body2
            }}
          />
        </Stack>
        <Divider />
        <Stack gap={2} flex={1}>
          <Stack>
            <Typography variant="h5">
              전체 댓글{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: theme.palette.text.primary,
                }}
              >
                {state.total}
              </span>{" "}
              개
            </Typography>
          </Stack>
          <Stack>
            <DataGrid
              rows={state.rows}
              rowCount={state.total}
              columns={columns}
              autoHeight
              getRowId={(row) => row.created_at.toString()}
              pagination
              paginationMode="server"
              pageSizeOptions={[5, 10, 30]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              disableRowSelectionOnClick
              localeText={{
                MuiTablePagination: {
                  labelRowsPerPage: "페이지 행",
                },
              }}
              getRowHeight={() => "auto"}
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
        </Stack>
        <Stack flexDirection={"row"} gap={1}>
          <OutlinedInput
            name="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            //   onKeyDown={handleKeyPress}
            size="small"
            fullWidth
          />
          <Button
            variant="contained"
            onClick={generateComment}
            autoFocus
            color={"info"}
          >
            등록
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}
