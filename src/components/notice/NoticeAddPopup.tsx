import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CropDinIcon from "@mui/icons-material/CropDin";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import {
  Box,
  OutlinedInput,
  Stack,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import ToggleButton from "@mui/material/ToggleButton";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import axiosInstance from "../../config/api";
import { Toast } from "../CustomToast";

interface Props {
  open: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function NoticeAddPopup({ open, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [alignment, setAlignment] = useState<string | null>("left");
  const [formats, setFormats] = useState(() => ["bold", "italic"]);
  const [fullScreen, setFullScreen] = useState(false);
  const [maxWidth, setMaxWidth] = useState<DialogProps["maxWidth"]>("lg");

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
      const response = await axiosInstance.post("/notice", {
        title,
        content,
      });

      onSubmit();
      Toast.success("글 작성 완료했습니다");
    } catch (error) {
      if (isAxiosError(error)) {
        Toast.warning("통신 오류");
      } else {
        Toast.error("예상치 못한 오류 발생");
      }
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
      fullScreen={fullScreen}
      maxWidth={maxWidth}
      sx={{
        // width:'100%'
        borderWidth: 1,
        borderStyle: "solid",
      }}
    >
      <Stack p={2} gap={2}>
        <Stack flexDirection={"row"} justifyContent={"space-between"}>
          <Box alignContent={"center"}>
            <Typography variant="h3">공지사항 글 작성</Typography>
          </Box>
          <Box>
            <Button
              variant="text"
              color="info"
              onClick={() => setFullScreen(!fullScreen)}
              autoFocus
            >
              {fullScreen ? <FilterNoneIcon fontSize="small" /> : <CropDinIcon fontSize="medium" />}
            </Button>
          </Box>
        </Stack>
        <Stack>
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
            <Stack
              flexDirection={"row"}
              gap={1}
              justifyContent={"space-between"}
            >
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
        </Stack>
        <DialogActions>
          <Button variant="contained" color="info" onClick={handleClickOpen}>
            작성하기
          </Button>
          <Button
            variant="outlined"
            color="info"
            onClick={handleClose}
            autoFocus
          >
            취소
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}
