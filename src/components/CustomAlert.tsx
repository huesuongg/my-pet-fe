import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

interface CustomAlertProps {
  status: "success" | "info" | "warning" | "error";
  message: string;
  handleClose?: () => void;
}
export default function CustomAlert({status, message, handleClose}: CustomAlertProps) {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert severity={status} onClose={handleClose}>{message}</Alert>
    </Stack>
  );
}
