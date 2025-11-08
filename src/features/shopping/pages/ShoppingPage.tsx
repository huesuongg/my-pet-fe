import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Button, CircularProgress, Alert } from "@mui/material";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import BlogCard from "../components/BlogCard";
import styles from "./ShoppingPage.module.css";
import { fetchProducts, fetchCategories, fetchBlogArticles } from "../shoppingThunk";
import { RootState } from "../../../store";
import { Product } from "../types";

export const getProductsByCategory = (products: Product[]) => {
  const categories: { [key: string]: Product[] } = {};

  products.forEach((product: Product) => {
    const categoryName = typeof product.category === 'object' && product.category?.name 
      ? product.category.name 
      : typeof product.category === 'string' 
        ? product.category 
        : "Khác";
    if (!categories[categoryName]) {
      categories[categoryName] = [];
    }
    categories[categoryName].push({
      ...product,
      price: typeof product.price === 'number' 
        ? `${product.price.toLocaleString("vi-VN")} VNĐ`
        : typeof product.price === 'string'
          ? product.price
          : '0 VNĐ',
      originalPrice: product.originalPrice
        ? typeof product.originalPrice === 'number'
          ? `${product.originalPrice.toLocaleString("vi-VN")} VNĐ`
          : product.originalPrice
        : undefined,
    });
  });

  return categories;
};

// Helper function to get product by ID
export const getProductById = (id: string | number, products: Product[]) => {
  return products.find((p: Product) => {
    const pId = p.id || p._id;
    const searchId = typeof id === 'string' ? id : String(id);
    return String(pId) === searchId || pId === id;
  });
};

const ShoppingPage = () => {
  const dispatch = useDispatch();
  const { products, categories, blogArticles, loading, error } = useSelector((state: RootState) => state.shopping);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(fetchProducts({ page: 1, limit: 50 }) as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(fetchCategories() as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(fetchBlogArticles({ page: 1, limit: 10 }) as any);
  }, [dispatch]);

  const handleCategoryClick = (categoryId: number) => {
    console.log("Category clicked:", categoryId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(fetchProducts({ page: 1, limit: 50, categoryId }) as any);
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
        {loading.categories ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error.categories ? (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error.categories}
          </Alert>
        ) : (
          <Box className={styles.categoriesGrid}>
            {categories.map((category) => (
              <CategoryCard
                key={category.id || category._id || 0}
                id={(category.id || category._id || 0) as number}
                name={category.name}
                image={category.image || "https://via.placeholder.com/300"}
                description={category.description}
                onClick={handleCategoryClick}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Products by Category Section */}
      {loading.products ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error.products ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error.products}
        </Alert>
      ) : products.length > 0 ? (
        Object.entries(getProductsByCategory(products)).map(
          ([categoryName, categoryProducts]) => (
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
                {categoryProducts.map((product) => (
                  <ProductCard
                    key={product.id || product._id || 0}
                    id={(product.id || product._id || 0) as string | number}
                    name={product.name}
                    price={typeof product.price === 'number' ? product.price : typeof product.price === 'string' ? product.price : 0}
                    originalPrice={typeof product.originalPrice === 'number' ? product.originalPrice : typeof product.originalPrice === 'string' ? product.originalPrice : undefined}
                    image={product.image || product.images?.[0] || "https://via.placeholder.com/300"}
                    rating={product.rating || (Array.isArray(product.reviews) ? product.reviews.reduce((acc: number, r: { rating?: number }) => acc + (r.rating || 0), 0) / product.reviews.length : 0) || 0}
                    reviews={product.reviewCount || (Array.isArray(product.reviews) ? product.reviews.length : 0) || 0}
                    brand={product.brand}
                    weight={product.weight}
                    color={product.color}
                    size={product.size}
                  />
                ))}
              </Box>
            </Box>
          )
        )
      ) : (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Chưa có sản phẩm nào
          </Typography>
        </Box>
      )}

      {/* Blog Section */}
      <Box className={styles.blogSection}>
        <Typography variant="h3" className={styles.blogTitle}>
          Chăm Boss Như Thế Nào ?
        </Typography>

        {loading.blogArticles ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error.blogArticles ? (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error.blogArticles}
          </Alert>
        ) : blogArticles.length > 0 ? (
          <Box className={styles.blogGrid}>
            {blogArticles.map((article) => (
              <BlogCard
                key={article.id || article._id || 0}
                id={(article.id || article._id || 0) as number}
                title={article.title}
                description={article.description}
                image={article.image || "https://via.placeholder.com/400"}
                bgColor={article.bgColor || "#E3F2FD"}
                onClick={handleBlogClick}
              />
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Chưa có bài viết nào
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ShoppingPage;
