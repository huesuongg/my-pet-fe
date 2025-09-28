// Shopping state types
import { Product, ProductCategory, BlogArticle, Cart } from './index';
import { Order } from './order';

export interface ShoppingState {
  products: Product[];
  categories: ProductCategory[];
  blogArticles: BlogArticle[];
  cart: Cart;
  orders: Order[];
  loading: {
    products: boolean;
    categories: boolean;
    blogArticles: boolean;
    cart: boolean;
    orders: boolean;
  };
  error: {
    products: string | null;
    categories: string | null;
    blogArticles: string | null;
    cart: string | null;
    orders: string | null;
  };
  filters: {
    categoryId?: number;
    searchQuery?: string;
    priceRange?: {
      min: number;
      max: number;
    };
    sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
  };
}

export interface ShoppingFilters {
  categoryId?: number;
  searchQuery?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}