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