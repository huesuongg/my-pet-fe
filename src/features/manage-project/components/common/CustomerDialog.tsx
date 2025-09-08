import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { toast } from "react-toastify";

export const CustomerDialog = ({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; code: string; address: string }) => void;
}): JSX.Element => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");

  const handleSave = () => {
    if (!name || !code) {
      toast.error("Name and code are required");
      return;
    }
    onSave({ name, code, address });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{ '& .MuiDialog-paper': { minWidth: 350,p: 4 } }}>
      <DialogTitle sx={{ variant: "h4", fontWeight: "bold" }}>New Client</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          fullWidth
          value={name}
          onChange={e => setName(e.target.value)}
          sx={{  mt: 2 }}
          required
        />
        <TextField
          label="Code"
          fullWidth
          value={code}
          onChange={e => setCode(e.target.value)}
          sx={{ mt: 2 }}
          required
        />
        <TextField
          label="Address"
          fullWidth
          value={address}
          onChange={e => setAddress(e.target.value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} sx={{ backgroundColor: "#b8192b", color: "white", "&:hover": { backgroundColor: "#b8192b" } }}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};