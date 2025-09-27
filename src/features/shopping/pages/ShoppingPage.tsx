import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import styles from "./ShoppingPage.module.css";

// Mock data for products
const mockProducts = [
  {
    id: 1,
    name: "Thức Ăn Cho Chó Con Royal Canin Mini Puppy",
    price: 160000,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop&crop=center",
    brand: "Royal Canin",
    weight: "400g",
    color: "Xanh",
    size: "M",
  },
  {
    id: 2,
    name: "Thức Ăn Cho Mèo Trưởng Thành Whiskas Premium",
    price: 85000,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop&crop=center",
    brand: "Whiskas Premium",
    weight: "300g",
    color: "Đỏ",
    size: "S",
  },
  {
    id: 3,
    name: "Thức Ăn Cho Chó Lớn Hill's Science Diet",
    price: 450000,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop&crop=center",
    brand: "Hill's Science Diet",
    weight: "1.5kg",
    color: "Xanh",
    size: "L",
  },
  {
    id: 4,
    name: "Thức Ăn Cho Mèo Con Royal Canin Kitten",
    price: 120000,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop&crop=center",
    brand: "Royal Canin",
    weight: "500g",
    color: "Vàng",
    size: "M",
  },
  {
    id: 5,
    name: "Thức Ăn Hữu Cơ Cho Chó Acana",
    price: 380000,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop&crop=center",
    brand: "Acana",
    weight: "2kg",
    color: "Xanh",
    size: "XL",
  },
  {
    id: 6,
    name: "Thức Ăn Cho Mèo Già Royal Canin Mature",
    price: 200000,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop&crop=center",
    brand: "Royal Canin",
    weight: "800g",
    color: "Đỏ",
    size: "L",
  },
  {
    id: 7,
    name: "Thức Ăn Cho Chó Cảnh Pedigree",
    price: 95000,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop&crop=center",
    brand: "Pedigree",
    weight: "600g",
    color: "Xanh",
    size: "M",
  },
  {
    id: 8,
    name: "Thức Ăn Cho Mèo Béo Whiskas Adult",
    price: 75000,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop&crop=center",
    brand: "Whiskas",
    weight: "400g",
    color: "Vàng",
    size: "S",
  },
];

const ShoppingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box className={styles.shoppingContainer}>
      {/* Hero Banner */}
      <Box className={styles.heroBanner}>
        <Box className={styles.heroOverlay} />
        <Typography variant="h2" className={styles.heroTitle}>
          Thức Ăn Thú Cưng Chất Lượng Cao
        </Typography>
        <Typography variant="h5" className={styles.heroSubtitle}>
          Chăm sóc thú cưng của bạn với những sản phẩm tốt nhất
        </Typography>
        <Button
          variant="contained"
          className={styles.heroButton}
          onClick={() => navigate("/cart")}
        >
          Xem giỏ hàng
        </Button>
      </Box>

      {/* Products Section */}
      <Box className={styles.productsSection}>
        <Typography variant="h4" className={styles.productsTitle}>
          Sản Phẩm Nổi Bật
        </Typography>
        <Box className={styles.productsGrid}>
          {mockProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              brand={product.brand}
              weight={product.weight}
              color={product.color}
              size={product.size}
            />
          ))}
        </Box>
        <Button
          variant="outlined"
          className={styles.loadMoreButton}
        >
          Xem thêm sản phẩm
        </Button>
      </Box>
    </Box>
  );
};

export default ShoppingPage;
