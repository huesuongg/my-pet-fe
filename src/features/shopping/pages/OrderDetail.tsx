import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Chip,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import styles from './OrderDetail.module.css';
import { Order, OrderStatus } from '../types/order';

// Import mockOrders from mockData
import { mockOrders } from '../data/mockData';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // In a real app, you would get this from Redux
  // const { orders } = useSelector((state: any) => state.shopping);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    
    // Find order from mock data or localStorage
    const orderId = parseInt(id || '0', 10);
    
    // First check mock data
    const foundOrder = mockOrders.find(order => order.id === orderId);
    
    if (foundOrder) {
      setOrder(foundOrder);
      setLoading(false);
      return;
    }
    
    // Then check localStorage
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders);
      const localOrder = parsedOrders.find((order: Order) => order.id === orderId);
      
      if (localOrder) {
        setOrder(localOrder);
        setLoading(false);
        return;
      }
    }
    
    // If not found, set loading to false
    setLoading(false);
  }, [id]);

  const handleBackToOrders = () => {
    navigate('/orders');
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
    case OrderStatus.PENDING:
      return '#FFA500'; // Orange
    case OrderStatus.PROCESSING:
      return '#3B82F6'; // Blue
    case OrderStatus.SHIPPED:
      return '#8B5CF6'; // Purple
    case OrderStatus.DELIVERED:
      return '#22C55E'; // Green
    case OrderStatus.CANCELLED:
      return '#EF4444'; // Red
    default:
      return '#6B7280'; // Gray
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
    case OrderStatus.PENDING:
      return 'Chờ xác nhận';
    case OrderStatus.PROCESSING:
      return 'Đang xử lý';
    case OrderStatus.SHIPPED:
      return 'Đang giao hàng';
    case OrderStatus.DELIVERED:
      return 'Đã giao hàng';
    case OrderStatus.CANCELLED:
      return 'Đã hủy';
    default:
      return 'Không xác định';
    }
  };

  const getActiveStep = (status: OrderStatus) => {
    switch (status) {
    case OrderStatus.PENDING:
      return 0;
    case OrderStatus.PROCESSING:
      return 1;
    case OrderStatus.SHIPPED:
      return 2;
    case OrderStatus.DELIVERED:
      return 3;
    case OrderStatus.CANCELLED:
      return -1; // Special case for cancelled
    default:
      return 0;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <Box className={styles.container}>
        <Typography variant="h5">Đang tải...</Typography>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box className={styles.container}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBackToOrders} sx={{ mb: 2 }}>
          Quay lại danh sách đơn hàng
        </Button>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Không tìm thấy đơn hàng
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </Typography>
          <Button variant="contained" onClick={handleBackToOrders}>
            Xem danh sách đơn hàng
          </Button>
        </Paper>
      </Box>
    );
  }

  const steps = ['Chờ xác nhận', 'Đang xử lý', 'Đang giao hàng', 'Đã giao hàng'];
  const activeStep = getActiveStep(order.status);

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBackToOrders} sx={{ mb: 2 }}>
          Quay lại danh sách đơn hàng
        </Button>
        <Box className={styles.title}>
          <Typography variant="h4">
            Đơn hàng #{order.orderNumber}
          </Typography>
          <Chip
            label={getStatusText(order.status)}
            sx={{
              bgcolor: getStatusColor(order.status),
              color: 'white',
              fontWeight: 600,
            }}
          />
        </Box>
        <Typography variant="body1" color="text.secondary">
          Đặt ngày: {formatDate(order.date)}
        </Typography>
      </Box>

      {/* Order Progress */}
      {order.status !== OrderStatus.CANCELLED && (
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Trạng thái đơn hàng
          </Typography>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
      )}

      {/* Order Details */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Left Column */}
        <Box sx={{ flex: 2 }}>
          <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" className={styles.sectionTitle}>
              Sản phẩm
            </Typography>
            <Box>
              {order.items.map((item) => (
                <Box key={item.id} className={styles.productItem}>
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className={styles.productImage}
                  />
                  <Box className={styles.productDetails}>
                    <Typography variant="subtitle1" className={styles.productName}>
                      {item.productName}
                    </Typography>
                    <Typography variant="body2" className={styles.productMeta}>
                      {item.weight && `Trọng lượng: ${item.weight}`}
                      {item.color && ` | Màu: ${item.color}`}
                      {item.size && ` | Size: ${item.size}`}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">
                        SL: {item.quantity} x {item.price.toLocaleString('vi-VN')} VNĐ
                      </Typography>
                      <Typography variant="subtitle2" className={styles.productPrice}>
                        {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

            <Box className={styles.totalSection}>
              <Box className={styles.totalRow}>
                <Typography variant="body1">Tạm tính:</Typography>
                <Typography variant="body1">{order.subtotal.toLocaleString('vi-VN')} VNĐ</Typography>
              </Box>
              <Box className={styles.totalRow}>
                <Typography variant="body1">Phí vận chuyển:</Typography>
                <Typography variant="body1">{order.shippingFee.toLocaleString('vi-VN')} VNĐ</Typography>
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <Box className={styles.totalRow}>
                <Typography variant="subtitle1" className={styles.finalTotal}>
                  Tổng cộng:
                </Typography>
                <Typography variant="subtitle1" className={styles.finalTotal}>
                  {order.total.toLocaleString('vi-VN')} VNĐ
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Right Column */}
        <Box sx={{ flex: 1 }}>
          {/* Shipping Information */}
          <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ShippingIcon color="primary" />
              <Typography variant="h6" className={styles.sectionTitle}>
                Thông tin giao hàng
              </Typography>
            </Box>
            <Box className={styles.infoItem}>
              <Typography variant="body2" className={styles.infoLabel}>
                Người nhận:
              </Typography>
              <Typography variant="body1" className={styles.infoValue}>
                {order.shippingInfo.fullName}
              </Typography>
            </Box>
            <Box className={styles.infoItem}>
              <Typography variant="body2" className={styles.infoLabel}>
                Số điện thoại:
              </Typography>
              <Typography variant="body1" className={styles.infoValue}>
                {order.shippingInfo.phone}
              </Typography>
            </Box>
            <Box className={styles.infoItem}>
              <Typography variant="body2" className={styles.infoLabel}>
                Email:
              </Typography>
              <Typography variant="body1" className={styles.infoValue}>
                {order.shippingInfo.email}
              </Typography>
            </Box>
            <Box className={styles.infoItem}>
              <Typography variant="body2" className={styles.infoLabel}>
                Địa chỉ:
              </Typography>
              <Typography variant="body1" className={styles.infoValue}>
                {order.shippingInfo.address}, {order.shippingInfo.ward}, {order.shippingInfo.district}, {order.shippingInfo.city}
              </Typography>
            </Box>
            {order.shippingInfo.notes && (
              <Box className={styles.infoItem}>
                <Typography variant="body2" className={styles.infoLabel}>
                  Ghi chú:
                </Typography>
                <Typography variant="body1" className={styles.infoValue}>
                  {order.shippingInfo.notes}
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Shipping Method */}
          <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ShippingIcon color="primary" />
              <Typography variant="h6" className={styles.sectionTitle}>
                Phương thức vận chuyển
              </Typography>
            </Box>
            <Typography variant="body1" gutterBottom>
              {order.shippingOption.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.shippingOption.description}
            </Typography>
            <Typography variant="subtitle2" sx={{ mt: 1, color: '#1E40AF' }}>
              {order.shippingFee.toLocaleString('vi-VN')} VNĐ
            </Typography>
          </Paper>

          {/* Payment Method */}
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PaymentIcon color="primary" />
              <Typography variant="h6" className={styles.sectionTitle}>
                Phương thức thanh toán
              </Typography>
            </Box>
            <Typography variant="body1">
              {order.paymentMethod === 'cod' && 'Thanh toán khi nhận hàng (COD)'}
              {order.paymentMethod === 'bank_transfer' && 'Chuyển khoản ngân hàng'}
              {order.paymentMethod === 'credit_card' && 'Thẻ tín dụng / Ghi nợ'}
              {order.paymentMethod === 'momo' && 'Ví MoMo'}
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Actions */}
      <Box className={styles.actions}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToOrders}
        >
          Quay lại danh sách đơn hàng
        </Button>
        {order.status === OrderStatus.PENDING && (
          <Button
            variant="contained"
            color="error"
          >
            Hủy đơn hàng
          </Button>
        )}
        <Button
          variant="contained"
          startIcon={<ReceiptIcon />}
        >
          In hóa đơn
        </Button>
      </Box>
    </Box>
  );
};

export default OrderDetail; 