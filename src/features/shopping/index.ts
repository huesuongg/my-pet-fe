// Export all types
export * from './types';

// Export all constants
export * from './constants';

// Export API
export { shoppingAPI } from './shoppingAPI';

// Export Redux slice
export { default as shoppingReducer } from './shoppingSlice';
export * from './shoppingSlice';

// Export thunks with different names to avoid conflicts
export {
  fetchProducts,
  fetchCategories,
  fetchBlogArticles,
  fetchCart,
  addToCartThunk,
  updateCartItemThunk,
  removeFromCartThunk,
  clearCartThunk,
} from './shoppingThunk';

// Export hooks
export * from './hooks/useShopping';

// Export components
export * from './components';

// Export pages
export { default as ShoppingPage } from './pages/ShoppingPage';