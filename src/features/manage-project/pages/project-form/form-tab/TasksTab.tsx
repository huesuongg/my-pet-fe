import { useSelector } from "react-redux";
import type { RootState } from "../../../../../store";
import { ProjectDetailPayload } from "../../../types/project.dto";
import {
  Box,
  Grid,
  Typography,
  Checkbox,
  IconButton,
  Collapse,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { useOutletContext } from "react-router-dom";
import { FieldError } from "../../../types";
import React from "react";
import { errorTaskList } from "../../../helpers/projectHelper";

export const TasksTab = (): JSX.Element => {
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
  const error = getError("tasks");
  const [showTaskList, setShowTaskList] = React.useState(true);

  const taskList = useSelector((state: RootState) => state.projectMeta.tasks);

  const toggleTask = (taskId: number) => {
    if (formData.tasks.some((t) => t.taskId === taskId)) return;
    setFormData((prev) => ({
      ...prev,
      tasks: [...prev.tasks, { taskId, billable: true }],
    }));
  };

  const toggleBillable = (taskId: number) => {
    setFormData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.taskId === taskId ? { ...task, billable: !task.billable } : task
      ),
    }));
  };

  const removeTask = (taskId: number) => {
    setFormData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.taskId !== taskId),
    }));
  };

  
  const allBillable = formData.tasks.length > 0 && formData.tasks.every((t) => t.billable);
  const noneBillable = formData.tasks.every((t) => !t.billable);
  const indeterminate = !allBillable && !noneBillable && formData.tasks.length > 0;

  const handleSelectAllBillable = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setFormData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => ({ ...task, billable: checked })),
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
        {/* Selected Tasks */}
        <Grid size={12}>
          <Grid
            size={12}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography fontWeight="bold" gutterBottom>
              Tasks
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography
                sx={{ marginRight: 1.5 }}
                fontWeight="bold"
                gutterBottom
              >
                Billable
              </Typography>
              <Checkbox
                indeterminate={indeterminate}
                checked={allBillable}
                onChange={handleSelectAllBillable}
                color="error"
                sx={{ p: 0, mr: 1 }}
                inputProps={{ 'aria-label': 'Select all billable' }}
              />
            </Box>
          </Grid>
          {error && errorTaskList(formData.tasks)&& (
            <Typography variant="caption" color="error" sx={{ mb: 1, ml: 2 }}>
              {error.message}
            </Typography>
          )}

          <Grid container>
            {formData.tasks.map((assignment) => {
              const task = taskList.find((t) => t.id === assignment.taskId);
              if (!task) return null;
              return (
                <Grid
                  key={assignment.taskId}
                  size={12}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton onClick={() => removeTask(assignment.taskId)}>
                      <CloseIcon color="error" />
                    </IconButton>
                    <Typography>{task.name}</Typography>
                  </Box>
                  <Checkbox
                    checked={assignment.billable}
                    onChange={() => toggleBillable(assignment.taskId)}
                    color="error"
                  />
                </Grid>
              );
            })}
          </Grid>
        </Grid>

        {/* Expandable Select Task */}
        <Grid size={12}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ cursor: "pointer" }}
            onClick={() => setShowTaskList((prev) => !prev)}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Select task
            </Typography>
            {showTaskList ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>

          <Collapse in={showTaskList}>
            <List dense>
              {taskList
                .filter(
                  (task) => !formData.tasks.some((t) => t.taskId === task.id)
                )
                .map((task) => (
                  <ListItem
                    key={task.id}
                    secondaryAction={
                      <Typography variant="body2" color="text.secondary">
                        Other Task
                      </Typography>
                    }
                    disablePadding
                    sx={{ px: 2 }}
                    onClick={() => toggleTask(task.id)}
                  >
                    <IconButton>
                      <AddCircleOutlineIcon />
                    </IconButton>
                    <ListItemText primary={task.name} sx={{ ml: 1 }} />
                  </ListItem>
                ))}
            </List>
          </Collapse>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TasksTab;
