import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store";
import {
  fetchProducts,
  fetchCategories,
  fetchBlogArticles,
  fetchCart,
  addToCartThunk,
  updateCartItemThunk,
  removeFromCartThunk,
  clearCartThunk,
} from "../shoppingThunk";
import {
  setFilters,
  clearFilters,
  setCurrentPage,
} from "../shoppingSlice";
import { ShoppingFilters } from "../types";

export const useShopping = () => {
  const dispatch = useDispatch<AppDispatch>();
  const shoppingState = useSelector((state: RootState) => state.shopping);

  const loadProducts = useCallback((params?: {
    page?: number;
    limit?: number;
    categoryId?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    if (params) {
      dispatch(fetchProducts(params));
    }
  }, [dispatch]);

  const loadCategories = useCallback(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const loadBlogArticles = useCallback((params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    dispatch(fetchBlogArticles(params || {}));
  }, [dispatch]);

  const loadCart = useCallback(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const addProductToCart = useCallback((productId: number, quantity: number = 1) => {
    dispatch(addToCartThunk({ productId, quantity }));
  }, [dispatch]);

  const updateCartItemQuantity = useCallback((itemIndex: number, quantity: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(updateCartItemThunk({ itemIndex, quantity }) as any);
  }, [dispatch]);

  const removeProductFromCart = useCallback((itemId: number) => {
    dispatch(removeFromCartThunk(itemId));
  }, [dispatch]);

  const clearShoppingCart = useCallback(() => {
    dispatch(clearCartThunk());
  }, [dispatch]);

  const setShoppingFilters = useCallback((filters: Partial<ShoppingFilters>) => {
    dispatch(setFilters(filters));
  }, [dispatch]);

  const clearShoppingFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const setPage = useCallback((page: number) => {
    dispatch(setCurrentPage(page));
  }, [dispatch]);

  return {
    ...shoppingState,
    loadProducts,
    loadCategories,
    loadBlogArticles,
    loadCart,
    addProductToCart,
    updateCartItemQuantity,
    removeProductFromCart,
    clearShoppingCart,
    setShoppingFilters,
    clearShoppingFilters,
    setPage,
  };
};