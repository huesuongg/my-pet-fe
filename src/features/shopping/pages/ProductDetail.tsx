import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CardMedia,
  CardContent,
  Avatar,
  Rating,
  IconButton,
  Tabs,
  Tab,
  TextField,
  Card,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import styles from "./ProductDetail.module.css";
import { useCart } from "../../../contexts/CartContext";

// Mock data for product detail
const mockProducts = [
  {
    id: 1,
    name: "Thức Ăn Cho Chó Con Royal Canin Mini Puppy",
    brand: "Royal Canin",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop&crop=center",
    description: `
      ROYAL CANIN INTENSE HAIRBALL được thiết kế đặc biệt để hỗ trợ tiêu hóa đường ruột và kiểm soát lông tụ.
      Lợi ích:
       Ngăn ngừa sỏi thận: Cân bằng khoáng chất giúp bảo vệ hệ tiết niệu.
       Sức khỏe răng miệng: Công thức đặc biệt giúp làm sạch răng tự nhiên.
      Thành phần: Thịt gà, gạo, chất béo động vật, chất xơ, vitamin và khoáng chất.
    `,
    weightOptions: [
      { id: 1, weight: "400g", price: 160000, selected: true },
      { id: 2, weight: "1 kg", price: 380000, selected: false },
      { id: 3, weight: "1.5 kg", price: 550000, selected: false },
    ],
    colorOptions: [
      { id: 1, color: "Xanh", selected: true },
      { id: 2, color: "Đỏ", selected: false },
      { id: 3, color: "Vàng", selected: false },
    ],
    sizeOptions: [
      { id: 1, size: "S", selected: false },
      { id: 2, size: "M", selected: true },
      { id: 3, size: "L", selected: false },
      { id: 4, size: "XL", selected: false },
    ],
    reviews: [
      { id: 1, name: "ADMIN", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Sản phẩm rất tốt, chó nhà tôi rất thích ăn. Đóng gói đẹp, chất lượng cao.", date: "20/11/2023" },
      { id: 2, name: "Nguyễn Văn A", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Thức ăn này giúp chó con phát triển tốt, tăng cân đều đặn.", date: "18/11/2023" },
      { id: 3, name: "Trần Thị B", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giá cả hợp lý, chất lượng đảm bảo. Sẽ mua lại lần sau.", date: "15/11/2023" },
      { id: 4, name: "Lê Văn C", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm như mô tả.", date: "12/11/2023" },
    ],
  },
  {
    id: 2,
    name: "Thức Ăn Cho Mèo Trưởng Thành Whiskas Premium",
    brand: "Whiskas Premium",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop&crop=center",
    description: `
      WHISKAS PREMIUM được chế biến đặc biệt để đáp ứng nhu cầu dinh dưỡng của mèo trưởng thành.
      Lợi ích:
       Protein cao: Từ cá hồi và thịt gà giúp duy trì cơ bắp săn chắc.
       Omega-3 & Omega-6: Cho da lông khỏe mạnh và bóng mượt.
       Prebiotics: Hỗ trợ hệ tiêu hóa khỏe mạnh.
      Thành phần: Cá hồi, thịt gà, ngô, gạo, dầu cá, vitamin và khoáng chất.
    `,
    weightOptions: [
      { id: 1, weight: "300g", price: 85000, selected: true },
      { id: 2, weight: "800g", price: 200000, selected: false },
      { id: 3, weight: "1.2 kg", price: 280000, selected: false },
    ],
    colorOptions: [
      { id: 1, color: "Xanh", selected: true },
      { id: 2, color: "Đỏ", selected: false },
    ],
    sizeOptions: [
      { id: 1, size: "S", selected: true },
      { id: 2, size: "M", selected: false },
    ],
    reviews: [
      { id: 5, name: "Mèo Con", avatar: "https://images.unsplash.com/photo-1514888627710-901001000000?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Mèo nhà tôi rất thích, ăn ngon miệng hơn hẳn!", date: "25/11/2023" },
      { id: 6, name: "Chủ Mèo", avatar: "https://images.unsplash.com/photo-1529626465-bb6a0cc77079?w=40&h=40&fit=crop&crop=face", rating: 4, comment: "Giá cả phải chăng, chất lượng tốt. Sẽ mua lại.", date: "22/11/2023" },
    ],
  },
  {
    id: 3,
    name: "Thức Ăn Cho Chó Lớn Hill's Science Diet Healthy Mobility",
    brand: "Hill's Science Diet",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop&crop=center",
    description: `
      HILL'S SCIENCE DIET HEALTHY MOBILITY được phát triển bởi các nhà khoa học để hỗ trợ sức khỏe xương khớp cho chó lớn.
      Lợi ích:
       Glucosamine & Chondroitin: Hỗ trợ sụn khớp khỏe mạnh.
       EPA từ dầu cá: Giảm viêm và cải thiện khả năng vận động.
       Chất chống oxy hóa: Tăng cường hệ miễn dịch.
      Thành phần: Thịt gà, lúa mì, ngô, gạo lứt, dầu cá, hạt lanh, vitamin và khoáng chất.
      Chứng nhận: AAFCO, FDA, ISO 9001.
    `,
    weightOptions: [
      { id: 1, weight: "1.5 kg", price: 450000, selected: true },
      { id: 2, weight: "3 kg", price: 800000, selected: false },
      { id: 3, weight: "7 kg", price: 1500000, selected: false },
    ],
    colorOptions: [
      { id: 1, color: "Xanh", selected: true },
    ],
    sizeOptions: [
      { id: 1, size: "L", selected: true },
      { id: 2, size: "XL", selected: false },
    ],
    reviews: [
      { id: 7, name: "Bác Sĩ Thú Y", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cfdfeeab?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Sản phẩm tuyệt vời cho chó có vấn đề về khớp. Rất khuyến nghị!", date: "01/12/2023" },
      { id: 8, name: "Chủ Trại Chó", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Chó của tôi đã cải thiện rõ rệt sau khi dùng sản phẩm này.", date: "28/11/2023" },
    ],
  },
];

// Mock data for recommended products
const recommendedProducts = [
  { id: 1, name: "Thức Ăn Cho Chó", image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=center", price: 120000 },
  { id: 2, name: "Thức Ăn Cho Mèo", image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=center", price: 95000 },
  { id: 3, name: "Thức Ăn Cao Cấp", image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=center", price: 350000 },
  { id: 4, name: "Thức Ăn Hữu Cơ", image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=center", price: 280000 },
];

interface ProductDetailProps {
  productId?: number;
  onClose?: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ onClose }) => {
  const { id } = useParams<{ id: string }>();
  const currentProductId = id ? parseInt(id, 10) : mockProducts[0].id;

  const product = mockProducts.find(p => p.id === currentProductId) || mockProducts[0];
  const reviews = product.reviews;

  const [selectedWeight, setSelectedWeight] = useState(product.weightOptions[0]);
  const [selectedColor, setSelectedColor] = useState(product.colorOptions[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizeOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const { dispatch } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleWeightChange = (weight: typeof product.weightOptions[0]) => {
    setSelectedWeight(weight);
  };

  const handleColorChange = (color: typeof product.colorOptions[0]) => {
    setSelectedColor(color);
  };

  const handleSizeChange = (size: typeof product.sizeOptions[0]) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        product: {
          id: product.id,
          name: product.name,
          price: selectedWeight.price,
          image: product.image,
          brand: product.brand,
          weight: selectedWeight.weight,
          color: selectedColor.color,
          size: selectedSize.size,
        },
        quantity,
      },
    });
    console.log("Added to cart:", {
      productId: product.id,
      weight: selectedWeight.weight,
      color: selectedColor.color,
      size: selectedSize.size,
      quantity,
      totalPrice: selectedWeight.price * quantity,
    });
  };

  const totalPrice = selectedWeight.price * quantity;

  return (
    <Box className={styles.productDetailContainer}>
      {/* Close Button */}
      {onClose && (
        <IconButton
          className={styles.closeButton}
          onClick={onClose}
          sx={{ position: "absolute", top: 16, right: 16, zIndex: 1 }}
        >
          <CloseIcon />
        </IconButton>
      )}

      {/* Product Information Section */}
      <Box className={styles.productInfoSection}>
        <Box className={styles.productImageContainer}>
          <img
            src={product.image}
            alt={product.name}
            className={styles.productImage}
          />
        </Box>

        <Box className={styles.productDetailsContainer}>
          <Typography variant="h4" className={styles.productTitle}>
            {product.name}
          </Typography>

          <Typography variant="h6" className={styles.brandName}>
            {product.brand}
          </Typography>

          <Typography variant="h4" className={styles.price}>
            {selectedWeight.price.toLocaleString("vi-VN")} VNĐ
          </Typography>

          {/* Weight Options */}
          <Box className={styles.weightOptions}>
            <Typography variant="h6" className={styles.weightLabel}>
              Trọng lượng:
            </Typography>
            <Box className={styles.weightButtons}>
              {product.weightOptions.map((weight) => (
                <Button
                  key={weight.id}
                  variant={weight.id === selectedWeight.id ? "contained" : "outlined"}
                  className={styles.weightButton}
                  onClick={() => handleWeightChange(weight)}
                >
                  {weight.weight}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Color Options */}
          <Box className={styles.colorOptions}>
            <Typography variant="h6" className={styles.colorLabel}>
              Màu sắc:
            </Typography>
            <Box className={styles.colorButtons}>
              {product.colorOptions.map((color) => (
                <Chip
                  key={color.id}
                  label={color.color}
                  variant={color.id === selectedColor.id ? "filled" : "outlined"}
                  onClick={() => handleColorChange(color)}
                  className={styles.colorChip}
                />
              ))}
            </Box>
          </Box>

          {/* Size Options */}
          <Box className={styles.sizeOptions}>
            <Typography variant="h6" className={styles.sizeLabel}>
              Kích thước:
            </Typography>
            <Box className={styles.sizeButtons}>
              {product.sizeOptions.map((size) => (
                <Chip
                  key={size.id}
                  label={size.size}
                  variant={size.id === selectedSize.id ? "filled" : "outlined"}
                  onClick={() => handleSizeChange(size)}
                  className={styles.sizeChip}
                />
              ))}
            </Box>
          </Box>

          {/* Quantity Selector */}
          <Box className={styles.quantitySection}>
            <Typography variant="h6" className={styles.quantityLabel}>
              Số lượng:
            </Typography>
            <Box className={styles.quantitySelector}>
              <IconButton
                onClick={() => handleQuantityChange(-1)}
                className={styles.quantityButton}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className={styles.quantityInput}
                inputProps={{ min: 1, style: { textAlign: "center" } }}
              />
              <IconButton
                onClick={() => handleQuantityChange(1)}
                className={styles.quantityButton}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Total Price */}
          <Typography variant="h5" className={styles.totalPrice}>
            Tổng số tiền: {totalPrice.toLocaleString("vi-VN")} VNĐ
          </Typography>

          {/* Add to Cart Button */}
          <Button
            variant="contained"
            className={styles.addToCartButton}
            onClick={handleAddToCart}
            startIcon={<ShoppingCartIcon />}
          >
            Thêm vào giỏ hàng
          </Button>
        </Box>
      </Box>

      {/* Product Description Section */}
      <Box className={styles.descriptionSection}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          className={styles.tabs}
        >
          <Tab label="Mô tả" />
          <Tab label="Đánh giá" />
        </Tabs>

        {activeTab === 0 && (
          <Box className={styles.descriptionContent}>
            <Typography variant="body1" className={styles.descriptionText}>
              {product.description}
            </Typography>
          </Box>
        )}

        {activeTab === 1 && (
          <Box className={styles.reviewsContent}>
            <Typography variant="h6" className={styles.reviewsTitle}>
              Phản hồi từ khách hàng
            </Typography>
            <Box className={styles.reviewsGrid}>
              {reviews.map((review) => (
                <Card key={review.id} className={styles.reviewCard}>
                  <CardContent>
                    <Box className={styles.reviewHeader}>
                      <Avatar
                        src={review.avatar}
                        className={styles.reviewAvatar}
                      />
                      <Box className={styles.reviewInfo}>
                        <Typography variant="subtitle1" className={styles.reviewerName}>
                          {review.name}
                        </Typography>
                        <Typography variant="caption" className={styles.reviewDate}>
                          {review.date}
                        </Typography>
                      </Box>
                    </Box>
                    <Rating value={review.rating} readOnly className={styles.reviewRating} />
                    <Typography variant="body2" className={styles.reviewComment}>
                      {review.comment}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
            <Button variant="contained" className={styles.viewMoreButton}>
              Xem thêm
            </Button>
          </Box>
        )}
      </Box>

      {/* Recommended Products Section */}
      <Box className={styles.recommendedSection}>
        <Typography variant="h4" className={styles.recommendedTitle}>
          Sản Phẩm Đề xuất
        </Typography>
        <Box className={styles.recommendedProducts}>
          {recommendedProducts.map((recProduct) => (
            <Card key={recProduct.id} className={styles.recommendedCard}>
              <CardMedia
                component="img"
                height="200"
                image={recProduct.image}
                alt={recProduct.name}
                className={styles.recommendedImage}
              />
              <CardContent className={styles.recommendedContent}>
                <Typography variant="subtitle1" className={styles.recommendedName}>
                  {recProduct.name}
                </Typography>
                <Typography variant="body2" className={styles.recommendedPrice}>
                  {recProduct.price.toLocaleString("vi-VN")} VNĐ
                </Typography>
                <IconButton className={styles.recommendedButton}>
                  <ShoppingCartIcon />
                </IconButton>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ProductDetail;