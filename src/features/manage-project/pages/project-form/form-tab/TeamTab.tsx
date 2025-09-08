import {
  Box,
  Grid,
  Typography,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Avatar,
  ListItemAvatar,
  ListItemText,
  Checkbox,
  ListItemButton,
  ListItem,
  Chip,
  MenuItem,
} from "@mui/material";
import { FixedSizeList as VirtualList } from "react-window";
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import type { RootState } from "../../../../../store";
import type {
  ProjectDetailPayload,
  ProjectUserAssignment,
} from "../../../types/project.dto";
import type { FieldError } from "../../../types";
import React from "react";
import { errorTypeUser, errorUserList } from "../../../helpers/projectHelper";
import { UserType } from "../../../../../types/user/user.model";

const typeOptions = [
  { value: 0, label: "Member" },
  { value: 1, label: "PM" },
  { value: 2, label: "Shadow" },
  { value: 3, label: "Deactive" },
];
const isTempOptions = [
  { value: false, label: "Official" },
  { value: true, label: "Temp" },
];

const UserItem = React.memo(
  ({
    user,
    isSelected,
    onToggle,
    style,
    type,
    isTemp,
    onTypeChange,
    onIsTempChange,
  }: {
    user: UserType;
    isSelected: boolean;
    onToggle: () => void;
    style: React.CSSProperties;
    type?: number;
    isTemp?: boolean;
    onTypeChange?: (type: number) => void;
    onIsTempChange?: (isTemp: boolean) => void;
  }) => (
    <ListItem style={style} disablePadding>
      <ListItemButton onClick={onToggle}>
        <ListItemAvatar>
          <Avatar
            src= {user.avatarFullPath}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography color="text.primary" fontWeight="bold">
                {user.name}
              </Typography>
              <Chip
                label={user.isActive ? "active" : "inactive"}
                variant="outlined"
                sx={{
                  borderColor: "#ffffff",
                  color: `${user.isActive ? "#399614" : "#d61f34"}`,
                }}
                size="small"
              />
            </Box>
          }
          secondary={
            <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  maxWidth: "250px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {user.emailAddress}
                </Typography>
                <Typography variant="body2" color={user.branchColor}>
                  {user.branchDisplayName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.positionName}
                </Typography>
              </Box>
              {isSelected && (
                <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                  <TextField
                    select
                    size="small"
                    label="Type"
                    value={type}
                    onChange={(e) =>
                      onTypeChange && onTypeChange(Number(e.target.value))
                    }
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      minWidth: 90,
                      "& .MuiInputBase-input": { fontSize: 14 },
                      "& .MuiInputLabel-root": { fontSize: 14 },
                    }}
                  >
                    {typeOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    size="small"
                    label="Status"
                    value={isTemp === true ? true : false}
                    onChange={(e) =>
                      onIsTempChange &&
                      onIsTempChange(e.target.value === "true")
                    }
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      minWidth: 90,
                      "& .MuiInputBase-input": { fontSize: 14 },
                      "& .MuiInputLabel-root": { fontSize: 14 },
                    }}
                  >
                    {isTempOptions.map((opt) => (
                      <MenuItem
                        key={String(opt.value)}
                        value={String(opt.value)}
                      >
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              )}
            </Box>
          }
          primaryTypographyProps={{ fontWeight: 500 }}
        />
        <Checkbox edge="end" checked={isSelected} />
      </ListItemButton>
    </ListItem>
  )
);

