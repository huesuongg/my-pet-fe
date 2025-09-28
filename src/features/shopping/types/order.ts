import { CartItem, Product } from './index';

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
  id: number;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingInfo: ShippingInfo;
  shippingOption: ShippingOption;
  paymentMethod: string;
  subtotal: number;
  shippingFee: number;
  total: number;
}

// Helper function to convert CartItems to OrderItems
export const cartItemsToOrderItems = (cartItems: CartItem[]): OrderItem[] => {
  return cartItems.map((item, index) => ({
    id: index + 1,
    productId: item.product.id,
    productName: item.product.name,
    productImage: item.product.image,
    price: item.product.price,
    quantity: item.quantity,
    weight: item.product.weight,
    color: item.product.color,
    size: item.product.size,
  }));
}; 