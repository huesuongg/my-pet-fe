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
  IconButton,
  CircularProgress,
  Alert,
  Stack,
  Pagination,
} from "@mui/material";
import {
  Person as PersonIcon,
  Block as BlockIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import { adminAPI, UsersResponse } from "../adminAPI";

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalCustomers: 0,
    bannedUsers: 0,
  });

  // Fetch all users stats to calculate accurate customer count
  const fetchAllUsersStats = useCallback(async () => {
    try {
      // First, try to get total users count
      const allUsersResponse: UsersResponse = await adminAPI.getUsers({
        page: 1,
        limit: 1, // Just to get total count
      });

      console.log('========= All Users Stats Response =========');
      console.log('Total users from API:', allUsersResponse.total);
      console.log('Stats from API:', allUsersResponse.stats);
      console.log('============================================');

      const totalUsers = allUsersResponse.total || 0;
      
      // If API provides stats, use them (most accurate)
      if (allUsersResponse.stats) {
        setStats({
          totalUsers: allUsersResponse.stats.totalUsers || totalUsers,
          totalAdmins: allUsersResponse.stats.totalAdmins || 0,
          totalCustomers: allUsersResponse.stats.totalCustomers || 0,
          bannedUsers: allUsersResponse.stats.bannedUsers || 0,
        });
        
        console.log('========= Using API Stats =========');
        console.log('Total Users:', allUsersResponse.stats.totalUsers);
        console.log('Total Customers:', allUsersResponse.stats.totalCustomers);
        console.log('Total Admins:', allUsersResponse.stats.totalAdmins);
        console.log('Banned Users:', allUsersResponse.stats.bannedUsers);
        console.log('==================================');
      } else {
        // If no stats from API, fetch by role to get accurate counts
        // Fetch customers count
        const customersResponse = await adminAPI.getUsers({
          page: 1,
          limit: 1,
          role: 'customer',
        });

        // Fetch admins count
        const adminsResponse = await adminAPI.getUsers({
          page: 1,
          limit: 1,
          role: 'admin',
        });

        // Fetch all users with large limit to count banned users
        // Or we can fetch all and count, but that might be expensive
        // For now, let's fetch a reasonable amount to estimate
        const allUsersSample = await adminAPI.getUsers({
          page: 1,
          limit: Math.min(totalUsers, 1000), // Fetch up to 1000 users to count banned
        });

        const bannedCount = allUsersSample.items?.filter((u: User) => u.isBanned).length || 0;
        // If we didn't get all users, estimate banned users proportionally
        const estimatedBanned = totalUsers > 1000 
          ? Math.round((bannedCount / Math.min(totalUsers, 1000)) * totalUsers)
          : bannedCount;

        const stats = {
          totalUsers: totalUsers,
          totalAdmins: adminsResponse.total || 0,
          totalCustomers: customersResponse.total || 0,
          bannedUsers: estimatedBanned,
        };

        setStats(stats);
        
        console.log('========= Calculated Stats from API Totals =========');
        console.log('Total Users:', stats.totalUsers);
        console.log('Total Customers (from API with role filter):', stats.totalCustomers);
        console.log('Total Admins (from API with role filter):', stats.totalAdmins);
        console.log('Banned Users (estimated):', stats.bannedUsers);
        console.log('====================================================');
      }
    } catch (err) {
      console.error('Error fetching all users stats:', err);
      // Don't show error toast, as this is a background operation
      // Fallback: try to get stats from first page
      try {
        const fallbackResponse = await adminAPI.getUsers({
          page: 1,
          limit: pageSize,
        });
        if (fallbackResponse.total) {
          setStats((prev) => ({
            ...prev,
            totalUsers: fallbackResponse.total || 0,
          }));
        }
      } catch (fallbackErr) {
        console.error('Error in fallback stats fetch:', fallbackErr);
      }
    }
  }, [pageSize]);

  // Fetch stats from all users once on mount
  useEffect(() => {
    fetchAllUsersStats();
  }, [fetchAllUsersStats]);

  const fetchUsers = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const response: UsersResponse = await adminAPI.getUsers({
        page,
        limit: pageSize,
      });
      
      console.log('========= Users API Response (Page ' + page + ') =========');
      console.log('Full response:', response);
      console.log('Items:', response.items);
      console.log('Total:', response.total);
      console.log('Page:', response.page);
      console.log('Limit:', response.limit);
      console.log('Total Pages from API:', response.totalPages);
      console.log('========================================================');
      
      // Extract items from paginated response
      const items = response.items || [];
      setUsers(items);
      setTotal(response.total || 0);
      
      // Calculate totalPages from total and pageSize if API doesn't provide it
      const calculatedTotalPages = response.totalPages 
        ? response.totalPages 
        : Math.ceil((response.total || 0) / pageSize);
      
      setTotalPages(calculatedTotalPages);
      
      console.log('========= Pagination Calculation =========');
      console.log('Total users:', response.total);
      console.log('Page size:', pageSize);
      console.log('Calculated total pages:', calculatedTotalPages);
      console.log('API total pages:', response.totalPages);
      console.log('==========================================');
      
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
  }, [pageSize]);

  // Fetch users when page changes
  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, fetchUsers]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleBanUser = async (userId: string) => {
    if (!confirm("Bạn có chắc muốn ban user này?")) return;
    
    try {
      await axiosInstance.put(`/api/users/${userId}/ban`, {
        reason: "Banned by admin",
        expires: null,
      });
      toast.success("User đã bị ban!");
      fetchUsers(currentPage);
    } catch {
      toast.error("Không thể ban user");
    }
  };

  const handleUnbanUser = async (userId: string) => {
    if (!confirm("Bạn có chắc muốn unban user này?")) return;
    
    try {
      await axiosInstance.put(`/api/users/${userId}/unban`);
      toast.success("User đã được unban!");
      fetchUsers(currentPage);
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
        <>
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
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary">
                        Không có users nào
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
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
              Hiển thị {users.length} / {total} users (Trang {currentPage} / {totalPages})
            </Typography>
          </Box>
        </>
      )}
    </Container>
  );
};