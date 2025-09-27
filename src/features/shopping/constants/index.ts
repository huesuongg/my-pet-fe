// Shopping constants
export const SHOPPING_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 12,
    MAX_PAGE_SIZE: 50,
  },
  CART: {
    MAX_QUANTITY: 99,
    MIN_QUANTITY: 1,
  },
  FILTERS: {
    DEFAULT_SORT_BY: 'name' as const,
    DEFAULT_SORT_ORDER: 'asc' as const,
    PRICE_RANGE: {
      MIN: 0,
      MAX: 10000000,
    },
  },
  API: {
    ENDPOINTS: {
      PRODUCTS: '/api/products',
      CATEGORIES: '/api/categories',
      BLOG_ARTICLES: '/api/blog-articles',
      CART: '/api/cart',
    },
  },
} as const;

export const PRODUCT_CATEGORIES = [
  { id: 1, name: 'Thức Ăn', slug: 'thuc-an' },
  { id: 2, name: 'Đồ Chơi', slug: 'do-choi' },
  { id: 3, name: 'Trang Phục', slug: 'trang-phuc' },
  { id: 4, name: 'Cát Vệ Sinh', slug: 'cat-ve-sinh' },
] as const;

export const SORT_OPTIONS = [
  { value: 'name', label: 'Tên A-Z' },
  { value: 'price', label: 'Giá thấp đến cao' },
  { value: 'rating', label: 'Đánh giá cao nhất' },
  { value: 'createdAt', label: 'Mới nhất' },
] as const;


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
    review: 124,
    category: "Thức Ăn",
    weight: "500g",
    color: "Vàng",
    size: "M",
    description: `
      ROYAL CANIN INTENSE HAIRBALL được thiết kế đặc biệt để hỗ trợ tiêu hóa đường ruột và kiểm soát lông tụ.
      
      Lợi ích:
       Kiểm soát lông: Giảm thiểu sự hình thành của lông tụ trong đường tiêu hóa
       Sức khỏe răng miệng: Công thức đặc biệt giúp làm sạch răng tự nhiên
       Ngăn ngừa sỏi thận: Cân bằng khoáng chất giúp bảo vệ hệ tiết niệu
      
      Thành phần: Thịt gà, gạo, chất béo động vật, chất xơ, vitamin và khoáng chất.
    `,
    weightOptions: [
      { id: 1, weight: "Size S", price: 180000, selected: true },
      { id: 2, weight: "Size M", price: 200000, selected: false },
      { id: 3, weight: "Size L", price: 220000, selected: false },
    ],
    colorOptions: [
      { id: 1, color: "Xanh dương", selected: true },
      { id: 2, color: "Đỏ", selected: false },
      { id: 3, color: "Xanh lá", selected: false },
    ],
    sizeOptions: [
      { id: 1, size: "S", selected: true },
      { id: 2, size: "M", selected: false },
      { id: 3, size: "L", selected: false },
    ],
    reviews: [
      { id: 1, name: "ADMIN", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Sản phẩm rất tốt, chó nhà tôi rất thích ăn. Đóng gói đẹp, chất lượng cao.", date: "20/11/2023" },
      { id: 2, name: "Nguyễn Văn A", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Thức ăn này giúp chó con phát triển tốt, tăng cân đều đặn.", date: "18/11/2023" },
      { id: 3, name: "Trần Thị B", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giá cả hợp lý, chất lượng đảm bảo. Sẽ mua lại lần sau.", date: "15/11/2023" },
      { id: 4, name: "Lê Văn C", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm như mô tả.", date: "12/11/2023" },
    ],
  },
  2: {
    id: 2,
    name: "Pate Whiskas cho mèo hiệu AFBC",
    brand: "Whiskas",
    price: 35000,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=500&fit=crop&crop=center",
    rating: 4.5,
    review: 89,
    category: "Thức Ăn",
    weight: "300g",
    color: "Đỏ",
    size: "S",
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
      { id: 1, weight: "Size S", price: 180000, selected: true },
      { id: 2, weight: "Size M", price: 200000, selected: false },
      { id: 3, weight: "Size L", price: 220000, selected: false },
    ],
    colorOptions: [
      { id: 1, color: "Xanh dương", selected: true },
      { id: 2, color: "Đỏ", selected: false },
      { id: 3, color: "Xanh lá", selected: false },
    ],
    sizeOptions: [
      { id: 1, size: "S", selected: true },
      { id: 2, size: "M", selected: false },
      { id: 3, size: "L", selected: false },
    ],
    reviews: [
      { id: 1, name: "ADMIN", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Sản phẩm rất tốt, chó nhà tôi rất thích ăn. Đóng gói đẹp, chất lượng cao.", date: "20/11/2023" },
      { id: 2, name: "Nguyễn Văn A", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Thức ăn này giúp chó con phát triển tốt, tăng cân đều đặn.", date: "18/11/2023" },
      { id: 3, name: "Trần Thị B", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giá cả hợp lý, chất lượng đảm bảo. Sẽ mua lại lần sau.", date: "15/11/2023" },
      { id: 4, name: "Lê Văn C", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm như mô tả.", date: "12/11/2023" },
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
    review: 156,
    category: "Thức Ăn",
    weight: "1.5kg",
    color: "Xanh",
    size: "L",
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
      { id: 1, weight: "Size S", price: 180000, selected: true },
      { id: 2, weight: "Size M", price: 200000, selected: false },
      { id: 3, weight: "Size L", price: 220000, selected: false },
    ],
    colorOptions: [
      { id: 1, color: "Xanh dương", selected: true },
      { id: 2, color: "Đỏ", selected: false },
      { id: 3, color: "Xanh lá", selected: false },
    ],
    sizeOptions: [
      { id: 1, size: "S", selected: true },
      { id: 2, size: "M", selected: false },
      { id: 3, size: "L", selected: false },
    ],
    reviews: [
      { id: 1, name: "ADMIN", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Sản phẩm rất tốt, chó nhà tôi rất thích ăn. Đóng gói đẹp, chất lượng cao.", date: "20/11/2023" },
      { id: 2, name: "Nguyễn Văn A", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Thức ăn này giúp chó con phát triển tốt, tăng cân đều đặn.", date: "18/11/2023" },
      { id: 3, name: "Trần Thị B", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giá cả hợp lý, chất lượng đảm bảo. Sẽ mua lại lần sau.", date: "15/11/2023" },
      { id: 4, name: "Lê Văn C", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm như mô tả.", date: "12/11/2023" },
    ],
  },
  4: {
    id: 4,
    name: "Bánh thưởng cho chó Pedigree",
    brand: "Pedigree",
    price: 65000,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=500&fit=crop&crop=center",
    rating: 4.3,
    review: 67,
    category: "Thức Ăn",
    weight: "600g",
    color: "Xanh",
    size: "M",
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
      { id: 1, weight: "Size S", price: 180000, selected: true },
      { id: 2, weight: "Size M", price: 200000, selected: false },
      { id: 3, weight: "Size L", price: 220000, selected: false },
    ],
    colorOptions: [
      { id: 1, color: "Xanh dương", selected: true },
      { id: 2, color: "Đỏ", selected: false },
      { id: 3, color: "Xanh lá", selected: false },
    ],
    sizeOptions: [
      { id: 1, size: "S", selected: true },
      { id: 2, size: "M", selected: false },
      { id: 3, size: "L", selected: false },
    ],
    reviews: [
      { id: 1, name: "ADMIN", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Sản phẩm rất tốt, chó nhà tôi rất thích ăn. Đóng gói đẹp, chất lượng cao.", date: "20/11/2023" },
      { id: 2, name: "Nguyễn Văn A", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Thức ăn này giúp chó con phát triển tốt, tăng cân đều đặn.", date: "18/11/2023" },
      { id: 3, name: "Trần Thị B", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giá cả hợp lý, chất lượng đảm bảo. Sẽ mua lại lần sau.", date: "15/11/2023" },
      { id: 4, name: "Lê Văn C", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm như mô tả.", date: "12/11/2023" },
    ],
  },
  5: {
    id: 5,
    name: "Bóng tennis cho chó",
    brand: "PetSafe",
    price: 45000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&crop=center",
    rating: 4.6,
    review: 78,
    category: "Đồ Chơi",
    weight: "600g",
    color: "Xanh",
    size: "M",
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
      { id: 1, weight: "Size S", price: 180000, selected: true },
      { id: 2, weight: "Size M", price: 200000, selected: false },
      { id: 3, weight: "Size L", price: 220000, selected: false },
    ],
    colorOptions: [
      { id: 1, color: "Xanh dương", selected: true },
      { id: 2, color: "Đỏ", selected: false },
      { id: 3, color: "Xanh lá", selected: false },
    ],
    sizeOptions: [
      { id: 1, size: "S", selected: true },
      { id: 2, size: "M", selected: false },
      { id: 3, size: "L", selected: false },
    ],
    reviews: [
      { id: 1, name: "ADMIN", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Sản phẩm rất tốt, chó nhà tôi rất thích ăn. Đóng gói đẹp, chất lượng cao.", date: "20/11/2023" },
      { id: 2, name: "Nguyễn Văn A", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Thức ăn này giúp chó con phát triển tốt, tăng cân đều đặn.", date: "18/11/2023" },
      { id: 3, name: "Trần Thị B", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giá cả hợp lý, chất lượng đảm bảo. Sẽ mua lại lần sau.", date: "15/11/2023" },
      { id: 4, name: "Lê Văn C", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm như mô tả.", date: "12/11/2023" },
    ],
  },
  6: {
    id: 6,
    name: "Cần câu mèo với lông chim",
    brand: "CatPlay",
    price: 85000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&crop=center",
    rating: 4.4,
    review: 92,
    category: "Đồ Chơi",
    weight: "600g",
    color: "Xanh",
    size: "M",
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
      { id: 1, weight: "Size S", price: 180000, selected: true },
      { id: 2, weight: "Size M", price: 200000, selected: false },
      { id: 3, weight: "Size L", price: 220000, selected: false },
    ],
    colorOptions: [
      { id: 1, color: "Xanh dương", selected: true },
      { id: 2, color: "Đỏ", selected: false },
      { id: 3, color: "Xanh lá", selected: false },
    ],
    sizeOptions: [
      { id: 1, size: "S", selected: true },
      { id: 2, size: "M", selected: false },
      { id: 3, size: "L", selected: false },
    ],
    reviews: [
      { id: 1, name: "ADMIN", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Sản phẩm rất tốt, chó nhà tôi rất thích ăn. Đóng gói đẹp, chất lượng cao.", date: "20/11/2023" },
      { id: 2, name: "Nguyễn Văn A", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Thức ăn này giúp chó con phát triển tốt, tăng cân đều đặn.", date: "18/11/2023" },
      { id: 3, name: "Trần Thị B", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giá cả hợp lý, chất lượng đảm bảo. Sẽ mua lại lần sau.", date: "15/11/2023" },
      { id: 4, name: "Lê Văn C", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm như mô tả.", date: "12/11/2023" },
    ],
  },
  7: {
    id: 7,
    name: "Xương gặm cho chó",
    brand: "Nylabone",
    price: 120000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&crop=center",
    rating: 4.8,
    review: 134,
    category: "Đồ Chơi",
    weight: "600g",
    color: "Xanh",
    size: "M",
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
      { id: 1, weight: "Size S", price: 180000, selected: true },
      { id: 2, weight: "Size M", price: 200000, selected: false },
      { id: 3, weight: "Size L", price: 220000, selected: false },
    ],
    colorOptions: [
      { id: 1, color: "Xanh dương", selected: true },
      { id: 2, color: "Đỏ", selected: false },
      { id: 3, color: "Xanh lá", selected: false },
    ],
    sizeOptions: [
      { id: 1, size: "S", selected: true },
      { id: 2, size: "M", selected: false },
      { id: 3, size: "L", selected: false },
    ],
    reviews: [
      { id: 1, name: "ADMIN", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Sản phẩm rất tốt, chó nhà tôi rất thích ăn. Đóng gói đẹp, chất lượng cao.", date: "20/11/2023" },
      { id: 2, name: "Nguyễn Văn A", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Thức ăn này giúp chó con phát triển tốt, tăng cân đều đặn.", date: "18/11/2023" },
      { id: 3, name: "Trần Thị B", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giá cả hợp lý, chất lượng đảm bảo. Sẽ mua lại lần sau.", date: "15/11/2023" },
      { id: 4, name: "Lê Văn C", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm như mô tả.", date: "12/11/2023" },
    ],
  },
  8: {
    id: 8,
    name: "Thú nhồi bông cho mèo",
    brand: "CatToy",
    price: 55000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&crop=center",
    rating: 4.2,
    review: 45,
    category: "Đồ Chơi",
    weight: "600g",
    color: "Xanh",
    size: "M",
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
      { id: 1, weight: "Size S", price: 180000, selected: true },
      { id: 2, weight: "Size M", price: 200000, selected: false },
      { id: 3, weight: "Size L", price: 220000, selected: false },
    ],
    colorOptions: [
      { id: 1, color: "Xanh dương", selected: true },
      { id: 2, color: "Đỏ", selected: false },
      { id: 3, color: "Xanh lá", selected: false },
    ],
    sizeOptions: [
      { id: 1, size: "S", selected: true },
      { id: 2, size: "M", selected: false },
      { id: 3, size: "L", selected: false },
    ],
    reviews: [
      { id: 1, name: "ADMIN", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Sản phẩm rất tốt, chó nhà tôi rất thích ăn. Đóng gói đẹp, chất lượng cao.", date: "20/11/2023" },
      { id: 2, name: "Nguyễn Văn A", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Thức ăn này giúp chó con phát triển tốt, tăng cân đều đặn.", date: "18/11/2023" },
      { id: 3, name: "Trần Thị B", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giá cả hợp lý, chất lượng đảm bảo. Sẽ mua lại lần sau.", date: "15/11/2023" },
      { id: 4, name: "Lê Văn C", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm như mô tả.", date: "12/11/2023" },
    ],
  },
  9: {
    id: 9,
    name: "Áo len cho chó mùa đông",
    brand: "PetFashion",
    price: 180000,
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&h=500&fit=crop&crop=center",
    rating: 4.5,
    review: 56,
    category: "Trang Phục",
    weight: "Size S",
    color: "Xanh dương",
    size: "S",
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
    colorOptions: [
      { id: 1, color: "Xanh dương", selected: true },
      { id: 2, color: "Đỏ", selected: false },
      { id: 3, color: "Xanh lá", selected: false },
    ],
    sizeOptions: [
      { id: 1, size: "S", selected: true },
      { id: 2, size: "M", selected: false },
      { id: 3, size: "L", selected: false },
    ],
    reviews: [
      { id: 1, name: "ADMIN", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Sản phẩm rất tốt, chó nhà tôi rất thích ăn. Đóng gói đẹp, chất lượng cao.", date: "20/11/2023" },
      { id: 2, name: "Nguyễn Văn A", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Thức ăn này giúp chó con phát triển tốt, tăng cân đều đặn.", date: "18/11/2023" },
      { id: 3, name: "Trần Thị B", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giá cả hợp lý, chất lượng đảm bảo. Sẽ mua lại lần sau.", date: "15/11/2023" },
      { id: 4, name: "Lê Văn C", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm như mô tả.", date: "12/11/2023" },
    ],
  },
  10: {
    id: 10,
    name: "Váy xinh cho mèo",
    brand: "CatStyle",
    price: 95000,
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&h=500&fit=crop&crop=center",
    rating: 4.3,
    review: 38,
    category: "Trang Phục",
    weight: "Size S",
    color: "Hồng",
    size: "S",
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
    colorOptions: [
      { id: 1, color: "Hồng", selected: true },
      { id: 2, color: "Xanh dương", selected: false },
      { id: 3, color: "Tím", selected: false },
    ],
    sizeOptions: [
      { id: 1, size: "S", selected: true },
      { id: 2, size: "M", selected: false },
    ],
    reviews: [
      { id: 1, name: "ADMIN", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Sản phẩm rất tốt, chó nhà tôi rất thích ăn. Đóng gói đẹp, chất lượng cao.", date: "20/11/2023" },
      { id: 2, name: "Nguyễn Văn A", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Thức ăn này giúp chó con phát triển tốt, tăng cân đều đặn.", date: "18/11/2023" },
      { id: 3, name: "Trần Thị B", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giá cả hợp lý, chất lượng đảm bảo. Sẽ mua lại lần sau.", date: "15/11/2023" },
      { id: 4, name: "Lê Văn C", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm như mô tả.", date: "12/11/2023" },
    ],
  },
  11: {
    id: 11,
    name: "Áo mưa cho chó",
    brand: "RainPet",
    price: 150000,
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&h=500&fit=crop&crop=center",
    rating: 4.7,
    review: 72,
    category: "Trang Phục",
    weight: "Size S",
    color: "Vàng",
    size: "S",
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
    colorOptions: [
      { id: 1, color: "Vàng", selected: true },
      { id: 2, color: "Xanh lá", selected: false },
      { id: 3, color: "Đỏ", selected: false },
    ],
    sizeOptions: [
      { id: 1, size: "S", selected: true },
      { id: 2, size: "M", selected: false },
      { id: 3, size: "L", selected: false },
    ],
    reviews: [
      { id: 1, name: "ADMIN", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Sản phẩm rất tốt, chó nhà tôi rất thích ăn. Đóng gói đẹp, chất lượng cao.", date: "20/11/2023" },
      { id: 2, name: "Nguyễn Văn A", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Thức ăn này giúp chó con phát triển tốt, tăng cân đều đặn.", date: "18/11/2023" },
      { id: 3, name: "Trần Thị B", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giá cả hợp lý, chất lượng đảm bảo. Sẽ mua lại lần sau.", date: "15/11/2023" },
      { id: 4, name: "Lê Văn C", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm như mô tả.", date: "12/11/2023" },
    ],
  },
  12: {
    id: 12,
    name: "Cát vệ sinh Ever Clean",
    brand: "Ever Clean",
    price: 220000,
    image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=500&h=500&fit=crop&crop=center",
    rating: 4.6,
    review: 89,
    category: "Cát Vệ Sinh",
    weight: "3.6 kg",
    color: "Trắng",
    size: "Lớn",
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
    colorOptions: [
      { id: 1, color: "Trắng", selected: true },
      { id: 2, color: "Xanh lá", selected: false },
    ],
    sizeOptions: [
      { id: 1, size: "Lớn", selected: true },
      { id: 2, size: "Rất lớn", selected: false },
    ],
    reviews: [
      { id: 1, name: "ADMIN", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Sản phẩm rất tốt, chó nhà tôi rất thích ăn. Đóng gói đẹp, chất lượng cao.", date: "20/11/2023" },
      { id: 2, name: "Nguyễn Văn A", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Thức ăn này giúp chó con phát triển tốt, tăng cân đều đặn.", date: "18/11/2023" },
      { id: 3, name: "Trần Thị B", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giá cả hợp lý, chất lượng đảm bảo. Sẽ mua lại lần sau.", date: "15/11/2023" },
      { id: 4, name: "Lê Văn C", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm như mô tả.", date: "12/11/2023" },
    ],
  },
  13: {
    id: 13,
    name: "Khay vệ sinh cho mèo",
    brand: "CatLitter",
    price: 180000,
    image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=500&h=500&fit=crop&crop=center",
    rating: 4.4,
    review: 67,
    category: "Cát Vệ Sinh",
    weight: "1 cái",
    color: "Trắng",
    size: "Lớn",
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
    colorOptions: [
      { id: 1, color: "Trắng", selected: true },
      { id: 2, color: "Xanh dương", selected: false },
    ],
    sizeOptions: [
      { id: 1, size: "Lớn", selected: true },
      { id: 2, size: "Nhỏ", selected: false },
    ],
    reviews: [
      { id: 1, name: "ADMIN", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Sản phẩm rất tốt, chó nhà tôi rất thích ăn. Đóng gói đẹp, chất lượng cao.", date: "20/11/2023" },
      { id: 2, name: "Nguyễn Văn A", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Thức ăn này giúp chó con phát triển tốt, tăng cân đều đặn.", date: "18/11/2023" },
      { id: 3, name: "Trần Thị B", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giá cả hợp lý, chất lượng đảm bảo. Sẽ mua lại lần sau.", date: "15/11/2023" },
      { id: 4, name: "Lê Văn C", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm như mô tả.", date: "12/11/2023" },
    ],
  },
  14: {
    id: 14,
    name: "Xẻng xúc cát",
    brand: "CatCare",
    price: 35000,
    image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=500&h=500&fit=crop&crop=center",
    rating: 4.2,
    category: "Cát Vệ Sinh",
    weight: "1 cái",
    color: "Xanh lá",
    size: "Vừa",
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
    colorOptions: [
      { id: 1, color: "Xanh lá", selected: true },
      { id: 2, color: "Xanh dương", selected: false },
    ],
    sizeOptions: [
      { id: 1, size: "Vừa", selected: true },
      { id: 2, size: "Nhỏ", selected: false },
    ],
    reviews: [
      { id: 1, name: "ADMIN", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Sản phẩm rất tốt, chó nhà tôi rất thích ăn. Đóng gói đẹp, chất lượng cao.", date: "20/11/2023" },
      { id: 2, name: "Nguyễn Văn A", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Thức ăn này giúp chó con phát triển tốt, tăng cân đều đặn.", date: "18/11/2023" },
      { id: 3, name: "Trần Thị B", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giá cả hợp lý, chất lượng đảm bảo. Sẽ mua lại lần sau.", date: "15/11/2023" },
      { id: 4, name: "Lê Văn C", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", rating: 5, comment: "Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm như mô tả.", date: "12/11/2023" },
    ],
  },
};

// Mock data for blog articles
export const blogArticles = [
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

// Mock data for product categories
export const productCategories = [
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
