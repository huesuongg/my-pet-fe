import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tabs,
  Tab,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  Rating,
  TextField,
} from "@mui/material";
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import styles from "./ProductDetail.module.css";

// Mock data for multiple products
const productsData = {
  1: {
    id: 1,
    name: "Thức Ăn Một Cho Chó Con",
    brand: "Thương hiệu Royal Canin",
    price: 160000,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=500&fit=crop&crop=center",
    description: `
      ROYAL CANIN INTENSE HAIRBALL được thiết kế đặc biệt để hỗ trợ tiêu hóa đường ruột và kiểm soát lông tụ.
      
      Lợi ích:
       Kiểm soát lông: Giảm thiểu sự hình thành của lông tụ trong đường tiêu hóa
       Sức khỏe răng miệng: Công thức đặc biệt giúp làm sạch răng tự nhiên
       Ngăn ngừa sỏi thận: Cân bằng khoáng chất giúp bảo vệ hệ tiết niệu
      
      Thành phần: Thịt gà, gạo, chất béo động vật, chất xơ, vitamin và khoáng chất.
    `,
    weightOptions: [
      { id: 1, weight: "400g", price: 160000, selected: true },
      { id: 2, weight: "1 kg", price: 380000, selected: false },
      { id: 3, weight: "1.5 kg", price: 550000, selected: false },
    ],
  },
  2: {
    id: 2,
    name: "Thức Ăn Cao Cấp Cho Mèo Trưởng Thành",
    brand: "Whiskas Premium",
    price: 85000,
    image: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=500&h=500&fit=crop&crop=center",
    description: `
      WHISKAS PREMIUM ADULT CAT FOOD - Thức ăn cao cấp dành cho mèo trưởng thành từ 1-7 tuổi.
      
      Đặc điểm nổi bật:
       Protein cao: 35% protein từ thịt cá hồi và thịt gà tươi
       Omega-3 & Omega-6: Tăng cường sức khỏe da và lông
       Prebiotics: Hỗ trợ hệ tiêu hóa khỏe mạnh
       Không chất bảo quản nhân tạo
       Hương vị tự nhiên, mèo yêu thích
      
      Thành phần: Cá hồi (25%), thịt gà (20%), gạo lứt, khoai tây, dầu cá, vitamin tổng hợp.
      Phù hợp cho: Mèo trưởng thành, mèo trong nhà, mèo có hệ tiêu hóa nhạy cảm.
    `,
    weightOptions: [
      { id: 1, weight: "300g", price: 85000, selected: true },
      { id: 2, weight: "800g", price: 195000, selected: false },
      { id: 3, weight: "1.2kg", price: 275000, selected: false },
    ],
  },
  3: {
    id: 3,
    name: "Thức Ăn Siêu Cao Cấp Cho Chó Lớn",
    brand: "Hill's Science Diet",
    price: 450000,
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&h=500&fit=crop&crop=center",
    description: `
      HILL'S SCIENCE DIET ADULT LARGE BREED - Thức ăn khoa học cho chó lớn từ 1-5 tuổi.
      
      Công nghệ tiên tiến:
       Glucosamine & Chondroitin: Bảo vệ khớp xương cho chó lớn
       Antioxidants: Tăng cường hệ miễn dịch tự nhiên
       Omega-3 EPA: Hỗ trợ sức khỏe tim mạch
       Prebiotic Fiber: Cải thiện hệ tiêu hóa
       Vitamin E & C: Chống oxy hóa, làm chậm lão hóa
      
      Thành phần: Thịt gà (18%), bột cá, gạo, ngô, chất béo động vật, glucosamine hydrochloride.
      Được khuyến nghị bởi: Bác sĩ thú y hàng đầu thế giới.
      Chứng nhận: AAFCO, FDA, ISO 9001.
    `,
    weightOptions: [
      { id: 1, weight: "500g", price: 450000, selected: true },
      { id: 2, weight: "1.5kg", price: 1200000, selected: false },
      { id: 3, weight: "3kg", price: 2200000, selected: false },
    ],
  },
};

