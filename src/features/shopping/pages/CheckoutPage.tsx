import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Card,
  CardContent,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  ShoppingCart as CartIcon,
  CheckCircle as ConfirmIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { createOrderThunk, fetchCart } from "../shoppingThunk";
import { RootState } from "../../../store";
import { ShippingInfo, ShippingOption } from "../types/order";
import styles from "./CheckoutPage.module.css";

// Steps for the checkout process
const steps = ["Giỏ hàng", "Thông tin giao hàng", "Phương thức thanh toán", "Xác nhận đơn hàng"];

// Payment methods
const paymentMethods = [
  {
    id: "cod",
    name: "Thanh toán khi nhận hàng (COD)",
    description: "Thanh toán bằng tiền mặt khi nhận hàng",
  },
  {
    id: "bank_transfer",
    name: "Chuyển khoản ngân hàng",
    description: "Chuyển khoản đến tài khoản ngân hàng của chúng tôi",
  },
  {
    id: "credit_card",
    name: "Thẻ tín dụng / Ghi nợ",
    description: "Thanh toán an toàn với thẻ của bạn",
  },
  {
    id: "momo",
    name: "Ví MoMo",
    description: "Thanh toán qua ví điện tử MoMo",
  },
];

// Shipping options
const shippingOptions = [
  {
    id: "standard",
    name: "Giao hàng tiêu chuẩn",
    price: 30000,
    description: "3-5 ngày làm việc",
  },
  {
    id: "express",
    name: "Giao hàng nhanh",
    price: 60000,
    description: "1-2 ngày làm việc",
  },
  {
    id: "same_day",
    name: "Giao hàng trong ngày",
    price: 100000,
    description: "Nhận hàng trong ngày",
  },
];

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state: RootState) => state.shopping);
  const [activeStep, setActiveStep] = useState(0);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [creatingOrder, setCreatingOrder] = useState(false);
  
  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    notes: "",
  });
  
  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0]);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);
  
  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});

  interface CartItemWithProduct {
    product?: { 
      price?: number | string;
      _id?: string;
      id?: string | number;
      name?: string;
      image?: string;
      color?: string;
      size?: string;
      weight?: string;
    };
    productImage?: string;
    productName?: string;
    quantity: number;
    color?: string;
    size?: string;
    weight?: string;
    price?: number | string;
    id?: string | number;
    _id?: string;
  }

  useEffect(() => {
    dispatch(fetchCart() as unknown);
  }, [dispatch]);
  
  // Calculate totals
  const cartItems: CartItemWithProduct[] = (cart?.items || []) as CartItemWithProduct[];
  const subtotal = cartItems.reduce((total: number, item: CartItemWithProduct) => {
    const price = typeof item.product?.price === 'number' 
      ? item.product.price 
      : item.price || 0;
    return total + (price * item.quantity);
  }, 0);
  const shippingFee = selectedShipping.price;
  const total = subtotal + shippingFee;

  const handleShippingInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: value,
    });
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleShippingOptionChange = (option: typeof shippingOptions[0]) => {
    setSelectedShipping(option);
  };

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPayment(e.target.value);
  };

  const validateShippingInfo = () => {
    const newErrors: Record<string, string> = {};
    
    if (!shippingInfo.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên";
    }
    
    if (!shippingInfo.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10}$/.test(shippingInfo.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    
    if (!shippingInfo.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    
    if (!shippingInfo.address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ";
    }
    
    if (!shippingInfo.city.trim()) {
      newErrors.city = "Vui lòng chọn thành phố";
    }
    
    if (!shippingInfo.district.trim()) {
      newErrors.district = "Vui lòng chọn quận/huyện";
    }
    
    if (!shippingInfo.ward.trim()) {
      newErrors.ward = "Vui lòng chọn phường/xã";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (activeStep === 1 && !validateShippingInfo()) {
      return;
    }
    
    if (activeStep === steps.length - 1) {
      // Place order via API
      setCreatingOrder(true);
      try {
        const orderData = {
          items: cartItems.map((item: CartItemWithProduct) => ({
            productId: item.product?._id || item.product?.id || String(item.product || ''),
            quantity: item.quantity,
            color: item.color || item.product?.color,
            size: item.size || item.product?.size,
            weight: item.weight || item.product?.weight,
          })),
          shippingInfo: shippingInfo as ShippingInfo,
          shippingOption: selectedShipping as ShippingOption,
          paymentMethod: selectedPayment,
        };

        const result = await dispatch(createOrderThunk(orderData) as unknown);
        
        interface OrderResult {
          payload?: {
            order?: {
              orderNumber?: string;
              _id?: string;
            };
          };
        }
        const orderResult = result as OrderResult;
        if (orderResult.payload?.order) {
          setOrderNumber(orderResult.payload.order.orderNumber || orderResult.payload.order._id || '');
          setOrderComplete(true);
        } else {
          throw new Error("Không thể tạo đơn hàng");
        }
      } catch (error) {
        console.error("Failed to create order:", error);
        const errorMessage = error instanceof Error ? error.message : "Không thể tạo đơn hàng. Vui lòng thử lại.";
        alert(errorMessage);
      } finally {
        setCreatingOrder(false);
      }
      return;
    }
    
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

  const handleGoToShopping = () => {
    navigate("/shopping");
  };

  const handleViewOrders = () => {
    navigate("/orders");
  };

  // Render content based on active step
  const renderStepContent = () => {
    if (orderComplete) {
      return renderOrderComplete();
    }

    switch (activeStep) {
    case 0:
      return renderCartSummary();
    case 1:
      return renderShippingForm();
    case 2:
      return renderPaymentMethod();
    case 3:
      return renderOrderConfirmation();
    default:
      return null;
    }
  };

  if (loading.cart) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error.cart) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error.cart}</Alert>
      </Box>
    );
  }

  const renderCartSummary = () => {
    if (cartItems.length === 0) {
      return (
        <Paper className={styles.paper}>
          <Box sx={{ textAlign: "center", padding: "2rem" }}>
            <CartIcon sx={{ fontSize: "4rem", color: "#ccc", marginBottom: "1rem" }} />
            <Typography variant="h5" gutterBottom>
              Giỏ hàng của bạn đang trống
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGoToShopping}
              sx={{ marginTop: "1rem" }}
            >
              Tiếp tục mua sắm
            </Button>
          </Box>
        </Paper>
      );
    }

    return (
      <Paper className={styles.paper}>
        <Typography variant="h6" gutterBottom>
          Sản phẩm trong giỏ hàng
        </Typography>
        
        <Box>
          {cartItems.map((item: CartItemWithProduct, index: number) => {
            const product = item.product || {};
            const price = typeof product.price === 'number' ? product.price : item.price || 0;
            return (
              <Box key={item.id || item._id || index} className={styles.productItem}>
                <img
                  src={product.image || item.productImage || "https://via.placeholder.com/100"}
                  alt={product.name || item.productName}
                  className={styles.productImage}
                />
                <Box className={styles.productDetails}>
                  <Typography variant="subtitle1" className={styles.productName}>
                    {product.name || item.productName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {(item.weight || product.weight) && `Trọng lượng: ${item.weight || product.weight}`}
                    {(item.color || product.color) && ` | Màu: ${item.color || product.color}`}
                    {(item.size || product.size) && ` | Size: ${item.size || product.size}`}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
                    <Typography variant="body2">
                      Số lượng: {item.quantity}
                    </Typography>
                    <Typography variant="body1" className={styles.productPrice}>
                      {(price * item.quantity).toLocaleString("vi-VN")} VNĐ
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
        
        <Box className={styles.totalSection}>
          <Box className={styles.totalRow}>
            <Typography variant="body1">Tạm tính:</Typography>
            <Typography variant="body1">{subtotal.toLocaleString("vi-VN")} VNĐ</Typography>
          </Box>
          <Box className={styles.totalRow}>
            <Typography variant="body1">Phí vận chuyển:</Typography>
            <Typography variant="body1">{shippingFee.toLocaleString("vi-VN")} VNĐ</Typography>
          </Box>
          <Box className={styles.totalRow}>
            <Typography variant="subtitle1" className={styles.finalTotal}>
              Tổng cộng:
            </Typography>
            <Typography variant="subtitle1" className={styles.finalTotal}>
              {total.toLocaleString("vi-VN")} VNĐ
            </Typography>
          </Box>
        </Box>
        
        <Box className={styles.buttonGroup}>
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={handleGoToCart}
          >
            Quay lại giỏ hàng
          </Button>
          <Button
            variant="contained"
            endIcon={<NextIcon />}
            onClick={handleNext}
          >
            Tiếp tục
          </Button>
        </Box>
      </Paper>
    );
  };

  const renderShippingForm = () => {
    return (
      <Paper className={styles.paper}>
        <Typography variant="h6" gutterBottom>
          Thông tin giao hàng
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <TextField
              fullWidth
              label="Họ và tên"
              name="fullName"
              value={shippingInfo.fullName}
              onChange={handleShippingInfoChange}
              error={!!errors.fullName}
              helperText={errors.fullName}
              required
            />
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            <TextField
              fullWidth
              label="Số điện thoại"
              name="phone"
              value={shippingInfo.phone}
              onChange={handleShippingInfoChange}
              error={!!errors.phone}
              helperText={errors.phone}
              required
            />
            
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={shippingInfo.email}
              onChange={handleShippingInfoChange}
              error={!!errors.email}
              helperText={errors.email}
              required
            />
          </Box>
          
          <Box>
            <TextField
              fullWidth
              label="Địa chỉ"
              name="address"
              value={shippingInfo.address}
              onChange={handleShippingInfoChange}
              error={!!errors.address}
              helperText={errors.address}
              required
            />
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            <TextField
              fullWidth
              label="Tỉnh/Thành phố"
              name="city"
              value={shippingInfo.city}
              onChange={handleShippingInfoChange}
              error={!!errors.city}
              helperText={errors.city}
              required
            />
            
            <TextField
              fullWidth
              label="Quận/Huyện"
              name="district"
              value={shippingInfo.district}
              onChange={handleShippingInfoChange}
              error={!!errors.district}
              helperText={errors.district}
              required
            />
            
            <TextField
              fullWidth
              label="Phường/Xã"
              name="ward"
              value={shippingInfo.ward}
              onChange={handleShippingInfoChange}
              error={!!errors.ward}
              helperText={errors.ward}
              required
            />
          </Box>
          
          <Box>
            <TextField
              fullWidth
              label="Ghi chú"
              name="notes"
              multiline
              rows={3}
              value={shippingInfo.notes}
              onChange={handleShippingInfoChange}
              placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
            />
          </Box>
        </Box>
        
        <Typography variant="h6" sx={{ marginTop: "2rem", marginBottom: "1rem" }}>
          Phương thức vận chuyển
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          {shippingOptions.map((option) => (
            <Box key={option.id} sx={{ flex: 1 }}>
              <Card 
                sx={{
                  cursor: "pointer",
                  border: selectedShipping.id === option.id ? "2px solid #1E40AF" : "1px solid #e0e0e0",
                  backgroundColor: selectedShipping.id === option.id ? "rgba(30, 64, 175, 0.05)" : "white",
                  height: '100%',
                }}
                onClick={() => handleShippingOptionChange(option)}
              >
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {option.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {option.description}
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: "0.5rem", fontWeight: 600, color: "#1E40AF" }}>
                    {option.price.toLocaleString("vi-VN")} VNĐ
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
        
        <Box className={styles.buttonGroup}>
          <Button
            variant="outlined"
            startIcon={<PrevIcon />}
            onClick={handleBack}
          >
            Quay lại
          </Button>
          <Button
            variant="contained"
            endIcon={<NextIcon />}
            onClick={handleNext}
          >
            Tiếp tục
          </Button>
        </Box>
      </Paper>
    );
  };

  const renderPaymentMethod = () => {
    return (
      <Paper className={styles.paper}>
        <Typography variant="h6" gutterBottom>
          Phương thức thanh toán
        </Typography>
        
        <FormControl component="fieldset" sx={{ width: "100%" }}>
          <RadioGroup
            aria-label="payment-method"
            name="payment-method"
            value={selectedPayment}
            onChange={handlePaymentMethodChange}
          >
            {paymentMethods.map((method) => (
              <Card
                key={method.id}
                sx={{
                  marginBottom: "1rem",
                  cursor: "pointer",
                  border: selectedPayment === method.id ? "2px solid #1E40AF" : "1px solid #e0e0e0",
                  backgroundColor: selectedPayment === method.id ? "rgba(30, 64, 175, 0.05)" : "white",
                }}
              >
                <CardContent sx={{ display: "flex", alignItems: "center" }}>
                  <FormControlLabel
                    value={method.id}
                    control={<Radio />}
                    label=""
                    sx={{ marginRight: 0 }}
                  />
                  <Box sx={{ marginLeft: "0.5rem" }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {method.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {method.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </RadioGroup>
        </FormControl>
        
        {selectedPayment === "bank_transfer" && (
          <Alert severity="info" sx={{ marginTop: "1rem" }}>
            <Typography variant="subtitle2">Thông tin chuyển khoản:</Typography>
            <Typography variant="body2">
              Ngân hàng: Vietcombank<br />
              Số tài khoản: 1234567890<br />
              Chủ tài khoản: CÔNG TY TNHH MY PET<br />
              Nội dung: Thanh toán đơn hàng [Họ tên]
            </Typography>
          </Alert>
        )}
        
        <Box className={styles.buttonGroup}>
          <Button
            variant="outlined"
            startIcon={<PrevIcon />}
            onClick={handleBack}
          >
            Quay lại
          </Button>
          <Button
            variant="contained"
            endIcon={<NextIcon />}
            onClick={handleNext}
          >
            Tiếp tục
          </Button>
        </Box>
      </Paper>
    );
  };

  const renderOrderConfirmation = () => {
    return (
      <Paper className={styles.paper}>
        <Typography variant="h6" gutterBottom>
          Xác nhận đơn hàng
        </Typography>
        
        <Box sx={{ marginBottom: "2rem" }}>
          <Typography variant="subtitle1" gutterBottom fontWeight={600}>
            Thông tin giao hàng
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2">
                <strong>Họ tên:</strong> {shippingInfo.fullName}
              </Typography>
              <Typography variant="body2">
                <strong>Số điện thoại:</strong> {shippingInfo.phone}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {shippingInfo.email}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2">
                <strong>Địa chỉ:</strong> {shippingInfo.address}, {shippingInfo.ward}, {shippingInfo.district}, {shippingInfo.city}
              </Typography>
              {shippingInfo.notes && (
                <Typography variant="body2">
                  <strong>Ghi chú:</strong> {shippingInfo.notes}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ margin: "1rem 0" }} />
        
        <Box sx={{ marginBottom: "2rem" }}>
          <Typography variant="subtitle1" gutterBottom fontWeight={600}>
            Phương thức vận chuyển
          </Typography>
          <Typography variant="body2">
            {selectedShipping.name} - {selectedShipping.description}
          </Typography>
          <Typography variant="body2" fontWeight={600} color="#1E40AF">
            {selectedShipping.price.toLocaleString("vi-VN")} VNĐ
          </Typography>
        </Box>
        
        <Divider sx={{ margin: "1rem 0" }} />
        
        <Box sx={{ marginBottom: "2rem" }}>
          <Typography variant="subtitle1" gutterBottom fontWeight={600}>
            Phương thức thanh toán
          </Typography>
          <Typography variant="body2">
            {paymentMethods.find(method => method.id === selectedPayment)?.name}
          </Typography>
        </Box>
        
        <Divider sx={{ margin: "1rem 0" }} />
        
        <Box sx={{ marginBottom: "2rem" }}>
          <Typography variant="subtitle1" gutterBottom fontWeight={600}>
            Sản phẩm đã đặt
          </Typography>
          {cartItems.map((item: CartItemWithProduct, index: number) => {
            const product = item.product || {};
            const price = typeof product.price === 'number' ? product.price : item.price || 0;
            return (
              <Box key={item.id || item._id || index} className={styles.orderItem}>
                <img
                  src={product.image || item.productImage || "https://via.placeholder.com/100"}
                  alt={product.name || item.productName}
                  className={styles.orderItemImage}
                />
                <Box className={styles.orderItemDetails}>
                  <Typography variant="body2" fontWeight={600}>
                    {product.name || item.productName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {(item.weight || product.weight) && `${item.weight || product.weight} | `}
                    {(item.color || product.color) && `${item.color || product.color} | `}
                    {(item.size || product.size) && `${item.size || product.size} | `}
                    SL: {item.quantity}
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={600} className={styles.orderItemPrice}>
                  {(price * item.quantity).toLocaleString("vi-VN")} VNĐ
                </Typography>
              </Box>
            );
          })}
        </Box>
        
        <Divider sx={{ margin: "1rem 0" }} />
        
        <Box className={styles.totalSection}>
          <Box className={styles.totalRow}>
            <Typography variant="body1">Tạm tính:</Typography>
            <Typography variant="body1">{subtotal.toLocaleString("vi-VN")} VNĐ</Typography>
          </Box>
          <Box className={styles.totalRow}>
            <Typography variant="body1">Phí vận chuyển:</Typography>
            <Typography variant="body1">{shippingFee.toLocaleString("vi-VN")} VNĐ</Typography>
          </Box>
          <Box className={styles.totalRow}>
            <Typography variant="subtitle1" className={styles.finalTotal}>
              Tổng cộng:
            </Typography>
            <Typography variant="subtitle1" className={styles.finalTotal}>
              {total.toLocaleString("vi-VN")} VNĐ
            </Typography>
          </Box>
        </Box>
        
        <Box className={styles.buttonGroup}>
          <Button
            variant="outlined"
            startIcon={<PrevIcon />}
            onClick={handleBack}
          >
            Quay lại
          </Button>
          <Button
            variant="contained"
            endIcon={<ConfirmIcon />}
            onClick={handleNext}
            color="primary"
            disabled={creatingOrder}
          >
            {creatingOrder ? "Đang xử lý..." : "Đặt hàng"}
          </Button>
        </Box>
      </Paper>
    );
  };

  const renderOrderComplete = () => {
    return (
      <Paper className={styles.paper}>
        <Box className={styles.successMessage}>
          <ConfirmIcon className={styles.successIcon} />
          <Typography variant="h4" gutterBottom>
            Đặt hàng thành công!
          </Typography>
          <Typography variant="body1" paragraph>
            Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận.
          </Typography>
          <Typography variant="body1" paragraph>
            Mã đơn hàng: <strong>#{orderNumber}</strong>
          </Typography>
          <Typography variant="body1" paragraph>
            Chúng tôi sẽ gửi email xác nhận đơn hàng và thông tin vận chuyển cho bạn trong thời gian sớm nhất.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGoToShopping}
            >
              Tiếp tục mua sắm
            </Button>
            <Button
              variant="outlined"
              onClick={handleViewOrders}
            >
              Xem đơn hàng của tôi
            </Button>
          </Box>
        </Box>
      </Paper>
    );
  };

  return (
    <Box className={styles.checkoutContainer}>
      <Box className={styles.header}>
        <IconButton className={styles.backButton} onClick={() => navigate(-1)}>
          <BackIcon />
        </IconButton>
        <Typography variant="h4">Thanh toán</Typography>
      </Box>
      
      {!orderComplete && (
        <Stepper activeStep={activeStep} className={styles.stepper} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
      
      {renderStepContent()}
    </Box>
  );
};

export default CheckoutPage; 