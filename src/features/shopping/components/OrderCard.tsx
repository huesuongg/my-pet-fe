import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Order, OrderStatus } from '../types/order';

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: OrderStatus | string) => {
    const statusStr = typeof status === 'string' ? status : status;
    switch (statusStr) {
    case OrderStatus.PENDING:
    case 'PENDING':
      return '#FFA500'; // Orange
    case OrderStatus.PROCESSING:
    case 'PROCESSING':
      return '#3B82F6'; // Blue
    case OrderStatus.SHIPPED:
    case 'SHIPPED':
      return '#8B5CF6'; // Purple
    case OrderStatus.DELIVERED:
    case 'DELIVERED':
      return '#22C55E'; // Green
    case OrderStatus.CANCELLED:
    case 'CANCELLED':
      return '#EF4444'; // Red
    default:
      return '#6B7280'; // Gray
    }
  };

  const getStatusText = (status: OrderStatus | string) => {
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

  const handleViewOrderDetail = () => {
    navigate(`/orders/${order.id}`);
  };

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Order Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: '#f9fafb',
            p: 2,
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              Đơn hàng #{order.orderNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đặt ngày: {formatDate(order.date || order.createdAt || new Date().toISOString())}
            </Typography>
          </Box>
          <Chip
            label={getStatusText(order.status)}
            sx={{
              bgcolor: getStatusColor(order.status),
              color: 'white',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        </Box>

        {/* Order Items */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            {order.items.slice(0, 3).map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  flex: { xs: '1 0 100%', sm: '1 0 calc(50% - 8px)', md: '1 0 calc(33.333% - 11px)' },
                }}
              >
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 1,
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.productName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    SL: {item.quantity} x {item.price.toLocaleString('vi-VN')} VNĐ
                  </Typography>
                </Box>
              </Box>
            ))}
            {order.items.length > 3 && (
              <Typography variant="body2" color="text.secondary" sx={{ width: '100%' }}>
                +{order.items.length - 3} sản phẩm khác
              </Typography>
            )}
          </Box>

          {/* Order Footer */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 0 },
              pt: 2,
              borderTop: '1px solid #e0e0e0',
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                Tổng tiền:
              </Typography>
              <Typography variant="subtitle1" fontWeight={600} color="#1E40AF">
                {order.total.toLocaleString('vi-VN')} VNĐ
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={handleViewOrderDetail}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                minWidth: 120,
              }}
            >
              Xem chi tiết
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderCard; 