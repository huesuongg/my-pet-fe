// Product types
export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description?: string;
  category: ProductCategory;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  inStock: boolean;
  stockQuantity?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  image: string;
  description?: string;
  parentId?: number;
  isActive: boolean;
}

export interface BlogArticle {
  id: number;
  title: string;
  description: string;
  content?: string;
  image: string;
  author: string;
  publishedAt: string;
  tags: string[];
  readTime?: number;
  isPublished: boolean;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  lastUpdated: string;
}

// Re-export state types
export * from './shopping.state';