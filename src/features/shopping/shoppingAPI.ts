import axiosInstance from '../../services/axiosInstance';
import { Product, ProductCategory, BlogArticle, Cart } from './types';
import { SHOPPING_CONSTANTS } from './constants';

interface AddToCartResponse {
  message: string;
  cart: Cart;
}

interface UpdateCartItemResponse {
  message: string;
  cart: Cart;
}

// Products API
export const shoppingAPI = {
  // Get all products
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    categoryId?: string | number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  }) => {
    const response = await axiosInstance.get(SHOPPING_CONSTANTS.API.ENDPOINTS.PRODUCTS, {
      params: {
        page: params?.page || 1,
        limit: params?.limit || SHOPPING_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
        categoryId: params?.categoryId,
        search: params?.search,
        sortBy: params?.sortBy || SHOPPING_CONSTANTS.FILTERS.DEFAULT_SORT_BY,
        sortOrder: params?.sortOrder || SHOPPING_CONSTANTS.FILTERS.DEFAULT_SORT_ORDER,
        minPrice: params?.minPrice,
        maxPrice: params?.maxPrice,
        inStock: params?.inStock,
      },
    });
    return response.data;
  },

  // Get product by ID
  getProductById: async (id: string | number): Promise<Product> => {
    const response = await axiosInstance.get(`${SHOPPING_CONSTANTS.API.ENDPOINTS.PRODUCTS}/${id}`);
    return response.data;
  },

  // Get all categories
  getCategories: async (): Promise<{ categories: ProductCategory[] }> => {
    const response = await axiosInstance.get(SHOPPING_CONSTANTS.API.ENDPOINTS.CATEGORIES);
    return response.data;
  },

  // Get blog articles
  getBlogArticles: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ articles: BlogArticle[]; page?: number; total?: number; totalPages?: number }> => {
    const response = await axiosInstance.get(SHOPPING_CONSTANTS.API.ENDPOINTS.BLOG_ARTICLES, {
      params: {
        page: params?.page || 1,
        limit: params?.limit || SHOPPING_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
        search: params?.search,
      },
    });
    return response.data;
  },

  // Cart operations
  getCart: async (): Promise<Cart> => {
    const response = await axiosInstance.get(SHOPPING_CONSTANTS.API.ENDPOINTS.CART);
    return response.data;
  },

  addToCart: async (productId: string | number, quantity: number = 1, color?: string, size?: string, weight?: string): Promise<AddToCartResponse> => {
    const response = await axiosInstance.post(`${SHOPPING_CONSTANTS.API.ENDPOINTS.CART}/items`, {
      productId,
      quantity,
      color,
      size,
      weight,
    });
    return response.data;
  },

  updateCartItem: async (itemIndex: number, quantity: number): Promise<UpdateCartItemResponse> => {
    const response = await axiosInstance.put(`${SHOPPING_CONSTANTS.API.ENDPOINTS.CART}/items/${itemIndex}`, {
      quantity,
    });
    return response.data;
  },

  removeFromCart: async (itemIndex: number): Promise<void> => {
    await axiosInstance.delete(`${SHOPPING_CONSTANTS.API.ENDPOINTS.CART}/items/${itemIndex}`);
  },

  clearCart: async (): Promise<void> => {
    await axiosInstance.delete(SHOPPING_CONSTANTS.API.ENDPOINTS.CART);
  },

  // Orders API
  getOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const response = await axiosInstance.get('/api/orders', {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        status: params?.status,
      },
    });
    return response.data;
  },

  getOrderById: async (id: string) => {
    const response = await axiosInstance.get(`/api/orders/${id}`);
    return response.data;
  },

  createOrder: async (orderData: {
    items: Array<{
      productId: string;
      quantity: number;
      color?: string;
      size?: string;
      weight?: string;
    }>;
    shippingInfo: {
      fullName: string;
      phone: string;
      email: string;
      address: string;
      city: string;
      district: string;
      ward: string;
      notes?: string;
    };
    shippingOption: {
      id: string;
      name: string;
      price: number;
      description: string;
    };
    paymentMethod: string;
    promoCode?: string;
  }) => {
    const response = await axiosInstance.post('/api/orders', orderData);
    return response.data;
  },

  cancelOrder: async (orderId: string) => {
    const response = await axiosInstance.put(`/api/orders/${orderId}/cancel`);
    return response.data;
  },

  // Coupons API
  getCoupons: async () => {
    const response = await axiosInstance.get('/api/coupons');
    return response.data;
  },

  applyCoupon: async (code: string, orderValue: number) => {
    const response = await axiosInstance.post('/api/coupons/apply', {
      code,
      orderValue,
    });
    return response.data;
  },
};