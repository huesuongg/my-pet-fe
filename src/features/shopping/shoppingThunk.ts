import { createAsyncThunk } from '@reduxjs/toolkit';
import { shoppingAPI } from './shoppingAPI';
import {
  setProducts,
  setProductsLoading,
  setProductsError,
  setCategories,
  setCategoriesLoading,
  setCategoriesError,
  setBlogArticles,
  setBlogArticlesLoading,
  setBlogArticlesError,
  setCart,
  setCartLoading,
  setCartError,
  setOrders,
  setOrdersLoading,
  setOrdersError,
} from './shoppingSlice';

// Fetch products thunk
export const fetchProducts = createAsyncThunk(
  'shopping/fetchProducts',
  async (params: {
    page?: number;
    limit?: number;
    categoryId?: string | number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }, { dispatch }) => {
    try {
      dispatch(setProductsLoading(true));
      dispatch(setProductsError(null));
      
      const response = await shoppingAPI.getProducts(params);
      
      // Handle different response structures
      const products = response.items || response.data || response.products || [];
      
      dispatch(setProducts(products));
      dispatch(setProductsLoading(false));
      
      return response;
    } catch (error: unknown) {
      let errorMessage = 'Không thể tải danh sách sản phẩm';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        // Server responded with error status
        if (axiosError.response?.status === 404) {
          errorMessage = 'Không tìm thấy sản phẩm. Vui lòng kiểm tra lại backend server.';
        } else if (axiosError.response?.status === 500) {
          errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
        } else {
          errorMessage = axiosError.response?.data?.message || errorMessage;
        }
      } else if (error && typeof error === 'object' && 'request' in error) {
        // Request was made but no response received
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra backend server có đang chạy không.';
      } else {
        errorMessage = error instanceof Error ? error.message : errorMessage;
      }
      
      dispatch(setProductsError(errorMessage));
      dispatch(setProductsLoading(false));
      // Don't throw, just set empty array
      dispatch(setProducts([]));
      return { items: [], data: [], products: [] };
    }
  }
);

// Fetch categories thunk
export const fetchCategories = createAsyncThunk(
  'shopping/fetchCategories',
  async (_, { dispatch }) => {
    try {
      dispatch(setCategoriesLoading(true));
      dispatch(setCategoriesError(null));
      
      const response = await shoppingAPI.getCategories();
      const categories = response.categories || response || [];
      
      dispatch(setCategories(categories));
      dispatch(setCategoriesLoading(false));
      
      return categories;
    } catch (error: unknown) {
      let errorMessage = 'Không thể tải danh mục sản phẩm';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        // Server responded with error status
        if (axiosError.response?.status === 404) {
          errorMessage = 'Không tìm thấy danh mục. Vui lòng kiểm tra lại backend server.';
        } else if (axiosError.response?.status === 500) {
          errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
        } else {
          errorMessage = axiosError.response?.data?.message || errorMessage;
        }
      } else if (error && typeof error === 'object' && 'request' in error) {
        // Request was made but no response received
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra backend server có đang chạy không.';
      } else {
        errorMessage = error instanceof Error ? error.message : errorMessage;
      }
      
      dispatch(setCategoriesError(errorMessage));
      dispatch(setCategoriesLoading(false));
      // Don't throw, just set empty array
      dispatch(setCategories([]));
      return [];
    }
  }
);

// Fetch blog articles thunk
export const fetchBlogArticles = createAsyncThunk(
  'shopping/fetchBlogArticles',
  async (params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}, { dispatch }) => {
    try {
      dispatch(setBlogArticlesLoading(true));
      dispatch(setBlogArticlesError(null));
      
      const response = await shoppingAPI.getBlogArticles(params);
      const articles = response.articles || [];
      
      dispatch(setBlogArticles(articles));
      dispatch(setBlogArticlesLoading(false));
      
      return articles;
    } catch (error: unknown) {
      let errorMessage = 'Không thể tải bài viết blog';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 404) {
          errorMessage = 'Không tìm thấy bài viết. Vui lòng kiểm tra lại backend server.';
        } else if (axiosError.response?.status === 500) {
          errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
        } else {
          errorMessage = axiosError.response?.data?.message || errorMessage;
        }
      } else if (error && typeof error === 'object' && 'request' in error) {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra backend server có đang chạy không.';
      } else {
        errorMessage = error instanceof Error ? error.message : errorMessage;
      }
      
      dispatch(setBlogArticlesError(errorMessage));
      dispatch(setBlogArticlesLoading(false));
      // Don't throw, just set empty array
      dispatch(setBlogArticles([]));
      return [];
    }
  }
);

// Fetch cart thunk
export const fetchCart = createAsyncThunk(
  'shopping/fetchCart',
  async (_, { dispatch }) => {
    try {
      dispatch(setCartLoading(true));
      dispatch(setCartError(null));
      
      const cart = await shoppingAPI.getCart();
      
      dispatch(setCart(cart));
      dispatch(setCartLoading(false));
      
      return cart;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch cart';
      dispatch(setCartError(errorMessage));
      dispatch(setCartLoading(false));
      throw error;
    }
  }
);

