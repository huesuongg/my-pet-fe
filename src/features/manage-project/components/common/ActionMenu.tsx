import React from "react";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

interface ActionMenuOption {
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

interface ActionMenuProps {
  options: ActionMenuOption[];
}

export default function ActionMenu({options }: ActionMenuProps): JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: () => void) => {
    action();
    handleClose();
  };

  return (
    <>
      <Button
        variant="outlined"
        sx={{
          minWidth: "120px",
          borderColor: "#B8192B ",
          color: "#B8192B",
          boxShadow:
            "0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12)",
          fontWeight: "550",
          border: "solid 2px",
        }}
        onClick={handleClick}
        endIcon={<span>▾</span>}
      >
        Actions
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {options.map((option, index) => (
          <MenuItem key={index} onClick={() => handleAction(option.action)}>
            <ListItemIcon>
              {option.icon}
            </ListItemIcon>
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
