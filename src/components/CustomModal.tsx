import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

type CustomConfirmModalProps = {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const CustomConfirmModal: React.FC<CustomConfirmModalProps> = ({
  open,
  title = "Are you sure?",
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <Box display="flex" flexDirection="column" alignItems="center" pt={3}>
        <WarningAmberRoundedIcon color="warning" sx={{ fontSize: 48 }} />
      </Box>
      <DialogTitle textAlign="center">
        <Typography fontWeight="bold">{title}</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography textAlign="center">{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={onConfirm}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomConfirmModal;
