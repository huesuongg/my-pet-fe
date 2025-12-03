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
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  ShoppingCart as ShoppingCartIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { shoppingAPI } from "../../shopping/shoppingAPI";
import { Order, OrderStatus } from "../../shopping/types/order";
import { toast } from "react-toastify";

interface FinanceStats {
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
}

export const FinanceManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false);
  const [stats, setStats] = useState<FinanceStats>({
    totalRevenue: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
    averageOrderValue: 0,
  });

  // Fetch all completed orders to calculate total revenue accurately
  const fetchAllCompletedOrders = useCallback(async () => {
    try {
      // Fetch all completed/delivered orders without pagination limit (Admin only)
      // Try DELIVERED status first
      const response = await shoppingAPI.getAllOrders({
        page: 1,
        limit: 1000, // Large limit to get all completed orders
        status: OrderStatus.DELIVERED,
      });

      // If no delivered orders, try fetching all orders and filter client-side
      let completedOrders: Order[] = [];
      if (Array.isArray(response)) {
        completedOrders = response.filter((order: Order) => 
          order.status === OrderStatus.DELIVERED || 
          order.status === "DELIVERED" ||
          order.status === "COMPLETED"
        );
      } else if (response.orders && Array.isArray(response.orders)) {
        completedOrders = response.orders.filter((order: Order) => 
          order.status === OrderStatus.DELIVERED || 
          order.status === "DELIVERED" ||
          order.status === "COMPLETED"
        );
      } else if (response.items && Array.isArray(response.items)) {
        completedOrders = response.items.filter((order: Order) => 
          order.status === OrderStatus.DELIVERED || 
          order.status === "DELIVERED" ||
          order.status === "COMPLETED"
        );
      }

      // If still no completed orders, try fetching all orders without status filter
      if (completedOrders.length === 0) {
        console.log("No delivered orders found with status filter, fetching all orders...");
        const allOrdersResponse = await shoppingAPI.getAllOrders({
          page: 1,
          limit: 1000,
          // No status filter
        });
        
        // Extract and filter for delivered/completed orders
        let allOrders: Order[] = [];
        if (Array.isArray(allOrdersResponse)) {
          allOrders = allOrdersResponse;
        } else if (allOrdersResponse.orders && Array.isArray(allOrdersResponse.orders)) {
          allOrders = allOrdersResponse.orders;
        } else if (allOrdersResponse.items && Array.isArray(allOrdersResponse.items)) {
          allOrders = allOrdersResponse.items;
        }
        
        completedOrders = allOrders.filter(order => 
          order.status === OrderStatus.DELIVERED || 
          order.status === "DELIVERED" ||
          order.status === "COMPLETED"
        );
      }
      
      console.log("========= Completed Orders Data =========");
      console.log("Completed orders count:", completedOrders.length);
      if (completedOrders.length > 0) {
        console.log("First order sample:", completedOrders[0]);
      }
      console.log("=========================================");
      
      // Helper function to safely calculate order total
      const calculateOrderTotal = (order: Order): number => {
        try {
          // First, try to use order.total if it exists and is a valid number
          if (order.total !== undefined && order.total !== null) {
            const totalNum = Number(order.total);
            if (!isNaN(totalNum) && totalNum >= 0) {
              return totalNum;
            }
          }
          
          // Calculate from subtotal + shippingFee
          const subtotal = order.subtotal !== undefined && order.subtotal !== null 
            ? Number(order.subtotal) 
            : 0;
          const shippingFee = order.shippingFee !== undefined && order.shippingFee !== null 
            ? Number(order.shippingFee) 
            : 0;
          
          // If we have subtotal and shippingFee, use them (even if 0)
          if (!isNaN(subtotal) && !isNaN(shippingFee)) {
            const result = subtotal + shippingFee;
            if (!isNaN(result)) {
              return result;
            }
          }
          
          // Otherwise, calculate from items
          if (order.items && Array.isArray(order.items) && order.items.length > 0) {
            const itemsTotal = order.items.reduce((sum, item) => {
              const price = item.price !== undefined && item.price !== null 
                ? Number(item.price) 
                : 0;
              const quantity = item.quantity !== undefined && item.quantity !== null 
                ? Number(item.quantity) 
                : 1;
              const itemTotal = (isNaN(price) ? 0 : price) * (isNaN(quantity) ? 1 : quantity);
              return sum + (isNaN(itemTotal) ? 0 : itemTotal);
            }, 0);
            const finalTotal = itemsTotal + (isNaN(shippingFee) ? 0 : shippingFee);
            if (!isNaN(finalTotal)) {
              return finalTotal;
            }
          }
          
          // Default to 0 if no valid data
          return 0;
        } catch (error) {
          console.error("Error calculating order total:", error, order);
          return 0;
        }
      };

      // Calculate total revenue with proper initial value
      const totalRevenue = completedOrders.reduce((sum, order) => {
        const orderTotal = calculateOrderTotal(order);
        const result = sum + (isNaN(orderTotal) ? 0 : orderTotal);
        return isNaN(result) ? sum : result;
      }, 0);

      const completedCount = completedOrders.length;
      
      console.log("========= All Completed Orders Revenue =========");
      console.log("Completed Orders Count:", completedOrders.length);
      if (completedOrders.length > 0) {
        console.log("First Order Sample:", JSON.stringify(completedOrders[0], null, 2));
        console.log("First Order Total:", calculateOrderTotal(completedOrders[0]));
        console.log("First Order Status:", completedOrders[0].status);
      } else {
        console.log("Warning: No completed orders found! Revenue will be 0.");
      }
      console.log("Calculated Total Revenue:", totalRevenue);
      console.log("Is NaN?", isNaN(totalRevenue));
      console.log("Is Finite?", isFinite(totalRevenue));
      console.log("================================================");

      // Ensure we have valid numbers - validate totalRevenue
      const finalRevenue = (isNaN(totalRevenue) || totalRevenue < 0 || !isFinite(totalRevenue)) 
        ? 0 
        : totalRevenue;
      
      // Calculate average order value safely
      const avgOrderValue = completedCount > 0 && finalRevenue > 0 
        ? finalRevenue / completedCount 
        : 0;
      const finalAvgValue = (isNaN(avgOrderValue) || avgOrderValue < 0 || !isFinite(avgOrderValue)) 
        ? 0 
        : avgOrderValue;

      console.log("Final Revenue:", finalRevenue);
      console.log("Final Average Order Value:", finalAvgValue);

      // Update only revenue stats with validated values
      setStats((prev) => ({
        ...prev,
        totalRevenue: finalRevenue,
        completedOrders: completedCount || 0,
        averageOrderValue: finalAvgValue,
      }));
    } catch (err) {
      console.error("Error fetching all completed orders:", err);
      console.error("Error details:", JSON.stringify(err, null, 2));
      // Reset revenue to 0 on error
      setStats((prev) => ({
        ...prev,
        totalRevenue: 0,
        completedOrders: 0,
        averageOrderValue: 0,
      }));
    }
  }, []);

  // Fetch order statistics separately
  const fetchOrdersStats = useCallback(async () => {
    try {
      // Fetch pending orders count (Admin only)
      const pendingResponse = await shoppingAPI.getAllOrders({
        page: 1,
        limit: 1,
        status: OrderStatus.PENDING,
      });

      // Fetch cancelled orders count (Admin only)
      const cancelledResponse = await shoppingAPI.getAllOrders({
        page: 1,
        limit: 1,
        status: OrderStatus.CANCELLED,
      });

      setStats((prev) => ({
        ...prev,
        pendingOrders: pendingResponse.total || 0,
        cancelledOrders: cancelledResponse.total || 0,
      }));
    } catch (err) {
      console.error("Error fetching order stats:", err);
    }
  }, []);

  // Fetch all stats once on mount
  useEffect(() => {
    fetchAllCompletedOrders();
    fetchOrdersStats();
  }, [fetchAllCompletedOrders, fetchOrdersStats]);

  const fetchOrders = useCallback(async (page: number = 1, status: string = "all") => {
    try {
      setLoading(true);
      // Use getAllOrders for admin to get all orders
      const response = await shoppingAPI.getAllOrders({
        page,
        limit: pageSize,
        status: status !== "all" ? status : undefined,
      });

      console.log("========= Orders API Response =========");
      console.log("Full response:", response);
      console.log("Response type:", typeof response);
      console.log("Is array:", Array.isArray(response));
      console.log("Orders:", response.orders);
      console.log("Items:", response.items);
      console.log("Total:", response.total);
      console.log("Page:", response.page);
      console.log("Total Pages:", response.totalPages);
      console.log("============================================");

      // Handle different response formats
      let ordersData: Order[] = [];
      if (Array.isArray(response)) {
        ordersData = response;
      } else if (response.orders && Array.isArray(response.orders)) {
        ordersData = response.orders;
      } else if (response.items && Array.isArray(response.items)) {
        ordersData = response.items;
      }

      setOrders(ordersData);
      const totalCount = response.total || ordersData.length || 0;
      setTotal(totalCount);
      const calculatedTotalPages = response.totalPages 
        ? response.totalPages 
        : Math.ceil(totalCount / pageSize);
      setTotalPages(calculatedTotalPages || 1);

      // Calculate finance stats for current page
      calculateStatsForPage(ordersData, totalCount);

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
        "Lỗi khi tải danh sách orders";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  }, [pageSize]);

  // Fetch orders when page or filter changes
  useEffect(() => {
    fetchOrders(currentPage, statusFilter);
  }, [currentPage, statusFilter, fetchOrders]);

  const calculateStatsForPage = (ordersData: Order[], totalOrders: number) => {
    // Update total orders count from API response
    setStats((prev) => ({
      ...prev,
      totalOrders: totalOrders || ordersData.length,
    }));

    console.log("========= Page Stats =========");
    console.log("Total Orders:", totalOrders || ordersData.length);
    console.log("==============================");
  };


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

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusDialogOpen(true);
  };

  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
    setSelectedOrder(null);
    setNewStatus("");
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      const orderId = selectedOrder.id || selectedOrder._id;
      if (!orderId) {
        toast.error("Không tìm thấy ID đơn hàng");
        return;
      }

      await shoppingAPI.updateOrderStatus(
        typeof orderId === "string" ? orderId : String(orderId),
        newStatus
      );
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      handleCloseStatusDialog();
      fetchOrders(currentPage, statusFilter);
      fetchAllCompletedOrders(); // Refresh revenue stats
      fetchOrdersStats(); // Refresh order stats
    } catch (err) {
      toast.error("Không thể cập nhật trạng thái đơn hàng");
      console.error("Error updating order status:", err);
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
    case OrderStatus.DELIVERED:
    case "DELIVERED":
    case "COMPLETED":
      return "success";
    case OrderStatus.PENDING:
    case "PENDING":
      return "warning";
    case OrderStatus.PROCESSING:
    case "PROCESSING":
      return "info";
    case OrderStatus.SHIPPED:
    case "SHIPPED":
      return "primary";
    case OrderStatus.CANCELLED:
    case "CANCELLED":
      return "error";
    default:
      return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
    case OrderStatus.DELIVERED:
    case "DELIVERED":
      return "Đã giao";
    case OrderStatus.PENDING:
    case "PENDING":
      return "Chờ xác nhận";
    case OrderStatus.PROCESSING:
    case "PROCESSING":
      return "Đang xử lý";
    case OrderStatus.SHIPPED:
    case "SHIPPED":
      return "Đang giao";
    case OrderStatus.CANCELLED:
    case "CANCELLED":
      return "Đã hủy";
    default:
      return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={1} color="#2F80ED">
        Quản lý Tài chính
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Theo dõi doanh thu và quản lý đơn hàng
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent sx={{ bgcolor: "#22C55E", color: "white" }}>
              <Box display="flex" alignItems="center">
                <AttachMoneyIcon
                  sx={{ fontSize: 40, color: "white", mr: 2 }}
                />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {formatCurrency(stats.totalRevenue || 0)}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.9)">
                    Tổng doanh thu
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent sx={{ bgcolor: "#3B82F6", color: "white" }}>
              <Box display="flex" alignItems="center">
                <ShoppingCartIcon
                  sx={{ fontSize: 40, color: "white", mr: 2 }}
                />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {stats.totalOrders}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.9)">
                    Tổng đơn hàng
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
                    {stats.completedOrders}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.9)">
                    Đơn đã hoàn thành
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
                <TrendingUpIcon
                  sx={{ fontSize: 40, color: "white", mr: 2 }}
                />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {formatCurrency(stats.averageOrderValue || 0)}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.9)">
                    Giá trị đơn trung bình
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
                <ShoppingCartIcon
                  sx={{ fontSize: 40, color: "white", mr: 2 }}
                />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {stats.pendingOrders}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.9)">
                    Đơn đang chờ
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent sx={{ bgcolor: "#6B7280", color: "white" }}>
              <Box display="flex" alignItems="center">
                <ShoppingCartIcon
                  sx={{ fontSize: 40, color: "white", mr: 2 }}
                />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {stats.cancelledOrders}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.9)">
                    Đơn đã hủy
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
            <MenuItem value={OrderStatus.PENDING}>Chờ xác nhận</MenuItem>
            <MenuItem value={OrderStatus.PROCESSING}>Đang xử lý</MenuItem>
            <MenuItem value={OrderStatus.SHIPPED}>Đang giao</MenuItem>
            <MenuItem value={OrderStatus.DELIVERED}>Đã giao</MenuItem>
            <MenuItem value={OrderStatus.CANCELLED}>Đã hủy</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Orders Table */}
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
                    <strong>Mã đơn</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Ngày đặt</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Trạng thái</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Số lượng sản phẩm</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Tổng tiền</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Phương thức thanh toán</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Thao tác</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary">
                        Không có đơn hàng nào
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => {
                    // Safely calculate order total
                    let orderTotal = 0;
                    if (order.total !== undefined && order.total !== null && !isNaN(Number(order.total))) {
                      orderTotal = Number(order.total);
                    } else {
                      const subtotal = order.subtotal !== undefined && order.subtotal !== null 
                        ? Number(order.subtotal) 
                        : 0;
                      const shippingFee = order.shippingFee !== undefined && order.shippingFee !== null 
                        ? Number(order.shippingFee) 
                        : 0;
                      
                      if (subtotal > 0 || shippingFee > 0) {
                        orderTotal = subtotal + shippingFee;
                      } else if (order.items && order.items.length > 0) {
                        const itemsTotal = order.items.reduce((sum, item) => {
                          const price = item.price !== undefined && item.price !== null 
                            ? Number(item.price) 
                            : 0;
                          const quantity = item.quantity !== undefined && item.quantity !== null 
                            ? Number(item.quantity) 
                            : 1;
                          return sum + (price * quantity);
                        }, 0);
                        orderTotal = itemsTotal + shippingFee;
                      }
                    }

                    return (
                      <TableRow key={order.id || order._id}>
                        <TableCell>
                          {order.orderNumber || order._id || order.id}
                        </TableCell>
                        <TableCell>
                          {formatDate(order.createdAt || order.date)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(order.status)}
                            color={getStatusColor(order.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {order.items?.length || 0} sản phẩm
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            color={
                              order.status === OrderStatus.DELIVERED ||
                              order.status === "DELIVERED"
                                ? "success.main"
                                : "text.primary"
                            }
                          >
                            {formatCurrency(orderTotal)}
                          </Typography>
                        </TableCell>
                        <TableCell>{order.paymentMethod || "N/A"}</TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleViewDetails(order)}
                              title="Xem chi tiết"
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="secondary"
                              onClick={() => handleUpdateStatus(order)}
                              title="Cập nhật trạng thái"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
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
              Hiển thị {orders.length} / {total} đơn hàng (Trang {currentPage}{" "}
              / {totalPages})
            </Typography>
          </Box>
        </>
      )}

      {/* Update Status Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={handleCloseStatusDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Mã đơn hàng: {selectedOrder?.orderNumber || selectedOrder?._id || selectedOrder?.id}
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={newStatus}
                label="Trạng thái"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value={OrderStatus.PENDING}>Chờ xác nhận</MenuItem>
                <MenuItem value={OrderStatus.PROCESSING}>Đang xử lý</MenuItem>
                <MenuItem value={OrderStatus.SHIPPED}>Đang giao</MenuItem>
                <MenuItem value={OrderStatus.DELIVERED}>Đã giao</MenuItem>
                <MenuItem value={OrderStatus.CANCELLED}>Đã hủy</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>Hủy</Button>
          <Button onClick={handleSaveStatus} variant="contained" color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chi tiết đơn hàng</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Mã đơn hàng
                </Typography>
                <Typography variant="body1">
                  {selectedOrder.orderNumber || selectedOrder._id || selectedOrder.id}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Ngày đặt
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedOrder.createdAt || selectedOrder.date)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Trạng thái
                </Typography>
                <Chip
                  label={getStatusLabel(selectedOrder.status)}
                  color={getStatusColor(selectedOrder.status)}
                  size="small"
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Số lượng sản phẩm
                </Typography>
                <Typography variant="body1">
                  {selectedOrder.items?.length || 0} sản phẩm
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Tổng tiền
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {(() => {
                    let orderTotal = 0;
                    if (selectedOrder.total !== undefined && selectedOrder.total !== null && !isNaN(Number(selectedOrder.total))) {
                      orderTotal = Number(selectedOrder.total);
                    } else {
                      const subtotal = selectedOrder.subtotal !== undefined && selectedOrder.subtotal !== null 
                        ? Number(selectedOrder.subtotal) 
                        : 0;
                      const shippingFee = selectedOrder.shippingFee !== undefined && selectedOrder.shippingFee !== null 
                        ? Number(selectedOrder.shippingFee) 
                        : 0;
                      
                      if (subtotal > 0 || shippingFee > 0) {
                        orderTotal = subtotal + shippingFee;
                      } else if (selectedOrder.items && selectedOrder.items.length > 0) {
                        const itemsTotal = selectedOrder.items.reduce((sum, item) => {
                          const price = item.price !== undefined && item.price !== null 
                            ? Number(item.price) 
                            : 0;
                          const quantity = item.quantity !== undefined && item.quantity !== null 
                            ? Number(item.quantity) 
                            : 1;
                          return sum + (price * quantity);
                        }, 0);
                        orderTotal = itemsTotal + shippingFee;
                      }
                    }
                    return formatCurrency(orderTotal);
                  })()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Phương thức thanh toán
                </Typography>
                <Typography variant="body1">
                  {selectedOrder.paymentMethod || "N/A"}
                </Typography>
              </Box>
              {selectedOrder.shippingInfo && (
                <>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Thông tin giao hàng
                    </Typography>
                    <Typography variant="body1">
                      {selectedOrder.shippingInfo.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedOrder.shippingInfo.phone}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedOrder.shippingInfo.address}, {selectedOrder.shippingInfo.city}
                    </Typography>
                  </Box>
                </>
              )}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Sản phẩm
                  </Typography>
                  {selectedOrder.items.map((item, index) => (
                    <Box key={index} sx={{ mb: 1, p: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {item.productName || "Sản phẩm"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Số lượng: {item.quantity} x {formatCurrency(item.price || 0)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

