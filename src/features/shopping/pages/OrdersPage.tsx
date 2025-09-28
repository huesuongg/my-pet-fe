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
import { useDispatch } from 'react-redux';
import styles from './OrdersPage.module.css';
import OrderCard from '../components/OrderCard';
import { Order, OrderStatus } from '../types/order';
import { setOrders } from '../shoppingSlice';
import { mockOrders } from '../data/mockData';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  
  // Get orders from Redux store
  // In a real app, this would be from Redux
  // const { orders } = useSelector((state: any) => state.shopping);
  const [orders, setOrdersState] = useState<Order[]>(mockOrders);
  
  useEffect(() => {
    // In a real app, you would dispatch an action to fetch orders
    // dispatch(fetchOrders());
    
    // For now, we'll use mock data
    dispatch(setOrders(mockOrders));
    
    // Load orders from localStorage if available
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders);
      setOrdersState([...mockOrders, ...parsedOrders]);
      dispatch(setOrders([...mockOrders, ...parsedOrders]));
    }
  }, [dispatch]);
  
  useEffect(() => {
    filterOrders();
  }, [tabValue, searchQuery, orders]);
  
  const filterOrders = () => {
    let filtered = [...orders];
    
    // Filter by tab/status
    if (tabValue !== 'all') {
      filtered = filtered.filter(order => order.status === tabValue);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(query) ||
        order.items.some(item => item.productName.toLowerCase().includes(query))
      );
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setFilteredOrders(filtered);
  };
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  const handleBackToShopping = () => {
    navigate('/shopping');
  };
  
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
          filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </Box>
    </Box>
  );
};

export default OrdersPage; 