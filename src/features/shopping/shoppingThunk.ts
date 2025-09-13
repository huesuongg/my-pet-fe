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
} from './shoppingSlice';

// Fetch products thunk
export const fetchProducts = createAsyncThunk(
  'shopping/fetchProducts',
  async (params: {
    page?: number;
    limit?: number;
    categoryId?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }, { dispatch }) => {
    try {
      dispatch(setProductsLoading(true));
      dispatch(setProductsError(null));
      
      const response = await shoppingAPI.getProducts(params);
      
      dispatch(setProducts(response.data));
      dispatch(setProductsLoading(false));
      
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
      dispatch(setProductsError(errorMessage));
      dispatch(setProductsLoading(false));
      throw error;
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
      
      const categories = await shoppingAPI.getCategories();
      
      dispatch(setCategories(categories));
      dispatch(setCategoriesLoading(false));
      
      return categories;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories';
      dispatch(setCategoriesError(errorMessage));
      dispatch(setCategoriesLoading(false));
      throw error;
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
      
      const articles = await shoppingAPI.getBlogArticles(params);
      
      dispatch(setBlogArticles(articles));
      dispatch(setBlogArticlesLoading(false));
      
      return articles;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch blog articles';
      dispatch(setBlogArticlesError(errorMessage));
      dispatch(setBlogArticlesLoading(false));
      throw error;
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
  async ({ productId, quantity }: { productId: number; quantity?: number }, { dispatch }) => {
    try {
      dispatch(setCartLoading(true));
      dispatch(setCartError(null));
      
      const cartItem = await shoppingAPI.addToCart(productId, quantity);
      
      // Refresh cart after adding
      const cart = await shoppingAPI.getCart();
      dispatch(setCart(cart));
      dispatch(setCartLoading(false));
      
      return cartItem;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add to cart';
      dispatch(setCartError(errorMessage));
      dispatch(setCartLoading(false));
      throw error;
    }
  }
);

// Update cart item thunk
export const updateCartItemThunk = createAsyncThunk(
  'shopping/updateCartItemThunk',
  async ({ itemId, quantity }: { itemId: number; quantity: number }, { dispatch }) => {
    try {
      dispatch(setCartLoading(true));
      dispatch(setCartError(null));
      
      const cartItem = await shoppingAPI.updateCartItem(itemId, quantity);
      
      // Refresh cart after updating
      const cart = await shoppingAPI.getCart();
      dispatch(setCart(cart));
      dispatch(setCartLoading(false));
      
      return cartItem;
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
  async (itemId: number, { dispatch }) => {
    try {
      dispatch(setCartLoading(true));
      dispatch(setCartError(null));
      
      await shoppingAPI.removeFromCart(itemId);
      
      // Refresh cart after removing
      const cart = await shoppingAPI.getCart();
      dispatch(setCart(cart));
      dispatch(setCartLoading(false));
      
      return itemId;
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