// Add to cart thunk
export const addToCartThunk = createAsyncThunk(
  'shopping/addToCartThunk',
  async ({ 
    productId, 
    quantity = 1, 
    color, 
    size, 
    weight 
  }: { 
    productId: string | number; 
    quantity?: number;
    color?: string;
    size?: string;
    weight?: string;
  }, { dispatch, rejectWithValue }) => {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue({ 
          message: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng',
          code: 'UNAUTHORIZED'
        });
      }

      dispatch(setCartLoading(true));
      dispatch(setCartError(null));
      
      const response = await shoppingAPI.addToCart(productId, quantity, color, size, weight);
      
      // Refresh cart after adding
      const cart = await shoppingAPI.getCart();
      dispatch(setCart(cart));
      dispatch(setCartLoading(false));
      
      return response;
    } catch (error: unknown) {
      let errorMessage = 'Không thể thêm sản phẩm vào giỏ hàng';
      let statusCode: number | string = 'UNKNOWN';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        statusCode = axiosError.response?.status || 'UNKNOWN';
        // Server responded with error status
        if (axiosError.response?.status === 401) {
          errorMessage = 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng';
        } else if (axiosError.response?.status === 400) {
          errorMessage = axiosError.response.data?.message || 'Sản phẩm không còn hàng hoặc số lượng không đủ';
        } else if (axiosError.response?.status === 404) {
          errorMessage = 'Không tìm thấy sản phẩm';
        } else if (axiosError.response?.status === 500) {
          errorMessage = axiosError.response.data?.message || 'Lỗi server. Vui lòng thử lại sau.';
        } else {
          errorMessage = axiosError.response?.data?.message || errorMessage;
        }
      } else if (error && typeof error === 'object' && 'request' in error) {
        // Request was made but no response received
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      } else {
        errorMessage = error instanceof Error ? error.message : errorMessage;
      }
      
      dispatch(setCartError(errorMessage));
      dispatch(setCartLoading(false));
      return rejectWithValue({ message: errorMessage, code: statusCode });
    }
  }
);

// Update cart item thunk
export const updateCartItemThunk = createAsyncThunk(
  'shopping/updateCartItemThunk',
  async ({ itemIndex, quantity }: { itemIndex: number; quantity: number }, { dispatch }) => {
    try {
      dispatch(setCartLoading(true));
      dispatch(setCartError(null));
      
      const response = await shoppingAPI.updateCartItem(itemIndex, quantity);
      
      // Refresh cart after updating
      const cart = await shoppingAPI.getCart();
      dispatch(setCart(cart));
      dispatch(setCartLoading(false));
      
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update cart item';
      dispatch(setCartError(errorMessage));
      dispatch(setCartLoading(false));
      throw error;
    }
  }
);

// Remove from cart thunk
export const removeFromCartThunk = createAsyncThunk(
  'shopping/removeFromCartThunk',
  async (itemIndex: number, { dispatch }) => {
    try {
      dispatch(setCartLoading(true));
      dispatch(setCartError(null));
      
      await shoppingAPI.removeFromCart(itemIndex);
      
      // Refresh cart after removing
      const cart = await shoppingAPI.getCart();
      dispatch(setCart(cart));
      dispatch(setCartLoading(false));
      
      return itemIndex;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove from cart';
      dispatch(setCartError(errorMessage));
      dispatch(setCartLoading(false));
      throw error;
    }
  }
);

// Clear cart thunk
export const clearCartThunk = createAsyncThunk(
  'shopping/clearCartThunk',
  async (_, { dispatch }) => {
    try {
      dispatch(setCartLoading(true));
      dispatch(setCartError(null));
      
      await shoppingAPI.clearCart();
      
      // Refresh cart after clearing
      const cart = await shoppingAPI.getCart();
      dispatch(setCart(cart));
      dispatch(setCartLoading(false));
      
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear cart';
      dispatch(setCartError(errorMessage));
      dispatch(setCartLoading(false));
      throw error;
    }
  }
);

// Fetch orders thunk
export const fetchOrders = createAsyncThunk(
  'shopping/fetchOrders',
  async (params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}, { dispatch }) => {
    try {
      dispatch(setOrdersLoading(true));
      dispatch(setOrdersError(null));
      
      const response = await shoppingAPI.getOrders(params);
      
      dispatch(setOrders(response.orders || []));
      dispatch(setOrdersLoading(false));
      
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch orders';
      dispatch(setOrdersError(errorMessage));
      dispatch(setOrdersLoading(false));
      throw error;
    }
  }
);

// Create order thunk
export const createOrderThunk = createAsyncThunk(
  'shopping/createOrderThunk',
  async (orderData: {
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
  }, { dispatch }) => {
    try {
      dispatch(setOrdersLoading(true));
      dispatch(setOrdersError(null));
      
      const response = await shoppingAPI.createOrder(orderData);
      
      // Clear cart after successful order
      await shoppingAPI.clearCart();
      const cart = await shoppingAPI.getCart();
      dispatch(setCart(cart));
      
      // Refresh orders
      const ordersResponse = await shoppingAPI.getOrders();
      dispatch(setOrders(ordersResponse.orders || []));
      
      dispatch(setOrdersLoading(false));
      
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
      dispatch(setOrdersError(errorMessage));
      dispatch(setOrdersLoading(false));
      throw error;
    }
  }
);

// Cancel order thunk
export const cancelOrderThunk = createAsyncThunk(
  'shopping/cancelOrderThunk',
  async (orderId: string, { dispatch }) => {
    try {
      dispatch(setOrdersLoading(true));
      dispatch(setOrdersError(null));
      
      const response = await shoppingAPI.cancelOrder(orderId);
      
      // Refresh orders
      const ordersResponse = await shoppingAPI.getOrders();
      dispatch(setOrders(ordersResponse.orders || []));
      
      dispatch(setOrdersLoading(false));
      
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel order';
      dispatch(setOrdersError(errorMessage));
      dispatch(setOrdersLoading(false));
      throw error;
    }
  }
);

// Apply coupon thunk
export const applyCouponThunk = createAsyncThunk(
  'shopping/applyCouponThunk',
  async ({ code, orderValue }: { code: string; orderValue: number }) => {
    try {
      const response = await shoppingAPI.applyCoupon(code, orderValue);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to apply coupon';
      throw new Error(errorMessage);
    }
  }
);