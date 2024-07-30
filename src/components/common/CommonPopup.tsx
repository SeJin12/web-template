import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function CommonPopup({ open, onSubmit, onCancel }: Props) {

  useEffect(() => {
    if(open) {
        console.log("공통 팝업이 열림");
        
    }    
  }, [open])
    
  const handleClickOpen = () => {
    onSubmit();
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
    >
      <DialogTitle id="alert-dialog-title">
        {"asdl;akd;sa"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Let Google help apps determine location. This means sending anonymous
          location data to Google, even when no apps are running.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>작성하기</Button>
        <Button onClick={handleClose} autoFocus>
          취소
        </Button>
      </DialogActions>
    </Dialog>
  );
}
