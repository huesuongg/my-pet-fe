import React from "react";
import { Form } from "react-bootstrap";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

import { Role, Status } from "../types/types";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  role: Role | "All";
  onRoleChange: (v: Role | "All") => void;
  status: Status | "All";
  onStatusChange: (v: Status | "All") => void;
};

const UserHeading: React.FC<Props> = ({
  search,
  onSearchChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
}) => {
  return (
    <div className="mb-3">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">User Management</h4>
      </div>

      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        {/* Left side: search + filters */}
        <div className="d-flex align-items-center gap-2 flex-grow-1">
          <div className="flex-grow-1" style={{ maxWidth: 300, position: "relative" }}>
            <Form.Control
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search"
              aria-label="Search"
              className="px-5" // Add padding to make space for the icon
            />
            {/* You'll need to position the icon absolutely on top of the Form.Control */}
            <InputAdornment position="start" sx={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "1rem" }}>
              <SearchIcon color="action" />
            </InputAdornment>
          </div>

          <div style={{ position: "relative" }}>
            <Form.Select
              style={{ width: 150 }}
              value={role}
              onChange={(e) => onRoleChange(e.target.value as Role | "All")}
              aria-label="Filter by role"
              className="px-5"
            >
              <option value="All">Role</option>
              <option value="Admin">Admin</option>
              <option value="Customer">Customer</option>
              <option value="Doctor">Doctor</option>
            </Form.Select>
            <InputAdornment position="start" sx={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "1rem" }}>
              <PersonIcon color="action" />
            </InputAdornment>
          </div>

          <div style={{ position: "relative" }}>
            <Form.Select
              style={{ width: 150 }}
              value={status}
              onChange={(e) => onStatusChange(e.target.value as Status | "All")}
              aria-label="Filter by status"
              className="px-5"
            >
              <option value="All">Status</option>
              <option value="Active">Active</option>
              <option value="Banned">Banned</option>
            </Form.Select>
            <InputAdornment position="start" sx={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "1rem" }}>
              <WorkspacePremiumIcon color="action" />
            </InputAdornment>
          </div>
        </div>

        {/* Right side: buttons (commented out) */}
      </div>
    </div>
  );
};

export default UserHeading;