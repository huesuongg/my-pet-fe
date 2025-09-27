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
    description: "Thức ăn dinh dưỡng cho thú cưng",
    productCount: 24,
  },
  {
    id: 2,
    name: "Đồ Chơi",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&crop=center",
    description: "Đồ chơi vui nhộn cho boss",
    productCount: 18,
  },
  {
    id: 3,
    name: "Trang Phục",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop&crop=center",
    description: "Quần áo thời trang cho thú cưng",
    productCount: 12,
  },
  {
    id: 4,
    name: "Cát Vệ Sinh",
    image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=300&h=300&fit=crop&crop=center",
    description: "Cát vệ sinh và phụ kiện",
    productCount: 8,
  },
  // {
  //   id: 5,
  //   name: "Phụ Kiện",
  //   image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop&crop=center",
  //   description: "Phụ kiện chăm sóc thú cưng",
  //   productCount: 15,
  // },
  // {
  //   id: 6,
  //   name: "Y Tế",
  //   image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop&crop=center",
  //   description: "Sản phẩm y tế và chăm sóc sức khỏe",
  //   productCount: 10,
  // },
];

// Comprehensive mock data for products - can be used by both ShoppingPage and ProductDetail
export const productsData = {
  1: {
    id: 1,
    name: "Thức ăn hạt Canin cho chó",
    brand: "Royal Canin",
    price: 450000,
    originalPrice: 520000,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=500&fit=crop&crop=center",
    rating: 4.8,
    reviews: 124,
    category: "Thức Ăn",
    description: `
      ROYAL CANIN INTENSE HAIRBALL được thiết kế đặc biệt để hỗ trợ tiêu hóa đường ruột và kiểm soát lông tụ.
      
      Lợi ích:
       Kiểm soát lông: Giảm thiểu sự hình thành của lông tụ trong đường tiêu hóa
       Sức khỏe răng miệng: Công thức đặc biệt giúp làm sạch răng tự nhiên
       Ngăn ngừa sỏi thận: Cân bằng khoáng chất giúp bảo vệ hệ tiết niệu
      
      Thành phần: Thịt gà, gạo, chất béo động vật, chất xơ, vitamin và khoáng chất.
    `,
    weightOptions: [
      { id: 1, weight: "400g", price: 450000, selected: true },
      { id: 2, weight: "1 kg", price: 520000, selected: false },
      { id: 3, weight: "1.5 kg", price: 750000, selected: false },
    ],
  },
  2: {
    id: 2,
    name: "Pate Whiskas cho mèo hiệu AFBC",
    brand: "Whiskas",
    price: 35000,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=500&fit=crop&crop=center",
    rating: 4.5,
    reviews: 89,
    category: "Thức Ăn",
    description: `
      WHISKAS PREMIUM ADULT CAT FOOD - Thức ăn cao cấp dành cho mèo trưởng thành từ 1-7 tuổi.
      
      Đặc điểm nổi bật:
       Protein cao: 35% protein từ thịt cá hồi và thịt gà tươi
       Omega-3 & Omega-6: Tăng cường sức khỏe da và lông
       Prebiotics: Hỗ trợ hệ tiêu hóa khỏe mạnh
       Không chất bảo quản nhân tạo
       Hương vị tự nhiên, mèo yêu thích
      
      Thành phần: Cá hồi (25%), thịt gà (20%), gạo lứt, khoai tây, dầu cá, vitamin tổng hợp.
    `,
    weightOptions: [
      { id: 1, weight: "300g", price: 35000, selected: true },
      { id: 2, weight: "600g", price: 65000, selected: false },
    ],
  },
  3: {
    id: 3,
    name: "Thức ăn khô Purina Pro Plan",
    brand: "Purina Pro Plan",
    price: 380000,
    originalPrice: 420000,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=500&fit=crop&crop=center",
    rating: 4.7,
    reviews: 156,
    category: "Thức Ăn",
    description: `
      PURINA PRO PLAN - Thức ăn dinh dưỡng cao cấp cho chó trưởng thành.
      
      Đặc điểm:
       Protein thực: 26% protein từ thịt gà tươi
       Probiotics: Hỗ trợ hệ tiêu hóa khỏe mạnh
       Vitamin E: Chất chống oxy hóa tự nhiên
       Không ngũ cốc: Phù hợp cho chó nhạy cảm
      
      Thành phần: Thịt gà (26%), khoai tây, đậu Hà Lan, chất béo động vật, vitamin tổng hợp.
    `,
    weightOptions: [
      { id: 1, weight: "500g", price: 380000, selected: true },
      { id: 2, weight: "1.2 kg", price: 420000, selected: false },
      { id: 3, weight: "2.5 kg", price: 850000, selected: false },
    ],
  },
  4: {
    id: 4,
    name: "Bánh thưởng cho chó Pedigree",
    brand: "Pedigree",
    price: 65000,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=500&fit=crop&crop=center",
    rating: 4.3,
    reviews: 67,
    category: "Thức Ăn",
    description: `
      PEDIGREE DENTASTIX - Bánh thưởng giúp làm sạch răng cho chó.
      
      Lợi ích:
       Làm sạch răng: Giảm 80% mảng bám răng
       Hương vị thơm ngon: Chó yêu thích
       Dinh dưỡng cân bằng: Vitamin và khoáng chất
       An toàn: Không chứa chất bảo quản nhân tạo
      
      Thành phần: Bột mì, thịt gà, chất béo động vật, vitamin tổng hợp.
    `,
    weightOptions: [
      { id: 1, weight: "150g", price: 65000, selected: true },
      { id: 2, weight: "300g", price: 120000, selected: false },
    ],
  },
  5: {
    id: 5,
    name: "Bóng tennis cho chó",
    brand: "PetSafe",
    price: 45000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&crop=center",
    rating: 4.6,
    reviews: 78,
    category: "Đồ Chơi",
    description: `
      BÓNG TENNIS CHO CHÓ - Đồ chơi vận động an toàn và bền bỉ.
      
      Đặc điểm:
       Chất liệu cao su tự nhiên: An toàn cho răng chó
       Kích thước vừa phải: Phù hợp chó nhỏ và vừa
       Màu sắc nổi bật: Dễ tìm kiếm
       Bền bỉ: Chịu được cắn xé mạnh
      
      Phù hợp cho: Chó con, chó trưởng thành, chó năng động.
    `,
    weightOptions: [
      { id: 1, weight: "1 quả", price: 45000, selected: true },
      { id: 2, weight: "3 quả", price: 120000, selected: false },
    ],
  },
  6: {
    id: 6,
    name: "Cần câu mèo với lông chim",
    brand: "CatPlay",
    price: 85000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&crop=center",
    rating: 4.4,
    reviews: 92,
    category: "Đồ Chơi",
    description: `
      CẦN CÂU MÈO VỚI LÔNG CHIM - Đồ chơi tương tác cho mèo.
      
      Đặc điểm:
       Lông chim tự nhiên: Kích thích bản năng săn mồi
       Cần câu dài: Dễ điều khiển
       An toàn: Không chứa hóa chất độc hại
       Bền bỉ: Chịu được cắn xé
      
      Phù hợp cho: Mèo con, mèo trưởng thành, mèo năng động.
    `,
    weightOptions: [
      { id: 1, weight: "1 cái", price: 85000, selected: true },
      { id: 2, weight: "2 cái", price: 150000, selected: false },
    ],
  },
  7: {
    id: 7,
    name: "Xương gặm cho chó",
    brand: "Nylabone",
    price: 120000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&crop=center",
    rating: 4.8,
    reviews: 134,
    category: "Đồ Chơi",
    description: `
      XƯƠNG GẶM NYLABONE - Đồ chơi gặm nhấm an toàn cho chó.
      
      Lợi ích:
       Làm sạch răng: Giảm mảng bám và cao răng
       Giảm stress: Giúp chó thư giãn
       Bền bỉ: Chịu được cắn xé mạnh
       Hương vị hấp dẫn: Chó yêu thích
      
      Thành phần: Nhựa an toàn, hương vị tự nhiên.
    `,
    weightOptions: [
      { id: 1, weight: "1 cái", price: 120000, selected: true },
      { id: 2, weight: "2 cái", price: 220000, selected: false },
    ],
  },
  8: {
    id: 8,
    name: "Thú nhồi bông cho mèo",
    brand: "CatToy",
    price: 55000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&crop=center",
    rating: 4.2,
    reviews: 45,
    category: "Đồ Chơi",
    description: `
      THÚ NHỒI BÔNG CHO MÈO - Đồ chơi mềm mại và an toàn.
      
      Đặc điểm:
       Chất liệu mềm mại: An toàn cho mèo
       Kích thước nhỏ gọn: Dễ mang theo
       Hình dáng đáng yêu: Mèo yêu thích
       Bền bỉ: Chịu được cắn xé
      
      Phù hợp cho: Mèo con, mèo trưởng thành.
    `,
    weightOptions: [
      { id: 1, weight: "1 cái", price: 55000, selected: true },
      { id: 2, weight: "3 cái", price: 150000, selected: false },
    ],
  },
  9: {
    id: 9,
    name: "Áo len cho chó mùa đông",
    brand: "PetFashion",
    price: 180000,
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&h=500&fit=crop&crop=center",
    rating: 4.5,
    reviews: 56,
    category: "Trang Phục",
    description: `
      ÁO LEN CHO CHÓ MÙA ĐÔNG - Giữ ấm cho thú cưng trong mùa lạnh.
      
      Đặc điểm:
       Chất liệu len mềm mại: Giữ ấm tốt
       Thiết kế thoải mái: Không gây khó chịu
       Dễ giặt: Có thể giặt máy
       Nhiều size: Phù hợp mọi giống chó
      
      Phù hợp cho: Chó nhỏ, chó lông ngắn, mùa đông.
    `,
    weightOptions: [
      { id: 1, weight: "Size S", price: 180000, selected: true },
      { id: 2, weight: "Size M", price: 200000, selected: false },
      { id: 3, weight: "Size L", price: 220000, selected: false },
    ],
  },
  10: {
    id: 10,
    name: "Váy xinh cho mèo",
    brand: "CatStyle",
    price: 95000,
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&h=500&fit=crop&crop=center",
    rating: 4.3,
    reviews: 38,
    category: "Trang Phục",
    description: `
      VÁY XINH CHO MÈO - Trang phục dễ thương cho mèo cưng.
      
      Đặc điểm:
       Thiết kế dễ thương: Tôn vẻ đẹp của mèo
       Chất liệu mềm mại: Không gây khó chịu
       Dễ mặc: Thiết kế tiện lợi
       Nhiều màu sắc: Phù hợp mọi sở thích
      
      Phù hợp cho: Mèo cái, mèo nhỏ, dịp đặc biệt.
    `,
    weightOptions: [
      { id: 1, weight: "Size S", price: 95000, selected: true },
      { id: 2, weight: "Size M", price: 110000, selected: false },
    ],
  },
  11: {
    id: 11,
    name: "Áo mưa cho chó",
    brand: "RainPet",
    price: 150000,
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&h=500&fit=crop&crop=center",
    rating: 4.7,
    reviews: 72,
    category: "Trang Phục",
    description: `
      ÁO MƯA CHO CHÓ - Bảo vệ thú cưng khỏi mưa ướt.
      
      Đặc điểm:
       Chống thấm nước: 100% chống nước
       Thoáng khí: Không gây bí bách
       Dễ mặc: Thiết kế tiện lợi
       Bền bỉ: Chất liệu cao cấp
      
      Phù hợp cho: Mùa mưa, chó đi dạo, chó ngoài trời.
    `,
    weightOptions: [
      { id: 1, weight: "Size S", price: 150000, selected: true },
      { id: 2, weight: "Size M", price: 170000, selected: false },
      { id: 3, weight: "Size L", price: 190000, selected: false },
    ],
  },
  12: {
    id: 12,
    name: "Cát vệ sinh Ever Clean",
    brand: "Ever Clean",
    price: 220000,
    image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=500&h=500&fit=crop&crop=center",
    rating: 4.6,
    reviews: 89,
    category: "Cát Vệ Sinh",
    description: `
      CÁT VỆ SINH EVER CLEAN - Cát vệ sinh cao cấp cho mèo.
      
      Đặc điểm:
       Khử mùi tốt: Loại bỏ mùi hôi hiệu quả
       Hút ẩm nhanh: Giữ khô ráo
       Không bụi: An toàn cho mèo
       Dễ dọn dẹp: Dễ dàng vệ sinh
      
      Thành phần: Bentonite, chất khử mùi tự nhiên.
    `,
    weightOptions: [
      { id: 1, weight: "3.6 kg", price: 220000, selected: true },
      { id: 2, weight: "7.2 kg", price: 420000, selected: false },
    ],
  },
  13: {
    id: 13,
    name: "Khay vệ sinh cho mèo",
    brand: "CatLitter",
    price: 180000,
    image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=500&h=500&fit=crop&crop=center",
    rating: 4.4,
    reviews: 67,
    category: "Cát Vệ Sinh",
    description: `
      KHAY VỆ SINH CHO MÈO - Khay vệ sinh tiện lợi và dễ sử dụng.
      
      Đặc điểm:
       Thiết kế cao cạnh: Ngăn cát rơi ra ngoài
       Dễ dọn dẹp: Bề mặt trơn láng
       Bền bỉ: Chất liệu nhựa cao cấp
       Kích thước phù hợp: Đủ rộng cho mèo
      
      Phù hợp cho: Mèo trưởng thành, mèo lớn.
    `,
    weightOptions: [
      { id: 1, weight: "1 cái", price: 180000, selected: true },
      { id: 2, weight: "2 cái", price: 340000, selected: false },
    ],
  },
  14: {
    id: 14,
    name: "Xẻng xúc cát",
    brand: "CatCare",
    price: 35000,
    image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=500&h=500&fit=crop&crop=center",
    rating: 4.2,
    reviews: 23,
    category: "Cát Vệ Sinh",
    description: `
      XẺNG XÚC CÁT - Dụng cụ vệ sinh khay cát cho mèo.
      
      Đặc điểm:
       Thiết kế tiện lợi: Dễ sử dụng
       Lỗ lọc nhỏ: Chỉ giữ lại cát sạch
       Cán dài: Không bị dính tay
       Bền bỉ: Chất liệu nhựa cao cấp
      
      Phù hợp cho: Vệ sinh khay cát hàng ngày.
    `,
    weightOptions: [
      { id: 1, weight: "1 cái", price: 35000, selected: true },
      { id: 2, weight: "2 cái", price: 65000, selected: false },
    ],
  },
};

// Helper function to get products by category
export const getProductsByCategory = () => {
  const products = Object.values(productsData);
  const categories = {};
  
  products.forEach(product => {
    if (!categories[product.category]) {
      categories[product.category] = [];
    }
    categories[product.category].push({
      ...product,
      price: `${product.price.toLocaleString('vi-VN')} VNĐ`,
      originalPrice: product.originalPrice ? `${product.originalPrice.toLocaleString('vi-VN')} VNĐ` : undefined,
    });
  });
  
  return categories;
};

// Helper function to get product by ID
export const getProductById = (id: number) => {
  return productsData[id];
};
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
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(10deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.2); opacity: 1; }
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
      {Object.entries(getProductsByCategory()).map(([categoryName, products]) => (
        <Box key={categoryName} className={styles.productsSection}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
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
                price={product.price}
                originalPrice={product.originalPrice}
                image={product.image}
                rating={product.rating}
                reviews={product.reviews}
                onAddToCart={handleAddToCart}
              />
            ))}
          </Box>
        </Box>
      ))}

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