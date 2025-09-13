import axiosInstance from '../../services/axiosInstance';
import { Product, ProductCategory, BlogArticle, Cart, CartItem } from './types';
import { SHOPPING_CONSTANTS } from './constants';

// Products API
export const shoppingAPI = {
  // Get all products
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    categoryId?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const response = await axiosInstance.get(SHOPPING_CONSTANTS.API.ENDPOINTS.PRODUCTS, {
      params: {
        page: params?.page || 1,
        limit: params?.limit || SHOPPING_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
        categoryId: params?.categoryId,
        search: params?.search,
        sortBy: params?.sortBy || SHOPPING_CONSTANTS.FILTERS.DEFAULT_SORT_BY,
        sortOrder: params?.sortOrder || SHOPPING_CONSTANTS.FILTERS.DEFAULT_SORT_ORDER,
      },
    });
    return response.data;
  },

  // Get product by ID
  getProductById: async (id: number): Promise<Product> => {
    const response = await axiosInstance.get(`${SHOPPING_CONSTANTS.API.ENDPOINTS.PRODUCTS}/${id}`);
    return response.data;
  },

  // Get all categories
  getCategories: async (): Promise<ProductCategory[]> => {
    const response = await axiosInstance.get(SHOPPING_CONSTANTS.API.ENDPOINTS.CATEGORIES);
    return response.data;
  },

  // Get blog articles
  getBlogArticles: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<BlogArticle[]> => {
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

  addToCart: async (productId: number, quantity: number = 1): Promise<CartItem> => {
    const response = await axiosInstance.post(SHOPPING_CONSTANTS.API.ENDPOINTS.CART, {
      productId,
      quantity,
    });
    return response.data;
  },

  updateCartItem: async (itemId: number, quantity: number): Promise<CartItem> => {
    const response = await axiosInstance.put(`${SHOPPING_CONSTANTS.API.ENDPOINTS.CART}/${itemId}`, {
      quantity,
    });
    return response.data;
  },

  removeFromCart: async (itemId: number): Promise<void> => {
    await axiosInstance.delete(`${SHOPPING_CONSTANTS.API.ENDPOINTS.CART}/${itemId}`);
  },

  clearCart: async (): Promise<void> => {
    await axiosInstance.delete(SHOPPING_CONSTANTS.API.ENDPOINTS.CART);
  },
};