// Mock data for reviews
const reviewsData = {
  1: [
    {
      id: 1,
      name: "ADMIN",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      rating: 5,
      comment: "Sản phẩm rất tốt, chó nhà tôi rất thích ăn. Đóng gói đẹp, chất lượng cao.",
      date: "20/11/2023",
    },
    {
      id: 2,
      name: "Nguyễn Văn A",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      rating: 5,
      comment: "Thức ăn này giúp chó con phát triển tốt, tăng cân đều đặn.",
      date: "18/11/2023",
    },
    {
      id: 3,
      name: "Trần Thị B",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      rating: 5,
      comment: "Giá cả hợp lý, chất lượng đảm bảo. Sẽ mua lại lần sau.",
      date: "15/11/2023",
    },
    {
      id: 4,
      name: "Lê Văn C",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
      rating: 5,
      comment: "Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm như mô tả.",
      date: "12/11/2023",
    },
  ],
  2: [
    {
      id: 1,
      name: "Minh Anh",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      rating: 5,
      comment: "Mèo nhà mình rất thích ăn Whiskas này. Lông mượt hơn nhiều sau 2 tuần.",
      date: "22/11/2023",
    },
    {
      id: 2,
      name: "Hoàng Nam",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      rating: 4,
      comment: "Chất lượng tốt, giá hơi cao nhưng đáng đồng tiền. Mèo ăn ngon miệng.",
      date: "19/11/2023",
    },
    {
      id: 3,
      name: "Thu Hương",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      rating: 5,
      comment: "Đóng gói đẹp, hương vị thơm ngon. Mèo nhà mình từ chối ăn thức ăn khác.",
      date: "16/11/2023",
    },
    {
      id: 4,
      name: "Đức Minh",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
      rating: 5,
      comment: "Sản phẩm cao cấp, thành phần tự nhiên. Mèo khỏe mạnh, năng động hơn.",
      date: "14/11/2023",
    },
  ],
  3: [
    {
      id: 1,
      name: "Bác sĩ Thú y",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=40&h=40&fit=crop&crop=face",
      rating: 5,
      comment: "Là bác sĩ thú y, tôi khuyên dùng Hill's cho chó lớn. Công thức khoa học, an toàn.",
      date: "25/11/2023",
    },
    {
      id: 2,
      name: "Chủ trại chó",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      rating: 5,
      comment: "Dùng cho 15 con chó lớn trong trại. Tất cả đều khỏe mạnh, lông bóng mượt.",
      date: "23/11/2023",
    },
    {
      id: 3,
      name: "Người nuôi chó",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      rating: 4,
      comment: "Giá cao nhưng chất lượng tuyệt vời. Chó Golden của mình rất thích ăn.",
      date: "21/11/2023",
    },
    {
      id: 4,
      name: "Khách hàng VIP",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
      rating: 5,
      comment: "Sản phẩm cao cấp nhất trên thị trường. Chó nhà mình khỏe mạnh, năng động.",
      date: "18/11/2023",
    },
  ],
};

// Mock data for recommended products
const recommendedProducts = [
  {
    id: 1,
    name: "Thức Ăn Cho Chó",
    price: "120.000 VNĐ",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 2,
    name: "Thức Ăn Cho Mèo",
    price: "95.000 VNĐ",
    image: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 3,
    name: "Thức Ăn Cao Cấp",
    price: "350.000 VNĐ",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 4,
    name: "Thức Ăn Hữu Cơ",
    price: "280.000 VNĐ",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=center",
  },
];

interface ProductDetailProps {
  onClose?: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ onClose }) => {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || "1");
  
  // Get product data based on ID, fallback to product 1
  const productDetail = productsData[productId as keyof typeof productsData] || productsData[1];
  const reviews = reviewsData[productId as keyof typeof reviewsData] || reviewsData[1];
  
  const [selectedWeight, setSelectedWeight] = useState(productDetail.weightOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);

  const handleWeightChange = (weight: typeof productDetail.weightOptions[0]) => {
    setSelectedWeight(weight);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    console.log("Add to cart:", {
      productId: productId,
      weight: selectedWeight.weight,
      quantity,
      totalPrice: selectedWeight.price * quantity,
    });
    // TODO: Implement add to cart functionality
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
            src={productDetail.image}
            alt={productDetail.name}
            className={styles.productImage}
          />
        </Box>

        <Box className={styles.productDetailsContainer}>
          <Typography variant="h4" className={styles.productTitle}>
            {productDetail.name}
          </Typography>

          <Typography variant="h6" className={styles.brandName}>
            {productDetail.brand}
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
              {productDetail.weightOptions.map((weight) => (
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
              {productDetail.description}
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
          {recommendedProducts.map((product) => (
            <Card key={product.id} className={styles.recommendedCard}>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
                className={styles.recommendedImage}
              />
              <CardContent className={styles.recommendedContent}>
                <Box className={styles.recommendedInfo}>
                  <Typography variant="subtitle1" className={styles.recommendedName}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" className={styles.recommendedPrice}>
                    {product.price}
                  </Typography>
                </Box>
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