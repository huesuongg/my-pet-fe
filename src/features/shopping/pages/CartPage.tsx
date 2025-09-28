import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  TextField,
  Divider,
  Paper,
  Chip,
  Avatar,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  ArrowBack as ArrowBackIcon,
  BrokenImage as BrokenImageIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import styles from "./CartPage.module.css";
import { useCart } from "../../../contexts/CartContext";

// Mock data for shipping options
const shippingOptions = [
  {
    id: 1,
    name: "Giao hàng tiêu chuẩn",
    description: "3-5 ngày làm việc",
    price: 30000,
    selected: true,
  },
  {
    id: 2,
    name: "Giao hàng nhanh",
    description: "1-2 ngày làm việc",
    price: 50000,
    selected: false,
  },
  {
    id: 3,
    name: "Giao hàng siêu tốc",
    description: "Trong ngày",
    price: 80000,
    selected: false,
  },
];

// Mock data for payment methods
const paymentMethods = [
  {
    id: 1,
    name: "Thanh toán khi nhận hàng",
    description: "COD - Trả tiền mặt khi nhận hàng",
    icon: "",
    selected: true,
  },
  {
    id: 2,
    name: "Chuyển khoản ngân hàng",
    description: "Chuyển khoản qua ngân hàng",
    icon: "",
    selected: false,
  },
  {
    id: 3,
    name: "Ví điện tử",
    description: "Momo, ZaloPay, VNPay",
    icon: "",
    selected: false,
  },
];

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartState, dispatch } = useCart();
  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0]);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]);
  const [promoCode, setPromoCode] = useState("");

  // Calculate totals
  const subtotal = cartState.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const shippingFee = selectedShipping.price;
  const discount = promoCode === "SAVE10" ? subtotal * 0.1 : 0;
  const total = subtotal + shippingFee - discount;

  const handleQuantityChange = (itemId: number, delta: number) => {
    const item = cartState.items.find(item => item.id === itemId);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta);
      dispatch({ type: "UPDATE_ITEM_QUANTITY", payload: { id: itemId, quantity: newQuantity } });
    }
  };

  const handleRemoveItem = (itemId: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: itemId });
  };

  const handleShippingChange = (shippingId: number) => {
    setSelectedShipping(shippingOptions.find(s => s.id === shippingId) || shippingOptions[0]);
  };

  const handlePaymentChange = (paymentId: number) => {
    setSelectedPayment(paymentMethods.find(p => p.id === paymentId) || paymentMethods[0]);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleApplyPromo = () => {
    if (promoCode === "SAVE10") {
      console.log("Promo code applied!");
    } else {
      console.log("Invalid promo code");
    }
  };

  if (cartState.items.length === 0) {
    return (
      <Box className={styles.emptyCartContainer}>
        <Box className={styles.emptyCartContent}>
          <ShoppingCartIcon className={styles.emptyCartIcon} />
          <Typography variant="h4" className={styles.emptyCartTitle}>
            Giỏ hàng trống
          </Typography>
          <Typography variant="body1" className={styles.emptyCartDescription}>
            Bạn chưa có sản phẩm nào trong giỏ hàng
          </Typography>
          <Button
            variant="contained"
            className={styles.continueShoppingButton}
            onClick={() => navigate("/shopping")}
          >
            Tiếp tục mua sắm
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box className={styles.cartContainer}>
      {/* Header - Only Back Button */}
      <Box className={styles.cartHeader}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          className={styles.backButton}
        >
          Quay lại
        </Button>
        <Typography variant="h4" className={styles.cartTitle}>
          Giỏ hàng của bạn
        </Typography>
        <Typography variant="body2" className={styles.itemCount}>
          {cartState.items.length} sản phẩm
        </Typography>
      </Box>

      <Box className={styles.cartContent}>
        {/* Cart Items */}
        <Box className={styles.cartItemsColumn}>
          <Paper className={styles.cartItemsContainer}>
            <Typography variant="h6" className={styles.sectionTitle}>
              Sản phẩm trong giỏ
            </Typography>

            {cartState.items.map((item: { id: number; product: { name: string; price: number; image: string; color?: string; size?: string; weight?: string; }; quantity: number; }) => (
              <Card key={item.id} className={styles.cartItem}>
                <Box className={styles.cartItemImageContainer}>
                  {item.product.image ? (
                    <CardMedia
                      component="img"
                      height="120"
                      image={item.product.image}
                      alt={item.product.name}
                      className={styles.cartItemImage}
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.style.display = 'none';
                        const placeholder = target.nextElementSibling as HTMLElement | null;
                        if (placeholder) {
                          placeholder.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <Box className={styles.cartItemImagePlaceholder} style={{ display: item.product.image ? 'none' : 'flex' }}>
                    <BrokenImageIcon sx={{ fontSize: 60, color: '#ccc' }} />
                  </Box>
                </Box>
                <CardContent className={styles.cartItemContent}>
                  <Box className={styles.cartItemInfo}>
                    <Typography variant="h6" className={styles.productName}>
                      {item.product.name}
                    </Typography>
                    <Box className={styles.productDetails}>
                      {item.product.color && (
                        <Chip
                          label={`Màu: ${item.product.color}`}
                          size="small"
                          className={styles.detailChip}
                        />
                      )}
                      {item.product.size && (
                        <Chip
                          label={`Size: ${item.product.size}`}
                          size="small"
                          className={styles.detailChip}
                        />
                      )}
                      {item.product.weight && (
                        <Chip
                          label={item.product.weight}
                          size="small"
                          className={styles.weightChip}
                        />
                      )}
                    </Box>
                    <Typography variant="h6" className={styles.productPrice}>
                      {item.product.price.toLocaleString("vi-VN")} VNĐ
                    </Typography>
                  </Box>

                  <Box className={styles.cartItemActions}>
                    <Box className={styles.quantityControls}>
                      <IconButton
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className={styles.quantityButton}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = Math.max(1, parseInt(e.target.value) || 1);
                          dispatch({ type: "UPDATE_ITEM_QUANTITY", payload: { id: item.id, quantity: newQuantity } });
                        }}
                        className={styles.quantityInput}
                        inputProps={{ min: 1, style: { textAlign: "center" } }}
                      />
                      <IconButton
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className={styles.quantityButton}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>

                    <Typography variant="h6" className={styles.itemTotal}>
                      {(item.product.price * item.quantity).toLocaleString("vi-VN")} VNĐ
                    </Typography>

                    <IconButton
                      onClick={() => handleRemoveItem(item.id)}
                      className={styles.removeButton}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Paper>

          {/* Promo Code */}
          <Paper className={styles.promoContainer}>
            <Typography variant="h6" className={styles.sectionTitle}>
              Mã giảm giá
            </Typography>
            <Box className={styles.promoInputContainer}>
              <TextField
                placeholder="Nhập mã giảm giá"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className={styles.promoInput}
              />
              <Button
                variant="outlined"
                onClick={handleApplyPromo}
                className={styles.applyPromoButton}
              >
                Áp dụng
              </Button>
            </Box>
            {discount > 0 && (
              <Typography variant="body2" className={styles.discountApplied}>
                Đã áp dụng mã giảm giá: -{discount.toLocaleString("vi-VN")} VNĐ
              </Typography>
            )}
          </Paper>
        </Box>

        {/* Order Summary */}
        <Box className={styles.orderSummaryColumn}>
          <Paper className={styles.orderSummaryContainer}>
            <Typography variant="h6" className={styles.sectionTitle}>
              Tóm tắt đơn hàng
            </Typography>

            {/* Shipping Options */}
            <Box className={styles.shippingSection}>
              <Typography variant="subtitle1" className={styles.shippingTitle}>
                <ShippingIcon className={styles.sectionIcon} />
                Phương thức giao hàng
              </Typography>
              {shippingOptions.map((option) => (
                <Card
                  key={option.id}
                  className={`${styles.shippingOption} ${selectedShipping.id === option.id ? styles.selected : ""}`}
                  onClick={() => handleShippingChange(option.id)}
                >
                  <CardContent className={styles.shippingContent}>
                    <Box className={styles.shippingInfo}>
                      <Typography variant="subtitle2" className={styles.shippingName}>
                        {option.name}
                      </Typography>
                      <Typography variant="body2" className={styles.shippingDescription}>
                        {option.description}
                      </Typography>
                    </Box>
                    <Typography variant="h6" className={styles.shippingPrice}>
                      {option.price.toLocaleString("vi-VN")} VNĐ
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Divider className={styles.divider} />

            {/* Payment Methods */}
            <Box className={styles.paymentSection}>
              <Typography variant="subtitle1" className={styles.paymentTitle}>
                <PaymentIcon className={styles.sectionIcon} />
                Phương thức thanh toán
              </Typography>
              {paymentMethods.map((method) => (
                <Card
                  key={method.id}
                  className={`${styles.paymentOption} ${selectedPayment.id === method.id ? styles.selected : ""}`}
                  onClick={() => handlePaymentChange(method.id)}
                >
                  <CardContent className={styles.paymentContent}>
                    <Box className={styles.paymentInfo}>
                      <Avatar className={styles.paymentIcon}>
                        {method.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" className={styles.paymentName}>
                          {method.name}
                        </Typography>
                        <Typography variant="body2" className={styles.paymentDescription}>
                          {method.description}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Divider className={styles.divider} />

            {/* Order Totals */}
            <Box className={styles.totalsSection}>
              <Box className={styles.totalRow}>
                <Typography variant="body1">Tạm tính:</Typography>
                <Typography variant="body1">{subtotal.toLocaleString("vi-VN")} VNĐ</Typography>
              </Box>
              <Box className={styles.totalRow}>
                <Typography variant="body1">Phí vận chuyển:</Typography>
                <Typography variant="body1">{shippingFee.toLocaleString("vi-VN")} VNĐ</Typography>
              </Box>
              {discount > 0 && (
                <Box className={styles.totalRow}>
                  <Typography variant="body1" className={styles.discountText}>Giảm giá:</Typography>
                  <Typography variant="body1" className={styles.discountText}>
                    -{discount.toLocaleString("vi-VN")} VNĐ
                  </Typography>
                </Box>
              )}
              <Divider className={styles.divider} />
              <Box className={styles.totalRow}>
                <Typography variant="h6" className={styles.finalTotal}>Tổng cộng:</Typography>
                <Typography variant="h6" className={styles.finalTotal}>
                  {total.toLocaleString("vi-VN")} VNĐ
                </Typography>
              </Box>
            </Box>

            <Box className={styles.actionButtons}>
              <Button
                variant="outlined"
                className={styles.continueShoppingButton}
                onClick={() => navigate("/shopping")}
              >
                Tiếp tục mua sắm
              </Button>
              <Button
                variant="contained"
                className={styles.checkoutButton}
                onClick={handleCheckout}
              >
                Thanh toán
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default CartPage;
