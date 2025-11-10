import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { schedulingAPI } from "../../scheduling/schedulingAPI";
import { Appointment } from "../../scheduling/types";
import { toast } from "react-toastify";

interface ScheduleStats {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
}

export const ScheduleManagement = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [stats, setStats] = useState<ScheduleStats>({
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
  });

  // Fetch all appointments stats
  const fetchAllAppointmentsStats = useCallback(async () => {
    try {
      // Fetch stats by status
      const allResponse = await schedulingAPI.getAllAppointments({
        page: 1,
        limit: 1,
      });

      const pendingResponse = await schedulingAPI.getAllAppointments({
        page: 1,
        limit: 1,
        status: "pending",
      });

      const confirmedResponse = await schedulingAPI.getAllAppointments({
        page: 1,
        limit: 1,
        status: "confirmed",
      });

      const completedResponse = await schedulingAPI.getAllAppointments({
        page: 1,
        limit: 1,
        status: "completed",
      });

      const cancelledResponse = await schedulingAPI.getAllAppointments({
        page: 1,
        limit: 1,
        status: "cancelled",
      });

      setStats({
        totalAppointments: allResponse.total || 0,
        pendingAppointments: pendingResponse.total || 0,
        confirmedAppointments: confirmedResponse.total || 0,
        completedAppointments: completedResponse.total || 0,
        cancelledAppointments: cancelledResponse.total || 0,
      });

      console.log("========= Appointments Stats =========");
      console.log("Total:", allResponse.total);
      console.log("Pending:", pendingResponse.total);
      console.log("Confirmed:", confirmedResponse.total);
      console.log("Completed:", completedResponse.total);
      console.log("Cancelled:", cancelledResponse.total);
      console.log("======================================");
    } catch (err) {
      console.error("Error fetching appointments stats:", err);
    }
  }, []);

  // Fetch all stats once on mount
  useEffect(() => {
    fetchAllAppointmentsStats();
  }, [fetchAllAppointmentsStats]);

  const fetchAppointments = useCallback(async (page: number = 1, status: string = "all") => {
    try {
      setLoading(true);
      const response = await schedulingAPI.getAllAppointments({
        page,
        limit: pageSize,
        status: status !== "all" ? status : undefined,
      });

      console.log("========= Appointments API Response =========");
      console.log("Full response:", response);
      console.log("Appointments:", response.appointments);
      console.log("Total:", response.total);
      console.log("Page:", response.page);
      console.log("Total Pages:", response.totalPages);
      console.log("============================================");

      const appointmentsData = response.appointments || [];
      setAppointments(appointmentsData);
      setTotal(response.total || 0);
      setTotalPages(response.totalPages || Math.ceil((response.total || 0) / pageSize));

      setLoading(false);
    } catch (err) {
      interface ErrorResponse {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      }
      const error = err as ErrorResponse;
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Lỗi khi tải danh sách appointments";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  }, [pageSize]);

  // Fetch appointments when page or filter changes
  useEffect(() => {
    fetchAppointments(currentPage, statusFilter);
  }, [currentPage, statusFilter, fetchAppointments]);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  const handleStatusFilterChange = (event: { target: { value: string } }) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleViewDetails = async (appointment: Appointment) => {
    try {
      // Fetch full appointment details
      const fullAppointment = await schedulingAPI.getAppointmentById(appointment.id);
      if (fullAppointment) {
        setSelectedAppointment(fullAppointment);
      } else {
        setSelectedAppointment(appointment);
      }
      setDialogOpen(true);
    } catch (err) {
      console.error("Error fetching appointment details:", err);
      // Fallback to using the appointment from list
      setSelectedAppointment(appointment);
      setDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedAppointment(null);
  };

  const handleUpdateStatus = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewStatus(appointment.status);
    setStatusDialogOpen(true);
  };

  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
    setSelectedAppointment(null);
    setNewStatus("");
  };

  const handleSaveStatus = async () => {
    if (!selectedAppointment || !newStatus) return;

    try {
      // Use updateAppointmentStatus for status-only updates
      await schedulingAPI.updateAppointmentStatus(
        selectedAppointment.id,
        newStatus
      );
      toast.success("Cập nhật trạng thái thành công!");
      handleCloseStatusDialog();
      fetchAppointments(currentPage, statusFilter);
      fetchAllAppointmentsStats(); // Refresh stats
    } catch (err) {
      toast.error("Không thể cập nhật trạng thái");
      console.error("Error updating appointment status:", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
    case "confirmed":
      return "success";
    case "pending":
      return "warning";
    case "completed":
      return "info";
    case "cancelled":
      return "error";
    case "active":
      return "primary";
    default:
      return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
    case "confirmed":
      return "Đã xác nhận";
    case "pending":
      return "Chờ xác nhận";
    case "cancelled":
      return "Đã hủy";
    case "completed":
      return "Hoàn thành";
    case "active":
      return "Đang hoạt động";
    default:
      return status;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "N/A";
    return timeString;
  };

  const formatDateTime = (dateString?: string, timeString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const time = timeString || "";
    return `${date.toLocaleDateString("vi-VN")} ${time}`;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={1} color="#2F80ED">
        Quản lý Lịch hẹn
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Quản lý tất cả lịch hẹn trong hệ thống
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent sx={{ bgcolor: "#3B82F6", color: "white" }}>
              <Box display="flex" alignItems="center">
                <CalendarTodayIcon
                  sx={{ fontSize: 40, color: "white", mr: 2 }}
                />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {stats.totalAppointments}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.9)">
                    Tổng lịch hẹn
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent sx={{ bgcolor: "#F59E0B", color: "white" }}>
              <Box display="flex" alignItems="center">
                <AccessTimeIcon
                  sx={{ fontSize: 40, color: "white", mr: 2 }}
                />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {stats.pendingAppointments}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.9)">
                    Chờ xác nhận
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent sx={{ bgcolor: "#22C55E", color: "white" }}>
              <Box display="flex" alignItems="center">
                <CheckCircleIcon
                  sx={{ fontSize: 40, color: "white", mr: 2 }}
                />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {stats.confirmedAppointments}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.9)">
                    Đã xác nhận
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent sx={{ bgcolor: "#10B981", color: "white" }}>
              <Box display="flex" alignItems="center">
                <CheckCircleIcon
                  sx={{ fontSize: 40, color: "white", mr: 2 }}
                />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {stats.completedAppointments}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.9)">
                    Hoàn thành
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent sx={{ bgcolor: "#EF4444", color: "white" }}>
              <Box display="flex" alignItems="center">
                <CancelIcon sx={{ fontSize: 40, color: "white", mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {stats.cancelledAppointments}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.9)">
                    Đã hủy
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter */}
      <Box mb={3}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Lọc theo trạng thái</InputLabel>
          <Select
            value={statusFilter}
            label="Lọc theo trạng thái"
            onChange={handleStatusFilterChange}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="pending">Chờ xác nhận</MenuItem>
            <MenuItem value="confirmed">Đã xác nhận</MenuItem>
            <MenuItem value="completed">Hoàn thành</MenuItem>
            <MenuItem value="cancelled">Đã hủy</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Appointments Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Mã lịch hẹn</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Bác sĩ</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Bệnh nhân</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Ngày giờ</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Loại</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Trạng thái</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Thao tác</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary">
                        Không có lịch hẹn nào
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.id}</TableCell>
                      <TableCell>
                        {appointment.doctor?.name || "N/A"}
                      </TableCell>
                      <TableCell>
                        {appointment.patientName || "N/A"}
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {appointment.patientPhone || appointment.phone}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {formatDateTime(appointment.date, appointment.time)}
                      </TableCell>
                      <TableCell>{appointment.type || "N/A"}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(appointment.status)}
                          color={getStatusColor(appointment.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewDetails(appointment)}
                            title="Xem chi tiết"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => handleUpdateStatus(appointment)}
                            title="Cập nhật trạng thái"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}

          {/* Pagination Info */}
          <Box mt={2} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Hiển thị {appointments.length} / {total} lịch hẹn (Trang{" "}
              {currentPage} / {totalPages})
            </Typography>
          </Box>
        </>
      )}

      {/* Appointment Details Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Mã lịch hẹn
                </Typography>
                <Typography variant="body1">{selectedAppointment.id}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Bác sĩ
                </Typography>
                <Typography variant="body1">
                  {selectedAppointment.doctor?.name || "N/A"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Bệnh nhân
                </Typography>
                <Typography variant="body1">
                  {selectedAppointment.patientName || "N/A"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Số điện thoại
                </Typography>
                <Typography variant="body1">
                  {selectedAppointment.patientPhone ||
                    selectedAppointment.phone ||
                    "N/A"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Ngày
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedAppointment.date)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Giờ
                </Typography>
                <Typography variant="body1">
                  {formatTime(selectedAppointment.time)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Loại
                </Typography>
                <Typography variant="body1">
                  {selectedAppointment.type || "N/A"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Trạng thái
                </Typography>
                <Chip
                  label={getStatusLabel(selectedAppointment.status)}
                  color={getStatusColor(selectedAppointment.status)}
                  size="small"
                />
              </Box>
              {selectedAppointment.notes && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ghi chú
                  </Typography>
                  <Typography variant="body1">
                    {selectedAppointment.notes}
                  </Typography>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={handleCloseStatusDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cập nhật trạng thái</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={newStatus}
              label="Trạng thái"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="pending">Chờ xác nhận</MenuItem>
              <MenuItem value="confirmed">Đã xác nhận</MenuItem>
              <MenuItem value="completed">Hoàn thành</MenuItem>
              <MenuItem value="cancelled">Đã hủy</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>Hủy</Button>
          <Button onClick={handleSaveStatus} variant="contained" color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

