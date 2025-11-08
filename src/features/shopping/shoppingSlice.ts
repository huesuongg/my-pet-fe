import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShoppingState, Product, ProductCategory, BlogArticle, Cart, CartItem, ShoppingFilters } from './types';
import { Order } from './types/order';

const initialState: ShoppingState = {
  products: [],
  categories: [],
  blogArticles: [],
  cart: {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    lastUpdated: new Date().toISOString(),
  },
  orders: [],
  loading: {
    products: false,
    categories: false,
    blogArticles: false,
    cart: false,
    orders: false,
  },
  error: {
    products: null,
    categories: null,
    blogArticles: null,
    cart: null,
    orders: null,
  },
  filters: {
    categoryId: undefined,
    searchQuery: undefined,
    priceRange: undefined,
    sortBy: 'name',
    sortOrder: 'asc',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 12,
    totalItems: 0,
  },
};

const shoppingSlice = createSlice({
  name: 'shopping',
  initialState,
  reducers: {
    // Products actions
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setProductsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.products = action.payload;
    },
    setProductsError: (state, action: PayloadAction<string | null>) => {
      state.error.products = action.payload;
    },

    // Categories actions
    setCategories: (state, action: PayloadAction<ProductCategory[]>) => {
      state.categories = action.payload;
    },
    setCategoriesLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.categories = action.payload;
    },
    setCategoriesError: (state, action: PayloadAction<string | null>) => {
      state.error.categories = action.payload;
    },

    // Blog articles actions
    setBlogArticles: (state, action: PayloadAction<BlogArticle[]>) => {
      state.blogArticles = action.payload;
    },
    setBlogArticlesLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.blogArticles = action.payload;
    },
    setBlogArticlesError: (state, action: PayloadAction<string | null>) => {
      state.error.blogArticles = action.payload;
    },

    // Cart actions
    setCart: (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.cart.items.find((item: CartItem) => item.product.id === action.payload.product.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.cart.items.push(action.payload);
      }
      state.cart.totalItems = state.cart.items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
      state.cart.totalPrice = state.cart.items.reduce((total: number, item: CartItem) => total + (item.product.price * item.quantity), 0);
      state.cart.lastUpdated = new Date().toISOString();
    },
    updateCartItem: (state, action: PayloadAction<{ itemId: number; quantity: number }>) => {
      const item = state.cart.items.find((item: CartItem) => item.id === action.payload.itemId);
      if (item) {
        item.quantity = action.payload.quantity;
        state.cart.totalItems = state.cart.items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
        state.cart.totalPrice = state.cart.items.reduce((total: number, item: CartItem) => total + (item.product.price * item.quantity), 0);
        state.cart.lastUpdated = new Date().toISOString();
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cart.items = state.cart.items.filter((item: CartItem) => item.id !== action.payload);
      state.cart.totalItems = state.cart.items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
      state.cart.totalPrice = state.cart.items.reduce((total: number, item: CartItem) => total + (item.product.price * item.quantity), 0);
      state.cart.lastUpdated = new Date().toISOString();
    },
    clearCart: (state) => {
      state.cart = {
        items: [],
        totalItems: 0,
        totalPrice: 0,
        lastUpdated: new Date().toISOString(),
      };
    },
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.cart = action.payload;
    },
    setCartError: (state, action: PayloadAction<string | null>) => {
      state.error.cart = action.payload;
    },

    // Orders actions
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload); // Add new order at the beginning
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: number; status: string }>) => {
      const order = state.orders.find(order => order.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
    },
    setOrdersLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.orders = action.payload;
    },
    setOrdersError: (state, action: PayloadAction<string | null>) => {
      state.error.orders = action.payload;
    },

    // Filters actions
    setFilters: (state, action: PayloadAction<Partial<ShoppingFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        categoryId: undefined,
        searchQuery: undefined,
        priceRange: undefined,
        sortBy: 'name',
        sortOrder: 'asc',
      };
    },

    // Pagination actions
    setPagination: (state, action: PayloadAction<Partial<typeof state.pagination>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
  },
});

export const {
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
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  setCartLoading,
  setCartError,
  setOrders,
  addOrder,
  updateOrderStatus,
  setOrdersLoading,
  setOrdersError,
  setFilters,
  clearFilters,
  setPagination,
  setCurrentPage,
} = shoppingSlice.actions;

export default shoppingSlice.reducer;