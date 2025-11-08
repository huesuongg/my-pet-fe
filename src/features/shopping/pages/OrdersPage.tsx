import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  TextField, 
  InputAdornment,
  Button,
  Divider,
  Paper,
} from '@mui/material';
import { 
  Search as SearchIcon, 
  ShoppingBag as ShoppingBagIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, Alert } from '@mui/material';
import styles from './OrdersPage.module.css';
import OrderCard from '../components/OrderCard';
import { OrderStatus } from '../types/order';
import { fetchOrders } from '../shoppingThunk';
import { RootState } from '../../../store';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state: RootState) => state.shopping);
  const [tabValue, setTabValue] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  
  useEffect(() => {
    dispatch(fetchOrders({ page: 1, limit: 50 }) as any);
  }, [dispatch]);
  
  useEffect(() => {
    filterOrders();
  }, [tabValue, searchQuery, orders]);
  
  const filterOrders = () => {
    let filtered = [...(orders || [])];
    
    // Filter by tab/status
    if (tabValue !== 'all') {
      filtered = filtered.filter(order => order.status === tabValue);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => {
        const orderNumber = order.orderNumber || order._id || '';
        const items = order.items || [];
        return orderNumber.toLowerCase().includes(query) ||
          items.some((item: any) => {
            const productName = item.productName || item.product?.name || '';
            return productName.toLowerCase().includes(query);
          });
      });
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0).getTime();
      const dateB = new Date(b.createdAt || b.date || 0).getTime();
      return dateB - dateA;
    });
    
    setFilteredOrders(filtered);
  };
  
  useEffect(() => {
    dispatch(fetchOrders({ page: 1, limit: 50 }));
  }, [dispatch]);
  
  useEffect(() => {
    filterOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue, searchQuery, orders]);
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  const handleBackToShopping = () => {
    navigate('/shopping');
  };
  
  if (loading.orders) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error.orders) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error.orders}</Alert>
      </Box>
    );
  }

  return (
    <Box className={styles.ordersContainer}>
      <Box className={styles.header}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToShopping}
          sx={{ mb: 2 }}
        >
          Quay lại mua sắm
        </Button>
        <Typography variant="h4" className={styles.title}>
          Đơn hàng của tôi
        </Typography>
        <Typography variant="body1" className={styles.subtitle}>
          Quản lý và theo dõi tất cả đơn hàng của bạn
        </Typography>
      </Box>
      
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box className={styles.filterContainer}>
          <Box sx={{ flex: 1 }}>
            <TextField
              placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm"
              variant="outlined"
              fullWidth
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 500 }}
            />
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 2,
            '& .MuiTab-root': {
              textTransform: 'none',
              minWidth: 100,
            },
          }}
        >
          <Tab label="Tất cả" value="all" />
          <Tab label="Chờ xác nhận" value={OrderStatus.PENDING} />
          <Tab label="Đang xử lý" value={OrderStatus.PROCESSING} />
          <Tab label="Đang giao" value={OrderStatus.SHIPPED} />
          <Tab label="Đã giao" value={OrderStatus.DELIVERED} />
          <Tab label="Đã hủy" value={OrderStatus.CANCELLED} />
        </Tabs>
      </Paper>
      
      <Box className={styles.ordersList}>
        {filteredOrders.length === 0 ? (
          <Box className={styles.noOrders}>
            <ShoppingBagIcon className={styles.noOrdersIcon} />
            <Typography variant="h6" gutterBottom>
              Không tìm thấy đơn hàng nào
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {searchQuery 
                ? 'Không tìm thấy đơn hàng phù hợp với tìm kiếm của bạn' 
                : 'Bạn chưa có đơn hàng nào trong mục này'}
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleBackToShopping}
              sx={{ mt: 2 }}
            >
              Tiếp tục mua sắm
            </Button>
          </Box>
        ) : (
          filteredOrders.map((order: Order) => (
            <OrderCard key={order.id || order._id} order={order} />
          ))
        )}
      </Box>
    </Box>
  );
};

export default OrdersPage; 