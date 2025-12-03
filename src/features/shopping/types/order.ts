import { CartItem } from './index';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  weight?: string;
  color?: string;
  size?: string;
}

export interface ShippingInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  notes?: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface Order {
  id?: number;
  _id?: string;
  orderNumber?: string;
  date?: string;
  createdAt?: string;
  status: OrderStatus | string;
  items: OrderItem[];
  shippingInfo?: ShippingInfo;
  shippingOption?: ShippingOption;
  paymentMethod?: string;
  subtotal?: number;
  shippingFee?: number;
  total?: number;
}

// Helper function to convert CartItems to OrderItems
export const cartItemsToOrderItems = (cartItems: CartItem[]): OrderItem[] => {
  return cartItems.map((item, index) => {
    const product = typeof item.product === 'object' ? item.product : null;
    const productId = product?.id || product?._id || item.productId || 0;
    const productName = product?.name || item.productName || '';
    const productImage = product?.image || item.productImage || '';
    const price = typeof product?.price === 'number' ? product.price : typeof item.price === 'number' ? item.price : 0;
    return {
      id: index + 1,
      productId: typeof productId === 'number' ? productId : 0,
      productName,
      productImage,
      price: typeof price === 'number' ? price : 0,
      quantity: item.quantity,
      weight: product?.weight || item.weight,
      color: product?.color || item.color,
      size: product?.size || item.size,
    };
  });
}; 