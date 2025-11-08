import { useState, useEffect } from "react";
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
  IconButton,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import {
  Person as PersonIcon,
  Block as BlockIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";

interface User {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  role: string;
  isBanned: boolean;
  banReason: string | null;
  createdAt: string;
}

export const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalCustomers: 0,
    bannedUsers: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/users');
      
      // Extract items from paginated response
      const items = response.data.items || response.data;
      setUsers(items);
      
      // Calculate stats
      const stats = {
        totalUsers: response.data.total || items.length,
        totalAdmins: items.filter((u: User) => u.role === "admin").length,
        totalCustomers: items.filter((u: User) => u.role === "customer").length,
        bannedUsers: items.filter((u: User) => u.isBanned).length,
      };
      setStats(stats);
      
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
      const errorMessage = error.response?.data?.message || error.message || "Lỗi khi tải danh sách users";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const handleBanUser = async (userId: string) => {
    if (!confirm("Bạn có chắc muốn ban user này?")) return;
    
    try {
      await axiosInstance.put(`/api/users/${userId}/ban`, {
        reason: "Banned by admin",
        expires: null,
      });
      toast.success("User đã bị ban!");
      fetchUsers();
    } catch {
      toast.error("Không thể ban user");
    }
  };

  const handleUnbanUser = async (userId: string) => {
    if (!confirm("Bạn có chắc muốn unban user này?")) return;
    
    try {
      await axiosInstance.put(`/api/users/${userId}/unban`);
      toast.success("User đã được unban!");
      fetchUsers();
    } catch {
      toast.error("Không thể unban user");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
    case "admin":
      return "error";
    case "customer":
      return "primary";
    default:
      return "default";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>

      <Typography variant="h5" fontWeight="bold" mb={1} color="#2F80ED">
        Quản lý Users
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Quản lý tất cả users trong hệ thống
      </Typography>

      {/* Stats Cards */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mb: 3 }}>
        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", md: "1 1 calc(25% - 18px)" } }}>
          <Card>
            <CardContent sx={{ bgcolor: "#2F80ED", color: "white" }}>
              <Box display="flex" alignItems="center">
                <PersonIcon sx={{ fontSize: 40, color: "white", mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {stats.totalUsers}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.8)">
                    Tổng Users
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", md: "1 1 calc(25% - 18px)" } }}>
          <Card>
            <CardContent sx={{ bgcolor: "#FFD43B", color: "white" }}>
              <Box display="flex" alignItems="center">
                <PersonIcon sx={{ fontSize: 40, color: "white", mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {stats.totalCustomers}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.9)">
                    Customers
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", md: "1 1 calc(25% - 18px)" } }}>
          <Card>
            <CardContent sx={{ bgcolor: "#FF6B6B", color: "white" }}>
              <Box display="flex" alignItems="center">
                <PersonIcon sx={{ fontSize: 40, color: "white", mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {stats.totalAdmins}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.9)">
                    Admins
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", md: "1 1 calc(25% - 18px)" } }}>
          <Card>
            <CardContent sx={{ bgcolor: "#A0AEC0", color: "white" }}>
              <Box display="flex" alignItems="center">
                <BlockIcon sx={{ fontSize: 40, color: "white", mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {stats.bannedUsers}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.9)">
                    Banned Users
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Stack>

      {/* Users Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Username</strong></TableCell>
                <TableCell><strong>Fullname</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Role</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Created At</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.fullname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role} 
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {user.isBanned ? (
                      <Chip 
                        label="Banned" 
                        color="error" 
                        size="small"
                        icon={<BlockIcon />}
                      />
                    ) : (
                      <Chip 
                        label="Active" 
                        color="success" 
                        size="small"
                        icon={<CheckIcon />}
                      />
                    )}
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      {user.isBanned ? (
                        <IconButton
                          color="success"
                          size="small"
                          onClick={() => handleUnbanUser(user._id)}
                          title="Unban user"
                        >
                          <CheckIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleBanUser(user._id)}
                          title="Ban user"
                        >
                          <BlockIcon />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};