import React from "react";

import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function DeleteConfirmationDialog({
  open,
  handleClose,
  handleConfirm,
  itemName,
}) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{`Delete ${itemName}?`}</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete {itemName}?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            handleConfirm();
            handleClose();
          }}
          color="error"
        >
          Confirm Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