export const TeamTab = (): JSX.Element => {
  const [formData, setFormData, errors] =
    useOutletContext<
      [
        ProjectDetailPayload,
        React.Dispatch<React.SetStateAction<ProjectDetailPayload>>,
        FieldError[],
      ]
    >();

  const getError = (field: string) => {
    return errors.find((e) => e.field === field);
  };
  const error = getError("users");

  const userList = useSelector((state: RootState) => state.projectMeta.users);
  const branchList = useSelector(
    (state: RootState) => state.projectMeta.branches
  );

  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<boolean | "all">("all");

  const handleToggleUser = (userId: number) => {
    const isSelected = formData.users.some((u) => u.userId === userId);

    if (isSelected) {
      const updatedUsers = formData.users.filter((u) => u.userId !== userId);
      setFormData({ ...formData, users: updatedUsers });
    } else {
      const user = userList.find((u) => u.id === userId);
      if (!user) return;

      const newUser: ProjectUserAssignment = {
        userId: user.id,
        type: 1,
        isTemp: false,
      };

      setFormData({ ...formData, users: [...formData.users, newUser] });
    }
  };

  const handleTypeChange = (userId: number, newType: number) => {
    setFormData({
      ...formData,
      users: formData.users.map((u) =>
        u.userId === userId ? { ...u, type: newType } : u
      ),
    });
  };

  const handleIsTempChange = (userId: number, newIsTemp: boolean) => {
    setFormData({
      ...formData,
      users: formData.users.map((u) =>
        u.userId === userId ? { ...u, isTemp: newIsTemp } : u
      ),
    });
  };

  const filteredUsers = useMemo(() => {
    return userList.filter((user) => {
      const matchSearch = user.name
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchType =
        typeFilter === "all" || String(user.type) === typeFilter;
      const matchBranch = branchFilter === 0 || user.branchId === branchFilter;
      const matchStatus =
        activeFilter === "all" || user.isActive === activeFilter;
      return matchSearch && matchType && matchBranch && matchStatus;
    });
  }, [userList, searchText, typeFilter, branchFilter, activeFilter]);

  const selectedUserIds = new Set(formData.users.map((u) => u.userId));

  const selectedUsers = filteredUsers.filter((user) =>
    selectedUserIds.has(user.id)
  );
  const unselectedUsers = filteredUsers.filter(
    (user) => !selectedUserIds.has(user.id)
  );

  return (
    <Box >
      <Box sx={{ padding: "0 24px 24px 24px" }}>
        <Typography variant="h6" fontWeight="bold">
          Select Users
        </Typography>
        {error &&
          (errorUserList(formData.users) || errorTypeUser(formData.users)) && (
          <Typography variant="caption" color="error" sx={{ mb: 1, ml: 0.5 }}>
            {error.message}
          </Typography>
        )}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={6}>
            <TextField
              label="Search user"
              fullWidth
              size="small"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Grid>
          <Grid size={6}>
            <ToggleButtonGroup
              value={typeFilter}
              exclusive
              onChange={(_, newType) =>
                newType !== null && setTypeFilter(newType)
              }
              size="small"
              fullWidth
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="0">Staff</ToggleButton>
              <ToggleButton value="1">Intern</ToggleButton>
              <ToggleButton value="2">Collab</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid size={12} container spacing={2}>
            <Grid size={6}>
              <TextField
                select
                label="Filter by Branch"
                fullWidth
                size="small"
                value={branchFilter}
                onChange={(e) => setBranchFilter(Number(e.target.value))}
              >
                {branchList.map((branch) => (
                  <MenuItem key={branch.id} value={branch.id}>
                    {branch.displayName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={6}>
              <ToggleButtonGroup
                value={activeFilter}
                exclusive
                onChange={(_, newStatus) => {
                  if (newStatus !== null) setActiveFilter(newStatus);
                }}
                size="small"
                fullWidth
              >
                <ToggleButton value="all">All</ToggleButton>
                <ToggleButton value={true}>Active</ToggleButton>
                <ToggleButton value={false}>Inactive</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>

          <Grid size={12} container spacing={2}>
            <Grid size={6}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Selected
              </Typography>
              <VirtualList
                height={500}
                itemSize={120}
                width="100%"
                itemCount={selectedUsers.length}
              >
                {({ index, style }) => {
                  const user = selectedUsers[index];
                  const selectedUser = formData.users.find(
                    (u) => u.userId === user.id
                  );
                  return (
                    <UserItem
                      key={user.id}
                      user={user}
                      isSelected={true}
                      onToggle={() => handleToggleUser(user.id)}
                      style={style}
                      type={selectedUser?.type}
                      isTemp={selectedUser?.isTemp}
                      onTypeChange={(type) => handleTypeChange(user.id, type)}
                      onIsTempChange={(isTemp) =>
                        handleIsTempChange(user.id, isTemp)
                      }
                    />
                  );
                }}
              </VirtualList>
            </Grid>
            <Grid size={6}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Unselected
              </Typography>
              <VirtualList
                height={500}
                itemSize={70}
                width="100%"
                itemCount={unselectedUsers.length}
              >
                {({ index, style }) => {
                  const user = unselectedUsers[index];
                  return (
                    <UserItem
                      key={user.id}
                      user={user}
                      isSelected={false}
                      onToggle={() => handleToggleUser(user.id)}
                      style={style}
                    />
                  );
                }}
              </VirtualList>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TeamTab;
