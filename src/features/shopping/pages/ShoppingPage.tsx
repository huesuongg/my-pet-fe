import { Box, Typography, Button } from "@mui/material";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import BlogCard from "../components/BlogCard";
import styles from "./ShoppingPage.module.css";
import { productCategories } from "../constants";
import { blogArticles } from "../constants";
import { productsData } from "../constants";

// Define product type
interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  review: number;
  category: string;
  weight: string;
  color: string;
  size: string;
  description: string;
  weightOptions: Array<{ id: number; weight: string; price: number; selected: boolean }>;
  colorOptions: Array<{ id: number; color: string; selected: boolean }>;
  sizeOptions: Array<{ id: number; size: string; selected: boolean }>;
  reviews: Array<{ id: number; name: string; avatar: string; rating: number; comment: string; date: string }>;
}

// Helper function to get products by category
export const getProductsByCategory = (): Record<string, Product[]> => {
  const products = Object.values(productsData) as Product[];
  const categories: Record<string, Product[]> = {};

  products.forEach((product: Product) => {
    if (!categories[product.category]) {
      categories[product.category] = [];
    }
    categories[product.category].push({
      ...product,
      price: product.price, // Keep as number for ProductCard component
      originalPrice: product.originalPrice
        ? `${product.originalPrice.toLocaleString("vi-VN")} VNĐ`
        : undefined,
    } as Product & { originalPrice?: string });
  });

  return categories;
};

// Helper function to get product by ID
export const getProductById = (id: number) => {
  return productsData[id as keyof typeof productsData];
};

const ShoppingPage = () => {
  const handleCategoryClick = (categoryId: number) => {
    console.log("Category clicked:", categoryId);
    // TODO: Implement category filtering
  };

  const handleBlogClick = (articleId: number) => {
    console.log("Blog article clicked:", articleId);
    // TODO: Implement blog navigation
  };

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          height: "60vh",
          minHeight: 500,
          background: "rgb(57, 57, 57)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "url('https://plus.unsplash.com/premium_photo-1661963919820-d201e373bb12?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') center/cover",
            zIndex: 1,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.6)", // 👈 lớp overlay đen mờ
            zIndex: 2,
          },
        }}
      >
        {/* Decorative Elements */}
        <Box
          sx={{
            position: "absolute",
            top: 50,
            left: 50,
            width: 100,
            height: 100,
            background: "linear-gradient(45deg, #FBBF24, #F59E0B)",
            borderRadius: "50%",
            opacity: 0.2,
            animation: "float 6s ease-in-out infinite",
            zIndex: 2,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 100,
            right: 80,
            width: 60,
            height: 60,
            background: "linear-gradient(45deg, #22C55E, #16A34A)",
            borderRadius: "50%",
            opacity: 0.3,
            animation: "float 8s ease-in-out infinite reverse",
            zIndex: 2,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 80,
            left: 100,
            width: 80,
            height: 80,
            background: "linear-gradient(45deg, #F87171, #EF4444)",
            borderRadius: "50%",
            opacity: 0.25,
            animation: "float 7s ease-in-out infinite",
            zIndex: 2,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 120,
            right: 120,
            width: 40,
            height: 40,
            background: "linear-gradient(45deg, #8B5CF6, #7C3AED)",
            borderRadius: "50%",
            opacity: 0.3,
            animation: "float 9s ease-in-out infinite reverse",
            zIndex: 2,
          }}
        />

        {/* Content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 3,
            textAlign: "center",
            color: "white",
            maxWidth: 800,
            px: 4,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "3rem", md: "4.5rem", lg: "5.5rem" },
              fontWeight: "900",
              mb: 3,
              background: "linear-gradient(45deg, #ffffff, #f0f9ff, #e0f2fe)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "'Inter', sans-serif",
              color: "white",
            }}
          >
            Mua Hàng Cho Boss
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: "1.2rem", md: "1.5rem" },
              fontWeight: "400",
              mb: 4,
              opacity: 0.95,
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Tìm kiếm những sản phẩm tốt nhất cho thú cưng yêu quý của bạn
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              justifyContent: "center",
              flexWrap: "wrap",
              mt: 5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                bgcolor: "rgba(255,255,255,0.15)",
                px: 3,
                py: 2,
                borderRadius: "50px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: "#22C55E",
                  borderRadius: "50%",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
              <Typography variant="body1" sx={{ fontWeight: "500" }}>
                Giao hàng nhanh
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                bgcolor: "rgba(255,255,255,0.15)",
                px: 3,
                py: 2,
                borderRadius: "50px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: "#FBBF24",
                  borderRadius: "50%",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
              <Typography variant="body1" sx={{ fontWeight: "500" }}>
                Chất lượng cao
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                bgcolor: "rgba(255,255,255,0.15)",
                px: 3,
                py: 2,
                borderRadius: "50px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: "#3B82F6",
                  borderRadius: "50%",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
              <Typography variant="body1" sx={{ fontWeight: "500" }}>
                Giá tốt nhất
              </Typography>
            </Box>
          </Box>
          
        </Box>

        {/* CSS Animations */}
        <style>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-30px) rotate(10deg);
            }
          }
          @keyframes pulse {
            0%,
            100% {
              transform: scale(1);
              opacity: 0.8;
            }
            50% {
              transform: scale(1.2);
              opacity: 1;
            }
          }
        `}</style>
      </Box>

      {/* Product Categories Section */}
      <Box className={styles.categoriesSection}>
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            mb: 6,
            fontFamily: "'Inter', sans-serif",
            fontWeight: "700",
            color: "#1E40AF",
          }}
        >
          Danh Mục Sản Phẩm
        </Typography>
        <Box className={styles.categoriesGrid}>
          {productCategories.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              image={category.image}
              description={category.description}
              productCount={category.productCount}
              onClick={handleCategoryClick}
            />
          ))}
        </Box>
      </Box>

      {/* Products by Category Section */}
      {Object.entries(getProductsByCategory()).map(
        ([categoryName, products]) => (
          <Box key={categoryName} className={styles.productsSection}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 4,
              }}
            >
              <Typography
                variant="h3"
                className={styles.productsTitle}
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: "700",
                  color: "#1E40AF",
                }}
              >
                {categoryName}
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#3B82F6",
                  color: "#3B82F6",
                  px: 3,
                  py: 1,
                  borderRadius: "25px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  textTransform: "none",
                  fontFamily: "'Inter', sans-serif",
                  "&:hover": {
                    borderColor: "#1E40AF",
                    color: "#1E40AF",
                    bgcolor: "rgba(30, 64, 175, 0.05)",
                  },
                }}
              >
                Xem tất cả →
              </Button>
            </Box>

            <Box className={styles.productsGrid}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={typeof product.price === 'number' ? product.price : product.price}
                  originalPrice={typeof product.originalPrice === 'number' ? `${product.originalPrice.toLocaleString("vi-VN")} VNĐ` : product.originalPrice}
                  image={product.image}
                  rating={product.rating}
                  reviews={product.review}
                  brand={product.brand}
                  weight={product.weight}
                  color={product.color}
                  size={product.size}
                />
              ))}
            </Box>
          </Box>
        )
      )}

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
