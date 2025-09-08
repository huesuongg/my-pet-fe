import {
  Button,
  Select,
  MenuItem,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import React, { useState } from "react";
import ProjectService from "../../manageProjectThunk";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../../store";

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const addMonths = (date: Date, months: number) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
  return new Date(d.setDate(diff));
};

const getStartOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const getEndOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0);

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

type ViewMode = "week" | "month" | "all";

interface ProjectModalHeaderProps {
  projectId: number;
  dateState: [Date, React.Dispatch<React.SetStateAction<Date>>];
}

const ProjectModalHeader = ({ projectId, dateState }: ProjectModalHeaderProps) => {
  const [currentStartDate, setCurrentStartDate] = dateState;
  const [mode, setMode] = useState<ViewMode>("week");

  const handlePrev = () => {
    if (mode === "week") {
      setCurrentStartDate(addDays(currentStartDate, -7));
    } else if (mode === "month") {
      setCurrentStartDate(addMonths(currentStartDate, -1));
    }
  };

  const handleNext = () => {
    if (mode === "week") {
      setCurrentStartDate(addDays(currentStartDate, 7));
    } else if (mode === "month") {
      setCurrentStartDate(addMonths(currentStartDate, 1));
    }
  };

  const renderTitle = () => {
    if (mode === "week") {
      const start = getStartOfWeek(currentStartDate);
      const end = addDays(start, 6);
      return `Week: ${formatDate(start)} - ${formatDate(end)}`;
    } else if (mode === "month") {
      const start = getStartOfMonth(currentStartDate);
      const end = getEndOfMonth(currentStartDate);
      return `Month: ${formatDate(start)} - ${formatDate(end)}`;
    } else {
      return "All Time";
    }
  };

  const dispatch = useDispatch<AppDispatch>();


  const formatISODate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getStartEndDates = (): { startDate: string; endDate: string } => {
    if (mode === "week") {
      const start = getStartOfWeek(currentStartDate);
      const end = addDays(start, 6);
      return {
        startDate: formatISODate(start),
        endDate: formatISODate(end),
      };
    } else if (mode === "month") {
      const start = getStartOfMonth(currentStartDate);
      const end = getEndOfMonth(currentStartDate);
      return {
        startDate: formatISODate(start),
        endDate: formatISODate(end),
      };
    } else {
      return { startDate: "", endDate: "" }; 
    }
  };

  React.useEffect(() => {
    const {startDate, endDate} = getStartEndDates();
    if (projectId) {
      dispatch(ProjectService.getTimesheetStatistic({
        projectId: projectId,
        startDate,
        endDate,
      }));
    }
  }, [currentStartDate, projectId, mode]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{ padding: 2, borderBottom: "1px solid #ddd" }}
      gap={1}
    >
      <Box display="flex" alignItems="center" gap={1}>
        {mode !== "all" && (
          <>
            <IconButton onClick={handlePrev}>
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={handleNext}>
              <ChevronRight />
            </IconButton>
          </>
        )}
        <Typography variant="h6" fontWeight="bold">
          {renderTitle()}
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={2}>
        <Select
          size="small"
          value={mode}
          onChange={(e) => setMode(e.target.value as ViewMode)}
        >
          <MenuItem value="week">Week</MenuItem>
          <MenuItem value="month">Month</MenuItem>
          <MenuItem value="all">All Time</MenuItem>
        </Select>
        <Button variant="contained" color="error">
          Export
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectModalHeader;
