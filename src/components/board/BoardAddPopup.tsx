import { useEffect, useState } from "react";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import { OutlinedInput, Stack, ToggleButtonGroup } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ToggleButton from "@mui/material/ToggleButton";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Toast } from "../CustomToast";
import axiosInstance from "../../config/api";
import { isAxiosError } from "axios";
import { errorHandler } from "../../utils/apiUtil";

interface Props {
  open: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function BoardAddPopup({ open, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [alignment, setAlignment] = useState<string | null>("left");
  const [formats, setFormats] = useState(() => ["bold", "italic"]);

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    setAlignment(newAlignment);
  };

  const handleFormat = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: string[]
  ) => {
    setFormats(newFormats);
  };

  useEffect(() => {
    if (open) {
      setTitle("");
      setContent("");
    }
  }, [open]);

  const handleClickOpen = async () => {
    try {
      const response = await axiosInstance.post("/board", {
        title,
        content,
      });

      onSubmit();
      Toast.success("글 작성 완료했습니다");
    } catch (error) {
      errorHandler(error);
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
      fullWidth
      sx={{
        // width:'100%'
        borderWidth: 1,
        borderStyle: "solid",
      }}
    >
      <DialogTitle id="alert-dialog-title">{"공지사항 글 작성"}</DialogTitle>
      <DialogContent>
        <Stack gap={2}>
          <OutlinedInput
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            //   onKeyDown={handleKeyPress}
            size="small"
            placeholder={"제목"}
            fullWidth
          />
          <Stack flexDirection={"row"} gap={1} justifyContent={"space-between"}>
            <ToggleButtonGroup
              value={alignment}
              exclusive
              onChange={handleAlignment}
              aria-label="text alignment"
            >
              <ToggleButton value="left" aria-label="left aligned">
                <FormatAlignLeftIcon />
              </ToggleButton>
              <ToggleButton value="center" aria-label="centered">
                <FormatAlignCenterIcon />
              </ToggleButton>
              <ToggleButton value="right" aria-label="right aligned">
                <FormatAlignRightIcon />
              </ToggleButton>
              <ToggleButton value="justify" aria-label="justified">
                <FormatAlignJustifyIcon />
              </ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
              value={formats}
              onChange={handleFormat}
              aria-label="text formatting"
            >
              <ToggleButton value="bold" aria-label="bold">
                <FormatBoldIcon />
              </ToggleButton>
              <ToggleButton value="italic" aria-label="italic">
                <FormatItalicIcon />
              </ToggleButton>
              <ToggleButton value="underlined" aria-label="underlined">
                <FormatUnderlinedIcon />
              </ToggleButton>
              <ToggleButton value="color" aria-label="color" disabled>
                <FormatColorFillIcon />
                <ArrowDropDownIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          <OutlinedInput
            name="content"
            value={content}
            multiline
            minRows={5}
            onChange={(e) => setContent(e.target.value)}
            //   onKeyDown={handleKeyPress}
            size="small"
            placeholder={"내용"}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClickOpen}>
          작성하기
        </Button>
        <Button variant="outlined" onClick={handleClose} autoFocus>
          취소
        </Button>
      </DialogActions>
    </Dialog>
  );
}
