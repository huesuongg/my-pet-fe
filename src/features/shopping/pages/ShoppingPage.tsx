import { Box, Typography, Button } from "@mui/material";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import BlogCard from "../components/BlogCard";
import styles from "./ShoppingPage.module.css";

// Mock data for product categories
const productCategories = [
  {
    id: 1,
    name: "Thức Ăn",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop&crop=center",
  },
  {
    id: 2,
    name: "Đồ Chơi",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop&crop=center",
  },
  {
    id: 3,
    name: "Trang Phục",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop&crop=center",
  },
  {
    id: 4,
    name: "Cát Vệ Sinh",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop&crop=center",
  },
];

// Mock data for featured products
const featuredProducts = [
  {
    id: 1,
    name: "Thức ăn cho chó",
    price: "120.000 VNĐ",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 2,
    name: "Thức ăn cho mèo",
    price: "95.000 VNĐ",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 3,
    name: "Bánh thưởng Royal Canin",
    price: "85.000 VNĐ",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 4,
    name: "Pate Whiskas",
    price: "45.000 VNĐ",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 5,
    name: "Thức ăn Purina One",
    price: "110.000 VNĐ",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 6,
    name: "Thức ăn Me-O",
    price: "75.000 VNĐ",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 7,
    name: "Bánh thưởng cho chó",
    price: "65.000 VNĐ",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 8,
    name: "Thức ăn hạt cho mèo",
    price: "90.000 VNĐ",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 9,
    name: "Pate cho chó",
    price: "55.000 VNĐ",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 10,
    name: "Thức ăn khô Royal Canin",
    price: "150.000 VNĐ",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 11,
    name: "Bánh thưởng cho mèo",
    price: "40.000 VNĐ",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 12,
    name: "Thức ăn ướt Whiskas",
    price: "35.000 VNĐ",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 13,
    name: "Thức ăn hạt Purina",
    price: "100.000 VNĐ",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 14,
    name: "Bánh thưởng Me-O",
    price: "50.000 VNĐ",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 15,
    name: "Thức ăn cho chó con",
    price: "130.000 VNĐ",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 16,
    name: "Thức ăn cho mèo con",
    price: "105.000 VNĐ",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=center",
  },
];

// Mock data for blog articles
const blogArticles = [
  {
    id: 1,
    title: "Cách chăm sóc mèo con",
    description: "Tìm hiểu về cách chăm sóc giúp bạn nuôi dưỡng những chú mèo con khỏe mạnh và hạnh phúc.",
    image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&h=250&fit=crop&crop=center",
    bgColor: "#E3F2FD",
  },
  {
    id: 2,
    title: "Huấn luyện chó cưng",
    description: "Những bí quyết vàng để huấn luyện chó cưng của bạn trở nên ngoan ngoãn và thông minh.",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=250&fit=crop&crop=center",
    bgColor: "#E3F2FD",
  },
  {
    id: 3,
    title: "Dinh dưỡng cho thú cưng",
    description: "Chế độ dinh dưỡng phù hợp giúp thú cưng của bạn luôn khỏe mạnh và tràn đầy năng lượng.",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=250&fit=crop&crop=center",
    bgColor: "#E8F5E8",
  },
];

const ShoppingPage = () => {
  const handleCategoryClick = (categoryId: number) => {
    console.log("Category clicked:", categoryId);
    // TODO: Implement category filtering
  };

  const handleAddToCart = (productId: number) => {
    console.log("Add to cart:", productId);
    // TODO: Implement add to cart functionality
  };

  const handleBlogClick = (articleId: number) => {
    console.log("Blog article clicked:", articleId);
    // TODO: Implement blog navigation
  };

  return (
    <Box>
      {/* Hero Banner Section */}
      <Box className={styles.heroBanner}>
        <Box className={styles.heroOverlay} />
        <Typography variant="h2" className={styles.heroTitle}>
          Mua hàng
        </Typography>
      </Box>

      {/* Product Categories Section */}
      <Box className={styles.categoriesSection}>
        <Box className={styles.categoriesGrid}>
          {productCategories.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              image={category.image}
              onClick={handleCategoryClick}
            />
          ))}
        </Box>
      </Box>

      {/* Featured Products Section */}
      <Box className={styles.productsSection}>
        <Typography variant="h3" className={styles.productsTitle}>
          Được Boss Yêu Thích
        </Typography>
        
        <Box className={styles.productsGrid}>
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              onAddToCart={handleAddToCart}
            />
          ))}
        </Box>
        
        <Box className={styles.loadMoreButton}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#4CAF50",
              color: "white",
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontSize: "1.1rem",
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "#45a049",
              },
            }}
          >
            Xem thêm
          </Button>
        </Box>
      </Box>

      {/* Blog Section */}
      <Box className={styles.blogSection}>
        <Typography variant="h3" className={styles.blogTitle}>
          Chăm Boss Như Thế Nào ?
        </Typography>
        
        <Box className={styles.blogGrid}>
          {blogArticles.map((article) => (
            <BlogCard
              key={article.id}
              id={article.id}
              title={article.title}
              description={article.description}
              image={article.image}
              bgColor={article.bgColor}
              onClick={handleBlogClick}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ShoppingPage;