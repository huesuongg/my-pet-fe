// Product types
export interface Product {
  id?: number;
  _id?: string;
  name: string;
  price: number | string;
  originalPrice?: number | string;
  image: string;
  images?: string[];
  description?: string;
  category?: ProductCategory | string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  reviews?: Array<{
    id?: string | number;
    _id?: string;
    name?: string;
    user?: { name?: string; avatar?: string };
    avatar?: string;
    rating?: number;
    comment?: string;
    content?: string;
    date?: string;
    createdAt?: string;
  }>;
  inStock: boolean;
  stockQuantity?: number;
  tags?: string[];
  weight?: string;
  color?: string;
  size?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductCategory {
  id?: number;
  _id?: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  parentId?: number;
  isActive: boolean;
}

export interface BlogArticle {
  id?: number;
  _id?: string;
  title: string;
  description: string;
  content?: string;
  image: string;
  author: string | { _id?: string; fullname?: string; avatar?: string };
  publishedAt: string;
  tags: string[];
  readTime?: number;
  isPublished: boolean;
  bgColor?: string;
}

export interface CartItem {
  id?: number | string;
  _id?: string;
  product?: Product | string;
  productId?: string | number;
  productName?: string;
  productImage?: string;
  price?: number | string;
  quantity: number;
  color?: string;
  size?: string;
  weight?: string;
  addedAt?: string;
}

export interface Cart {
  items: CartItem[];
  totalItems?: number;
  totalPrice?: number;
  total?: number;
  lastUpdated?: string;
  user?: string;
}

// Re-export state types
export * from './shopping.state';